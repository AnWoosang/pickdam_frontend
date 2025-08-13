'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle, AlertCircle, User, Mail, Lock } from 'lucide-react';
import { SignupFormData, PasswordStrength, SignupStatus } from '@/types/signup';
import { checkPasswordStrength } from '@/constants/signup-mock-data';
import { validateEmail, validatePassword, validatePasswordConfirm } from '@/utils/validation';

interface SignupPageProps {
  className?: string;
}

export function SignupPage({ className = '' }: SignupPageProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    birthDate: '',
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SignupStatus>('idle');
  const [currentStep, setCurrentStep] = useState(1);

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
    } else if (!/^[가-힣a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = '이름은 한글 또는 영문만 입력 가능합니다.';
    }

    // 이메일 검증
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        newErrors.email = emailError;
      }
    }

    // 비밀번호 검증
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors.join(', ');
      }
    }

    // 비밀번호 확인 검증
    const confirmPasswordError = validatePasswordConfirm(formData.password, formData.confirmPassword);
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }


    // 생년월일 검증 (선택사항이지만 입력 시 검증)
    if (formData.birthDate) {
      const birthYear = new Date(formData.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      if (currentYear - birthYear < 19) {
        newErrors.birthDate = '만 19세 이상만 가입 가능합니다.';
      }
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

    setStatus('submitting');

    try {
      // Mock API 호출 (실제로는 서버 API 호출)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 성공 시
      setStatus('success');
      
      // 성공 페이지로 이동 또는 로그인 페이지로 이동
      setTimeout(() => {
        router.push('/login?signup=success');
      }, 1500);
      
    } catch (err) {
      setStatus('error');
      setErrors({ 
        general: err instanceof Error ? err.message : '회원가입에 실패했습니다.' 
      });
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

  const passwordStrength: PasswordStrength = checkPasswordStrength(formData.password);

  if (status === 'success') {
    return (
      <div className={`max-w-md mx-auto ${className}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">회원가입 완료!</h1>
            <p className="text-gray-600">픽담에 오신 것을 환영합니다.</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              로그인 페이지로 이동 중입니다...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-600">픽담과 함께 시작해보세요</p>
        </div>

        {/* 진행 상태 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary">회원정보 입력</span>
            <span className="text-sm text-gray-500">1 / 1</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* 전체 에러 메시지 */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 입력 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={status === 'submitting'}
              className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                         disabled:bg-gray-50 disabled:text-gray-500 ${
                           errors.name ? 'border-red-300' : 'border-gray-300'
                         }`}
              placeholder="실명을 입력하세요"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* 이메일 입력 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={status === 'submitting'}
              className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                         disabled:bg-gray-50 disabled:text-gray-500 ${
                           errors.email ? 'border-red-300' : 'border-gray-300'
                         }`}
              placeholder="이메일을 입력하세요"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>


          {/* 생년월일 입력 (선택) */}
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
              생년월일 (선택)
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              disabled={status === 'submitting'}
              max={new Date(new Date().getFullYear() - 19, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                         disabled:bg-gray-50 disabled:text-gray-500 ${
                           errors.birthDate ? 'border-red-300' : 'border-gray-300'
                         }`}
            />
            {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={status === 'submitting'}
                className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                           disabled:bg-gray-50 disabled:text-gray-500 ${
                             errors.password ? 'border-red-300' : 'border-gray-300'
                           }`}
                placeholder="영문, 숫자 포함 8자 이상"
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
                        level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600">
                  {passwordStrength.text && `강도: ${passwordStrength.text}`}
                  {passwordStrength.requirements.length > 0 && 
                    ` (${passwordStrength.requirements.join(', ')} 포함)`
                  }
                </p>
              </div>
            )}
            
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* 비밀번호 확인 입력 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={status === 'submitting'}
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
                  disabled={status === 'submitting'}
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
                    disabled={status === 'submitting'}
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
                    disabled={status === 'submitting'}
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
                    disabled={status === 'submitting'}
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
            disabled={status === 'submitting'}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md 
                       shadow-sm text-sm font-medium text-white bg-primary 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'submitting' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                가입 중...
              </>
            ) : (
              '회원가입'
            )}
          </button>
        </form>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link 
              href="/login" 
              className="font-medium text-primary transition-colors"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}