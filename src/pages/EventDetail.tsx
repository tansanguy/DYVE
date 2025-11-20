import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Tag, DollarSign } from 'lucide-react';
import { EventDetail, getEventDetail } from '../api/events';
import { ImageWithFallback } from '../dyve-figma/components/figma/ImageWithFallback';
import { formatEventDateTime, formatEventPrice, getDDayLabel } from '../utils/event';
import { toast } from 'sonner';

const ENTRY_TYPE_LABELS: Record<string, string> = {
  seat: '지정 좌석',
  number: '입장 번호',
  entry: '일반 입장',
  standing: '스탠딩 입장',
  firstcome: '선착순 입장',
};

const DETAIL_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=900&auto=format&fit=crop&q=80';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'idle'>('loading');

  useEffect(() => {
    const eventId = Number(id);
    if (!eventId) {
      setStatus('error');
      return;
    }

    const fetchEvent = async () => {
      try {
        const data = await getEventDetail(eventId);
        setEvent(data);
        setStatus('idle');
      } catch (error) {
        console.error('공연 상세 정보를 불러오는 중 오류 발생', error);
        setStatus('error');
      }
    };

    fetchEvent();
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        공연 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (status === 'error' || !event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black text-white">
        <p>공연을 찾을 수 없습니다.</p>
        <Link to="/" className="rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const scheduleLabel = formatEventDateTime(event.date, event.time);
  const entryTypeLabel = ENTRY_TYPE_LABELS[event.entry_type] ?? '입장 방식 미정';
  const priceLabel = formatEventPrice(event.price_min ?? event.price, event.is_free, event.price_max ?? event.price);
  const dDayLabel = getDDayLabel(event.date);

  const handleGoToBooking = () => {
    if (!event.allow_dyve_reservation) {
      toast.error('DYVE 예매가 불가능한 공연입니다.');
      return;
    }
    navigate(`/booking/${event.id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-extrabold">공연 상세</h1>
        </div>
      </header>

      <article className="mx-auto w-full max-w-screen-sm pb-16">
        <div className="relative h-80 w-full">
        <ImageWithFallback
          src={event.image_url ?? DETAIL_FALLBACK_IMAGE}
          alt={event.title}
          className="h-full w-full object-cover opacity-80"
        />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            {event.allow_dyve_reservation && (
              <span className="inline-flex rounded-lg bg-[#FF3B5C] px-3 py-1.5 text-xs font-extrabold text-white shadow-lg shadow-[#FF3B5C]/30">
                DYVE 예약 가능
              </span>
            )}
            <span className="inline-flex rounded-lg bg-white/10 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur-sm">
              {dDayLabel}
            </span>
          </div>
        </div>

        <div className="space-y-6 px-6 py-8">
          <div>
            <h2 className="text-white text-3xl font-extrabold tracking-tight">{event.title}</h2>
            <p className="text-gray-400 text-lg font-medium">{event.genre || '장르 미정'}</p>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-gray-300">
              <MapPin size={18} className="text-[#FF3B5C]" />
              <span className="font-medium">{event.venue_name}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Calendar size={18} className="text-[#FF3B5C]" />
              <span className="font-medium">{scheduleLabel}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Clock size={18} className="text-[#FF3B5C]" />
              <span className="font-medium">{entryTypeLabel}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Tag size={18} className="text-[#FF3B5C]" />
              <span className="font-medium">{event.region}</span>
            </div>
            <div className="flex items-center gap-3 text-white text-lg">
              <DollarSign size={18} className="text-[#FF3B5C]" />
              <span className="font-extrabold">{priceLabel}</span>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/5 bg-[#0F0F0F] p-6">
            <h3 className="text-white font-extrabold">공연 정보</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {event.description || '공연 소개가 준비 중입니다.'}
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/5 bg-[#0F0F0F] p-6">
            <p className="text-sm text-white/60">주소</p>
            <p className="text-base font-semibold text-white">{event.address}</p>
          </div>

          <button
            type="button"
            disabled={!event.allow_dyve_reservation}
            onClick={handleGoToBooking}
            className={`w-full py-4 text-lg font-extrabold transition-all ${
              event.allow_dyve_reservation
                ? 'rounded-2xl bg-[#FF3B5C] text-white hover:bg-[#d43550] shadow-lg shadow-[#FF3B5C]/30 hover:shadow-[#FF3B5C]/50'
                : 'rounded-2xl bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {event.allow_dyve_reservation ? 'DYVE로 예매하기' : '예매 불가 (외부 예매만 가능)'}
          </button>

          <Link
            to="/events"
            className="block rounded-2xl border border-white/10 py-4 text-center text-sm font-semibold text-white/70 hover:border-white/40"
          >
            다른 공연 둘러보기
          </Link>
        </div>
      </article>
    </div>
  );
}
