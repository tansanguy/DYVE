// src/api/client.ts
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("⚠️ REACT_APP_API_BASE_URL 가 설정되지 않았습니다.");
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // 백엔드에서 쿠키/세션 쓸 일 있으면 true
  // withCredentials: true,
});
