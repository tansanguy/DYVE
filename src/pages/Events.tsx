import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, X, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { getUpcomingEvents, EventPreview } from '../api/home';
import { Checkbox } from '../dyve-figma/components/ui/checkbox';
import { EventPerformanceCard } from '../components/figma/cards/EventPerformanceCard';
import { EventCardData } from '../components/figma/cards/EventPosterCard';
import { BottomNav } from '../components/navigation/BottomNav';

export default function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventPreview[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'idle'>('loading');

  const [showFilters, setShowFilters] = useState(false);
  const [showDyveOnly, setShowDyveOnly] = useState(false);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getUpcomingEvents();
        setEvents(data);
        setStatus('idle');
      } catch (error) {
        console.error('공연 목록을 불러오는 중 오류 발생', error);
        setStatus('error');
      }
    };

    fetchEvents();
  }, []);

  const genres = useMemo(() => {
    const unique = new Set(events.map((event) => event.genre).filter(Boolean));
    return Array.from(unique);
  }, [events]);

  const filteredEvents = events.filter((event) => {
    if (showDyveOnly && !event.allow_dyve_reservation) return false;
    if (showFreeOnly && !event.is_free) return false;
    if (selectedGenres.length > 0 && !selectedGenres.includes(event.genre)) return false;
    return true;
  });

  const hasActiveFilters = showDyveOnly || showFreeOnly || selectedGenres.length > 0;

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((item) => item !== genre) : [...prev, genre]));
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setShowDyveOnly(false);
    setShowFreeOnly(false);
  };

  const statusMessage = () => {
    if (status === 'loading') return '공연을 불러오는 중입니다...';
    if (status === 'error') return '공연 목록을 불러오지 못했습니다.';
    if (filteredEvents.length === 0) return '조건에 맞는 공연이 없습니다.';
    return null;
  };

  const mapEventToCard = (event: EventPreview): EventCardData => ({
    id: event.id,
    title: event.title,
    artist: event.genre,
    venue: event.venue_name,
    date: event.date,
    time: event.time,
    genre: event.genre,
    price: event.price,
    isFree: event.is_free,
    imageUrl: event.image_url,
  });

  const message = statusMessage();

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <div className="mx-auto w-full max-w-screen-sm">
        <div className="sticky top-0 z-40 border-b border-white/10 bg-black/95 px-6 py-5 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight">Events</h1>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/mypage')}
                className="flex items-center gap-2 rounded-xl bg-[#FF3B5C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d43550]"
              >
                <Plus size={18} />
                공연 등록
              </button>
              <Link to="/networking" className="relative text-white/80 transition hover:text-[#FF3B5C]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF3B5C] text-[10px] font-bold text-white">
                  !
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  showFilters || hasActiveFilters ? 'bg-[#FF3B5C] text-white' : 'border border-white/5 bg-[#0F0F0F] text-gray-400'
                }`}
              >
                <SlidersHorizontal size={18} />
                필터
                {hasActiveFilters && !showFilters && <span className="h-2 w-2 rounded-full bg-white" />}
              </button>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-400">
            <label className="flex items-center gap-3">
              <Checkbox
                id="dyve-only"
                checked={showDyveOnly}
                onCheckedChange={(checked) => setShowDyveOnly(Boolean(checked))}
                className="border-gray-600 data-[state=checked]:border-[#FF3B5C] data-[state=checked]:bg-[#FF3B5C]"
              />
              <span className="cursor-pointer" onClick={() => setShowDyveOnly((prev) => !prev)}>
                DYVE 예약 가능만 보기
              </span>
            </label>
            <label className="flex items-center gap-3">
              <Checkbox
                id="free-only"
                checked={showFreeOnly}
                onCheckedChange={(checked) => setShowFreeOnly(Boolean(checked))}
                className="border-gray-600 data-[state=checked]:border-[#FF3B5C] data-[state=checked]:bg-[#FF3B5C]"
              />
              <span className="cursor-pointer" onClick={() => setShowFreeOnly((prev) => !prev)}>
                무료 공연만 보기
              </span>
            </label>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-b border-white/10 bg-[#0A0A0A]"
            >
              <div className="space-y-5 px-6 py-6">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-sm font-bold">장르</label>
                    {selectedGenres.length > 0 && (
                      <button type="button" className="text-xs font-semibold text-[#FF3B5C]" onClick={() => setSelectedGenres([])}>
                        장르 초기화
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <button
                        type="button"
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                          selectedGenres.includes(genre)
                            ? 'bg-[#FF3B5C] text-white'
                            : 'border border-white/5 bg-[#0F0F0F] text-gray-400 hover:border-[#FF3B5C]/30'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-[#111] py-3 text-sm font-semibold text-gray-400 transition hover:border-[#FF3B5C]/30"
                  >
                    <X size={16} />
                    모든 필터 초기화
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-6">
          {hasActiveFilters && (
            <div className="my-4 flex flex-wrap gap-2">
              {selectedGenres.map((genre) => (
                <span key={genre} className="inline-flex items-center gap-1.5 rounded-lg border border-[#FF3B5C]/20 bg-[#FF3B5C]/10 px-3 py-1.5 text-xs font-semibold text-[#FF3B5C]">
                  {genre}
                  <button type="button" onClick={() => toggleGenre(genre)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
              {showDyveOnly && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#FF3B5C]/20 bg-[#FF3B5C]/10 px-3 py-1.5 text-xs font-semibold text-[#FF3B5C]">
                  DYVE 예약
                  <button type="button" onClick={() => setShowDyveOnly(false)}>
                    <X size={14} />
                  </button>
                </span>
              )}
              {showFreeOnly && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#FF3B5C]/20 bg-[#FF3B5C]/10 px-3 py-1.5 text-xs font-semibold text-[#FF3B5C]">
                  무료 공연
                  <button type="button" onClick={() => setShowFreeOnly(false)}>
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          )}

          <p className="mb-4 text-sm text-white/60">총 {filteredEvents.length}개의 공연</p>

          {message ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70">{message}</div>
          ) : (
            <div className="space-y-3 pb-6">
              {filteredEvents.map((event) => (
                <EventPerformanceCard
                  key={event.id}
                  event={mapEventToCard(event)}
                  onClick={() => navigate(`/event/${event.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
