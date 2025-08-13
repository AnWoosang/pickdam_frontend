"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, X } from "lucide-react";
import { Button } from "../common/button";
import { ConfirmDialog } from "../common/confirmDialog";
import { LoginFormData, SocialProvider } from "@/types/auth";
import { useAuth } from "@/features/login/hooks/useAuth";
import { validateEmail, validatePassword } from "@/utils/validation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, loginWithSocialProvider, error: authError, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // 입력 시 해당 필드 에러 메시지 초기화
    if (name === 'email' && emailError) {
      setEmailError('');
    }
    if (name === 'password' && passwordError) {
      setPasswordError('');
    }
  };

  const validateForm = (): boolean => {
    // 에러 초기화
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    // 이메일 검증
    if (!formData.email.trim()) {
      setEmailError('이메일을 입력해주세요.');
      hasError = true;
    } else {
      const emailValidationError = validateEmail(formData.email);
      if (emailValidationError) {
        setEmailError(emailValidationError);
        hasError = true;
      }
    }

    // 비밀번호 검증
    if (!formData.password.trim()) {
      setPasswordError('비밀번호를 입력해주세요.');
      hasError = true;
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        setPasswordError(passwordValidation.errors[0]);
        hasError = true;
      }
    }

    return !hasError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      onClose(); // 로그인 성공 시 모달 닫기
    } catch (err) {
      // "Failed to fetch" 또는 기타 에러를 일관된 메시지로 변경
      setShowErrorDialog(true);
    }
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    setEmailError('');
    setPasswordError('');
    
    try {
      await loginWithSocialProvider(provider);
      onClose(); // 로그인 성공 시 모달 닫기
    } catch (err) {
      setShowErrorDialog(true);
    }
  };

  const handleSignupClick = () => {
    onClose();
    // 회원가입 페이지로 이동은 Link가 처리
  };

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
        style={{ maxWidth: "400px", minHeight: "580px" }}
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
          <div className="text-2xl font-bold text-primary">Pickdam</div>
        </div>


        {/* Email & Password Fields */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={authLoading}
              className={`w-full h-13 px-4 border-[1px] rounded-lg focus:outline-none text-base placeholder:text-hintText text-black ${
                emailError
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-black"
              }`}
              placeholder="이메일을 입력해 주세요."
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1 ml-1">{emailError}</p>
            )}
          </div>

          <div className="mb-3">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={authLoading}
                className={`w-full h-13 px-4 pr-12 border-[1px] rounded-lg focus:outline-none text-base placeholder:text-hintText text-black ${
                  passwordError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-black"
                }`}
                placeholder="비밀번호를 입력해 주세요."
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1 ml-1">{passwordError}</p>
            )}
          </div>

          <Button
            variant="primary"
            type="submit"
            disabled={authLoading}
            className="w-full h-13 mt-1 mb-8"
          >
            {authLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        {/* 로그인 유지 & 아이디/비밀번호 찾기 */}
        <div className="flex items-center justify-between mb-10">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="accent-primary w-4 h-4 rounded border-gray-300 text-gray"
            />
            <span className="text-gray text-sm font-medium">로그인 유지</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-gray hover:underline cursor-pointer"
            onClick={onClose}
          >
            아이디/비밀번호 찾기
          </Link>
        </div>

        {/* SNS Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-3 text-xs text-gray-400 font-medium whitespace-nowrap">
            SNS 간편 로그인
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* SNS Login Buttons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {/* 카카오 로그인 */}
          <button
            onClick={() => handleSocialLogin('kakao')}
            disabled={authLoading}
            className="w-12 h-12 rounded-full bg-[#FEE500] flex items-center justify-center hover:bg-[#FFEB3B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-black text-sm font-bold">K</span>
          </button>

          {/* 네이버 로그인 */}
          <button
            onClick={() => handleSocialLogin('naver')}
            disabled={authLoading}
            className="w-12 h-12 rounded-full bg-[#03C75A] flex items-center justify-center hover:bg-[#00B050] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-white text-sm font-bold">N</span>
          </button>

          {/* 구글 로그인 */}
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={authLoading}
            className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>

          {/* 페이스북 로그인 */}
          <button
            onClick={() => handleSocialLogin('facebook')}
            disabled={authLoading}
            className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center hover:bg-[#166FE5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-white text-sm font-bold">f</span>
          </button>
        </div>

        {/* 회원가입 안내 */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-gray-400">아직 회원이 아니신가요?</span>
          <Link
            href="/signup"
            className="text-black font-bold hover:underline cursor-pointer"
            onClick={handleSignupClick}
          >
            회원가입
          </Link>
        </div>
      </div>

      {/* 로그인 실패 경고 다이얼로그 */}
      <ConfirmDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        onConfirm={() => setShowErrorDialog(false)}
        message={`로그인에 실패하였습니다.
아이디와 비밀번호를 확인해주세요.`}
        confirmText="확인"
        cancelText="닫기"
        confirmButtonColor="red"
        width="w-80"
      />
    </div>
  );
}