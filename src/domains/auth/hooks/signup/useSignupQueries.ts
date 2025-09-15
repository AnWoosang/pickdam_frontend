'use client';

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '@/domains/auth/api/authApi';
import { signupApi } from '@/domains/auth/api/signupApi';
import { SignupForm } from '@/domains/auth/types/signup';
import { EmailVerificationParams } from '@/domains/auth/types/auth';
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
    },
    onError: (error) => {
      // Interceptor에서 이미 사용자 친화적 메시지로 변환됨
      console.error('Signup failed:', error.message)
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
    },
    onError: (error) => {
      console.error('💥 인증 처리 에러:', error)
    }
  })
}

// 인증 메일 재발송 Mutation
export const useResendEmailMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; type?: 'signup' | 'reset' }) => 
      authApi.resendEmail(data),
    onError: (error) => {
      console.error('이메일 재발송 실패:', error)
    }
  })
}

// 닉네임 중복확인 Mutation
export const useNicknameCheckMutation = () => {
  return useMutation({
    mutationKey: signupKeys.nicknameCheck(),
    mutationFn: (nickname: string) => userApi.checkNicknameDuplicate(nickname),
    onError: (error) => {
      console.error('닉네임 중복확인 실패:', error)
    }
  })
}

// 이메일 중복확인 Mutation
export const useEmailCheckMutation = () => {
  return useMutation({
    mutationKey: signupKeys.emailCheck(),
    mutationFn: (email: string) => userApi.checkEmailDuplicate(email),
    onError: (error) => {
      console.error('이메일 중복확인 실패:', error)
    }
  })
}