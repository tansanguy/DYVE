import { Screen } from '../App';
import BottomNav from './BottomNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Artist } from '../../types/Artist';

interface SuggestionPageProps {
  navigate: (screen: Screen, data?: any) => void;
}

const ARTIST_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop';

const mockArtists: Artist[] = [
  {
    id: 1,
    name: 'Luna Quartet',
    genre: 'Jazz',
    bio: '감성적인 재즈 4인조 밴드',
    image_url: 'https://images.unsplash.com/photo-1507878866276-a947ef722fee?w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'The Wanderers',
    genre: 'Rock',
    bio: '강렬한 인디 록 밴드',
    image_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'NEON',
    genre: 'Electronic',
    bio: '실험적 일렉트로닉 아티스트',
    image_url: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&auto=format&fit=crop',
  },
];

const mockSpaces = [
  { id: 1, name: 'Blue Note Seoul', type: 'Jazz Club', capacity: 150 },
  { id: 2, name: 'Club FF', type: 'Live Club', capacity: 200 },
  { id: 3, name: 'Vault', type: 'Underground Venue', capacity: 100 },
];

export default function SuggestionPage({ navigate }: SuggestionPageProps) {
  return (
    <div className="min-h-screen pb-20 bg-black">
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-white text-xl font-extrabold">Networking</h1>
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

      <div className="px-6 py-6">
        {/* Info Banner */}
        <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/5 mb-6">
          <h3 className="text-white font-bold mb-2">제안 가능한 경우</h3>
          <ul className="text-gray-400 text-sm space-y-1.5">
            <li>• 아티스트 → 공간 제안</li>
            <li>• 공간 → 아티스트 제안</li>
            <li>• 아티스트 ↔ 아티스트 협업</li>
            <li>• 공간 ↔ 공간 협업</li>
          </ul>
          <p className="text-[#FF3B5C] text-sm mt-3 font-semibold">
            ※ 아티스트 또는 공간 프로필이 있어야 제안할 수 있습니다
          </p>
        </div>

        <Tabs defaultValue="artists" className="w-full">
          <TabsList className="w-full bg-[#1A1A1A] border border-white/5 mb-6">
            <TabsTrigger 
              value="artists" 
              className="flex-1 data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold"
            >
              아티스트 보기
            </TabsTrigger>
            <TabsTrigger 
              value="spaces"
              className="flex-1 data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold"
            >
              공간 보기
            </TabsTrigger>
          </TabsList>

          <TabsContent value="artists" className="space-y-3">
            {mockArtists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => navigate('artistDetail', { artist })}
                className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-[#FF2E2E] transition"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-black rounded-xl overflow-hidden">
                    {/* image_url만 읽도록 통일하고 없으면 fallback 이미지를 사용한다. */}
                    <ImageWithFallback
                      src={artist.image_url || ARTIST_IMAGE_FALLBACK}
                      alt={artist.name}
                      className="w-full h-full object-cover opacity-50"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white mb-1 font-semibold">{artist.name}</h3>
                    <p className="text-[#FF2E2E] text-sm mb-2 font-medium">{artist.genre}</p>
                    <p className="text-gray-500 text-sm">{artist.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="spaces" className="space-y-3">
            {mockSpaces.map((space) => (
              <div
                key={space.id}
                onClick={() => navigate('spaceDetail', { space })}
                className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-[#FF2E2E] transition"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-black rounded-xl overflow-hidden">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200"
                      alt={space.name}
                      className="w-full h-full object-cover opacity-50"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white mb-1 font-semibold">{space.name}</h3>
                    <p className="text-[#FF2E2E] text-sm mb-2 font-medium">{space.type}</p>
                    <p className="text-gray-500 text-sm">수용 인원: {space.capacity}명</p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav navigate={navigate} currentScreen="suggest" />
    </div>
  );
}
