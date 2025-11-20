import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../dyve-figma/components/ui/tabs';
import { ImageWithFallback } from '../dyve-figma/components/figma/ImageWithFallback';
import { BottomNav } from '../components/navigation/BottomNav';
import { ProposalInboxButton } from '../components/navigation/ProposalInboxButton';
import { getArtists, getArtistDetail } from '../api/artists';
import { getSpaces, getSpaceDetail, SpaceProfile } from '../api/spaces';
import type { Artist } from '../types/Artist';
import { proposalsCreate } from '../api/proposal';
import { toast } from 'sonner';
import { Textarea } from '../dyve-figma/components/ui/textarea';
import { Button } from '../dyve-figma/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../dyve-figma/components/ui/dialog';
import { useAppContext } from '../contexts/AppContext';
import { Skeleton } from '../dyve-figma/components/ui/skeleton';
import { DEFAULT_CARD_PLACEHOLDER } from '../constants/media';
import { CardSkeleton } from '../components/common/CardSkeleton';

export default function NetworkingPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [spaces, setSpaces] = useState<SpaceProfile[]>([]);
  const [artistStatus, setArtistStatus] = useState<'loading' | 'error' | 'idle'>('loading');
  const [spaceStatus, setSpaceStatus] = useState<'loading' | 'error' | 'idle'>('loading');
  const [artistDetail, setArtistDetail] = useState<Artist | null>(null);
  const [spaceDetail, setSpaceDetail] = useState<SpaceProfile | null>(null);
  const [artistDetailOpen, setArtistDetailOpen] = useState(false);
  const [spaceDetailOpen, setSpaceDetailOpen] = useState(false);
  const [artistDetailLoading, setArtistDetailLoading] = useState(false);
  const [spaceDetailLoading, setSpaceDetailLoading] = useState(false);
  const [proposalTarget, setProposalTarget] = useState<{ type: 'artist' | 'space'; id: number; name: string } | null>(null);
  const [proposalContent, setProposalContent] = useState('');
  const [sendingProposal, setSendingProposal] = useState(false);
  const { refreshProposalCount } = useAppContext();

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

  const openArtistDetail = async (id: number) => {
    setArtistDetailLoading(true);
    try {
      const detail = await getArtistDetail(id);
      setArtistDetail(detail);
      setArtistDetailOpen(true);
    } catch (error) {
      console.error('아티스트 상세를 불러오지 못했습니다.', error);
      toast.error('아티스트 정보를 불러오지 못했습니다.');
    } finally {
      setArtistDetailLoading(false);
    }
  };

  const openSpaceDetail = async (id: number) => {
    setSpaceDetailLoading(true);
    try {
      const detail = await getSpaceDetail(id);
      setSpaceDetail(detail);
      setSpaceDetailOpen(true);
    } catch (error) {
      console.error('공간 상세를 불러오지 못했습니다.', error);
      toast.error('공간 정보를 불러오지 못했습니다.');
    } finally {
      setSpaceDetailLoading(false);
    }
  };

  const openArtistProposalFromDetail = () => {
    if (!artistDetail) return;
    openProposalDialog('artist', artistDetail.id, artistDetail.name);
  };

  const openSpaceProposalFromDetail = () => {
    if (!spaceDetail) return;
    openProposalDialog('space', spaceDetail.id, spaceDetail.name);
  };

  const openProposalDialog = (type: 'artist' | 'space', id: number, name: string) => {
    setProposalTarget({ type, id, name });
    setProposalContent('');
  };

  const closeProposalDialog = () => {
    setProposalTarget(null);
    setProposalContent('');
    setSendingProposal(false);
  };

  const handleSendProposal = async () => {
    if (!proposalTarget) return;
    if (!proposalContent.trim()) {
      toast.error('제안 내용을 입력해주세요.');
      return;
    }

    setSendingProposal(true);
    try {
      await proposalsCreate({
        receiver_artist: proposalTarget.type === 'artist' ? proposalTarget.id : null,
        receiver_space: proposalTarget.type === 'space' ? proposalTarget.id : null,
        content: proposalContent.trim(),
      });
      toast.success('제안서가 전송되었습니다');
      closeProposalDialog();
      refreshProposalCount();
    } catch (error) {
      console.error('제안 전송 실패', error);
      toast.error('제안서를 전송하지 못했습니다. 다시 시도해주세요.');
    } finally {
      setSendingProposal(false);
    }
  };

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
                  onClick={() => openArtistDetail(artist.id)}
                  onKeyDown={(e) => e.key === 'Enter' && openArtistDetail(artist.id)}
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
                  onClick={() => openSpaceDetail(space.id)}
                  onKeyDown={(e) => e.key === 'Enter' && openSpaceDetail(space.id)}
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

      <Dialog
        open={artistDetailOpen}
        onOpenChange={(open) => {
          setArtistDetailOpen(open);
          if (!open) {
            setArtistDetail(null);
          }
        }}
      >
        <DialogContent className="border border-[#333] bg-[#111]">
          <DialogHeader>
            <DialogTitle className="text-white">아티스트 상세</DialogTitle>
          </DialogHeader>
          {artistDetailLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-40 w-full rounded-2xl bg-white/10" />
              <Skeleton className="h-4 w-1/2 rounded-full bg-white/10" />
            </div>
          ) : artistDetail ? (
            <div className="space-y-4 text-sm text-gray-300">
              <div className="space-y-2">
                <p className="text-lg font-bold text-white">{artistDetail.name}</p>
                <p>장르: {artistDetail.genre || '-'}</p>
                <p>지역: {artistDetail.region || '-'}</p>
                <p>{artistDetail.bio || '소개가 없습니다.'}</p>
              </div>
              <Button type="button" className="w-full rounded-xl bg-white text-black" onClick={openArtistProposalFromDetail}>
                제안하기
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-400">아티스트 정보를 찾을 수 없습니다.</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={spaceDetailOpen}
        onOpenChange={(open) => {
          setSpaceDetailOpen(open);
          if (!open) {
            setSpaceDetail(null);
          }
        }}
      >
        <DialogContent className="border border-[#333] bg-[#111]">
          <DialogHeader>
            <DialogTitle className="text-white">공간 상세</DialogTitle>
          </DialogHeader>
          {spaceDetailLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-40 w-full rounded-2xl bg-white/10" />
              <Skeleton className="h-4 w-1/2 rounded-full bg-white/10" />
            </div>
          ) : spaceDetail ? (
            <div className="space-y-4 text-sm text-gray-300">
              <div className="space-y-2">
                <p className="text-lg font-bold text-white">{spaceDetail.name}</p>
                <p>유형: {spaceDetail.category || spaceDetail.type || '-'}</p>
                <p>위치: {spaceDetail.region || spaceDetail.address || spaceDetail.location || '-'}</p>
                <p>{spaceDetail.description || '공간 설명이 없습니다.'}</p>
              </div>
              <Button type="button" className="w-full rounded-xl bg-white text-black" onClick={openSpaceProposalFromDetail}>
                제안하기
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-400">공간 정보를 찾을 수 없습니다.</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(proposalTarget)}
        onOpenChange={(open) => {
          if (!open) {
            closeProposalDialog();
          }
        }}
      >
        <DialogContent className="border border-[#333] bg-[#111]">
          <DialogHeader>
            <DialogTitle className="text-white">{proposalTarget ? `${proposalTarget.name}에게 제안 보내기` : '제안'}</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="제안 내용을 입력하세요"
            value={proposalContent}
            onChange={(e) => setProposalContent(e.target.value)}
            className="rounded-2xl border border-[#333] bg-black text-white placeholder:text-gray-600"
            rows={5}
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" className="flex-1" onClick={handleSendProposal} disabled={sendingProposal}>
              {sendingProposal ? '전송 중...' : '제안 보내기'}
            </Button>
            <Button type="button" variant="secondary" className="flex-1 border border-[#444] bg-transparent text-white hover:bg-white/10" onClick={closeProposalDialog}>
              취소
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
