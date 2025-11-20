import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getArtistDetail } from '../api/artists';
import type { Artist } from '../types/Artist';
import { ImageWithFallback } from '../dyve-figma/components/figma/ImageWithFallback';
import { BottomNav } from '../components/navigation/BottomNav';
import { DEFAULT_CARD_PLACEHOLDER } from '../constants/media';

export default function NetworkingDetail() {
  const navigate = useNavigate();
  const { artistId } = useParams<{ artistId: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');

  useEffect(() => {
    const loadArtist = async () => {
      if (!artistId) return;
      setStatus('loading');
      try {
        const data = await getArtistDetail(Number(artistId));
        setArtist(data);
        setStatus('idle');
      } catch (error) {
        console.error('아티스트 상세를 불러오지 못했습니다.', error);
        setStatus('error');
      }
    };

    loadArtist();
  }, [artistId]);

  const handleProposal = () => {
    if (!artist) return;
    navigate(`/proposals/send?artistId=${artist.id}`);
  };

  const fallbackGenre = artist?.genre || '장르 미정';
  const fallbackRegion = artist?.region || '활동 지역 미정';
  const fallbackBio = artist?.bio || '이 아티스트는 아직 소개글을 등록하지 않았습니다.';

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <button type="button" onClick={() => navigate(-1)} className="text-white hover:text-[#FF3B5C]">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-extrabold">Networking</h1>
          <span className="w-6" />
        </div>
      </div>

      <div className="mx-auto max-w-screen-sm px-6 py-8">
        {status === 'loading' && <p className="text-sm text-gray-400">로딩 중...</p>}
        {status === 'error' && <p className="text-sm text-red-400">아티스트 정보를 불러오지 못했습니다.</p>}
        {status === 'idle' && artist && (
          <div className="space-y-5 rounded-3xl border border-white/10 bg-[#111] p-5">
            <div className="relative h-64 overflow-hidden rounded-2xl border border-white/10">
              <ImageWithFallback
                src={artist.image_url || DEFAULT_CARD_PLACEHOLDER}
                alt={artist.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/90" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-3xl font-bold text-white">{artist.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#FF3B5C]">
                  <span>{fallbackGenre}</span>
                  <span className="text-white/70">·</span>
                  <span className="text-white/70">{fallbackRegion}</span>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{fallbackBio}</p>
              {artist.instagram && (
                <a
                  href={artist.instagram.startsWith('http') ? artist.instagram : `https://${artist.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#FF3B5C] underline"
                >
                  Instagram: {artist.instagram.replace(/^https?:\/\//, '')}
                </a>
              )}
              <button
                type="button"
                onClick={handleProposal}
                className="w-full rounded-2xl bg-[#FF3B5C] py-3 text-center font-bold transition hover:bg-[#cc2525]"
              >
                제안 보내기
              </button>
            </div>
          </div>
        )}
        {status === 'idle' && !artist && (
          <p className="text-sm text-gray-400">해당 아티스트를 찾을 수 없습니다.</p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
