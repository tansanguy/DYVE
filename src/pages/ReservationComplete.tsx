import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/navigation/BottomNav';

export default function ReservationCompletePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 px-6 py-4 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40">DYVE</p>
        <h1 className="text-2xl font-bold">예매 완료</h1>
      </header>

      <main className="mx-auto flex max-w-screen-sm flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-white">예매가 성공적으로 완료되었습니다!</p>
          <p className="text-sm text-white/70">
            공연 당일 예약 코드를 현장에서 제시해 주세요. QR 코드와 예약 번호는 마이페이지에서도 확인할 수 있습니다.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="w-full rounded-2xl bg-[#FF3B5C] py-4 text-base font-bold text-white transition hover:bg-[#d43550]"
          >
            다른 공연 둘러보기
          </button>
          <button
            type="button"
            onClick={() => navigate('/mypage')}
            className="w-full rounded-2xl border border-white/20 py-4 text-base font-bold text-white transition hover:border-white/40"
          >
            마이페이지에서 예약 확인
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
