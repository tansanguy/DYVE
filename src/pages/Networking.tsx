import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../dyve-figma/components/ui/tabs';
import { ImageWithFallback } from '../dyve-figma/components/figma/ImageWithFallback';
import { BottomNav } from '../components/navigation/BottomNav';
import { ProposalInboxButton } from '../components/navigation/ProposalInboxButton';
import { getArtists } from '../api/artists';
import { getSpaces, SpaceProfile } from '../api/spaces';
import type { Artist } from '../types/Artist';
import { DEFAULT_CARD_PLACEHOLDER } from '../constants/media';
import { CardSkeleton } from '../components/common/CardSkeleton';

export default function NetworkingPage() {
  const navigate = useNavigate();
  const [artists, setArtists] = useState<Artist[]>([]);
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
        console.error('아티스트 목록을 불러오지 못했습니다.', error);
        setArtistStatus('error');
      }
    };

    const fetchSpaces = async () => {
      try {
        const data = await getSpaces();
        setSpaces(data);
        setSpaceStatus('idle');
      } catch (error) {
        console.error('공간 목록을 불러오지 못했습니다.', error);
        setSpaceStatus('error');
      }
    };

    fetchArtists();
    fetchSpaces();
  }, []);

  const StatusBlock = ({ message }: { message: string }) => (
    <div className="rounded-2xl border border-[#333] bg-[#111] p-6 text-center text-sm text-gray-400">{message}</div>
  );

  const goToArtistDetail = (id: number) => navigate(`/artists/${id}`);
  const goToSpaceDetail = (id: number) => navigate(`/spaces/${id}`);

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <div className="sticky top-0 z-40 border-b border-[#222] bg-black/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold text-white">Networking</h1>
          <ProposalInboxButton />
        </div>
      </div>

      <div className="mx-auto w-full max-w-md space-y-6 px-4 py-6">
        <div className="rounded-2xl border border-[#333] bg-[#111] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-base font-semibold text-white">제안 가능한 경우</h3>
          <ul className="mt-3 space-y-1 text-sm text-gray-400">
            <li>• 아티스트 → 공간 제안</li>
            <li>• 공간 → 아티스트 제안</li>
            <li>• 아티스트 ↔ 아티스트 협업</li>
            <li>• 공간 ↔ 공간 협업</li>
          </ul>
          <p className="mt-4 text-sm font-semibold text-[#FF3B5C]">※ 아티스트 또는 공간 프로필이 있어야 제안할 수 있습니다</p>
        </div>

        <Tabs defaultValue="artists" className="w-full">
          <TabsList className="mb-5 flex gap-2 rounded-full bg-transparent">
            <TabsTrigger
              value="artists"
              className="flex-1 rounded-full border border-[#333] px-4 py-2 text-sm font-semibold text-gray-400 data-[state=active]:border-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              아티스트 보기
            </TabsTrigger>
            <TabsTrigger
              value="spaces"
              className="flex-1 rounded-full border border-[#333] px-4 py-2 text-sm font-semibold text-gray-400 data-[state=active]:border-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              공간 보기
            </TabsTrigger>
          </TabsList>

          <TabsContent value="artists" className="space-y-3">
            {artistStatus === 'loading' && (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <CardSkeleton key={`artist-skeleton-${index}`} variant="artist" />
                ))}
              </div>
            )}
            {artistStatus === 'error' && <StatusBlock message="아티스트 정보를 불러오지 못했습니다." />}
            {artistStatus === 'idle' && artists.length === 0 && <StatusBlock message="등록된 아티스트가 없습니다." />}
            {artistStatus === 'idle' &&
              artists.map((artist) => (
                <div
                  key={artist.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => goToArtistDetail(artist.id)}
                  onKeyDown={(e) => e.key === 'Enter' && goToArtistDetail(artist.id)}
                  className="rounded-2xl border border-[#333] bg-[#111] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.55)] transition hover:border-white/30 cursor-pointer"
                >
                  <div className="flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-[#333] bg-black">
                      <ImageWithFallback src={artist.image_url || DEFAULT_CARD_PLACEHOLDER} alt={artist.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-base font-semibold text-white">{artist.name}</h3>
                      <p className="text-sm font-semibold text-[#FF3B5C]">{artist.genre || '장르 미정'}</p>
                      <p className="text-xs text-gray-500">{artist.region || '활동 지역 미정'}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-300">{artist.bio || '자기소개가 아직 없습니다.'}</p>
                    </div>
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="spaces" className="space-y-3">
            {spaceStatus === 'loading' && (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <CardSkeleton key={`space-skeleton-${index}`} variant="space" />
                ))}
              </div>
            )}
            {spaceStatus === 'error' && <StatusBlock message="공간 정보를 불러오지 못했습니다." />}
            {spaceStatus === 'idle' && spaces.length === 0 && <StatusBlock message="등록된 공간이 없습니다." />}
            {spaceStatus === 'idle' &&
              spaces.map((space) => (
                <div
                  key={space.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => goToSpaceDetail(space.id)}
                  onKeyDown={(e) => e.key === 'Enter' && goToSpaceDetail(space.id)}
                  className="rounded-2xl border border-[#333] bg-[#111] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.55)] transition hover:border-white/30 cursor-pointer"
                >
                  <div className="flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-[#333] bg-black">
                      <ImageWithFallback src={space.image_url || DEFAULT_CARD_PLACEHOLDER} alt={space.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-base font-semibold text-white">{space.name}</h3>
                      <p className="text-sm font-semibold text-[#FF3B5C]">{space.type || space.category || '공간'}</p>
                      <p className="text-xs text-gray-500">위치: {space.region || space.address || space.location || '미정'}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-300">{space.description || '공간 소개가 아직 없습니다.'}</p>
                    </div>
                  </div>
                </div>
              ))}
          </TabsContent>
        </Tabs>

        <div className="rounded-2xl border border-[#333] bg-[#111] p-5 text-center text-sm text-gray-400">
          내 프로필 생성과 관리는 My Page에서 진행할 수 있습니다.
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
