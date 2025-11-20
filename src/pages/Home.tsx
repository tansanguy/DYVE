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
import { HeroBanner } from '../components/figma/home/HeroBanner';
import { EventPosterCard, EventCardData } from '../components/figma/cards/EventPosterCard';
import { BottomNav } from '../components/navigation/BottomNav';
import { ProposalInboxButton } from '../components/navigation/ProposalInboxButton';
import { UpcomingEventCard } from '../components/figma/cards/UpcomingEventCard';

const DEFAULT_LOCATION = {
  lat: 37.5665,
  lng: 126.978,
  region: '서울',
};

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

  const heroData = useMemo(() => {
    const firstBanner = banners[0];
    if (!firstBanner) return undefined;
    return {
      title: firstBanner.title,
      description: firstBanner.description,
      imageUrl: firstBanner.image_url,
      ctaLabel: firstBanner.link_url ? '바로가기' : '공연 찾아보기',
      onAction: () => {
        if (firstBanner.link_url) {
          if (firstBanner.link_url.startsWith('http')) {
            window.open(firstBanner.link_url, '_blank');
            return;
          }
          navigate(firstBanner.link_url);
          return;
        }
        navigate('/events');
      },
    };
  }, [banners, navigate]);

  // 한국어 주석: 공통 카드 컴포넌트가 동일한 필드 명을 쓰도록 priceMin/Max 등을 한 번에 매핑한다.
  const mapEventToCard = (event: EventPreview): EventCardData => ({
    id: event.id,
    title: event.title,
    artist: event.genre,
    venue: event.venue_name,
    region: event.region,
    date: event.date,
    time: event.time,
    genre: event.genre,
    price: event.price,
    priceMin: event.price_min ?? event.price,
    priceMax: event.price_max ?? event.price,
    isFree: event.is_free,
    imageUrl: event.image_url,
    description: event.description,
    allowDyveReservation: event.allow_dyve_reservation,
  });

  const StatusBlock = ({ message }: { message: string }) => (
    <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-5 text-center text-sm text-white/70">
      {message}
    </div>
  );

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
            <HeroBanner
              {...(heroData ?? {})}
              onAction={heroData?.onAction ?? (() => navigate('/events'))}
              ctaLabel={heroData?.ctaLabel ?? '공연 찾아보기'}
            />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-white/50">Around You</p>
                <h2 className="text-2xl font-semibold">당신 주변에서 열리는 공연</h2>
              </div>
              <span className="text-xs text-white/40">위치: {currentRegion}</span>
            </div>
            {aroundStatus === 'loading' && (
              <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6">
                <div className="flex gap-4 overflow-hidden pb-4">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={`around-skeleton-${index}`}
                      className="h-[320px] w-[250px] flex-shrink-0 rounded-3xl border border-white/10 bg-white/5 animate-pulse sm:w-[280px]"
                    />
                  ))}
                </div>
              </div>
            )}
            {aroundStatus === 'error' && <StatusBlock message="주변 공연을 불러오지 못했습니다." />}
            {aroundStatus === 'idle' && aroundEvents.length === 0 && <StatusBlock message="주변 공연이 없습니다." />}
            {aroundStatus === 'idle' && aroundEvents.length > 0 && (
              <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6">
                <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {aroundEvents.map((event) => (
                    <EventPosterCard
                      key={`around-${event.id}`}
                      event={mapEventToCard(event)}
                      onClick={() => navigate(`/events/${event.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-white/50">Upcoming</p>
                <h2 className="text-2xl font-semibold">다가오는 공연</h2>
              </div>
              <span className="text-xs text-white/40">{upcomingEvents.length}개 일정</span>
            </div>
            {upcomingStatus === 'loading' && (
              <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6">
                <div className="flex gap-4 overflow-hidden pb-4">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={`upcoming-skeleton-${index}`}
                      className="h-[220px] w-[280px] flex-shrink-0 rounded-3xl border border-white/10 bg-white/5 animate-pulse sm:w-[320px]"
                    />
                  ))}
                </div>
              </div>
            )}
            {upcomingStatus === 'error' && <StatusBlock message="다가오는 공연을 불러오지 못했습니다." />}
            {upcomingStatus === 'idle' && upcomingEvents.length === 0 && <StatusBlock message="예정된 공연이 없습니다." />}
            {upcomingStatus === 'idle' && upcomingEvents.length > 0 && (
              <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6">
                <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {upcomingEvents.map((event) => (
                    <UpcomingEventCard
                      key={`upcoming-${event.id}`}
                      event={mapEventToCard(event)}
                      onClick={() => navigate(`/events/${event.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
