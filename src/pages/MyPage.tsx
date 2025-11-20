import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Ticket, DollarSign, Settings, Code, Calendar } from 'lucide-react';
import kakaoLoginBtn from '../assets/images/kakao_login_large_wide.png';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../dyve-figma/components/ui/dialog';
import { Switch } from '../dyve-figma/components/ui/switch';
import { Input } from '../dyve-figma/components/ui/input';
import { Label } from '../dyve-figma/components/ui/label';
import { Button } from '../dyve-figma/components/ui/button';
import { BottomNav } from '../components/navigation/BottomNav';
import { ProposalInboxButton } from '../components/navigation/ProposalInboxButton';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/client';
import { FakeLoginResponse } from '../types/auth';

type UserType = 'user' | 'artist' | 'venue' | null;

export default function MyPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout: logoutFromContext, setUser } = useAuth();
  const [userType, setUserType] = useState<UserType>(null);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showSettlementDialog, setShowSettlementDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [notifications, setNotifications] = useState({
    performanceUpdates: true,
    suggestions: true,
    bookingConfirm: true,
    marketing: false,
  });
  const [userInfo, setUserInfo] = useState({
    name: '김다이브',
    email: 'user@example.com',
    phone: '010-1234-5678',
  });

  const mockBookings = [
    { id: 1, title: 'Midnight Jazz Session', date: '2025-11-05', status: '예매완료' },
    { id: 2, title: 'Indie Rock Night', date: '2025-11-04', status: '예매완료' },
  ];

  const mockPerformances = [
    { id: 1, title: 'Jazz Night Live', date: '2025-12-01', venue: 'Blue Note', attendees: 45 },
    { id: 2, title: 'Acoustic Session', date: '2025-11-28', venue: 'Café Muse', attendees: 30 },
  ];

  useEffect(() => {
    if (isAuthenticated && user) {
      setUserInfo((prev) => ({
        ...prev,
        name: user.first_name || user.username || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [isAuthenticated, user]);

  const handleKakaoLogin = () => {
    alert('카카오 로그인은 준비 중입니다.');
  };

  const handleDevLogin = async (nextType?: Exclude<UserType, null>) => {
    try {
      const res = await apiClient.post("/api/auth/fake-login/");
      const data = res.data as FakeLoginResponse;
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("개발용 로그인 완료!");
      if (nextType) setUserType(nextType);
    } catch (err) {
      console.error(err);
      alert("로그인 실패");
    }
  };

  const handleLogout = () => {
    logoutFromContext();
    setUserType(null);
  };

  const goToArtistRegister = () => navigate('/mypage/artist-profile');
  const goToSpaceRegister = () => navigate('/events/register?tab=space');

  return (
    <div className="min-h-screen pb-20 bg-black">
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-white text-xl font-extrabold">My Page</h1>
          <ProposalInboxButton />
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-6">
          {!user ? (
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
              <button onClick={handleKakaoLogin} className="w-full hover:opacity-90 transition" type="button">
                <img src={kakaoLoginBtn} alt="카카오 로그인" className="w-full rounded-xl" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#FF2E2E] rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-white text-xl font-bold">{userInfo.name || '사용자 이름'}</h3>
              <p className="text-gray-500 text-sm">{userInfo.email || 'user@email.com'}</p>
            </div>
          </div>
        )}
        </div>

        {user && (
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-bold">활동 유형</h4>
              {(userType === 'artist' || userType === 'venue') && (
                <button
                  type="button"
                  onClick={() => setShowProfileDialog(true)}
                  className="text-[#FF2E2E] text-sm font-semibold underline hover:text-red-400 transition"
                >
                  프로필 확인
                </button>
              )}
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={goToArtistRegister}
                className="w-full bg-black border border-[#FF2E2E] text-[#FF2E2E] py-3 rounded-xl hover:bg-[#FF2E2E] hover:text-white transition font-semibold text-center"
              >
                아티스트로 활동하기
              </button>
              <button
                type="button"
                onClick={goToSpaceRegister}
                className="w-full bg-black border border-[#FF2E2E] text-[#FF2E2E] py-3 rounded-xl hover:bg-[#FF2E2E] hover:text-white transition font-semibold text-center"
              >
                공간 보유자로 등록하기
              </button>
            </div>
          </div>
        )}

        {user && (
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

        {user && (userType === 'artist' || userType === 'venue') && (
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={20} className="text-[#FF2E2E]" />
              <h4 className="text-white font-bold">나의 공연 내역</h4>
            </div>
            <div className="space-y-3">
              {mockPerformances.map((performance) => (
                <div key={performance.id} className="bg-black rounded-xl p-4 border border-white/5">
                  <h5 className="text-white mb-1 font-medium">{performance.title}</h5>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-500 text-sm">{performance.date}</p>
                    <p className="text-gray-500 text-sm">{performance.venue}</p>
                  </div>
                  <p className="text-[#FF2E2E] text-xs font-semibold">참석 인원: {performance.attendees}명</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {user && (
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign size={20} className="text-[#FF2E2E]" />
              <h4 className="text-white font-bold">정산 내역</h4>
            </div>
            <p className="text-gray-500 text-sm mb-4">아티스트 또는 공간 등록 후 이용 가능합니다</p>
            <button
              type="button"
              onClick={() => setShowSettlementDialog(true)}
              className="text-[#FF2E2E] text-sm font-semibold underline hover:text-red-400 transition"
            >
              정산 내역 보기
            </button>
          </div>
        )}

        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={20} className="text-[#FF2E2E]" />
            <h4 className="text-white font-bold">설정</h4>
          </div>
          <div className="space-y-3 text-gray-500 text-sm">
            <button type="button" onClick={() => setShowNotificationDialog(true)} className="w-full text-left hover:text-white transition font-medium">
              알림 설정
            </button>
            <button type="button" onClick={() => setShowPrivacyDialog(true)} className="w-full text-left hover:text-white transition font-medium">
              개인정보 수정
            </button>
            <button type="button" onClick={() => setShowTermsDialog(true)} className="w-full text-left hover:text-white transition font-medium">
              약관 및 정책
            </button>
            {user && (
              <button type="button" onClick={handleLogout} className="w-full text-left text-[#FF2E2E] hover:text-red-400 transition font-medium">
                로그아웃
              </button>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-6 border border-purple-500/20 mt-6">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Code size={20} className="text-purple-400" />
            <h4 className="text-white font-bold">개발 전용 로그인</h4>
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full font-semibold">DEV</span>
          </div>
          <p className="text-gray-400 text-xs mb-4 text-center">테스트를 위한 더미 계정으로 빠르게 로그인하세요</p>
          <div className="space-y-2">
            <button type="button" onClick={() => handleDevLogin('user')} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-lg hover:from-blue-500 hover:to-blue-400 transition font-semibold text-sm text-center">
              일반 사용자로 로그인
            </button>
            <button type="button" onClick={() => handleDevLogin('artist')} className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-2.5 rounded-lg hover:from-purple-500 hover:to-purple-400 transition font-semibold text-sm text-center">
              아티스트로 로그인
            </button>
            <button type="button" onClick={() => handleDevLogin('venue')} className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white py-2.5 rounded-lg hover:from-pink-500 hover:to-pink-400 transition font-semibold text-sm text-center">
              공간 보유자로 로그인
            </button>
          </div>
        </div>
      </div>

      <BottomNav />

      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="bg-[#1A1A1A] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">알림 설정</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium mb-1">공연 업데이트</p>
                <p className="text-gray-500 text-xs">예매한 공연의 변경사항을 알려드립니다</p>
              </div>
              <Switch
                checked={notifications.performanceUpdates}
                onCheckedChange={(checked) => setNotifications({ ...notifications, performanceUpdates: checked })}
                className="data-[state=checked]:bg-[#FF2E2E]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium mb-1">제안 알림</p>
                <p className="text-gray-500 text-xs">새로운 제안을 받으면 알려드립니다</p>
              </div>
              <Switch
                checked={notifications.suggestions}
                onCheckedChange={(checked) => setNotifications({ ...notifications, suggestions: checked })}
                className="data-[state=checked]:bg-[#FF2E2E]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium mb-1">예매 확정</p>
                <p className="text-gray-500 text-xs">예매 확정 시 알려드립니다</p>
              </div>
              <Switch
                checked={notifications.bookingConfirm}
                onCheckedChange={(checked) => setNotifications({ ...notifications, bookingConfirm: checked })}
                className="data-[state=checked]:bg-[#FF2E2E]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium mb-1">마케팅 알림</p>
                <p className="text-gray-500 text-xs">이벤트 및 프로모션 정보를 받습니다</p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                className="data-[state=checked]:bg-[#FF2E2E]"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="bg-[#1A1A1A] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">개인정보 수정</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-400 mb-2 block text-xs">
                이름
              </Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                className="bg-black border-white/10 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-400 mb-2 block text-xs">
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                className="bg-black border-white/10 text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-400 mb-2 block text-xs">
                전화번호
              </Label>
              <Input
                id="phone"
                type="tel"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                className="bg-black border-white/10 text-white"
              />
            </div>
            <div className="pt-2">
              <Button
                onClick={() => {
                  toast.success('개인정보가 수정되었습니다');
                  setShowPrivacyDialog(false);
                }}
                className="w-full bg-[#FF2E2E] text-white hover:bg-[#cc2525] font-bold"
              >
                저장
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="bg-[#1A1A1A] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">약관 및 정책</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-gray-400 text-sm space-y-3">
            <p>• 이용약관</p>
            <p>• 개인정보 처리방침</p>
            <p>• 위치기반 서비스 이용약관</p>
            <p className="text-gray-600 text-xs pt-2">자세한 약관은 곧 추가될 예정입니다.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSettlementDialog} onOpenChange={setShowSettlementDialog}>
        <DialogContent className="bg-[#1A1A1A] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">정산 내역</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-black rounded-xl p-4 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">2024년 10월</span>
                <span className="text-[#FF2E2E] font-bold">+50,000원</span>
              </div>
              <p className="text-gray-500 text-xs">Jazz Night 수익</p>
            </div>
            <div className="bg-black rounded-xl p-4 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">2024년 9월</span>
                <span className="text-[#FF2E2E] font-bold">+30,000원</span>
              </div>
              <p className="text-gray-500 text-xs">Rock Concert 수익</p>
            </div>
            <p className="text-gray-600 text-xs text-center pt-2">모의 데이터입니다</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">{userType === 'artist' ? '아티스트 프로필' : '공간 프로필'}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {userType === 'artist' ? (
              <>
                <div>
                  <p className="text-gray-600 text-xs mb-1">아티스트명</p>
                  <p className="text-white font-medium">Jazz Master</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1">장르</p>
                  <p className="text-white font-medium">Jazz, R&B</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1">활동 지역</p>
                  <p className="text-white font-medium">서울, 경기</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1">소개</p>
                  <p className="text-white font-medium">10년 경력의 재즈 뮤지션입니다. 다양한 공연 경험을 보유하고 있습니다.</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1">총 공연 횟수</p>
                  <p className="text-[#FF2E2E] font-bold">32회</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-gray-600 text-xs mb-1">공간명</p>
                  <p className="text-white font-medium">Blue Note Seoul</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1">위치</p>
                  <p className="text-white font-medium">서울시 마포구 홍대입구역</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1">수용 인원</p>
                  <p className="text-white font-medium">최대 100명</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1">공간 소개</p>
                  <p className="text-white font-medium">홍대에서 가장 유명한 재즈 공연장입니다. 최고의 음향 시설을 갖추고 있습니다.</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1">총 개최 공연</p>
                  <p className="text-[#FF2E2E] font-bold">48회</p>
                </div>
              </>
            )}
            <p className="text-gray-600 text-xs text-center pt-2">모의 데이터입니다</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
