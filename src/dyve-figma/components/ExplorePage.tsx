import { Screen } from '../App';
import BottomNav from './BottomNav';
import PerformanceCard from './PerformanceCard';
import { mockPerformances } from './HomePage';
import { Checkbox } from './ui/checkbox';
import { useState } from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExplorePageProps {
  navigate: (screen: Screen, data?: any) => void;
}

const regions = ['전체', '서울', '경기', '인천', '강원', '충청', '전라', '경상', '제주'];
const genres = ['전체', 'Jazz', 'Rock', 'Electronic', 'Hip-Hop', 'Indie', '디제잉', '북토크', '스탠드업 코미디', '클래식', 'R&B'];

export default function ExplorePage({ navigate }: ExplorePageProps) {
  const [showDyveOnly, setShowDyveOnly] = useState(false);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedGenre, setSelectedGenre] = useState('전체');

  const filteredPerformances = mockPerformances.filter((p) => {
    if (showDyveOnly && !p.dyveBookable) return false;
    if (showFreeOnly && p.price !== 0) return false;
    if (selectedRegion !== '전체' && !p.venue.includes(selectedRegion)) return false;
    if (selectedGenre !== '전체' && p.genre !== selectedGenre) return false;
    return true;
  });

  const hasActiveFilters = selectedRegion !== '전체' || selectedGenre !== '전체' || showDyveOnly || showFreeOnly;

  const clearAllFilters = () => {
    setSelectedRegion('전체');
    setSelectedGenre('전체');
    setShowDyveOnly(false);
    setShowFreeOnly(false);
  };

  return (
    <div className="min-h-screen pb-20 bg-black">
      <div className="bg-black/95 backdrop-blur-xl sticky top-0 z-40 border-b border-white/5">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-white text-2xl font-black tracking-tight">Explore</h1>
            <div className="flex items-center gap-3">
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
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  showFilters || hasActiveFilters
                    ? 'bg-[#FF3B5C] text-white'
                    : 'bg-[#0F0F0F] text-gray-400 border border-white/5'
                }`}
              >
                <SlidersHorizontal size={18} />
                <span className="text-sm font-semibold">필터</span>
                {hasActiveFilters && !showFilters && (
                  <span className="w-2 h-2 bg-white rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Checkbox
                id="dyve-only"
                checked={showDyveOnly}
                onCheckedChange={(checked) => setShowDyveOnly(!!checked)}
                className="border-gray-600 data-[state=checked]:bg-[#FF3B5C] data-[state=checked]:border-[#FF3B5C]"
              />
              <label
                htmlFor="dyve-only"
                className="text-gray-400 text-sm cursor-pointer font-medium"
              >
                DYVE 예약 가능만 보기
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="free-only"
                checked={showFreeOnly}
                onCheckedChange={(checked) => setShowFreeOnly(!!checked)}
                className="border-gray-600 data-[state=checked]:bg-[#FF3B5C] data-[state=checked]:border-[#FF3B5C]"
              />
              <label
                htmlFor="free-only"
                className="text-gray-400 text-sm cursor-pointer font-medium"
              >
                무료공연만 보기
              </label>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-white/5"
            >
              <div className="px-6 py-6 space-y-5 bg-[#0A0A0A]">
                {/* Region Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white text-sm font-bold">지역</label>
                    {selectedRegion !== '전체' && (
                      <button
                        onClick={() => setSelectedRegion('전체')}
                        className="text-[#FF3B5C] text-xs font-semibold"
                      >
                        초기화
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {regions.map((region) => (
                      <button
                        key={region}
                        onClick={() => setSelectedRegion(region)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                          selectedRegion === region
                            ? 'bg-[#FF3B5C] text-white'
                            : 'bg-[#0F0F0F] text-gray-400 border border-white/5 hover:border-[#FF3B5C]/30'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genre Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white text-sm font-bold">장르</label>
                    {selectedGenre !== '전체' && (
                      <button
                        onClick={() => setSelectedGenre('전체')}
                        className="text-[#FF3B5C] text-xs font-semibold"
                      >
                        초기화
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                          selectedGenre === genre
                            ? 'bg-[#FF3B5C] text-white'
                            : 'bg-[#0F0F0F] text-gray-400 border border-white/5 hover:border-[#FF3B5C]/30'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear All Button */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full bg-[#0F0F0F] text-gray-400 py-3 rounded-xl border border-white/5 hover:border-[#FF3B5C]/30 transition flex items-center justify-center gap-2 font-semibold"
                  >
                    <X size={18} />
                    <span>모든 필터 초기화</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-6">
        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="my-4 flex flex-wrap gap-2">
            {selectedRegion !== '전체' && (
              <span className="inline-flex items-center gap-1.5 bg-[#FF3B5C]/10 text-[#FF3B5C] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#FF3B5C]/20">
                {selectedRegion}
                <button onClick={() => setSelectedRegion('전체')}>
                  <X size={14} />
                </button>
              </span>
            )}
            {selectedGenre !== '전체' && (
              <span className="inline-flex items-center gap-1.5 bg-[#FF3B5C]/10 text-[#FF3B5C] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#FF3B5C]/20">
                {selectedGenre}
                <button onClick={() => setSelectedGenre('전체')}>
                  <X size={14} />
                </button>
              </span>
            )}
            {showDyveOnly && (
              <span className="inline-flex items-center gap-1.5 bg-[#FF3B5C]/10 text-[#FF3B5C] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#FF3B5C]/20">
                DYVE 예약
                <button onClick={() => setShowDyveOnly(false)}>
                  <X size={14} />
                </button>
              </span>
            )}
            {showFreeOnly && (
              <span className="inline-flex items-center gap-1.5 bg-[#FF3B5C]/10 text-[#FF3B5C] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#FF3B5C]/20">
                무료공연
                <button onClick={() => setShowFreeOnly(false)}>
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="my-5">
          <p className="text-gray-500 text-sm">
            <span className="text-white font-bold">{filteredPerformances.length}</span>개의 공연
          </p>
        </div>

        {/* Performance List */}
        {filteredPerformances.length > 0 ? (
          <div className="space-y-3 mb-8">
            {filteredPerformances.map((perf) => (
              <PerformanceCard
                key={perf.id}
                performance={perf}
                onClick={() => navigate('detail', { performance: perf })}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-600 mb-2">검색 결과가 없습니다</p>
            <button
              onClick={clearAllFilters}
              className="text-[#FF3B5C] text-sm font-semibold underline"
            >
              필터 초기화하기
            </button>
          </div>
        )}
      </div>

      <BottomNav navigate={navigate} currentScreen="explore" />
    </div>
  );
}
