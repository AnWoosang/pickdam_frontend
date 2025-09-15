'use client';

import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/domains/user/api/userApi'
import { userKeys } from '@/domains/user/constants/userQueryKeys'

// 닉네임 중복 확인 (캐싱 비활성화)
export const useNicknameCheck = (nickname: string) => {
  return useQuery({
    queryKey: userKeys.nicknameCheck(nickname),
    queryFn: () => userApi.checkNicknameDuplicate(nickname),
    enabled: !!nickname && nickname.length >= 2,
    staleTime: 0, // 캐싱 비활성화
    gcTime: 0, // 가비지 컬렉션 즉시 실행
    refetchOnWindowFocus: false,
    retry: false
  })
}

// 이메일 중복 확인 (캐싱 비활성화)
export const useEmailCheck = (email: string) => {
  return useQuery({
    queryKey: userKeys.emailCheck(email),
    queryFn: () => userApi.checkEmailDuplicate(email),
    enabled: !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    staleTime: 0, // 캐싱 비활성화
    gcTime: 0, // 가비지 컬렉션 즉시 실행
    refetchOnWindowFocus: false,
    retry: false
  })
}


