import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getArtistDetail } from '../api/artists';
import type { Artist } from '../types/Artist';
import { ImageWithFallback } from '../dyve-figma/components/figma/ImageWithFallback';
import { DEFAULT_CARD_PLACEHOLDER } from '../constants/media';
import { BottomNav } from '../components/navigation/BottomNav';
import { ProposalInboxButton } from '../components/navigation/ProposalInboxButton';

export default function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'idle'>('loading');

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
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

  const goBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-4">
          <button type="button" className="text-sm text-gray-300 hover:text-white" onClick={goBack}>
            ← 뒤로
          </button>
          <h1 className="text-lg font-semibold">아티스트 상세</h1>
          <ProposalInboxButton />
        </div>
      </div>

      <div className="mx-auto w-full max-w-md px-4 py-6 space-y-5">
        {status === 'loading' && <p className="text-sm text-gray-400">불러오는 중...</p>}
        {status === 'error' && <p className="text-sm text-red-400">아티스트 정보를 불러오지 못했습니다.</p>}
        {status === 'idle' && artist && (
          <div className="space-y-4 rounded-2xl border border-white/10 bg-[#111] p-5">
            <div className="h-40 w-full overflow-hidden rounded-xl border border-white/10 bg-black">
              <ImageWithFallback
                src={artist.image_url || DEFAULT_CARD_PLACEHOLDER}
                alt={artist.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-white">{artist.name}</p>
              <p className="text-sm text-[#FF3B5C]">{artist.genre || '장르 미정'}</p>
              <p className="text-xs text-gray-500">{artist.region || '활동 지역 미정'}</p>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{artist.bio || '소개가 없습니다.'}</p>
            {artist.instagram && (
              <p className="text-sm text-gray-400">
                Instagram: <span className="text-white">{artist.instagram}</span>
              </p>
            )}
            {artist.portfolio_url && (
              <p className="text-sm text-gray-400">
                Portfolio: <span className="text-white">{artist.portfolio_url}</span>
              </p>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
