// src/api/client.ts
import axios from "axios";

const FALLBACK_BASE_URL = "https://dyve-backend-ui3c.onrender.com";
const ENV_BASE_URL = process.env.REACT_APP_API_BASE_URL?.trim();

if (!ENV_BASE_URL) {
  console.warn(
    "⚠️ REACT_APP_API_BASE_URL 가 설정되지 않았습니다. 기본값을 사용합니다:",
    FALLBACK_BASE_URL,
  );
}

const resolvedBaseURL = ENV_BASE_URL || FALLBACK_BASE_URL;
console.log("🌐 DYVE apiClient baseURL =>", resolvedBaseURL);

const apiClient = axios.create({
  baseURL: resolvedBaseURL,
  // 백엔드에서 쿠키/세션 쓸 일 있으면 true
  // withCredentials: true,
});

export { apiClient };
export default apiClient;
