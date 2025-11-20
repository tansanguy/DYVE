import { ImageWithFallback } from '../../../dyve-figma/components/figma/ImageWithFallback';
import { DEFAULT_CARD_PLACEHOLDER } from '../../../constants/media';
import { formatEventDateTime, formatEventPrice, getDDayLabel } from '../../../utils/event';
import { EventCardData } from './EventPosterCard';

interface UpcomingEventCardProps {
  event?: EventCardData;
  onClick?: () => void;
}

const fallbackEvent: EventCardData = {
  title: 'Upcoming Highlight',
  artist: 'DYVE Curated',
  venue: '홍대 라이브홀',
  region: '서울',
  date: '2025-11-12',
  time: '20:00',
  genre: 'Indie',
  imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&auto=format&fit=crop&q=80',
  price: 30000,
};

export function UpcomingEventCard({ event, onClick }: UpcomingEventCardProps) {
  const data = { ...fallbackEvent, ...event };
  // 한국어 주석: 홈-다가오는 공연 영역도 동일한 가격 포맷을 따라야 전체 UI가 일관된다.
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
      className="group flex min-h-[220px] w-[280px] flex-shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-black/10 p-4 text-left transition duration-300 hover:border-white/40 hover:bg-white/5 sm:w-[320px]"
    >
      <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-white/10">
        <ImageWithFallback src={coverImage} alt={data.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white">
          {dDayLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-1">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/50">{data.region}</p>
          <h3 className="mt-1 text-lg font-semibold leading-tight text-white line-clamp-2">{data.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-white/70 line-clamp-2">{data.artist}</p>
        </div>

        <div className="mt-auto space-y-1 text-sm text-white/70">
          <p>{scheduleLabel}</p>
          <p className="text-white/60">{data.venue}</p>
          <p className="text-base font-semibold text-white whitespace-nowrap tabular-nums leading-none">{priceLabel}</p>
        </div>
      </div>
    </button>
  );
}
