'use client';

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '@/domains/auth/api/authApi';
import { signupApi } from '@/domains/auth/api/signupApi';
import { SignupForm } from '@/domains/auth/types/auth';
import { EmailVerificationParams, ResendEmailForm } from '@/domains/auth/types/auth';
import { userApi } from '@/domains/user/api/userApi'
import { signupKeys } from '@/domains/auth/constants/signupQueryKeys';

// 회원가입 Mutation
export const useSignup = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: SignupForm) => signupApi.register(data),
    onSuccess: (_, variables) => {
      // 회원가입 성공 시 완료 페이지로 이동
      const emailParam = encodeURIComponent(variables.email)
      router.push(`/auth/signup/complete?email=${emailParam}`)
    }
  })
}

// 이메일 인증 Mutation
export const useEmailVerification = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (params: EmailVerificationParams) => {
      // 모든 인증 로직을 verify-email API에서 처리
      return await authApi.verifyEmail(params)
    },
    onSuccess: () => {
      // 3초 후 로그인 모달과 함께 홈페이지로 이동
      setTimeout(() => {
        router.push('/?login=true')
      }, 3000)
    }
  })
}

// 인증 메일 재발송 Mutation
export const useResendEmailMutation = () => {
  return useMutation({
    mutationFn: (data: ResendEmailForm) => authApi.resendEmail(data)
  })
}

// 닉네임 중복확인 Mutation
export const useNicknameCheckMutation = () => {
  return useMutation({
    mutationKey: signupKeys.nicknameCheck(),
    mutationFn: (nickname: string) => userApi.checkNicknameDuplicate(nickname)
  })
}

// 이메일 중복확인 Mutation
export const useEmailCheckMutation = () => {
  return useMutation({
    mutationKey: signupKeys.emailCheck(),
    mutationFn: (email: string) => userApi.checkEmailDuplicate(email)
  })
}