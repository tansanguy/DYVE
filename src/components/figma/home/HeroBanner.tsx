import { ImageWithFallback } from '../../../dyve-figma/components/figma/ImageWithFallback';

interface HeroBannerProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  ctaLabel?: string;
  onAction?: () => void;
}

const fallbackHero: Required<HeroBannerProps> = {
  title: 'Live Music Tonight',
  description: '지금 당신 주변의 공연을 만나보세요',
  imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80',
  ctaLabel: '공연 찾아보기',
  onAction: () => undefined,
};

export function HeroBanner({ title, description, imageUrl, ctaLabel, onAction }: HeroBannerProps) {
  const data = {
    title: title ?? fallbackHero.title,
    description: description ?? fallbackHero.description,
    imageUrl: imageUrl ?? fallbackHero.imageUrl,
    ctaLabel: ctaLabel ?? fallbackHero.ctaLabel,
    onAction: onAction ?? fallbackHero.onAction,
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10">
      <div className="absolute inset-0">
        <ImageWithFallback src={data.imageUrl} alt={data.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>
      <div className="relative z-10 flex min-h-[220px] flex-col justify-end gap-4 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Featured</p>
        <h2 className="text-3xl font-semibold leading-tight">{data.title}</h2>
        <p className="text-sm leading-relaxed text-white/70">{data.description}</p>
        <button
          type="button"
          onClick={data.onAction}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
        >
          {data.ctaLabel}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
