// Query Keys for Auth related queries
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  login: () => [...authKeys.all, 'login'] as const,
  logout: () => [...authKeys.all, 'logout'] as const,
  refresh: () => [...authKeys.all, 'refresh'] as const,
} as const;