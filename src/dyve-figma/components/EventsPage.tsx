import { Screen } from '../App';
import { ArrowLeft, Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EventsPageProps {
  navigate: (screen: Screen) => void;
}

const mockEvents = [
  {
    id: 1,
    title: 'DYVE 런칭 기념 이벤트',
    date: '2025-11-10',
    description: '첫 예매 시 20% 할인',
  },
  {
    id: 2,
    title: '인디 음악 페스티벌 2025',
    date: '2025-12-01',
    description: 'DYVE 파트너 아티스트 총출동',
  },
  {
    id: 3,
    title: '신규 아티스트 모집 공고',
    date: '2025-11-15',
    description: '지원 기간: 11/15 - 11/30',
  },
];

export default function EventsPage({ navigate }: EventsPageProps) {
  return (
    <div className="min-h-screen bg-black">
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('home')} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-extrabold">이벤트 & 공지</h1>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="space-y-6">
          {mockEvents.map((event) => (
            <div 
              key={event.id}
              className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-[#FF2E2E] transition"
            >
              <div className="relative h-48 bg-black">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"
                  alt={event.title}
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>
              
              <div className="p-6">
                <h3 className="text-white text-xl mb-2 font-bold">{event.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <Calendar size={16} className="text-[#FF2E2E]" />
                  <span>{event.date}</span>
                </div>
                <p className="text-gray-500">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
