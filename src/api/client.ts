// src/api/client.ts
import axios from 'axios';

const DEFAULT_BASE_URL = 'https://dyve-backend-ui3c.onrender.com';
const envBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  process.env.REACT_APP_API_BASE_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
const resolvedBaseURL = envBaseUrl || DEFAULT_BASE_URL;

// Render 백엔드로 세션 쿠키를 항상 전달하기 위해 전역으로 활성화한다.
axios.defaults.withCredentials = true;

// 한국어 주석: 프론트/백엔드 환경이 바뀌어도 여기만 수정하면 되도록 axios 인스턴스를 단일화한다.
const apiClient = axios.create({
  baseURL: resolvedBaseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// 한국어 주석: 모든 응답에서 data.data 형태를 제거해 FE 사용성이 좋아지도록 인터셉터에서 통일한다.
apiClient.interceptors.response.use(
  (response) => {
    const normalizedData =
      response?.data && typeof response.data === 'object' && 'data' in response.data
        ? (response.data as { data: unknown }).data
        : response.data;
    return { ...response, data: normalizedData };
  },
  (error: { response?: { data?: { message?: string; detail?: string }; status?: number } } & Error) => {
    const fallbackMessage = 'API 요청 중 오류가 발생했습니다.';
    const serverMessage = error.response?.data?.message || error.response?.data?.detail;
    const normalizedMessage = serverMessage || fallbackMessage;
    error.message = normalizedMessage;
    console.error('[DYVE] API Error:', normalizedMessage, error.response);
    return Promise.reject(error);
  },
);

export { apiClient };
export default apiClient;
