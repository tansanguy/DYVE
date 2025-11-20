import { ImageWithFallback } from '../../../dyve-figma/components/figma/ImageWithFallback';
import { DEFAULT_CARD_PLACEHOLDER } from '../../../constants/media';
import { formatEventDateTime, formatEventPrice, getDDayLabel } from '../../../utils/event';

export interface EventCardData {
  id?: number | string;
  title?: string;
  artist?: string;
  venue?: string;
  region?: string;
  date?: string;
  time?: string;
  genre?: string;
  price?: number;
  priceMin?: number | null;
  priceMax?: number | null;
  isFree?: boolean;
  imageUrl?: string;
  description?: string;
  allowDyveReservation?: boolean;
}

interface EventPosterCardProps {
  event?: EventCardData;
  onClick?: () => void;
}

const fallbackEvent: EventCardData = {
  title: 'Midnight Jazz Session',
  artist: 'Luna Quartet',
  venue: 'Blue Note Seoul',
  region: '서울',
  date: '2025-11-05',
  time: '20:00',
  genre: 'Jazz',
  price: 25000,
  imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=80',
};

export function EventPosterCard({ event, onClick }: EventPosterCardProps) {
  const data = { ...fallbackEvent, ...event };
  // 한국어 주석: 가격 범위와 placeholder 이미지를 하나의 포맷으로 맞춰 카드들 사이 레이아웃이 흔들리지 않도록 한다.
  const priceLabel = formatEventPrice(
    data.priceMin ?? data.price,
    data.isFree,
    data.priceMax ?? data.price,
  );
  const dDayLabel = getDDayLabel(data.date);
  const scheduleLabel = formatEventDateTime(data.date, data.time);
  const coverImage = data.imageUrl || DEFAULT_CARD_PLACEHOLDER;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex min-h-[320px] w-[250px] flex-shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/0 to-black/30 text-left transition duration-300 hover:border-white/40 hover:shadow-[0_15px_45px_rgba(0,0,0,0.45)] sm:w-[280px]"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <ImageWithFallback
          src={coverImage}
          alt={data.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <span className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/60 px-3 py-1 text-xs font-semibold tracking-tight text-white">
          {dDayLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-[11px] uppercase tracking-[0.32em] text-white/50">{data.genre}</p>
        <h3 className="text-lg font-semibold leading-snug text-white line-clamp-2">{data.title}</h3>
        <p className="text-sm text-white/70 line-clamp-1">{data.artist}</p>
        <p className="text-sm text-white/60">{data.venue}</p>
        <div className="mt-auto space-y-1 text-sm text-white/70">
          <p className="font-medium text-white/90">{scheduleLabel}</p>
          <p className="text-white/60">{data.region}</p>
          <p className="text-base font-semibold text-white whitespace-nowrap tabular-nums leading-none">{priceLabel}</p>
        </div>
      </div>
    </button>
  );
}
