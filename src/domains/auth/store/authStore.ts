'use client';

import { create } from 'zustand';
import toast from 'react-hot-toast';
import { User } from '@/domains/user/types/user';

interface AuthState {
  // 사용자 정보
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // UI 상태
  isLoginModalOpen: boolean;
  
  // 액션들
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  requireAuth: () => boolean;
}

export const authStore = create<AuthState>((set, get) => ({
  // 초기 상태
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isLoginModalOpen: false,
  
  // 액션들
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    error: null 
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  // 로그인 모달
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  
  // 인증 확인
  requireAuth: () => {
    const { isAuthenticated } = get();
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      return false;
    }
    return true;
  },
}));

export const useAuthStore = authStore;

