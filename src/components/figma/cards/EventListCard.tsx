import { ImageWithFallback } from '../../../dyve-figma/components/figma/ImageWithFallback';
import { EventCardData } from './EventPosterCard';
import { formatEventPrice, getDDayLabel } from '../../../utils/event';

interface EventListCardProps {
  event?: EventCardData;
  onClick?: () => void;
}

const fallbackEvent: EventCardData = {
  title: 'Upcoming Spotlight',
  artist: 'DYVE Curated',
  venue: '홍대 공연장',
  region: '서울',
  date: '2025-11-08',
  time: '19:30',
  genre: 'Indie',
  imageUrl: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=800&auto=format&fit=crop&q=80',
};

export function EventListCard({ event, onClick }: EventListCardProps) {
  const data = { ...fallbackEvent, ...event };
  const priceLabel = formatEventPrice(data.price, data.isFree);
  const dDayLabel = getDDayLabel(data.date);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[220px] w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-black/10 p-4 text-left transition duration-300 hover:border-white/40 hover:bg-white/5 sm:flex-row"
    >
      <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-white/10 sm:h-auto sm:w-32">
        <ImageWithFallback src={data.imageUrl} alt={data.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white">
          {dDayLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-2 sm:p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/50">{data.region}</p>
          <h3 className="mt-1 text-lg font-semibold leading-tight text-white line-clamp-2">{data.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-white/70 line-clamp-2">{data.artist}</p>
        </div>

        <div className="mt-auto space-y-1 text-sm text-white/70">
          <p>
            {data.date} · {data.time}
          </p>
          <p className="text-white/60">{data.venue}</p>
          <p className="text-base font-semibold text-white">{priceLabel}</p>
        </div>
      </div>
    </button>
  );
}
