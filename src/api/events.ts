import { apiClient } from './client';
import { EventPreview } from './home';

export type EventDetail = EventPreview;

export async function getEventDetail(eventId: number) {
  const response = await apiClient.get<EventDetail>(`/api/events/${eventId}/`);
  return response.data;
}
