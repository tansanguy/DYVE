import { Screen } from '../App';
import { CheckCircle2, MapPin, Calendar, Clock } from 'lucide-react';

interface BookingConfirmationPageProps {
  navigate: (screen: Screen) => void;
  booking: any;
}

export default function BookingConfirmationPage({ navigate, booking }: BookingConfirmationPageProps) {
  if (!booking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">예매 정보를 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="px-6 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <CheckCircle2 size={72} className="text-[#FF2E2E] mx-auto mb-6" />
          <h1 className="text-white text-3xl mb-2 font-extrabold">예매 완료!</h1>
          <p className="text-gray-500">QR 코드로 입장하세요</p>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl p-8 mb-8 flex items-center justify-center">
          <div className="w-48 h-48 bg-gray-900 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full p-2">
              <rect x="0" y="0" width="100" height="100" fill="white"/>
              <rect x="10" y="10" width="10" height="10" fill="black"/>
              <rect x="30" y="10" width="10" height="10" fill="black"/>
              <rect x="50" y="10" width="10" height="10" fill="black"/>
              <rect x="70" y="10" width="10" height="10" fill="black"/>
              <rect x="10" y="30" width="10" height="10" fill="black"/>
              <rect x="30" y="30" width="10" height="10" fill="black"/>
              <rect x="50" y="30" width="10" height="10" fill="black"/>
              <rect x="70" y="30" width="10" height="10" fill="black"/>
              <rect x="10" y="50" width="10" height="10" fill="black"/>
              <rect x="30" y="50" width="10" height="10" fill="black"/>
              <rect x="50" y="50" width="10" height="10" fill="black"/>
              <rect x="70" y="50" width="10" height="10" fill="black"/>
              <rect x="10" y="70" width="10" height="10" fill="black"/>
              <rect x="30" y="70" width="10" height="10" fill="black"/>
              <rect x="50" y="70" width="10" height="10" fill="black"/>
              <rect x="70" y="70" width="10" height="10" fill="black"/>
            </svg>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-8">
          <h3 className="text-white mb-4 font-bold">예매 상세</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">공연명</p>
              <p className="text-white font-medium">{booking.performance}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">아티스트</p>
              <p className="text-white font-medium">{booking.artist}</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#FF2E2E]" />
              <span className="text-white font-medium">{booking.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#FF2E2E]" />
              <span className="text-white font-medium">{booking.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#FF2E2E]" />
              <span className="text-white font-medium">{booking.venue}</span>
            </div>
            <div className="h-px bg-white/5 my-3" />
            <div>
              <p className="text-gray-600 text-sm mb-1">예매 번호</p>
              <p className="text-[#FF2E2E] font-bold">{booking.bookingNumber}</p>
            </div>
          </div>
        </div>

        {/* Venue Info */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-8">
          <h3 className="text-white mb-3 font-bold">공연장 정보</h3>
          <p className="text-gray-500 text-sm mb-4">
            서울시 마포구 홍대거리 123<br />
            지하철 2호선 홍대입구역 9번 출구 도보 5분
          </p>
          <button className="text-[#FF2E2E] text-sm font-semibold underline text-left">
            지도에서 보기
          </button>
        </div>

        {/* Home Button */}
        <button 
          onClick={() => navigate('home')}
          className="w-full bg-[#FF2E2E] text-white py-4 rounded-2xl hover:bg-[#cc2525] transition font-bold text-lg flex items-center justify-center"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
