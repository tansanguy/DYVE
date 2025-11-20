export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface FakeLoginResponse {
  message: string;
  user: AuthUser;
  csrf_token?: string;
}
