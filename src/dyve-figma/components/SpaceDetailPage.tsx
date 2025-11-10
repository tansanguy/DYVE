import { Screen } from '../App';
import { ArrowLeft, MapPin, Users, Info } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SpaceDetailPageProps {
  navigate: (screen: Screen, data?: any) => void;
  space: any;
}

export default function SpaceDetailPage({ navigate, space }: SpaceDetailPageProps) {
  if (!space) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">공간 정보를 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('suggest')} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-extrabold">공간 상세</h1>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Space Image */}
        <div className="relative h-64 bg-black rounded-2xl overflow-hidden mb-6">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800"
            alt={space.name}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-white text-3xl mb-2 font-extrabold">{space.name}</h2>
            <p className="text-[#FF2E2E] mb-3 font-semibold text-lg">{space.type}</p>
          </div>

          {/* Capacity */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Users size={20} className="text-[#FF2E2E]" />
              <h3 className="text-white font-bold">수용 인원</h3>
            </div>
            <p className="text-gray-500">최대 {space.capacity}명</p>
          </div>

          {/* Description */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Info size={20} className="text-[#FF2E2E]" />
              <h3 className="text-white font-bold">공간 소개</h3>
            </div>
            <p className="text-gray-500 leading-relaxed">
              인디 아티스트들을 위한 친밀한 공연 공간입니다. 
              최고급 음향 시설과 편안한 분위기를 제공합니다.
            </p>
          </div>

          {/* Location */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={20} className="text-[#FF2E2E]" />
              <h3 className="text-white font-bold">위치</h3>
            </div>
            <p className="text-gray-500 mb-4">
              서울시 마포구 홍대거리 123<br />
              지하철 2호선 홍대입구역 9번 출구 도보 5분
            </p>
            <button className="text-[#FF2E2E] text-sm font-semibold underline text-left">
              지도에서 보기
            </button>
          </div>

          {/* Equipment */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <h3 className="text-white mb-3 font-bold">보유 장비</h3>
            <ul className="text-gray-500 text-sm space-y-2">
              <li>• 프로페셔널 PA 시스템</li>
              <li>• 조명 장비</li>
              <li>• 백라인 (드럼, 앰프)</li>
              <li>• 무선 마이크 4채널</li>
            </ul>
          </div>

          {/* Proposal Button */}
          <button 
            onClick={() => navigate('proposal', { space })}
            className="w-full bg-[#FF2E2E] text-white py-4 rounded-2xl hover:bg-[#cc2525] transition font-bold text-lg flex items-center justify-center"
          >
            제안서 보내기
          </button>
        </div>
      </div>
    </div>
  );
}
