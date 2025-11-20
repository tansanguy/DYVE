import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { EventDetail, getEventDetail } from '../api/events';
import { createReservation } from '../api/reservation';
import { ImageWithFallback } from '../dyve-figma/components/figma/ImageWithFallback';
import { formatEventDateTime, formatEventPrice, getDDayLabel } from '../utils/event';
import { toast } from 'sonner';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'idle'>('loading');
  const [creatingReservation, setCreatingReservation] = useState(false);

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
      <div className="flex min-h-screen items-center justify-center bg-black text-white">공연 정보를 불러오는 중입니다...</div>
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

  const dDayLabel = getDDayLabel(event.date);
  const scheduleLabel = formatEventDateTime(event.date, event.time);
  const entryTypeMap: Record<string, string> = {
    seat: '지정 좌석',
    number: '입장 번호',
    entry: '일반 입장',
    standing: '스탠딩 입장',
    firstcome: '선착순 입장',
  };
  const entryTypeLabel = entryTypeMap[event.entry_type] ?? '입장 방식 미정';
  const priceLabel = formatEventPrice(event.price_min ?? event.price, event.is_free, event.price_max ?? event.price);

  // 한국어 주석: 좌석 선택 없이도 예매 버튼을 누르면 바로 예약이 생성되도록 빠른 예매를 구현한다.
  const handleQuickReservation = async () => {
    if (!event?.allow_dyve_reservation || creatingReservation) return;
    setCreatingReservation(true);
    try {
      await createReservation({
        event: event.id,
        quantity: 1,
        seat: '빠른 예매',
      });
      toast.success('예매가 완료되었습니다');
    } catch (error) {
      console.error('빠른 예매 실패', error);
      toast.error('예매를 완료하지 못했습니다');
    } finally {
      setCreatingReservation(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-screen-sm items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">공연 상세</h1>
        </div>
      </header>

      <article className="mx-auto w-full max-w-screen-sm pb-16">
        <div className="relative h-80 w-full">
          {event.image_url ? (
            <ImageWithFallback src={event.image_url} alt={event.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-white/5 text-white/70">이미지가 없습니다.</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            {event.allow_dyve_reservation && (
              <span className="rounded-lg bg-[#FF3B5C] px-3 py-1.5 text-xs font-bold">DYVE 예약 가능</span>
            )}
            <span className="rounded-lg bg-black/60 px-3 py-1.5 text-xs font-bold">{dDayLabel}</span>
          </div>
        </div>

        <div className="space-y-6 px-6 py-8">
          <div>
            <p className="text-sm uppercase text-white/60">{event.genre}</p>
            <h2 className="mt-2 text-3xl font-bold leading-tight">{event.title}</h2>
            {event.description && <p className="mt-2 text-sm text-white/70 leading-relaxed">{event.description}</p>}
          </div>

          <div className="space-y-3 text-sm text-white/80">
            <div className="flex items-center gap-3">
              <MapPin className="text-[#FF3B5C]" size={18} />
              <span className="font-medium">{event.venue_name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="text-[#FF3B5C]" size={18} />
              <span className="font-medium">{scheduleLabel}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-[#FF3B5C]" size={18} />
              <span className="font-medium">{entryTypeLabel}</span>
            </div>
            <div className="flex items-center gap-3">
              <Tag className="text-[#FF3B5C]" size={18} />
              <span className="font-medium">{event.region}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">가격</p>
            <p className="text-2xl font-bold text-white whitespace-nowrap">{priceLabel}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">주소</p>
            <p className="text-base font-semibold text-white">{event.address}</p>
          </div>

          <button
            type="button"
            disabled={!event.allow_dyve_reservation || creatingReservation}
            onClick={handleQuickReservation}
            className={`w-full rounded-2xl py-4 text-lg font-bold transition ${
              event.allow_dyve_reservation
                ? 'bg-[#FF3B5C] text-white hover:bg-[#d43550]'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {event.allow_dyve_reservation ? (creatingReservation ? '예매 중...' : 'DYVE로 예매하기') : '외부 예매만 가능합니다'}
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
