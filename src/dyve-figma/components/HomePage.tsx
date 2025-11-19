import { Screen } from '../App';
import BottomNav from './BottomNav';
import dyveLogo from '../../assets/images/dyve-logo.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  navigate?: (screen: Screen, data?: any) => void;
}

type EntryType = 'seat' | 'number' | 'entry';

interface SeatingInfo {
  rows: number;
  cols: number;
}

interface PerformanceInfo {
  id: number;
  title: string;
  artist: string;
  venue: string;
  region: string;
  date: string;
  time: string;
  price: number;
  genre: string;
  dDay: number;
  dyveBookable: boolean;
  entryType: EntryType;
  seatingInfo?: SeatingInfo;
  imageUrl: string;
}

interface BannerContent {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface HeroHighlight extends BannerContent {
  ctaLabel: string;
}

const heroHighlight: HeroHighlight = {
  id: 0,
  title: 'Live Music Tonight',
  description: '지금 당신 주변의 공연을 만나보세요',
  imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80',
  ctaLabel: '공연 찾아보기',
};

const featuredBanners: BannerContent[] = [
  {
    id: 1,
    title: 'Live Music Tonight',
    description: '서울에서 지금 바로 즐길 수 있는 공연을 만나보세요',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'DYVE Spotlight',
    description: '신규 아티스트와 콜라보 레코멘데이션',
    imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Weekend Picks',
    description: '주말 밤을 채워줄 공연 큐레이션',
    imageUrl: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81d?w=900&auto=format&fit=crop&q=80',
  },
];

export const mockPerformances: PerformanceInfo[] = [
  {
    id: 1,
    title: 'Midnight Jazz Session',
    artist: 'Luna Quartet',
    venue: 'Blue Note Seoul',
    region: '서울',
    date: '2025-11-05',
    time: '20:00',
    price: 25000,
    genre: 'Jazz',
    dDay: 2,
    dyveBookable: true,
    entryType: 'seat',
    seatingInfo: { rows: 5, cols: 6 },
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Indie Rock Night',
    artist: 'The Wanderers',
    venue: 'Club FF 홍대',
    region: '서울',
    date: '2025-11-04',
    time: '19:00',
    price: 20000,
    genre: 'Rock',
    dDay: 1,
    dyveBookable: true,
    entryType: 'number',
    seatingInfo: { rows: 3, cols: 10 },
    imageUrl: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Electronic Dreams',
    artist: 'NEON',
    venue: 'Vault 강남',
    region: '서울',
    date: '2025-11-06',
    time: '21:00',
    price: 30000,
    genre: 'Electronic',
    dDay: 3,
    dyveBookable: false,
    entryType: 'entry',
    imageUrl: 'https://images.unsplash.com/photo-1507878866276-a947ef722fee?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Hip-Hop Cypher',
    artist: 'Seoul Rappers',
    venue: 'Underground 이태원',
    region: '서울',
    date: '2025-11-08',
    time: '22:00',
    price: 15000,
    genre: 'Hip-Hop',
    dDay: 5,
    dyveBookable: true,
    entryType: 'entry',
    imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    title: 'Indie Acoustic Night',
    artist: 'Moonlight Band',
    venue: 'Cafe Live 신촌',
    region: '서울',
    date: '2025-11-10',
    time: '19:30',
    price: 0,
    genre: 'Indie',
    dDay: 7,
    dyveBookable: true,
    entryType: 'number',
    seatingInfo: { rows: 4, cols: 8 },
    imageUrl: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81d?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    title: 'Jazz & Wine',
    artist: 'Seoul Jazz Collective',
    venue: 'Blue Moon 대학로',
    region: '서울',
    date: '2025-11-12',
    time: '20:30',
    price: 35000,
    genre: 'Jazz',
    dDay: 9,
    dyveBookable: false,
    entryType: 'seat',
    seatingInfo: { rows: 6, cols: 8 },
    imageUrl: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=900&auto=format&fit=crop&q=80',
  },
];

const formatEventPrice = (price: number) => (price <= 0 ? '무료' : `${price.toLocaleString()}원`);

const getDDayLabel = (dDay: number) => {
  if (dDay === 0) return 'D-Day';
  if (dDay > 0) return `D-${dDay}`;
  return '상시';
};

const noopNavigate = () => {};

export default function HomePage({ navigate }: HomePageProps) {
  const handleNavigate = navigate ?? noopNavigate;
  const aroundYouEvents = mockPerformances.slice(0, 4);

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-screen-sm items-center justify-between px-6 py-4">
          <img src={dyveLogo} alt="DYVE" className="h-7" />
          <button
            type="button"
            onClick={() => handleNavigate('receivedProposals')}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 hover:text-white"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
              <polyline points="3 7 12 13 21 7" />
            </svg>
            제안함
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-screen-sm space-y-10 px-6 pt-6 pb-24">
        <section className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.45em] text-white/50">Dyve</p>
            <h1 className="text-3xl font-bold leading-snug tracking-tight">당신 근처의 공연을 발견하세요</h1>
            <p className="text-sm text-white/60">현재 서울 인근의 공연을 엄선했어요.</p>
          </div>

          <HeroSection hero={heroHighlight} onAction={() => handleNavigate('explore')} />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/50">Spotlight</p>
              <h2 className="text-2xl font-semibold">추천 배너</h2>
            </div>
            <span className="text-xs text-white/40">Auto Scroll</span>
          </div>
          <BannerRail banners={featuredBanners} onBannerClick={(banner) => handleNavigate('explore', { banner })} />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/50">Around You</p>
              <h2 className="text-2xl font-semibold">당신 주변에서 열리는 공연을 확인하세요</h2>
            </div>
            <span className="text-xs text-white/40">위치: 서울</span>
          </div>
          <PosterRail
            performances={aroundYouEvents}
            onSelect={(performance) => handleNavigate('detail', { performance })}
          />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/50">Upcoming</p>
              <h2 className="text-2xl font-semibold">다가오는 공연 일정을 미리 확인하세요</h2>
            </div>
            <span className="text-xs text-white/40">{mockPerformances.length}개 일정</span>
          </div>
          <UpcomingGrid
            performances={mockPerformances}
            onSelect={(performance) => handleNavigate('detail', { performance })}
          />
        </section>
      </div>

      <BottomNav navigate={(screen) => handleNavigate(screen)} currentScreen="home" />
    </div>
  );
}

interface HeroSectionProps {
  hero: HeroHighlight;
  onAction?: () => void;
}

function HeroSection({ hero, onAction }: HeroSectionProps) {
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
          onClick={onAction}
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
  return (
    <div className="relative -mx-6 px-1">
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {banners.map((banner) => (
          <button
            type="button"
            key={banner.id}
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
    </div>
  );
}

interface PosterRailProps {
  performances: PerformanceInfo[];
  onSelect?: (performance: PerformanceInfo) => void;
}

function PosterRail({ performances, onSelect }: PosterRailProps) {
  return (
    <div className="relative -mx-6 px-1">
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {performances.map((performance) => (
          <PosterCard key={performance.id} performance={performance} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

interface PosterCardProps {
  performance: PerformanceInfo;
  onSelect?: (performance: PerformanceInfo) => void;
}

function PosterCard({ performance, onSelect }: PosterCardProps) {
  const priceLabel = formatEventPrice(performance.price);
  const dDayLabel = getDDayLabel(performance.dDay);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(performance)}
      className="group relative flex min-h-[320px] w-[250px] flex-shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/0 to-black/30 text-left transition duration-300 hover:border-white/40 hover:shadow-[0_15px_45px_rgba(0,0,0,0.45)] sm:w-[280px]"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <ImageWithFallback
          src={performance.imageUrl}
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
  const priceLabel = formatEventPrice(performance.price);
  const dDayLabel = getDDayLabel(performance.dDay);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(performance)}
      className="group flex min-h-[220px] w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-black/10 p-4 text-left transition duration-300 hover:border-white/40 hover:bg-white/5 sm:basis-[calc(50%-0.5rem)] sm:flex-row"
    >
      <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-white/10 sm:h-auto sm:w-32">
        <ImageWithFallback src={performance.imageUrl} alt={performance.title} className="h-full w-full object-cover" />
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
