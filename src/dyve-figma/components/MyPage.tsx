import { Screen } from '../App';
import BottomNav from './BottomNav';
import { User, Ticket, DollarSign, Settings } from 'lucide-react';
import kakaoLoginBtn from 'figma:asset/bf5265e12ba30b9cb07431cc30e30c3400dba2d2.png';
import { useState } from 'react';

interface MyPageProps {
  navigate: (screen: Screen) => void;
}

export default function MyPage({ navigate }: MyPageProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const mockBookings = [
    { id: 1, title: 'Midnight Jazz Session', date: '2025-11-05', status: '예매완료' },
    { id: 2, title: 'Indie Rock Night', date: '2025-11-04', status: '예매완료' },
  ];

  const handleKakaoLogin = () => {
    // 카카오 로그인 로직 (여기서는 간단히 상태 변경)
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen pb-20 bg-black">
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-white text-xl font-extrabold">My Page</h1>
          <button 
            onClick={() => navigate('receivedProposals')}
            className="relative text-white hover:text-[#FF3B5C] transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF3B5C] text-white text-xs rounded-full flex items-center justify-center font-bold">
              2
            </span>
          </button>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Profile / Login Section */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-6">
          {!isLoggedIn ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                  <User size={32} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold">로그인이 필요합니다</h3>
                  <p className="text-gray-500 text-sm">카카오로 간편하게 시작하세요</p>
                </div>
              </div>
              <button 
                onClick={handleKakaoLogin}
                className="w-full hover:opacity-90 transition"
              >
                <img 
                  src={kakaoLoginBtn} 
                  alt="카카오 로그인" 
                  className="w-full rounded-xl"
                />
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-[#FF2E2E] rounded-full flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold">사용자 이름</h3>
                  <p className="text-gray-500 text-sm">useremail.com</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Type - Only visible when logged in */}
        {isLoggedIn && (
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-6">
            <h4 className="text-white mb-3 font-bold">활동 유형</h4>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('register')}
                className="w-full bg-black border border-[#FF2E2E] text-[#FF2E2E] py-3 rounded-xl hover:bg-[#FF2E2E] hover:text-white transition font-semibold text-center"
              >
                아티스트로 활동하기
              </button>
              <button 
                onClick={() => navigate('register')}
                className="w-full bg-black border border-[#FF2E2E] text-[#FF2E2E] py-3 rounded-xl hover:bg-[#FF2E2E] hover:text-white transition font-semibold text-center"
              >
                공간 보유자로 등록하기
              </button>
            </div>
          </div>
        )}

        {/* Booking History - Only visible when logged in */}
        {isLoggedIn && (
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Ticket size={20} className="text-[#FF2E2E]" />
              <h4 className="text-white font-bold">예매 내역</h4>
            </div>
            <div className="space-y-3">
              {mockBookings.map((booking) => (
                <div key={booking.id} className="bg-black rounded-xl p-4 border border-white/5">
                  <h5 className="text-white mb-1 font-medium">{booking.title}</h5>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm">{booking.date}</p>
                    <span className="text-[#FF2E2E] text-sm font-semibold">{booking.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settlement - Only visible when logged in */}
        {isLoggedIn && (
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign size={20} className="text-[#FF2E2E]" />
              <h4 className="text-white font-bold">정산 내역</h4>
            </div>
            <p className="text-gray-500 text-sm mb-4">아티스트 또는 공간 등록 후 이용 가능합니다</p>
            <button className="text-[#FF2E2E] text-sm font-semibold underline">
              정산 내역 보기
            </button>
          </div>
        )}

        {/* Settings */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={20} className="text-[#FF2E2E]" />
            <h4 className="text-white font-bold">설정</h4>
          </div>
          <div className="space-y-3 text-gray-500 text-sm">
            <button className="w-full text-left hover:text-white transition font-medium">알림 설정</button>
            <button className="w-full text-left hover:text-white transition font-medium">개인정보 수정</button>
            <button className="w-full text-left hover:text-white transition font-medium">약관 및 정책</button>
            {isLoggedIn && (
              <button 
                onClick={handleLogout}
                className="w-full text-left text-[#FF2E2E] hover:text-red-400 transition font-medium"
              >
                로그아웃
              </button>
            )}
          </div>
        </div>
      </div>

      <BottomNav navigate={navigate} currentScreen="myPage" />
    </div>
  );
}