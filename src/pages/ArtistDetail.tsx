import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageWithFallback } from '../dyve-figma/components/figma/ImageWithFallback';
import { DEFAULT_CARD_PLACEHOLDER } from '../constants/media';
import { BottomNav } from '../components/navigation/BottomNav';
import { ProposalInboxButton } from '../components/navigation/ProposalInboxButton';
import { getArtistDetail } from '../api/artists';
import type { Artist } from '../types/Artist';

const parseEquipment = (equipments?: string | string[] | null) => {
  if (!equipments) return [];
  const content = Array.isArray(equipments) ? equipments.join('\n') : equipments;
  return content
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

export default function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'idle'>('loading');

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) {
        setStatus('error');
        return;
      }
      setStatus('loading');
      try {
        const data = await getArtistDetail(Number(id));
        setArtist(data);
        setStatus('idle');
      } catch (error) {
        console.error('아티스트 상세 조회 실패', error);
        setStatus('error');
      }
    };

    fetchDetail();
  }, [id]);

  const equipmentList = useMemo(() => parseEquipment(artist?.equipments), [artist]);

  const handleProposal = () => {
    if (!artist) return;
    navigate(`/proposals/send?artistId=${artist.id}`);
  };

  const description = artist?.history || artist?.bio;

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-4">
          <button type="button" className="text-sm text-gray-300 hover:text-white" onClick={() => navigate(-1)}>
            ← 뒤로
          </button>
          <h1 className="text-lg font-semibold">아티스트 상세</h1>
          <ProposalInboxButton />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 pb-5 pt-5">
          <div className="mx-auto flex max-w-md flex-col gap-4">
            {status === 'loading' && <p className="text-sm text-gray-400">불러오는 중...</p>}
            {status === 'error' && <p className="text-sm text-red-400">아티스트 정보를 불러오지 못했습니다.</p>}
            {status === 'idle' && artist && (
              <div className="space-y-5 rounded-2xl border border-white/10 bg-[#111] p-5">
                <div className="h-48 w-full overflow-hidden rounded-xl border border-white/10 bg-black">
                  <ImageWithFallback
                    src={artist.image_url || DEFAULT_CARD_PLACEHOLDER}
                    alt={artist.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold">{artist.name}</p>
                  <p className="text-sm text-[#FF3B5C]">{artist.genre || '장르 미정'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">소개</p>
                  <p className="text-base text-gray-200 leading-relaxed">{description || '소개가 준비 중입니다.'}</p>
                </div>
                {artist.portfolio_url && (
                  <div>
                    <p className="text-sm text-gray-400">포트폴리오</p>
                    <a
                      href={artist.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[#FF3B5C] hover:underline"
                    >
                      {artist.portfolio_url.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-400">보유 장비</p>
                  <ul className="mt-1 space-y-1 text-sm text-gray-300">
                    {equipmentList.length
                      ? equipmentList.map((equipment) => <li key={equipment}>• {equipment}</li>)
                      : <li>자료 없음</li>}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-white/5 bg-black/80 px-4 py-4">
          <button
            type="button"
            onClick={handleProposal}
            className="w-full rounded-2xl bg-[#FF2E2E] py-4 text-lg font-bold text-white transition hover:bg-[#d43550]"
          >
            제안서 보내기
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
