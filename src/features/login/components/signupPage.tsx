'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { SignupFormData } from '@/types/auth';
import { useAuth } from '../hooks/useAuth';

interface SignupPageProps {
  className?: string;
}

export function SignupPage({ className = '' }: SignupPageProps) {
  const { register, error: authError, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // 입력 시 해당 필드 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다.';
    }

    // 이메일 검증
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '비밀번호는 영문자와 숫자를 포함해야 합니다.';
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 약관 동의 검증
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = '이용약관에 동의해주세요.';
    }
    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = '개인정보 처리방침에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : '회원가입에 실패했습니다.' });
    }
  };

  const handleAllAgree = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      termsAccepted: checked,
      privacyAccepted: checked,
      marketingAccepted: checked,
    }));
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, text: '' };
    
    let strength = 0;
    const requirements = [];

    if (password.length >= 8) {
      strength++;
      requirements.push('8자 이상');
    }
    if (/[a-zA-Z]/.test(password)) {
      strength++;
      requirements.push('영문자');
    }
    if (/\d/.test(password)) {
      strength++;
      requirements.push('숫자');
    }
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength++;
      requirements.push('특수문자');
    }

    const colors = ['bg-red-200', 'bg-yellow-200', 'bg-blue-200', 'bg-green-200'];
    const texts = ['매우 약함', '약함', '보통', '강함'];

    return {
      strength,
      text: texts[strength - 1] || '',
      color: colors[strength - 1] || 'bg-gray-200',
      requirements
    };
  };

  const strengthInfo = passwordStrength();

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-600">픽담 계정을 만들어보세요</p>
        </div>

        {/* 전체 에러 메시지 */}
        {(errors.general || authError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.general || authError}</p>
          </div>
        )}

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 입력 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={authLoading}
              className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                         disabled:bg-gray-50 disabled:text-gray-500 ${
                           errors.name ? 'border-red-300' : 'border-gray-300'
                         }`}
              placeholder="이름을 입력하세요"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* 이메일 입력 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={authLoading}
              className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                         disabled:bg-gray-50 disabled:text-gray-500 ${
                           errors.email ? 'border-red-300' : 'border-gray-300'
                         }`}
              placeholder="이메일을 입력하세요"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={authLoading}
                className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                           disabled:bg-gray-50 disabled:text-gray-500 ${
                             errors.password ? 'border-red-300' : 'border-gray-300'
                           }`}
                placeholder="비밀번호를 입력하세요"
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
            
            {/* 비밀번호 강도 표시 */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex space-x-1 mb-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 w-1/4 rounded ${
                        level <= strengthInfo.strength ? strengthInfo.color : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600">
                  {strengthInfo.text && `강도: ${strengthInfo.text}`}
                  {strengthInfo.requirements && strengthInfo.requirements.length > 0 && 
                    ` (${strengthInfo.requirements.join(', ')} 포함)`
                  }
                </p>
              </div>
            )}
            
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* 비밀번호 확인 입력 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={authLoading}
                className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                           disabled:bg-gray-50 disabled:text-gray-500 ${
                             errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                           }`}
                placeholder="비밀번호를 다시 입력하세요"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          {/* 약관 동의 */}
          <div className="space-y-3 pt-4">
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center">
                <input
                  id="allAgree"
                  type="checkbox"
                  checked={formData.termsAccepted && formData.privacyAccepted && formData.marketingAccepted}
                  onChange={(e) => handleAllAgree(e.target.checked)}
                  disabled={authLoading}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="allAgree" className="ml-2 block text-sm font-medium text-gray-900">
                  전체 동의
                </label>
              </div>
            </div>

            <div className="space-y-2 pl-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="termsAccepted"
                    name="termsAccepted"
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    disabled={authLoading}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
                    이용약관 동의 <span className="text-red-500">*</span>
                  </label>
                </div>
                <Link href="/terms" className="text-sm text-primary underline">
                  보기
                </Link>
              </div>
              {errors.termsAccepted && <p className="text-sm text-red-600">{errors.termsAccepted}</p>}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="privacyAccepted"
                    name="privacyAccepted"
                    type="checkbox"
                    checked={formData.privacyAccepted}
                    onChange={handleInputChange}
                    disabled={authLoading}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="privacyAccepted" className="ml-2 block text-sm text-gray-700">
                    개인정보 처리방침 동의 <span className="text-red-500">*</span>
                  </label>
                </div>
                <Link href="/privacy" className="text-sm text-primary underline">
                  보기
                </Link>
              </div>
              {errors.privacyAccepted && <p className="text-sm text-red-600">{errors.privacyAccepted}</p>}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="marketingAccepted"
                    name="marketingAccepted"
                    type="checkbox"
                    checked={formData.marketingAccepted}
                    onChange={handleInputChange}
                    disabled={authLoading}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="marketingAccepted" className="ml-2 block text-sm text-gray-700">
                    마케팅 정보 수신 동의 (선택)
                  </label>
                </div>
                <Link href="/marketing" className="text-sm text-primary underline">
                  보기
                </Link>
              </div>
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={authLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                       shadow-sm text-sm font-medium text-white bg-primary 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {authLoading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link 
              href="/login" 
              className="font-medium text-primary hover:text-primary-dark"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}