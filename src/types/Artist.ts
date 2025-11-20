export interface Artist {
  id: number;
  name: string;
  genre?: string | null;
  bio?: string | null;
  region?: string | null;
  instagram?: string | null;
  portfolio_url?: string | null;
  image_url: string;
  // 한국어 주석: avatar_url 등의 커스텀 필드는 모두 image_url에 통합해 FE 이미지 버그를 근본적으로 막는다.
}
