'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEmailVerification } from './useSignupQueries'
import { EmailVerificationParams } from '@/domains/auth/types/auth'

export interface EmailVerificationState {
  status: 'loading' | 'success' | 'error'
  message: string
}

/**
 * 이메일 인증 처리 hook
 * URL 파라미터를 자동으로 파싱하고 인증을 처리합니다.
 */
export function useEmailVerify(): EmailVerificationState {
  const searchParams = useSearchParams()
  const emailVerification = useEmailVerification()

  const [state, setState] = useState<EmailVerificationState>({
    status: 'loading',
    message: '이메일 인증을 처리하고 있습니다...'
  })

  useEffect(() => {
    async function handleEmailVerification() {
      try {
        // URL fragment에서 토큰 정보 파싱 (Supabase implicit flow)
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);

        // Query params에서도 확인 (PKCE flow)
        const tokenHash = searchParams.get('token_hash')
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = searchParams.get('type') || hashParams.get('type') || 'signup'

        // Implicit flow인 경우 (access_token이 있는 경우)
        if (accessToken && refreshToken) {
          setState({
            status: 'success',
            message: '이메일 인증이 완료되었습니다!'
          })
          return;
        }

        // PKCE flow인 경우 (tokenHash가 있는 경우)
        if (!tokenHash) {
          throw new Error('인증 토큰이 없습니다.')
        }

        const params: EmailVerificationParams = { tokenHash, type }
        await emailVerification.mutateAsync(params)

        setState({
          status: 'success',
          message: '이메일 인증이 완료되었습니다!'
        })

      } catch (error) {
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : '이메일 인증에 실패했습니다.'
        })
      }
    }

    handleEmailVerification()
  }, [searchParams, emailVerification])

  return state
}