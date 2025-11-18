import { FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createReservation, ReservationResponse } from '../api/reservation';

export default function ReservationPage() {
  const { id } = useParams();
  const eventId = Number(id);

  const [quantity, setQuantity] = useState(1);
  const [seat, setSeat] = useState('');
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<ReservationResponse | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!eventId) {
      alert('유효하지 않은 공연 ID입니다.');
      return;
    }

    if (!seat.trim()) {
      alert('좌석을 입력해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await createReservation({
        event: eventId,
        quantity,
        seat: seat.trim(),
      });
      setReservation(response);
      alert('예매가 완료되었습니다.');
    } catch (err) {
      console.error('예매 생성 중 오류 발생', err);
      alert('예매를 완료하지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-white/60">Reservation</p>
          <h1 className="text-3xl font-bold">공연 예매</h1>
          <p className="text-sm text-white/60">원하시는 수량과 좌석 정보를 입력해 예매를 완료하세요.</p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-white/5"
        >
          <div>
            <label htmlFor="quantity" className="block text-sm font-semibold text-white/80">
              수량
            </label>
            <select
              id="quantity"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 p-3 text-white focus:border-white focus:outline-none"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={loading}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value} className="text-black">
                  {value}매
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="seat" className="block text-sm font-semibold text-white/80">
              좌석 정보
            </label>
            <input
              id="seat"
              type="text"
              placeholder="예: Standing A-1"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 p-3 text-white placeholder:text-white/40 focus:border-white focus:outline-none"
              value={seat}
              onChange={(e) => setSeat(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-white px-6 py-3 text-lg font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-white/60"
            disabled={loading}
          >
            {loading ? '예매 중...' : '예매 완료'}
          </button>
        </form>

        {reservation && (
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
            <h2 className="text-2xl font-semibold text-emerald-200">예매가 완료되었습니다!</h2>
            <p className="mt-2 text-sm text-emerald-100">
              예매 코드를 확인하고 QR을 현장에서 제시해 주세요.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm text-white/60">예매 코드</p>
                <p className="text-2xl font-bold text-white">{reservation.reservation_code}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm text-white/60">입장 유형</p>
                <p className="text-xl font-semibold text-white">{reservation.entry_type}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm text-white/60">예매 수량</p>
                <p className="text-xl font-semibold text-white">{reservation.quantity}매</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm text-white/60">좌석</p>
                <p className="text-xl font-semibold text-white">{reservation.seat}</p>
              </div>
            </div>

            {reservation.qr_code && (
              <div className="mt-4 flex flex-col items-center gap-2">
                <p className="text-sm text-white/70">QR 코드</p>
                <img
                  src={reservation.qr_code}
                  alt="예약 QR"
                  className="h-40 w-40 rounded-2xl border border-white/10 bg-white"
                />
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between text-sm text-white/70">
          <Link to="/" className="underline-offset-4 hover:underline">
            홈으로 돌아가기
          </Link>
          {eventId && (
            <Link to={`/event/${eventId}`} className="underline-offset-4 hover:underline">
              공연 상세 보기
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
