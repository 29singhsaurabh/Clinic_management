import { apiRequest } from "@/lib/queryClient";

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials) {
  const response = await apiRequest("POST", "/api/auth/login", credentials);
  return response.json();
}

export async function logout() {
  await apiRequest("POST", "/api/auth/logout");
}
