import type { CreateEventPayload, EventDetail, EventSummary } from '../types/Event';
import { apiClient } from './client';

export interface EventListParams {
  region?: string;
  genre?: string;
  is_free?: boolean;
  allow_dyve_reservation?: boolean;
}

export async function getEvents(params?: EventListParams) {
  const response = await apiClient.get<EventSummary[]>('/api/events/', { params });
  return response.data;
}

export async function getEventDetail(eventId: number) {
  const response = await apiClient.get<EventDetail>(`/api/events/${eventId}/`);
  return response.data;
}

// 한국어 주석: 백엔드 스펙에 맞춰 JSON 본문으로 공연을 생성한다.
export async function createEvent(payload: CreateEventPayload) {
  const response = await apiClient.post<EventDetail>('/api/events/', payload);
  return response.data;
}

export type { EventDetail, EventSummary } from '../types/Event';
