import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EventDetail, getEventDetail } from '../api/events';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const eventId = Number(id);

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setError('유효하지 않은 공연 ID입니다.');
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const data = await getEventDetail(eventId);
        setEvent(data);
      } catch (err) {
        console.error('공연 상세 정보를 불러오는 중 오류 발생', err);
        setError('공연 정보를 불러오지 못했습니다.');
        alert('공연 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        공연 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black text-white">
        <p>{error ?? '공연을 찾을 수 없습니다.'}</p>
        <Link to="/" className="rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-fit rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/40 hover:text-white"
        >
          뒤로가기
        </button>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          {event.image_url ? (
            <img src={event.image_url} alt={event.title} className="h-80 w-full object-cover" />
          ) : (
            <div className="flex h-80 items-center justify-center text-white/70">이미지가 없습니다.</div>
          )}

          <div className="space-y-6 p-8">
            <div className="space-y-2">
              <p className="text-sm uppercase text-white/60">{event.genre}</p>
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <p className="text-white/70">{event.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm text-white/60">일시</p>
                <p className="text-lg font-semibold">{event.date} · {event.time}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm text-white/60">장소</p>
                <p className="text-lg font-semibold">{event.venue_name}</p>
                <p className="text-white/70">{event.address}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm text-white/60">지역</p>
                <p className="text-lg font-semibold">{event.region}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm text-white/60">가격</p>
                <p className="text-lg font-semibold">
                  {event.is_free ? '무료' : `${event.price.toLocaleString()}원`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => navigate(`/reservation/${event.id}`)}
                className="flex-1 rounded-full bg-white px-6 py-3 text-center text-base font-semibold text-black transition hover:bg-white/90"
              >
                예매하기
              </button>
              <Link
                to="/"
                className="flex-1 rounded-full border border-white/30 px-6 py-3 text-center text-base font-semibold text-white transition hover:border-white/60"
              >
                다른 공연 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
