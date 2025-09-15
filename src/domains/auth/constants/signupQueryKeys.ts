// Query Keys for Signup related queries
export const signupKeys = {
  all: ['signup'] as const,
  verification: () => [...signupKeys.all, 'verification'] as const,
  nicknameCheck: () => [...signupKeys.all, 'nickname-check'] as const,
  emailCheck: () => [...signupKeys.all, 'email-check'] as const,
} as const;