import { useState } from 'react';
import { Calendar, Ticket, User } from 'lucide-react';
import kakaoLoginBtn from '../assets/images/kakao_login_large_wide.png';
import { BottomNav } from '../components/navigation/BottomNav';

type UserType = 'user' | 'artist' | 'venue';

const mockBookings = [
  { id: 1, title: 'Midnight Jazz Session', date: '2025-11-05', status: '예매완료' },
  { id: 2, title: 'Indie Rock Night', date: '2025-11-04', status: '예매완료' },
];

const mockPerformances = [
  { id: 1, title: 'Jazz Night Live', date: '2025-12-01', venue: 'Blue Note', attendees: 45 },
  { id: 2, title: 'Acoustic Session', date: '2025-11-28', venue: 'Café Muse', attendees: 30 },
];

export default function MyPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType>('user');

  const handleLogin = (type: UserType) => {
    setIsLoggedIn(true);
    setUserType(type);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <div className="mx-auto w-full max-w-screen-sm px-6 py-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold">My Page</h1>
          {isLoggedIn && (
            <button type="button" onClick={handleLogout} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
              로그아웃
            </button>
          )}
        </header>

        <section className="mb-6 rounded-2xl border border-white/5 bg-[#1A1A1A] p-6">
          {!isLoggedIn ? (
            <>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
                  <User size={32} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">로그인이 필요합니다</h3>
                  <p className="text-sm text-gray-500">카카오로 간편하게 DYVE를 시작하세요</p>
                </div>
              </div>
              <button type="button" onClick={() => handleLogin('user')} className="w-full transition hover:opacity-90">
                <img src={kakaoLoginBtn} alt="카카오 로그인" className="w-full rounded-xl" />
              </button>
              <p className="mt-4 text-xs text-gray-500">테스트용 빠른 로그인</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <button type="button" className="rounded-xl border border-white/10 py-2" onClick={() => handleLogin('user')}>
                  사용자
                </button>
                <button type="button" className="rounded-xl border border-white/10 py-2" onClick={() => handleLogin('artist')}>
                  아티스트
                </button>
                <button type="button" className="rounded-xl border border-white/10 py-2" onClick={() => handleLogin('venue')}>
                  공간
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FF2E2E]">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">DYVE 사용자</h3>
                <p className="text-sm text-gray-400">{userType === 'user' ? '일반 사용자' : userType === 'artist' ? '아티스트' : '공간 보유자'}</p>
              </div>
            </div>
          )}
        </section>

        {isLoggedIn && (
          <>
            <section className="mb-6 rounded-2xl border border-white/5 bg-[#1A1A1A] p-6">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-bold">활동 유형</h4>
                <span className="text-xs text-white/50">{userType.toUpperCase()}</span>
              </div>
              <div className="space-y-2">
                <button type="button" className="w-full rounded-xl border border-[#FF2E2E] py-3 text-sm font-semibold text-[#FF2E2E]">
                  아티스트로 활동하기
                </button>
                <button type="button" className="w-full rounded-xl border border-[#FF2E2E] py-3 text-sm font-semibold text-[#FF2E2E]">
                  공간 보유자로 등록하기
                </button>
              </div>
            </section>

            <section className="mb-6 rounded-2xl border border-white/5 bg-[#1A1A1A] p-6">
              <div className="mb-4 flex items-center gap-2">
                <Ticket size={18} className="text-[#FF2E2E]" />
                <h4 className="font-bold">예매 내역</h4>
              </div>
              <div className="space-y-3">
                {mockBookings.map((booking) => (
                  <div key={booking.id} className="rounded-xl border border-white/5 bg-black p-4">
                    <h5 className="font-semibold">{booking.title}</h5>
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                      <span>{booking.date}</span>
                      <span className="text-[#FF2E2E]">{booking.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {(userType === 'artist' || userType === 'venue') && (
              <section className="mb-6 rounded-2xl border border-white/5 bg-[#1A1A1A] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-[#FF2E2E]" />
                  <h4 className="font-bold">나의 공연 내역</h4>
                </div>
                <div className="space-y-3">
                  {mockPerformances.map((performance) => (
                    <div key={performance.id} className="rounded-xl border border-white/5 bg-black p-4">
                      <h5 className="font-semibold">{performance.title}</h5>
                      <div className="mt-2 flex justify-between text-sm text-gray-500">
                        <span>{performance.date}</span>
                        <span>{performance.venue}</span>
                      </div>
                      <p className="mt-2 text-xs text-white/60">예상 관객 {performance.attendees}명</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
