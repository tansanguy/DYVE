import { Screen } from '../App';
import { ArrowLeft, MapPin, Users, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { SpaceProfile } from '../../api/spaces';
import { getSpaceDetail } from '../../api/spaces';

interface SpaceDetailPageProps {
  navigate: (screen: Screen, data?: any) => void;
  space: SpaceProfile | null;
}

export default function SpaceDetailPage({ navigate, space }: SpaceDetailPageProps) {
  const [spaceDetail, setSpaceDetail] = useState<SpaceProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const spaceId = space?.id;

  useEffect(() => {
    if (!spaceId) {
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setHasError(false);
    setSpaceDetail(null);

    getSpaceDetail(spaceId)
      .then((data) => {
        if (isMounted) {
          setSpaceDetail(data);
        }
      })
      .catch((error) => {
        console.error('[SpaceDetailPage] failed to load', error);
        if (isMounted) {
          setHasError(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [spaceId]);

  if (!spaceId && !spaceDetail) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">공간 정보를 찾을 수 없습니다</p>
      </div>
    );
  }

  if (isLoading && !spaceDetail) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">공간 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!spaceDetail && hasError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">공간 정보를 불러오는 데 실패했습니다.</p>
      </div>
    );
  }

  const detail = spaceDetail!;
  const equipmentSource =
    Array.isArray(detail.equipments) ? detail.equipments.join('\n') : detail.equipments ?? '';
  const equipmentItems = equipmentSource
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
  const locationLines = [detail.region, detail.address].filter(Boolean);

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('suggest')} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-extrabold">공간 상세</h1>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Space Image */}
        <div className="relative h-64 bg-black rounded-2xl overflow-hidden mb-6">
          <ImageWithFallback
            src={detail.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'}
            alt={detail.name || '공간'}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-white text-3xl mb-2 font-extrabold">{detail.name}</h2>
            <p className="text-[#FF2E2E] mb-3 font-semibold text-lg">{detail.category || '카테고리 정보 없음'}</p>
          </div>

          {/* Capacity */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Users size={20} className="text-[#FF2E2E]" />
              <h3 className="text-white font-bold">수용 인원</h3>
            </div>
            <p className="text-gray-500">최대 {detail.capacity ?? '정보 없음'}명</p>
          </div>

          {/* Description */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Info size={20} className="text-[#FF2E2E]" />
              <h3 className="text-white font-bold">공간 소개</h3>
            </div>
            <p className="text-gray-500 leading-relaxed">
              {detail.description || '공간 소개 정보를 준비 중입니다.'}
            </p>
          </div>

          {/* Location */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={20} className="text-[#FF2E2E]" />
              <h3 className="text-white font-bold">위치</h3>
            </div>
            <p className="text-gray-500 mb-4">
              {locationLines.length
                ? locationLines.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))
                : '위치 정보가 없습니다.'}
            </p>
            <button className="text-[#FF2E2E] text-sm font-semibold underline text-left">
              지도에서 보기
            </button>
          </div>

          {/* Equipment */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <h3 className="text-white mb-3 font-bold">보유 장비</h3>
            <ul className="text-gray-500 text-sm space-y-2">
              {equipmentItems.length
                ? equipmentItems.map((equipment) => <li key={equipment}>• {equipment}</li>)
                : <li>• 장비 정보가 없습니다.</li>}
            </ul>
          </div>

          {/* Proposal Button */}
          <button
            onClick={() => navigate('proposal', { spaceId: detail.id, name: detail.name })}
            className="w-full bg-[#FF2E2E] text-white py-4 rounded-2xl hover:bg-[#cc2525] transition font-bold text-lg flex items-center justify-center"
          >
            제안서 보내기
          </button>
        </div>
      </div>
    </div>
  );
}
