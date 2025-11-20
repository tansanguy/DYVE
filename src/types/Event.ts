// 한국어 주석: 이벤트 관련 타입을 한곳에서 관리해야 각 화면(API) 결합 시 타입 불일치를 막을 수 있다.
export interface EventSummary {
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
  price_min?: number | null;
  price_max?: number | null;
  is_free: boolean;
  entry_type: string;
  image_url: string;
  allow_dyve_reservation: boolean;
  advertise: boolean;
  space: number;
  artists: number[];
  created_at: string;
  updated_at: string;
  total_seats?: number;
  seat_rows?: number;
  seat_cols?: number;
}

export type EventDetail = EventSummary & {
  lineup?: string[] | null;
  tags?: string[] | null;
};

export interface CreateEventPayload {
  title: string;
  description?: string;
  genre?: string;
  date: string;
  time: string;
  venue_name: string;
  address?: string;
  region?: string;
  price?: number;
  price_min?: number | null;
  price_max?: number | null;
  is_free?: boolean;
  entry_type?: string;
  total_seats?: number;
  seat_rows?: number;
  seat_cols?: number;
  allow_dyve_reservation?: boolean;
}
