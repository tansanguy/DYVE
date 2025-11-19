import { ImageWithFallback } from '../../../dyve-figma/components/figma/ImageWithFallback';

export interface BannerContent {
  id?: number | string;
  title?: string;
  description?: string;
  imageUrl?: string;
  linkLabel?: string;
  onClick?: () => void;
}

const fallbackBanner: Required<Omit<BannerContent, 'id' | 'onClick'>> = {
  title: 'Weekend Picks',
  description: '주말 밤을 채워줄 공연 큐레이션',
  imageUrl: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81d?w=900&auto=format&fit=crop&q=80',
  linkLabel: '자세히 보기',
};

interface BannerRailProps {
  banners: BannerContent[];
}

export function BannerRail({ banners }: BannerRailProps) {
  const items = banners.length ? banners : [{ ...fallbackBanner, id: 'fallback' }];

  return (
    <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6">
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((banner, index) => {
          const data = {
            ...fallbackBanner,
            ...banner,
            id: banner.id ?? `banner-${index}`,
          };
          return (
            <button
              type="button"
              key={data.id}
              onClick={data.onClick}
              className="group relative flex h-48 min-w-[250px] flex-shrink-0 snap-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-black/20 p-6 text-left text-white transition duration-300 hover:border-white/40 hover:bg-white/5"
            >
              <div className="absolute inset-0">
                <ImageWithFallback src={data.imageUrl} alt={data.title} className="h-full w-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/80" />
              </div>
              <div className="relative z-10 flex h-full flex-col justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-white/50">Banner</p>
                  <h3 className="mt-1 text-2xl font-semibold leading-snug">{data.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-white/70 line-clamp-2">{data.description}</p>
                <span className="inline-flex items-center text-sm font-semibold text-white/80">
                  {data.linkLabel}
                  <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
