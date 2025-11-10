import { Screen } from '../App';
import { ArrowLeft, Calendar, MapPin, Clock, Tag, DollarSign } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PerformanceDetailPageProps {
  navigate: (screen: Screen, data?: any) => void;
  performance: any;
}

export default function PerformanceDetailPage({ navigate, performance }: PerformanceDetailPageProps) {
  if (!performance) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">공연을 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('explore')} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-extrabold">공연 상세</h1>
        </div>
      </div>

      <div>
        {/* Poster */}
        <div className="relative h-80 bg-black">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800"
            alt={performance.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* DYVE Bookable Badge & D-Day */}
          <div className="absolute top-6 left-6 flex gap-2">
            {performance.dyveBookable && (
              <div className="bg-[#FF3B5C] text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-lg">
                DYVE 예약 가능
              </div>
            )}
            <div className="bg-white/10 backdrop-blur-sm text-white text-xs font-extrabold px-3 py-1.5 rounded-lg">
              D-{performance.dDay}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-8 space-y-6">
          <div>
            <h2 className="text-white text-3xl mb-2 font-extrabold tracking-tight">{performance.title}</h2>
            <p className="text-gray-400 text-lg font-medium">{performance.artist}</p>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-gray-300">
              <MapPin size={18} className="text-[#FF3B5C]" />
              <span className="font-medium">{performance.venue}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <Calendar size={18} className="text-[#FF3B5C]" />
              <span className="font-medium">{performance.date}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <Clock size={18} className="text-[#FF3B5C]" />
              <span className="font-medium">{performance.time}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <Tag size={18} className="text-[#FF3B5C]" />
              <span className="font-medium">{performance.genre}</span>
            </div>

            <div className="flex items-center gap-3 text-white text-lg">
              <DollarSign size={18} className="text-[#FF3B5C]" />
              <span className="font-extrabold">{performance.price.toLocaleString()}원</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#0F0F0F] rounded-2xl p-6 border border-white/5">
            <h3 className="text-white mb-3 font-extrabold">공연 정보</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {performance.artist}의 특별한 라이브 공연이 {performance.venue}에서 펼쳐집니다. 
              인디 음악의 진수를 느낄 수 있는 특별한 밤을 경험하세요.
            </p>
          </div>

          {/* Book Button */}
          <button 
            onClick={() => performance.dyveBookable && navigate('booking', { performance })}
            disabled={!performance.dyveBookable}
            className={`w-full py-4 rounded-2xl transition-all font-extrabold text-lg flex items-center justify-center ${
              performance.dyveBookable
                ? 'bg-[#FF3B5C] text-white hover:bg-[#d43550] shadow-lg shadow-[#FF3B5C]/30 hover:shadow-[#FF3B5C]/50'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {performance.dyveBookable ? 'DYVE로 예매하기' : '예매 불가 (외부 예매만 가능)'}
          </button>
        </div>
      </div>
    </div>
  );
}
