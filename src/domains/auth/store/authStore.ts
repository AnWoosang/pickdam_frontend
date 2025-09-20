'use client';

import { create } from 'zustand';
import toast from 'react-hot-toast';

interface UIState {
  // UI 상태만 관리
  isLoginModalOpen: boolean;

  // UI 액션들
  openLoginModal: () => void;
  closeLoginModal: () => void;
  requireAuth: () => boolean;
}

export const uiStore = create<UIState>((set, get) => ({
  // 초기 상태
  isLoginModalOpen: false,

  // UI 액션들
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),

  // 인증 확인 (React Query에서 가져온 데이터로 체크)
  requireAuth: () => {
    // 이제 React Query의 useAuth에서 인증 상태 확인
    toast.error('로그인이 필요합니다.');
    set({ isLoginModalOpen: true });
    return false;
  },
}));

export const useUIStore = uiStore;

