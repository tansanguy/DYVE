import { Calendar, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../../../dyve-figma/components/figma/ImageWithFallback';
import { EventCardData } from './EventPosterCard';
import { formatEventPrice, getDDayLabel } from '../../../utils/event';

interface EventPerformanceCardProps {
  event?: EventCardData;
  onClick?: () => void;
}

const fallbackEvent: EventCardData = {
  title: 'Indie Rock Night',
  artist: 'The Wanderers',
  venue: 'Club FF 홍대',
  date: '2025-11-04',
  time: '19:00',
  genre: 'Rock',
  price: 20000,
  imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80',
};

export function EventPerformanceCard({ event, onClick }: EventPerformanceCardProps) {
  const data = { ...fallbackEvent, ...event };
  const priceLabel = formatEventPrice(data.price, data.isFree);
  const dDayLabel = getDDayLabel(data.date);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-white/5 bg-[#0F0F0F] p-4 text-left transition hover:border-[#FF3B5C] hover:shadow-lg hover:shadow-[#FF3B5C]/10"
    >
      <div className="flex gap-4">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-black">
          <ImageWithFallback src={data.imageUrl} alt={data.title} className="h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute right-1.5 top-1.5 rounded-md bg-[#FF3B5C] px-2 py-0.5 text-xs font-bold text-white">
            {dDayLabel}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-1">
          <div>
            <h4 className="truncate text-white font-semibold">{data.title}</h4>
            <p className="text-sm text-gray-400">{data.artist}</p>
          </div>
          <div className="space-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <MapPin size={12} />
              <span className="truncate">{data.venue}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={12} />
              <span>
                {data.date} {data.time}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between text-right">
          <span className="text-xs font-bold text-[#FF3B5C]">{data.genre}</span>
          <span className="text-sm font-bold text-white">{priceLabel}</span>
        </div>
      </div>
    </button>
  );
}
