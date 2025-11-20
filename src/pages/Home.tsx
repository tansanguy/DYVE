import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dyveLogo from '../assets/images/dyve-logo.png';
import {
  AroundYouResponse,
  EventPreview,
  HomeBanner,
  getAroundYou,
  getHomeBanner,
  getUpcomingEvents,
} from '../api/home';
import { BottomNav } from '../components/navigation/BottomNav';
import { ProposalInboxButton } from '../components/navigation/ProposalInboxButton';
import { ImageWithFallback } from '../dyve-figma/components/figma/ImageWithFallback';
import { formatEventPrice, getDDayLabel } from '../utils/event';

const DEFAULT_LOCATION = {
  lat: 37.5665,
  lng: 126.978,
  region: '서울',
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=900&auto=format&fit=crop&q=80';

const FALLBACK_HERO = {
  id: 0,
  title: 'Premium Live Moments',
  description: '당신 근처에서 지금 만날 수 있는 특별한 공연을 모아보세요.',
  imageUrl: FALLBACK_IMAGE,
  ctaLabel: '공연 찾아보기',
};

interface BannerContent {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
}

interface HeroHighlight extends BannerContent {
  ctaLabel: string;
  onAction?: () => void;
}

interface PerformanceInfo {
  id: number;
  title: string;
  artist: string;
  venue: string;
  region: string;
  date?: string | null;
  time?: string | null;
  price?: number | null;
  priceMax?: number | null;
  isFree?: boolean;
  genre?: string;
  dyveBookable?: boolean;
  entryType?: string;
  imageUrl?: string;
  description?: string;
}

export default function Home() {
  const navigate = useNavigate();

  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [aroundEvents, setAroundEvents] = useState<EventPreview[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventPreview[]>([]);
  const [currentRegion, setCurrentRegion] = useState(DEFAULT_LOCATION.region);
  const [aroundStatus, setAroundStatus] = useState<'loading' | 'error' | 'idle'>('loading');
  const [upcomingStatus, setUpcomingStatus] = useState<'loading' | 'error' | 'idle'>('loading');

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getHomeBanner();
        setBanners(data);
      } catch (error) {
        console.error('배너 데이터를 불러오는 중 오류 발생', error);
      }
    };

    const fetchAround = async () => {
      try {
        const data: AroundYouResponse = await getAroundYou(DEFAULT_LOCATION);
        setAroundEvents(data.events || []);
        if (data.region) {
          setCurrentRegion(data.region);
        }
        setAroundStatus('idle');
      } catch (error) {
        console.error('내 주변 공연 데이터를 불러오는 중 오류 발생', error);
        setAroundStatus('error');
      }
    };

    const fetchUpcoming = async () => {
      try {
        const data = await getUpcomingEvents();
        setUpcomingEvents(data);
        setUpcomingStatus('idle');
      } catch (error) {
        console.error('다가오는 공연 데이터를 불러오는 중 오류 발생', error);
        setUpcomingStatus('error');
      }
    };

    fetchBanners();
    fetchAround();
    fetchUpcoming();
  }, []);

  const heroHighlight = useMemo<HeroHighlight>(() => {
    const primary = banners[0];
    if (!primary) {
      return {
        ...FALLBACK_HERO,
        imageUrl: FALLBACK_HERO.imageUrl ?? FALLBACK_IMAGE,
        onAction: () => navigate('/events'),
      };
    }

    const action = () => {
      if (primary.link_url) {
        if (primary.link_url.startsWith('http')) {
          window.open(primary.link_url, '_blank');
          return;
        }
        navigate(primary.link_url);
        return;
      }
      navigate('/events');
    };

    return {
      id: primary.id,
      title: primary.title ?? FALLBACK_HERO.title,
      description: primary.description ?? FALLBACK_HERO.description,
      imageUrl: primary.image_url ?? FALLBACK_IMAGE,
      ctaLabel: primary.link_url ? '바로가기' : '공연 찾아보기',
      linkUrl: primary.link_url,
      onAction: action,
    };
  }, [banners, navigate]);

  const spotlightBanners = useMemo<BannerContent[]>(() => {
    const mapBanner = (banner: HomeBanner): BannerContent => ({
      id: banner.id,
      title: banner.title,
      description: banner.description,
      imageUrl: banner.image_url ?? FALLBACK_IMAGE,
      linkUrl: banner.link_url,
    });

    if (banners.length <= 1) {
      return banners.map(mapBanner);
    }

    return banners.slice(1).map(mapBanner);
  }, [banners]);

  const aroundPerformances = useMemo<PerformanceInfo[]>(() => {
    return aroundEvents.map((event) => mapEventToPerformance(event));
  }, [aroundEvents]);

  const upcomingPerformances = useMemo<PerformanceInfo[]>(() => {
    return upcomingEvents.map((event) => mapEventToPerformance(event));
  }, [upcomingEvents]);

  const StatusBlock = ({ message }: { message: string }) => (
    <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-5 text-center text-sm text-white/70">
      {message}
    </div>
  );

  const handleBannerClick = (banner: BannerContent) => {
    if (!banner.linkUrl) {
      navigate('/events');
      return;
    }
    if (banner.linkUrl.startsWith('http')) {
      window.open(banner.linkUrl, '_blank');
      return;
    }
    navigate(banner.linkUrl);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex w-full max-w-screen-sm flex-col pb-24">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <img src={dyveLogo} alt="DYVE" className="h-7" />
            <ProposalInboxButton />
          </div>
        </header>

        <main className="flex flex-col gap-10 px-4 pb-10 pt-6 sm:px-6">
          <section className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.45em] text-white/50">Dyve</p>
              <h1 className="text-3xl font-bold leading-snug tracking-tight">당신 근처의 공연을 발견하세요</h1>
              <p className="text-sm text-white/60">현재 {currentRegion} 인근에서 진행되는 공연을 엄선했어요.</p>
            </div>
            <HeroSection hero={heroHighlight} />
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-white/50">Spotlight</p>
                <h2 className="text-2xl font-semibold">추천 배너</h2>
              </div>
              <span className="text-xs text-white/40">Auto Scroll</span>
            </div>
            <div className="relative -mx-4 px-1 sm:-mx-6">
              <BannerRail banners={spotlightBanners} onBannerClick={handleBannerClick} />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-white/50">Around You</p>
                <h2 className="text-2xl font-semibold">당신 주변에서 열리는 공연을 확인하세요</h2>
              </div>
              <span className="text-xs text-white/40">위치: {currentRegion}</span>
            </div>
            {aroundStatus === 'loading' && (
              <div className="relative -mx-4 px-4 sm:-mx-6">
                <div className="flex gap-4 overflow-hidden pb-4">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={`around-loading-${index}`}
                      className="h-[320px] w-[250px] flex-shrink-0 rounded-3xl border border-white/10 bg-white/5 animate-pulse sm:w-[280px]"
                    />
                  ))}
                </div>
              </div>
            )}
            {aroundStatus === 'error' && <StatusBlock message="주변 공연을 불러오지 못했습니다." />}
            {aroundStatus === 'idle' && aroundPerformances.length === 0 && (
              <StatusBlock message="주변 공연이 아직 없습니다." />
            )}
            {aroundStatus === 'idle' && aroundPerformances.length > 0 && (
              <div className="relative -mx-4 px-4 sm:-mx-6">
                <PosterRail
                  performances={aroundPerformances}
                  onSelect={(performance) => navigate(`/events/${performance.id}`)}
                />
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-white/50">Upcoming</p>
                <h2 className="text-2xl font-semibold">다가오는 공연 일정을 미리 확인하세요</h2>
              </div>
              <span className="text-xs text-white/40">{upcomingPerformances.length}개 일정</span>
            </div>
            {upcomingStatus === 'loading' && (
              <div className="space-y-4">
                {[0, 1, 2].map((index) => (
                  <div
                    key={`upcoming-loading-${index}`}
                    className="h-[220px] rounded-3xl border border-white/10 bg-white/5 animate-pulse"
                  />
                ))}
              </div>
            )}
            {upcomingStatus === 'error' && <StatusBlock message="다가오는 공연을 불러오지 못했습니다." />}
            {upcomingStatus === 'idle' && upcomingPerformances.length === 0 && (
              <StatusBlock message="다가오는 공연 일정이 없습니다." />
            )}
            {upcomingStatus === 'idle' && upcomingPerformances.length > 0 && (
              <UpcomingGrid
                performances={upcomingPerformances}
                onSelect={(performance) => navigate(`/events/${performance.id}`)}
              />
            )}
          </section>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

function mapEventToPerformance(event: EventPreview): PerformanceInfo {
  return {
    id: event.id,
    title: event.title,
    artist: event.genre || 'DYVE',
    venue: event.venue_name,
    region: event.region,
    date: event.date,
    time: event.time,
    price: event.price ?? event.price_min ?? 0,
    priceMax: event.price_max ?? event.price ?? 0,
    isFree: event.is_free,
    genre: event.genre,
    dyveBookable: event.allow_dyve_reservation,
    entryType: event.entry_type,
    imageUrl: event.image_url ?? FALLBACK_IMAGE,
    description: event.description,
  };
}

interface HeroSectionProps {
  hero: HeroHighlight;
}

function HeroSection({ hero }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10">
      <div className="absolute inset-0">
        <ImageWithFallback src={hero.imageUrl} alt={hero.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>
      <div className="relative z-10 flex min-h-[220px] flex-col justify-end gap-4 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Featured</p>
        <h2 className="text-3xl font-semibold leading-tight">{hero.title}</h2>
        <p className="text-sm leading-relaxed text-white/70">{hero.description}</p>
        <button
          type="button"
          onClick={hero.onAction ?? (() => {})}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
        >
          {hero.ctaLabel}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface BannerRailProps {
  banners: BannerContent[];
  onBannerClick?: (banner: BannerContent) => void;
}

function BannerRail({ banners, onBannerClick }: BannerRailProps) {
  if (banners.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6 text-center text-sm text-white/60">
        추천 배너를 준비 중입니다.
      </div>
    );
  }

  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {banners.map((banner) => (
        <button
          type="button"
          key={`banner-${banner.id}`}
          onClick={() => onBannerClick?.(banner)}
          className="group relative flex h-48 min-w-[250px] flex-shrink-0 snap-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-black/20 p-6 text-left text-white transition duration-300 hover:border-white/40 hover:bg-white/5"
        >
          <div className="absolute inset-0">
            <ImageWithFallback
              src={banner.imageUrl}
              alt={banner.title}
              className="h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/80" />
          </div>
          <div className="relative z-10 flex h-full flex-col justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/50">Banner</p>
              <h3 className="mt-1 text-2xl font-semibold leading-snug">{banner.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-white/70 line-clamp-2">{banner.description}</p>
            <span className="inline-flex items-center text-sm font-semibold text-white/80">
              자세히 보기
              <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

interface PosterRailProps {
  performances: PerformanceInfo[];
  onSelect?: (performance: PerformanceInfo) => void;
}

function PosterRail({ performances, onSelect }: PosterRailProps) {
  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {performances.map((performance) => (
        <PosterCard key={`poster-${performance.id}`} performance={performance} onSelect={onSelect} />
      ))}
    </div>
  );
}

interface PosterCardProps {
  performance: PerformanceInfo;
  onSelect?: (performance: PerformanceInfo) => void;
}

function PosterCard({ performance, onSelect }: PosterCardProps) {
  const priceLabel = formatEventPrice(performance.price, performance.isFree, performance.priceMax);
  const dDayLabel = getDDayLabel(performance.date);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(performance)}
      className="group relative flex min-h-[320px] w-[250px] flex-shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/0 to-black/30 text-left transition duration-300 hover:border-white/40 hover:shadow-[0_15px_45px_rgba(0,0,0,0.45)] sm:w-[280px]"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <ImageWithFallback
          src={performance.imageUrl ?? ''}
          alt={performance.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <span className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/60 px-3 py-1 text-xs font-semibold tracking-tight text-white">
          {dDayLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-[11px] uppercase tracking-[0.32em] text-white/50">{performance.genre}</p>
        <h3 className="text-lg font-semibold leading-snug text-white line-clamp-2">{performance.title}</h3>
        <p className="text-sm text-white/70 line-clamp-1">{performance.artist}</p>
        <p className="text-sm text-white/60">{performance.venue}</p>
        <div className="mt-auto space-y-1 text-sm text-white/70">
          <p className="font-medium text-white/90">
            {performance.date} · {performance.time}
          </p>
          <p className="text-white/60">{performance.region}</p>
          <p className="text-base font-semibold text-white">{priceLabel}</p>
        </div>
      </div>
    </button>
  );
}

interface UpcomingGridProps {
  performances: PerformanceInfo[];
  onSelect?: (performance: PerformanceInfo) => void;
}

function UpcomingGrid({ performances, onSelect }: UpcomingGridProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {performances.map((performance) => (
        <UpcomingCard key={`upcoming-${performance.id}`} performance={performance} onSelect={onSelect} />
      ))}
    </div>
  );
}

interface UpcomingCardProps {
  performance: PerformanceInfo;
  onSelect?: (performance: PerformanceInfo) => void;
}

function UpcomingCard({ performance, onSelect }: UpcomingCardProps) {
  const priceLabel = formatEventPrice(performance.price, performance.isFree, performance.priceMax);
  const dDayLabel = getDDayLabel(performance.date);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(performance)}
      className="group flex min-h-[220px] w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-black/10 p-4 text-left transition duration-300 hover:border-white/40 hover:bg-white/5 sm:basis-[calc(50%-0.5rem)] sm:flex-row"
    >
      <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-white/10 sm:h-auto sm:w-32">
        <ImageWithFallback src={performance.imageUrl ?? ''} alt={performance.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white">
          {dDayLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-2 sm:p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/50">{performance.region}</p>
          <h3 className="mt-1 text-lg font-semibold leading-tight text-white line-clamp-2">{performance.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-white/70 line-clamp-2">{performance.artist}</p>
        </div>

        <div className="mt-auto space-y-1 text-sm text-white/70">
          <p>
            {performance.date} · {performance.time}
          </p>
          <p className="text-white/60">{performance.venue}</p>
          <p className="text-base font-semibold text-white">{priceLabel}</p>
        </div>
      </div>
    </button>
  );
}
