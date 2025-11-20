import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../dyve-figma/components/ui/tabs';
import { ImageWithFallback } from '../dyve-figma/components/figma/ImageWithFallback';
import { BottomNav } from '../components/navigation/BottomNav';
import { ProposalInboxButton } from '../components/navigation/ProposalInboxButton';
import { getArtists } from '../api/artists';
import { getSpaces, SpaceProfile } from '../api/spaces';
import type { Artist } from '../types/Artist';
import { CardSkeleton } from '../components/common/CardSkeleton';

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1464375117522-1311d6a5b81d?w=900&auto=format&fit=crop&q=80';

const ALERT_ITEMS = [
  '아티스트 → 공간 제안',
  '공간 → 아티스트 제안',
  '아티스트 ↔ 아티스트 협업',
  '공간 ↔ 공간 협업',
];

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
        console.error('아티스트 목록을 불러오는 중 오류 발생', error);
        setArtistStatus('error');
      }
    };

    const fetchSpaces = async () => {
      try {
        const data = await getSpaces();
        setSpaces(data);
        setSpaceStatus('idle');
      } catch (error) {
        console.error('공간 목록을 불러오는 중 오류 발생', error);
        setSpaceStatus('error');
      }
    };

    fetchArtists();
    fetchSpaces();
  }, []);

  const StatusBlock = ({ message }: { message: string }) => (
    <div className="rounded-2xl border border-white/5 bg-[#111] p-6 text-center text-sm text-gray-300">{message}</div>
  );

  const goToArtistDetail = (artistId: number) => navigate(`/networking/${artistId}`);
  const goToSpaceDetail = (spaceId: number) => navigate(`/spaces/${spaceId}`);

  return (
    <div className="min-h-screen pb-24 bg-black text-white">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-extrabold">Networking</h1>
          <ProposalInboxButton />
        </div>
      </div>

      <main className="space-y-6 px-6 py-6">
        <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-4">
          <h3 className="text-white font-bold">제안 가능한 경우</h3>
          <ul className="mt-3 space-y-1 text-sm text-gray-400">
            {ALERT_ITEMS.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm font-semibold text-[#FF3B5C]">
            ※ 아티스트 또는 공간 프로필이 있어야 제안할 수 있습니다
          </p>
        </div>

        <Tabs defaultValue="artists" className="space-y-4">
          <TabsList className="flex w-full rounded-full border border-white/5 bg-[#111] p-1">
            <TabsTrigger
              value="artists"
              className="flex-1 rounded-full px-4 py-2 text-sm font-semibold text-white transition data-[state=active]:bg-[#FF3B5C] data-[state=active]:text-black"
            >
              아티스트 보기
            </TabsTrigger>
            <TabsTrigger
              value="spaces"
              className="flex-1 rounded-full px-4 py-2 text-sm font-semibold text-white transition data-[state=active]:bg-[#FF3B5C] data-[state=active]:text-black"
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
                  onKeyDown={(event) => event.key === 'Enter' && goToArtistDetail(artist.id)}
                  className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-4 transition hover:border-[#FF3B5C]"
                >
                  <div className="flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-white/5 bg-black">
                      <ImageWithFallback
                        src={artist.image_url || FALLBACK_AVATAR}
                        alt={artist.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-base font-semibold text-white">{artist.name}</h3>
                      <p className="text-[#FF3B5C] text-sm font-medium">
                        {artist.genre || '장르 미정'}
                      </p>
                      <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                        {artist.bio || '자기소개가 아직 없습니다.'}
                      </p>
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
                  onKeyDown={(event) => event.key === 'Enter' && goToSpaceDetail(space.id)}
                  className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-4 transition hover:border-[#FF3B5C]"
                >
                  <div className="flex gap-4">
                    <div className="overflow-hidden rounded-xl border border-white/5 bg-black">
                      <ImageWithFallback
                        src={space.image_url || FALLBACK_AVATAR}
                        alt={space.name}
                        className="h-20 w-20 object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-base font-semibold text-white">{space.name}</h3>
                      <p className="text-[#FF3B5C] text-sm font-medium">
                        {space.type || space.category || '공간'}
                      </p>
                      <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                        {space.description || '공간 소개가 아직 없습니다.'}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        수용 인원: {space.capacity ?? '미정'}명
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
}
