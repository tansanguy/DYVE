import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { EventDetail, getEventDetail } from '../api/events';
import { ImageWithFallback } from '../dyve-figma/components/figma/ImageWithFallback';
import { formatEventPrice, getDDayLabel } from '../utils/event';

export default function EventDetailPage() {
  const { id } = useParams();
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
  const priceLabel = formatEventPrice(event.price, event.is_free);

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
            <p className="mt-2 text-sm text-white/70">{event.description}</p>
          </div>

          <div className="space-y-3 text-sm text-white/80">
            <div className="flex items-center gap-3">
              <MapPin className="text-[#FF3B5C]" size={18} />
              <span className="font-medium">{event.venue_name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="text-[#FF3B5C]" size={18} />
              <span className="font-medium">{event.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-[#FF3B5C]" size={18} />
              <span className="font-medium">{event.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <Tag className="text-[#FF3B5C]" size={18} />
              <span className="font-medium">{event.region}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">가격</p>
            <p className="text-2xl font-bold text-white">{priceLabel}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">주소</p>
            <p className="text-base font-semibold text-white">{event.address}</p>
          </div>

          <button
            type="button"
            disabled={!event.allow_dyve_reservation}
            onClick={() => navigate(`/reservation/${event.id}`)}
            className={`w-full rounded-2xl py-4 text-lg font-bold transition ${
              event.allow_dyve_reservation
                ? 'bg-[#FF3B5C] text-white hover:bg-[#d43550]'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {event.allow_dyve_reservation ? 'DYVE로 예매하기' : '외부 예매만 가능합니다'}
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
