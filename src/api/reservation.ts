import { apiClient } from './client';

export interface ReservationPayload {
  event: number;
  quantity: number;
  seat: string;
}

export interface ReservationResponse {
  id: number;
  user: number;
  event: number;
  quantity: number;
  seat: string;
  entry_type: string;
  price: number;
  qr_code: string;
  reservation_code: string;
  created_at: string;
  updated_at: string;
}

// 한국어 주석: 좌석 지정이 없는 빠른 예매 버튼에서도 재사용하려고 seat 필드를 선택값으로 둔다.
export async function createReservation(payload: ReservationPayload) {
  const response = await apiClient.post<ReservationResponse>('/api/reservations/', payload);
  return response.data;
}
