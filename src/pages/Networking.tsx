import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../dyve-figma/components/ui/tabs';
import { ImageWithFallback } from '../dyve-figma/components/figma/ImageWithFallback';
import { BottomNav } from '../components/navigation/BottomNav';
import { ProposalInboxButton } from '../components/navigation/ProposalInboxButton';
import { getArtists, getSpaces, ArtistProfile, SpaceProfile } from '../api/networking';

export default function NetworkingPage() {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [spaces, setSpaces] = useState<SpaceProfile[]>([]);
  const [artistStatus, setArtistStatus] = useState<'loading' | 'error' | 'idle'>('loading');
  const [spaceStatus, setSpaceStatus] = useState<'loading' | 'error' | 'idle'>('loading');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await getArtists();
        setArtists(data);
        setArtistStatus('idle');
      } catch (error) {
        console.error('아티스트 목록을 불러오는 중 오류', error);
        setArtistStatus('error');
      }
    };

    const fetchSpaces = async () => {
      try {
        const data = await getSpaces();
        setSpaces(data);
        setSpaceStatus('idle');
      } catch (error) {
        console.error('공간 목록을 불러오는 중 오류', error);
        setSpaceStatus('error');
      }
    };

    fetchArtists();
    fetchSpaces();
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-black">
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-white text-xl font-extrabold">Networking</h1>
          <ProposalInboxButton />
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/5 mb-6">
          <h3 className="text-white font-bold mb-2">제안 가능한 경우</h3>
          <ul className="text-gray-400 text-sm space-y-1.5">
            <li>• 아티스트 → 공간 제안</li>
            <li>• 공간 → 아티스트 제안</li>
            <li>• 아티스트 ↔ 아티스트 협업</li>
            <li>• 공간 ↔ 공간 협업</li>
          </ul>
          <p className="text-[#FF3B5C] text-sm mt-3 font-semibold">※ 아티스트 또는 공간 프로필이 있어야 제안할 수 있습니다</p>
        </div>

        <Tabs defaultValue="artists" className="w-full">
          <TabsList className="w-full bg-[#1A1A1A] border border-white/5 mb-6">
            <TabsTrigger value="artists" className="flex-1 data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold">
              아티스트 보기
            </TabsTrigger>
            <TabsTrigger value="spaces" className="flex-1 data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold">
              공간 보기
            </TabsTrigger>
          </TabsList>

          <TabsContent value="artists" className="space-y-3">
            {artistStatus === 'loading' && (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={`artist-skeleton-${index}`} className="h-32 rounded-2xl border border-white/5 bg-white/5 animate-pulse" />
                ))}
              </div>
            )}
            {artistStatus === 'error' && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                아티스트 정보를 불러오지 못했습니다.
              </div>
            )}
            {artistStatus === 'idle' && artists.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-white/60">
                등록된 아티스트가 없습니다.
              </div>
            )}
            {artistStatus === 'idle' && artists.map((artist) => (
              <div
                key={artist.id}
                className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-[#FF2E2E] transition"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-black rounded-xl overflow-hidden">
                    <ImageWithFallback
                      src={artist.avatar_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200'}
                      alt={artist.name}
                      className="w-full h-full object-cover opacity-50"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white mb-1 font-semibold">{artist.name}</h3>
                    <p className="text-[#FF2E2E] text-sm mb-2 font-medium">{artist.genre || '장르 미정'}</p>
                    <p className="text-gray-500 text-sm">{artist.bio || '자기소개가 아직 없습니다.'}</p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="spaces" className="space-y-3">
            {spaceStatus === 'loading' && (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={`space-skeleton-${index}`} className="h-32 rounded-2xl border border-white/5 bg-white/5 animate-pulse" />
                ))}
              </div>
            )}
            {spaceStatus === 'error' && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                공간 정보를 불러오지 못했습니다.
              </div>
            )}
            {spaceStatus === 'idle' && spaces.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-white/60">
                등록된 공간이 없습니다.
              </div>
            )}
            {spaceStatus === 'idle' && spaces.map((space) => (
              <div
                key={space.id}
                className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-[#FF2E2E] transition"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-black rounded-xl overflow-hidden">
                    <ImageWithFallback
                      src={space.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200'}
                      alt={space.name}
                      className="w-full h-full object-cover opacity-50"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white mb-1 font-semibold">{space.name}</h3>
                    <p className="text-[#FF2E2E] text-sm mb-2 font-medium">{space.type || '공간'}</p>
                    <p className="text-gray-500 text-sm">수용 인원: {space.capacity ?? '-'}명</p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
