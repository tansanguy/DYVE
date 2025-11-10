import { Calendar, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PerformanceCardProps {
  performance: any;
  onClick: () => void;
}

export default function PerformanceCard({ performance, onClick }: PerformanceCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-[#0F0F0F] rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-[#FF3B5C] hover:shadow-lg hover:shadow-[#FF3B5C]/10 transition-all duration-300"
    >
      <div className="flex gap-4 p-4">
        <div className="relative w-20 h-20 flex-shrink-0 bg-black rounded-xl overflow-hidden">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200"
            alt={performance.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {performance.dDay && (
            <div className="absolute top-1.5 right-1.5 bg-[#FF3B5C] text-white text-xs font-extrabold px-2 py-0.5 rounded-md">
              D-{performance.dDay}
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h4 className="text-white mb-0.5 font-semibold truncate">{performance.title}</h4>
            <p className="text-gray-400 text-sm">{performance.artist}</p>
          </div>
          
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-gray-600 text-xs">
              <MapPin size={11} className="flex-shrink-0" />
              <span className="truncate">{performance.venue}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 text-xs">
              <Calendar size={11} className="flex-shrink-0" />
              <span>{performance.date} {performance.time}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-between items-end">
          <span className="text-[#FF3B5C] text-xs font-bold">{performance.genre}</span>
          <span className="text-white font-bold">{performance.price.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
}
