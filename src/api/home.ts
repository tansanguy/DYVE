import { apiClient } from './client';

export interface EventPreview {
  id: number;
  title: string;
  description: string;
  genre: string;
  region: string;
  date: string;
  time: string;
  venue_name: string;
  address: string;
  price: number;
  is_free: boolean;
  entry_type: string;
  image_url: string;
  allow_dyve_reservation: boolean;
  advertise: boolean;
  space: number;
  artists: number[];
  created_at: string;
  updated_at: string;
}

export interface AroundYouResponse {
  region: string;
  events: EventPreview[];
}

export interface HomeBanner {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
}

export async function getAroundYouEvents(params: {
  lat: number;
  lng: number;
  region?: string;
}): Promise<AroundYouResponse> {
  const response = await apiClient.get<AroundYouResponse>('/api/home/around-you/', {
    params,
  });
  return response.data;
}

export async function getHomeBanner() {
  const response = await apiClient.get<HomeBanner[]>('/api/home/banner/');
  return response.data;
}

export async function getUpcomingEvents() {
  const response = await apiClient.get<EventPreview[]>('/api/home/upcoming/');
  return response.data;
}
