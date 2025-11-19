import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AroundYouResponse,
  EventPreview,
  HomeBanner,
  getAroundYouEvents,
  getHomeBanner,
  getUpcomingEvents,
} from '../api/home';

const DEFAULT_LOCATION = {
  lat: 37.5665,
  lng: 126.978,
  region: '서울',
};

export default function Home() {
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [aroundYouEvents, setAroundYouEvents] = useState<EventPreview[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventPreview[]>([]);

  const [bannerLoading, setBannerLoading] = useState(true);
  const [aroundLoading, setAroundLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(true);

  const [bannerError, setBannerError] = useState<string | null>(null);
  const [aroundError, setAroundError] = useState<string | null>(null);
  const [upcomingError, setUpcomingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getHomeBanner();
        setBanners(data);
      } catch (error) {
        console.error('배너 데이터를 불러오는 중 오류 발생', error);
        setBannerError('배너 정보를 불러오지 못했습니다.');
        alert('배너 정보를 불러오지 못했습니다.');
      } finally {
        setBannerLoading(false);
      }
    };

    const fetchAroundYou = async () => {
      try {
        const data: AroundYouResponse = await getAroundYouEvents({
          lat: DEFAULT_LOCATION.lat,
          lng: DEFAULT_LOCATION.lng,
          region: DEFAULT_LOCATION.region,
        });
        setAroundYouEvents(data.events || []);
      } catch (error) {
        console.error('내 주변 공연 데이터를 불러오는 중 오류 발생', error);
        setAroundError('내 주변 공연을 불러오지 못했습니다.');
        alert('내 주변 공연을 불러오지 못했습니다.');
      } finally {
        setAroundLoading(false);
      }
    };

    const fetchUpcoming = async () => {
      try {
        const data = await getUpcomingEvents();
        setUpcomingEvents(data);
      } catch (error) {
        console.error('다가오는 공연 데이터를 불러오는 중 오류 발생', error);
        setUpcomingError('다가오는 공연을 불러오지 못했습니다.');
        alert('다가오는 공연을 불러오지 못했습니다.');
      } finally {
        setUpcomingLoading(false);
      }
    };

    fetchBanners();
    fetchAroundYou();
    fetchUpcoming();
  }, []);

  const renderEventCard = (event: EventPreview) => (
    <Link
      key={event.id}
      to={`/event/${event.id}`}
      className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-white/30"
    >
      <div className="h-48 w-full overflow-hidden bg-black/40">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/60">
            이미지 준비 중
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 text-white">
        <p className="text-xs uppercase tracking-wide text-white/60">{event.genre}</p>
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <p className="line-clamp-2 text-sm text-white/70">{event.description}</p>
        <div className="mt-auto text-sm text-white/80">
          <p>
            {event.date} · {event.time}
          </p>
          <p className="text-white/60">{event.region} · {event.venue_name}</p>
          <p className="font-medium">
            {event.is_free ? '무료' : `${event.price.toLocaleString()}원`}
          </p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-white/60">DYVE</p>
          <h1 className="text-3xl font-bold md:text-4xl">당신 근처의 공연을 발견하세요</h1>
        </header>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">추천 배너</h2>
            <span className="text-sm text-white/60">Carousel Preview</span>
          </div>
          {bannerLoading ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
              배너를 불러오는 중입니다...
            </div>
          ) : bannerError ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-center text-red-200">
              {bannerError}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/10 to-white/5 p-6"
                >
                  <p className="text-xs uppercase text-white/60">Banner #{banner.id}</p>
                  <h3 className="mt-2 text-xl font-semibold">{banner.title}</h3>
                  {banner.description && (
                    <p className="mt-2 text-sm text-white/70">{banner.description}</p>
                  )}
                  {banner.image_url && (
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="mt-4 h-40 w-full rounded-xl object-cover"
                    />
                  )}
                </div>
              ))}
              {banners.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
                  표시할 배너가 없습니다.
                </div>
              )}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">내 주변 공연</h2>
            <span className="text-sm text-white/60">위치: {DEFAULT_LOCATION.region}</span>
          </div>
          {aroundLoading ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
              주변 공연을 불러오는 중입니다...
            </div>
          ) : aroundError ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-center text-red-200">
              {aroundError}
            </div>
          ) : aroundYouEvents.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
              주변 공연이 없습니다.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {(aroundYouEvents ?? []).slice(0, 3).map((event) => renderEventCard(event))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">다가오는 공연</h2>
          {upcomingLoading ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
              다가오는 공연을 불러오는 중입니다...
            </div>
          ) : upcomingError ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-center text-red-200">
              {upcomingError}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
              예정된 공연이 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Link
                  key={`upcoming-${event.id}`}
                  to={`/event/${event.id}`}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/30 md:flex-row md:items-center"
                >
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide text-white/60">{event.region}</p>
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <p className="text-sm text-white/70">{event.description}</p>
                  </div>
                  <div className="text-right text-sm text-white/80">
                    <p>
                      {event.date} · {event.time}
                    </p>
                    <p className="text-white/60">{event.venue_name}</p>
                    <p className="font-medium">
                      {event.is_free ? '무료' : `${event.price.toLocaleString()}원`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
