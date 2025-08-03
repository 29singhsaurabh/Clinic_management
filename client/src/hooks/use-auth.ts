import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
  };
}
