import { EventSummary } from '../types/Event';
import { apiClient } from './client';

export type EventPreview = EventSummary;

export interface AroundYouResponse {
  region: string;
  events: EventPreview[];
}

export interface AroundYouParams {
  lat: number;
  lng: number;
  region?: string;
}

export async function getAroundYou(params: AroundYouParams): Promise<AroundYouResponse> {
  const response = await apiClient.get<AroundYouResponse>('/api/home/around-you/', { params });
  return response.data;
}

export async function getUpcomingEvents() {
  const response = await apiClient.get<EventPreview[]>('/api/home/upcoming/');
  return response.data;
}
