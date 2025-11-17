import uuid

from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils import timezone
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .constants import GENRES, REGIONS, SPACE_CATEGORIES
from .models import Artist, Event, NotificationSetting, Proposal, Reservation, Settlement, Space
from .serializers import (
    ArtistSerializer,
    EventSerializer,
    NotificationSettingSerializer,
    ProposalSerializer,
    ReservationSerializer,
    SettlementSerializer,
    SpaceSerializer,
    UserSerializer,
)

User = get_user_model()


class MetaViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        return Response(
            {
                'regions': REGIONS,
                'genres': GENRES,
                'space_categories': SPACE_CATEGORIES,
            }
        )

    @action(detail=False, methods=['get'], url_path='regions')
    def regions(self, request):
        return Response({'regions': REGIONS})

    @action(detail=False, methods=['get'], url_path='genres')
    def genres(self, request):
        return Response({'genres': GENRES})

    @action(detail=False, methods=['get'], url_path='space-categories')
    def space_categories(self, request):
        return Response({'space_categories': SPACE_CATEGORIES})


class MyPageViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        artist = getattr(request.user, 'artist_profile', None)
        space_ids = list(request.user.spaces.values_list('id', flat=True))
        data = {
            'user': UserSerializer(request.user).data,
            'artist_id': artist.id if artist else None,
            'space_ids': space_ids,
        }
        return Response(data)

    @action(detail=False, methods=['get', 'patch'], url_path='profile')
    def profile(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if request.method == 'PATCH':
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['get', 'patch'], url_path='notifications')
    def notifications(self, request):
        setting, _ = NotificationSetting.objects.get_or_create(user=request.user)
        serializer = NotificationSettingSerializer(setting, data=request.data, partial=True)
        if request.method == 'PATCH':
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='reservations')
    def reservations(self, request):
        queryset = Reservation.objects.filter(user=request.user).select_related('event')
        serializer = ReservationSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='settlements')
    def settlements(self, request):
        queryset = Settlement.objects.filter(space__owner=request.user).select_related('event', 'space')
        serializer = SettlementSerializer(queryset, many=True)
        return Response(serializer.data)


class ArtistViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Artist.objects.select_related('user').all()
    serializer_class = ArtistSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post', 'put'], permission_classes=[permissions.IsAuthenticated], url_path='profile')
    def profile(self, request):
        instance = getattr(request.user, 'artist_profile', None)
        serializer = self.get_serializer(instance, data=request.data, partial=bool(instance))
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        status_code = status.HTTP_200_OK if instance else status.HTTP_201_CREATED
        return Response(serializer.data, status=status_code)


class SpaceViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Space.objects.select_related('owner').all()
    serializer_class = SpaceSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post', 'put'], permission_classes=[permissions.IsAuthenticated], url_path='profile')
    def profile(self, request):
        instance = request.user.spaces.first()
        serializer = self.get_serializer(instance, data=request.data, partial=bool(instance))
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)
        status_code = status.HTTP_200_OK if instance else status.HTTP_201_CREATED
        return Response(serializer.data, status=status_code)


class EventViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Event.objects.select_related('space').prefetch_related('artists').all()

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def filter_queryset(self, queryset):
        genre = self.request.query_params.get('genre')
        if genre:
            queryset = queryset.filter(genre=genre)
        free = self.request.query_params.get('free')
        if free in {'true', '1'}:
            queryset = queryset.filter(is_free=True)
        dyve_only = self.request.query_params.get('dyve_only')
        if dyve_only in {'true', '1'}:
            queryset = queryset.filter(allow_dyve_reservation=True)
        ordering = self.request.query_params.get('ordering')
        if ordering == 'dday':
            queryset = queryset.order_by('date', 'time')
        return queryset

    def perform_create(self, serializer):
        space = serializer.validated_data.get('space')
        if space and space.owner != self.request.user:
            raise PermissionDenied('해당 공간의 소유자만 공연을 등록할 수 있습니다.')
        serializer.save()


class ReservationViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reservation.objects.select_related('event', 'user')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = serializer.validated_data['event']
        quantity = serializer.validated_data.get('quantity', 1)
        price = 0 if event.is_free or event.price == 0 else event.price * quantity
        entry_type = event.entry_type
        reservation_code = uuid.uuid4().hex[:12]
        qr_code = f"QR-{uuid.uuid4().hex[:8]}"
        serializer.save(
            user=request.user,
            entry_type=entry_type,
            price=price,
            reservation_code=reservation_code,
            qr_code=qr_code,
        )
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ProposalViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Proposal.objects.filter(sender=self.request.user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=False, methods=['get'], url_path='received')
    def received(self, request):
        queryset = Proposal.objects.filter(
            Q(receiver_artist__user=request.user)
            | Q(receiver_space__owner=request.user)
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class HomeViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def get_serializer(self):
        return EventSerializer

    @action(detail=False, methods=['get'], url_path='banner')
    def banner(self, request):
        queryset = Event.objects.filter(advertise=True).order_by('-created_at')[:5]
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='upcoming')
    def upcoming(self, request):
        today = timezone.localdate()
        queryset = (
            Event.objects.filter(date__gte=today)
            .order_by('date', 'time')
            [:5]
        )
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='around-you')
    def around_you(self, request):
        region = request.query_params.get('region') or request.query_params.get('mock_region') or '서울'
        queryset = Event.objects.filter(region=region).order_by('date', 'time')[:5]
        serializer = EventSerializer(queryset, many=True)
        return Response({'region': region, 'events': serializer.data})
