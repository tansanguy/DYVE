import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { getEventDetail, EventDetail } from '../api/events';
import { createReservation, ReservationResponse } from '../api/reservation';
import { formatEventPrice, getDDayLabel } from '../utils/event';
import { ImageWithFallback } from '../dyve-figma/components/figma/ImageWithFallback';

const DEFAULT_SEATING = { rows: 5, cols: 6 };
const DEFAULT_NUMBER_GRID = { rows: 5, cols: 5 };

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const eventId = Number(id);

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'idle'>('loading');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [reservationResult, setReservationResult] = useState<ReservationResponse | null>(null);

  useEffect(() => {
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
        console.error('예매 페이지 공연 정보를 불러오지 못했습니다.', error);
        setStatus('error');
      }
    };

    fetchEvent();
  }, [eventId]);

  const entryType = event?.entry_type ?? 'entry';
  const seatingInfo = useMemo(() => {
    if (entryType === 'number') {
      return event && 'seatingInfo' in event ? (event as any).seatingInfo ?? DEFAULT_NUMBER_GRID : DEFAULT_NUMBER_GRID;
    }
    if (entryType === 'seat') {
      return event && 'seatingInfo' in event ? (event as any).seatingInfo ?? DEFAULT_SEATING : DEFAULT_SEATING;
    }
    return DEFAULT_SEATING;
  }, [entryType, event]);

  const totalPrice = useMemo(() => {
    if (!event) return 0;
    if (event.is_free) return 0;
    if (entryType === 'entry') {
      return event.price * quantity;
    }
    return event.price * Math.max(selectedSeats.length, 1);
  }, [entryType, event, quantity, selectedSeats.length]);

  const toggleSeatSelection = (seatId: string) => {
    setSelectedSeats((prev) => (prev.includes(seatId) ? prev.filter((seat) => seat !== seatId) : [...prev, seatId]));
  };

  const handleReservation = async () => {
    if (!event) return;
    if (entryType !== 'entry' && selectedSeats.length === 0) {
      alert('최소 한 개 이상의 좌석/번호를 선택해 주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const payloadQuantity = entryType === 'entry' ? quantity : Math.max(selectedSeats.length, 1);
      const seatLabel =
        entryType === 'entry'
          ? `일반 입장 x${quantity}`
          : selectedSeats.length
            ? selectedSeats.join(', ')
            : '미지정';

      const reservation = await createReservation({
        event: event.id,
        quantity: payloadQuantity,
        seat: seatLabel,
      });

      setReservationResult(reservation);
    } catch (error) {
      console.error('예매 생성 실패', error);
      alert('예매를 완료하지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetToEvents = () => {
    setReservationResult(null);
    navigate('/events');
  };

  const goToTicket = () => {
    if (!event) {
      navigate('/');
      return;
    }
    setReservationResult(null);
    navigate(`/events/${event.id}`);
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">예매 정보를 불러오는 중입니다...</div>
    );
  }

  if (status === 'error' || !event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black text-white">
        <p>공연 정보를 찾을 수 없습니다.</p>
        <Link to="/events" className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white">
          공연 목록으로 이동
        </Link>
      </div>
    );
  }

  const renderSeatSelector = () => {
    if (entryType === 'entry') {
      return (
        <div className="space-y-4">
          <h3 className="text-white font-bold">입장 수량</h3>
          <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-6">
            <p className="text-sm text-white/60">입장 인원을 선택해 주세요</p>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/5 bg-black/40 p-3">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                className="h-10 w-10 rounded-xl border border-white/10 text-2xl text-white/80"
              >
                −
              </button>
              <div className="text-2xl font-bold">{quantity}</div>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="h-10 w-10 rounded-xl border border-white/10 text-2xl text-white/80"
              >
                +
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (entryType === 'number') {
      const total = seatingInfo.rows * seatingInfo.cols;
      const booked = [3, 7, 12, 17, 21];
      const columns = Math.min(seatingInfo.cols, 6);
      return (
        <div className="space-y-4">
          <h3 className="text-white font-bold">입장 번호 선택</h3>
          <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-6">
            <p className="mb-4 text-center text-sm text-white/60">원하는 번호를 선택해 주세요</p>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
              {Array.from({ length: total }, (_, index) => {
                const number = index + 1;
                const isBooked = booked.includes(number);
                const key = `${number}`;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={isBooked}
                    onClick={() => toggleSeatSelection(key)}
                    className={`aspect-square rounded-full text-sm font-semibold transition ${
                      isBooked
                        ? 'cursor-not-allowed bg-gray-800 text-gray-600'
                        : selectedSeats.includes(key)
                          ? 'bg-[#FF3B5C] text-white shadow-lg shadow-[#FF3B5C]/30'
                          : 'border border-white/10 bg-black text-white/70 hover:border-[#FF3B5C]'
                    }`}
                  >
                    {number}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    const rows = Array.from({ length: seatingInfo.rows }, (_, i) => String.fromCharCode(65 + i));
    const bookedSeats = ['A3', 'B2', 'C4', 'D1'];

    return (
      <div className="space-y-4">
        <h3 className="text-white font-bold">좌석 선택</h3>
        <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-6">
          <div className="mb-6 rounded-xl bg-[#FF3B5C] py-2 text-center text-sm font-semibold text-white">STAGE</div>
          <div className="space-y-4">
            {rows.map((rowLabel) => (
              <div key={rowLabel} className="flex items-center gap-3">
                <span className="w-6 text-xs font-semibold text-white/60">{rowLabel}</span>
                <div className="flex flex-1 justify-center gap-2">
                  {Array.from({ length: seatingInfo.cols }, (_, index) => {
                    const seatId = `${rowLabel}${index + 1}`;
                    const isBooked = bookedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    return (
                      <button
                        key={seatId}
                        type="button"
                        disabled={isBooked}
                        onClick={() => toggleSeatSelection(seatId)}
                        className={`h-10 w-10 rounded-lg text-xs font-semibold transition ${
                          isBooked
                            ? 'cursor-not-allowed bg-gray-800 text-gray-600'
                            : isSelected
                              ? 'bg-[#FF3B5C] text-white shadow-lg shadow-[#FF3B5C]/20'
                              : 'border border-white/10 bg-black text-white/70 hover:border-[#FF3B5C]'
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-screen-sm items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">예매하기</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-screen-sm px-6 py-6 space-y-8">
        <section className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <div className="relative h-48 w-full">
              {event.image_url ? (
                <ImageWithFallback src={event.image_url} alt={event.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-white/5 text-white/60">이미지가 없습니다.</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute left-4 top-4 flex gap-2">
                <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold">{getDDayLabel(event.date)}</span>
                {event.allow_dyve_reservation && <span className="rounded-full bg-[#FF3B5C] px-3 py-1 text-xs font-semibold text-white">DYVE 예약 가능</span>}
              </div>
            </div>
            <div className="space-y-3 bg-[#0F0F0F] p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-white/50">{event.genre}</p>
              <h2 className="text-2xl font-bold leading-tight">{event.title}</h2>
              <div className="flex flex-wrap gap-3 text-sm text-white/70">
                <span>{event.date}</span>
                <span>·</span>
                <span>{event.time}</span>
                <span>·</span>
                <span>{event.venue_name}</span>
              </div>
              <div className="text-white text-xl font-bold">{formatEventPrice(event.price, event.is_free)}</div>
            </div>
          </div>
        </section>

        <section>{renderSeatSelector()}</section>

        <section className="space-y-4">
          <h3 className="text-white font-bold">결제 요약</h3>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-3">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>입장 방식</span>
              <span className="font-semibold text-white">{entryType === 'seat' ? '지정 좌석' : entryType === 'number' ? '번호표' : '일반 입장'}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>선택 수량</span>
              <span className="font-semibold text-white">{entryType === 'entry' ? quantity : Math.max(selectedSeats.length, 1)}명</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold text-white">
              <span>총 결제 금액</span>
              <span>{event.is_free ? '무료' : formatEventPrice(totalPrice, false)}</span>
            </div>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={handleReservation}
            className="w-full rounded-2xl bg-[#FF3B5C] py-4 text-lg font-bold text-white transition hover:bg-[#d43550] disabled:cursor-not-allowed disabled:bg-[#FF3B5C]/60"
          >
            {submitting ? '예매 처리 중...' : '결제 진행하기'}
          </button>
        </section>
      </div>

      {reservationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0F0F0F] p-6 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
            <h3 className="text-2xl font-bold text-white">예매 완료!</h3>
            <p className="mt-2 text-sm text-white/70">예약 코드 <span className="font-mono text-white">{reservationResult.reservation_code}</span> 를 현장에서 제시해 주세요.</p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4 text-left text-sm text-white/80 space-y-2">
              <p><span className="text-white/50">입장 유형</span> <span className="float-right font-semibold text-white">{reservationResult.entry_type}</span></p>
              <p><span className="text-white/50">수량</span> <span className="float-right font-semibold text-white">{reservationResult.quantity}명</span></p>
              <p><span className="text-white/50">좌석/번호</span> <span className="float-right font-semibold text-white">{reservationResult.seat}</span></p>
            </div>
            {reservationResult.qr_code && (
              <div className="mt-4 flex flex-col items-center">
                <p className="text-xs text-white/60">QR 코드</p>
                <img src={reservationResult.qr_code} alt="예약 QR" className="mt-2 h-36 w-36 rounded-2xl border border-white/10 bg-white" />
              </div>
            )}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={goToTicket} className="rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold text-white">
                공연 상세 보기
              </button>
              <button type="button" onClick={resetToEvents} className="rounded-2xl bg-[#FF3B5C] px-4 py-3 text-sm font-semibold text-white">
                다른 공연 둘러보기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
