import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import useFetch from '../hooks/useFetch';

type Performance = {
  id: string;
  title: string;
  location: string;
  schedule: string;
  distance?: string;
  image?: string;
  badge?: string;
};

const aroundYouMock: Performance[] = [
  {
    id: 'around-1',
    title: 'Seoul Jazz Collective',
    location: 'Hongdae · Mapo-gu',
    schedule: 'Tonight · 9:00 PM',
    distance: '2.1 km',
    badge: 'Live',
    image:
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'around-2',
    title: 'Indie Acoustic Stories',
    location: 'Itaewon · Yongsan-gu',
    schedule: 'Tomorrow · 7:30 PM',
    distance: '4.3 km',
    badge: 'Acoustic',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'around-3',
    title: 'DYVE Rooftop Session',
    location: 'Seongsu · Seongdong-gu',
    schedule: 'Fri · 8:00 PM',
    distance: '5.0 km',
    badge: 'Limited',
    image:
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=600&q=80',
  },
];

const upcomingMock: Performance[] = [
  {
    id: 'upcoming-1',
    title: 'Electronic Bloom',
    location: 'Gangnam · Seoul',
    schedule: 'Sat · 11:00 PM',
    badge: 'New',
    image:
      'https://images.unsplash.com/photo-1464375117522-1311d6a5b81c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'upcoming-2',
    title: 'Neo-Soul Lab',
    location: 'Yeonnam-dong · Mapo-gu',
    schedule: 'Sun · 6:30 PM',
    badge: 'Sold 80%',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'upcoming-3',
    title: 'Midnight Session',
    location: 'Banpo · Seocho-gu',
    schedule: 'Mon · 9:30 PM',
    badge: 'Last tickets',
    image:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80',
  },
];

const SectionTitle: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
  <div className="mb-4 flex items-baseline justify-between">
    <div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
    <button type="button" className="text-xs font-medium text-gray-500">
      See all
    </button>
  </div>
);

const SectionPlaceholder: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-gray-200">
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

const PerformanceCard: React.FC<{ performance: Performance; variant: 'carousel' | 'list' }> = ({
  performance,
  variant,
}) => {
  const isCarousel = variant === 'carousel';

  return (
    <article
      className={[
        'rounded-2xl bg-white shadow-sm',
        isCarousel ? 'w-64 flex-shrink-0 overflow-hidden' : 'flex items-center gap-4 p-4',
      ].join(' ')}
    >
      <div
        className={[
          'relative overflow-hidden rounded-2xl bg-gray-200',
          isCarousel ? 'h-40 w-full' : 'h-24 w-24',
        ].join(' ')}
      >
        {performance.image ? (
          <img
            src={performance.image}
            alt={performance.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-wide text-gray-400">
            No Image
          </div>
        )}
        {performance.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-900">
            {performance.badge}
          </span>
        )}
      </div>

      <div className={isCarousel ? 'p-4' : 'flex-1'}>
        <p className="text-sm font-semibold text-gray-900">{performance.title}</p>
        <p className="text-xs text-gray-500">{performance.location}</p>
        <p className="mt-1 text-xs font-medium text-gray-700">{performance.schedule}</p>
        {performance.distance && (
          <span className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600">
            {performance.distance} away
          </span>
        )}
      </div>
    </article>
  );
};

const HomePage: React.FC = () => {
  const { data: aroundData, loading: aroundLoading } = useFetch<Performance[]>('mock:around-you', {
    mockData: aroundYouMock,
    mockDelay: 350,
  });
  const { data: upcomingData, loading: upcomingLoading } = useFetch<Performance[]>('mock:upcoming', {
    mockData: upcomingMock,
    mockDelay: 500,
  });

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto flex h-screen max-w-sm flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 pt-14 pb-[64px]">
          <section className="mb-10">
            <SectionTitle title="Around You" description="Personalized shows near your location" />
            {aroundLoading && <SectionPlaceholder label="Loading shows near you..." />}
            {!aroundLoading && aroundData && aroundData.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {aroundData.map((performance) => (
                  <PerformanceCard key={performance.id} performance={performance} variant="carousel" />
                ))}
              </div>
            ) : null}
            {!aroundLoading && (!aroundData || aroundData.length === 0) && (
              <SectionPlaceholder label="No nearby shows. Stay tuned!" />
            )}
          </section>

          <section>
            <SectionTitle title="Upcoming" description="Newly added & trending concerts" />
            {upcomingLoading && <SectionPlaceholder label="Loading upcoming concerts..." />}
            {!upcomingLoading && upcomingData && upcomingData.length > 0 ? (
              <div className="flex flex-col gap-4">
                {upcomingData.map((performance) => (
                  <PerformanceCard key={performance.id} performance={performance} variant="list" />
                ))}
              </div>
            ) : null}
            {!upcomingLoading && (!upcomingData || upcomingData.length === 0) && (
              <SectionPlaceholder label="No upcoming concerts. Check back tomorrow." />
            )}
          </section>
        </div>
      </main>
      <Navbar />
    </div>
  );
};

export default HomePage;
