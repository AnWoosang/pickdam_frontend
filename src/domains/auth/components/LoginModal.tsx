"use client";

import React, { useCallback, useReducer } from "react";
import { X } from "lucide-react";
import { Logo } from "@/shared/components/Logo";
import { useLoginModal } from "../hooks/useLoginModal";
import { LoginForm } from "./login/LoginForm";
import { RememberMeSection } from "./login/RememberMeSection";
import { SocialLoginButtons } from "./login/SocialLoginButtons";
import { SignupPrompt } from "./login/SignupPrompt";
import { LoginDialogs } from "./login/LoginDialogs";

// 모달 스타일 상수
const MODAL_STYLES = {
  maxWidth: "400px",
  minHeight: "580px"
} as const;

// Dialog 상태 타입 정의
interface DialogState {
  showErrorDialog: boolean;
  showResendDialog: boolean;
  showSuccessDialog: boolean;
  successMessage: string;
  unverifiedEmail: string;
  errorMessage: string;
}

// Dialog 액션 타입 정의
type DialogAction =
  | { type: 'SHOW_ERROR'; message: string }
  | { type: 'SHOW_RESEND'; email: string }
  | { type: 'SHOW_SUCCESS'; message: string }
  | { type: 'CLOSE_ERROR' }
  | { type: 'CLOSE_RESEND' }
  | { type: 'CLOSE_SUCCESS' }
  | { type: 'RESET_ALL' };

// 초기 상태
const initialDialogState: DialogState = {
  showErrorDialog: false,
  showResendDialog: false,
  showSuccessDialog: false,
  successMessage: '',
  unverifiedEmail: '',
  errorMessage: ''
};

// 리듀서 함수
function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case 'SHOW_ERROR':
      return {
        ...state,
        showErrorDialog: true,
        errorMessage: action.message,
        showResendDialog: false,
        showSuccessDialog: false
      };
    case 'SHOW_RESEND':
      return {
        ...state,
        showResendDialog: true,
        unverifiedEmail: action.email,
        showErrorDialog: false,
        showSuccessDialog: false
      };
    case 'SHOW_SUCCESS':
      return {
        ...state,
        showSuccessDialog: true,
        successMessage: action.message,
        showErrorDialog: false,
        showResendDialog: false
      };
    case 'CLOSE_ERROR':
      return {
        ...state,
        showErrorDialog: false,
        errorMessage: ''
      };
    case 'CLOSE_RESEND':
      return {
        ...state,
        showResendDialog: false,
        unverifiedEmail: ''
      };
    case 'CLOSE_SUCCESS':
      return {
        ...state,
        showSuccessDialog: false,
        successMessage: ''
      };
    case 'RESET_ALL':
      return initialDialogState;
    default:
      return state;
  }
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const {
    // Loading states
    isLoading,
    isResending,
    
    // Actions
    handleLogin,
    handleResendEmail,
  } = useLoginModal();

  // UI Dialog state (useReducer로 통합 관리)
  const [dialogState, dispatch] = useReducer(dialogReducer, initialDialogState);

  // 로그인 핸들러
  const handleLoginSubmit = useCallback(async (formData: { email: string; password: string }) => {
    const result = await handleLogin(formData);
    
    if (result.success) {
      onClose(); // 로그인 성공 시 모달 닫기
    } else if (result.error) {
      if (result.error.code === 'EMAIL_NOT_VERIFIED' && result.error.email) {
        // 이메일 미인증 에러
        dispatch({ type: 'SHOW_RESEND', email: result.error.email });
      } else {
        // 일반적인 로그인 실패
        dispatch({ type: 'SHOW_ERROR', message: result.error.message });
      }
    }
  }, [handleLogin, onClose]);

  // 재전송 확인 핸들러
  const handleResendConfirm = useCallback(async () => {
    dispatch({ type: 'CLOSE_RESEND' });
    const result = await handleResendEmail(dialogState.unverifiedEmail);
    
    if (result.success) {
      dispatch({ type: 'SHOW_SUCCESS', message: result.message });
    } else {
      dispatch({ type: 'SHOW_ERROR', message: result.message });
    }
  }, [handleResendEmail, dialogState.unverifiedEmail]);

  // 재전송 취소 핸들러
  const handleResendCancel = useCallback(() => {
    dispatch({ type: 'CLOSE_RESEND' });
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={(e) => {
        // 모달 외부 클릭 시 닫기
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full px-8 py-12 relative"
        style={MODAL_STYLES}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 전파 중단
      >
        {/* Header: Logo + Close */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
          onClick={onClose}
          aria-label="닫기"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex justify-center mb-10">
          <Logo size="medium" />
        </div>


        {/* Email & Password Form */}
        <LoginForm
          isLoading={isLoading}
          onSubmit={handleLoginSubmit}
        />

        {/* Remember Me Section */}
        <RememberMeSection
          onClose={onClose}
        />

        {/* Social Login */}
        <SocialLoginButtons isLoading={isLoading} />

        {/* Signup Prompt */}
        <SignupPrompt onClose={onClose} />
      </div>

      {/* Login Dialogs */}
      <LoginDialogs
        showErrorDialog={dialogState.showErrorDialog}
        errorMessage={dialogState.errorMessage}
        onCloseErrorDialog={() => dispatch({ type: 'CLOSE_ERROR' })}
        showResendDialog={dialogState.showResendDialog}
        unverifiedEmail={dialogState.unverifiedEmail}
        isResending={isResending}
        onResendConfirm={handleResendConfirm}
        onResendCancel={handleResendCancel}
        showSuccessDialog={dialogState.showSuccessDialog}
        successMessage={dialogState.successMessage}
        onCloseSuccessDialog={() => dispatch({ type: 'CLOSE_SUCCESS' })}
      />
    </div>
  );
}