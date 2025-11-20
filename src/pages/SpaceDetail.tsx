import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSpaceDetail, SpaceProfile } from '../api/spaces';
import { ImageWithFallback } from '../dyve-figma/components/figma/ImageWithFallback';
import { DEFAULT_CARD_PLACEHOLDER } from '../constants/media';
import { BottomNav } from '../components/navigation/BottomNav';
import { ProposalInboxButton } from '../components/navigation/ProposalInboxButton';

export default function SpaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [space, setSpace] = useState<SpaceProfile | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'idle'>('loading');

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setStatus('loading');
      try {
        const data = await getSpaceDetail(Number(id));
        setSpace(data);
        setStatus('idle');
      } catch (error) {
        console.error('공간 상세 조회 실패', error);
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
          <h1 className="text-lg font-semibold">공간 상세</h1>
          <ProposalInboxButton />
        </div>
      </div>

      <div className="mx-auto w-full max-w-md px-4 py-6 space-y-5">
        {status === 'loading' && <p className="text-sm text-gray-400">불러오는 중...</p>}
        {status === 'error' && <p className="text-sm text-red-400">공간 정보를 불러오지 못했습니다.</p>}
        {status === 'idle' && space && (
          <div className="space-y-4 rounded-2xl border border-white/10 bg-[#111] p-5">
            <div className="h-40 w-full overflow-hidden rounded-xl border border-white/10 bg-black">
              <ImageWithFallback
                src={space.image_url || DEFAULT_CARD_PLACEHOLDER}
                alt={space.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-white">{space.name}</p>
              <p className="text-sm text-[#FF3B5C]">{space.category || space.type || '공간'}</p>
              <p className="text-xs text-gray-500">{space.region || space.address || space.location || '위치 미정'}</p>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{space.description || '공간 설명이 없습니다.'}</p>
            {space.capacity && <p className="text-sm text-gray-400">수용 인원: {space.capacity}명</p>}
            {space.phone && <p className="text-sm text-gray-400">연락처: {space.phone}</p>}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
