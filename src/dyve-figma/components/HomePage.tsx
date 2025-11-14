import { Screen } from '../App';
import BottomNav from './BottomNav';
import dyveLogo from '../../assets/images/dyve-logo.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  navigate: (screen: Screen, data?: any) => void;
}

export const mockPerformances = [
  {
    id: 1,
    title: 'Midnight Jazz Session',
    artist: 'Luna Quartet',
    venue: 'Blue Note Seoul',
    date: '2025-11-05',
    time: '20:00',
    price: 25000,
    genre: 'Jazz',
    dDay: 2,
    dyveBookable: true,
    entryType: 'seat', // seat, number, entry
    seatingInfo: { rows: 5, cols: 6 },
  },
  {
    id: 2,
    title: 'Indie Rock Night',
    artist: 'The Wanderers',
    venue: 'Club FF 홍대',
    date: '2025-11-04',
    time: '19:00',
    price: 20000,
    genre: 'Rock',
    dDay: 1,
    dyveBookable: true,
    entryType: 'number',
    seatingInfo: { rows: 3, cols: 10 },
  },
  {
    id: 3,
    title: 'Electronic Dreams',
    artist: 'NEON',
    venue: 'Vault 강남',
    date: '2025-11-06',
    time: '21:00',
    price: 30000,
    genre: 'Electronic',
    dDay: 3,
    dyveBookable: false,
    entryType: 'entry',
  },
  {
    id: 4,
    title: 'Hip-Hop Cypher',
    artist: 'Seoul Rappers',
    venue: 'Underground 이태원',
    date: '2025-11-08',
    time: '22:00',
    price: 15000,
    genre: 'Hip-Hop',
    dDay: 5,
    dyveBookable: true,
    entryType: 'entry',
  },
  {
    id: 5,
    title: 'Indie Acoustic Night',
    artist: 'Moonlight Band',
    venue: 'Cafe Live 신촌',
    date: '2025-11-10',
    time: '19:30',
    price: 0,
    genre: 'Indie',
    dDay: 7,
    dyveBookable: true,
    entryType: 'number',
    seatingInfo: { rows: 4, cols: 8 },
  },
  {
    id: 6,
    title: 'Jazz & Wine',
    artist: 'Seoul Jazz Collective',
    venue: 'Blue Moon 대학로',
    date: '2025-11-12',
    time: '20:30',
    price: 35000,
    genre: 'Jazz',
    dDay: 9,
    dyveBookable: false,
    entryType: 'seat',
    seatingInfo: { rows: 6, cols: 8 },
  },
];

export default function HomePage({ navigate }: HomePageProps) {
  return (
    <div className="min-h-screen pb-20 bg-black">
      {/* Header */}
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <img src={dyveLogo} alt="DYVE" className="h-7" />
          <button 
            onClick={() => navigate('receivedProposals')}
            className="relative text-white hover:text-[#FF3B5C] transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF3B5C] text-white text-xs rounded-full flex items-center justify-center font-bold">
              2
            </span>
          </button>
        </div>
      </div>

      <div className="px-6">
        {/* Banner */}
        <div className="mb-8">
          <div className="relative h-44 bg-[#1A1A1A] rounded-2xl overflow-hidden">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800"
              alt="Live performance"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-white text-2xl mb-2 font-extrabold tracking-tight">Live Music Tonight</h2>
                <p className="text-gray-400">지금 당신 주변의 공연</p>
              </div>
            </div>
          </div>
        </div>

        {/* Around You */}
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="text-white text-xl font-extrabold">Around You</h3>
            <p className="text-gray-500 text-sm mt-1">당신 주변에서 열리는 공연을 확인하세요</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {mockPerformances.slice(0, 3).map((perf) => (
              <div 
                key={perf.id}
                onClick={() => navigate('detail', { performance: perf })}
                className="flex-shrink-0 w-64 bg-[#0F0F0F] rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-[#FF3B5C] hover:shadow-lg hover:shadow-[#FF3B5C]/10 transition-all duration-300"
              >
                <div className="relative h-36 bg-black">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400"
                    alt={perf.title}
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-3 right-3 bg-[#FF3B5C] text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-lg">
                    D-{perf.dDay}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-white mb-1 font-semibold">{perf.title}</h4>
                  <p className="text-gray-400 text-sm">{perf.artist}</p>
                  <p className="text-gray-600 text-sm">{perf.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="text-white text-xl font-extrabold">Upcoming</h3>
            <p className="text-gray-500 text-sm mt-1">다가오는 공연 일정을 미리 확인하세요</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {mockPerformances.map((perf) => (
              <div 
                key={perf.id}
                onClick={() => navigate('detail', { performance: perf })}
                className="flex-shrink-0 w-64 bg-[#0F0F0F] rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-[#FF3B5C] hover:shadow-lg hover:shadow-[#FF3B5C]/10 transition-all duration-300"
              >
                <div className="relative h-36 bg-black">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400"
                    alt={perf.title}
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-3 right-3 bg-[#FF3B5C] text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-lg">
                    D-{perf.dDay}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-white mb-1 font-semibold">{perf.title}</h4>
                  <p className="text-gray-400 text-sm">{perf.artist}</p>
                  <p className="text-gray-600 text-sm">{perf.venue}</p>
                  <div className="mt-2 pt-2 border-t border-white/5">
                    <p className="text-gray-500 text-xs">{perf.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav navigate={navigate} currentScreen="home" />
    </div>
  );
}
