import { Screen } from '../App';
import { ArrowLeft, Music, Link as LinkIcon, Package } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ArtistDetailPageProps {
  navigate: (screen: Screen, data?: any) => void;
  artist: any;
}

export default function ArtistDetailPage({ navigate, artist }: ArtistDetailPageProps) {
  if (!artist) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">아티스트 정보를 찾을 수 없습니다</p>
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
          <h1 className="text-white text-xl font-extrabold">아티스트 프로필</h1>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Profile Image */}
        <div className="relative h-64 bg-black rounded-2xl overflow-hidden mb-6">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800"
            alt={artist.name}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-white text-3xl mb-2 font-extrabold">{artist.name}</h2>
            <p className="text-[#FF2E2E] mb-3 font-semibold text-lg">{artist.genre}</p>
            <p className="text-gray-500 leading-relaxed">
              {artist.bio || '감각적인 사운드와 독특한 스타일로 인디 음악 신에서 주목받고 있는 아티스트입니다.'}
            </p>
          </div>

          {/* Portfolio */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <LinkIcon size={20} className="text-[#FF2E2E]" />
              <h3 className="text-white font-bold">포트폴리오</h3>
            </div>
            <a href="#" className="text-[#FF2E2E] text-sm underline font-medium">
              soundcloud.com/{artist.name.toLowerCase().replace(' ', '')}
            </a>
          </div>

          {/* Equipment */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Package size={20} className="text-[#FF2E2E]" />
              <h3 className="text-white font-bold">장비 리스트</h3>
            </div>
            <ul className="text-gray-500 text-sm space-y-2">
              <li>• Guitar (Electric & Acoustic)</li>
              <li>• Keyboard / Synthesizer</li>
              <li>• Vocal Mic & Stand</li>
              <li>• Audio Interface</li>
            </ul>
          </div>

          {/* Past Performances */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Music size={20} className="text-[#FF2E2E]" />
              <h3 className="text-white font-bold">공연 이력</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• 2024.10 - Hongdae Live Hall</p>
              <p>• 2024.09 - Seoul Jazz Festival</p>
              <p>• 2024.08 - Club Stage</p>
            </div>
          </div>

          {/* Proposal Button */}
          <button 
            onClick={() => navigate('proposal', { artist })}
            className="w-full bg-[#FF2E2E] text-white py-4 rounded-2xl hover:bg-[#cc2525] transition font-bold text-lg flex items-center justify-center"
          >
            제안서 보내기
          </button>
        </div>
      </div>
    </div>
  );
}
