'use client';

import React, { useState } from 'react';
import { AlertCircle, User } from 'lucide-react';
import { GENDER_LABELS } from '@/domains/user/types/user';
import { Button } from '@/shared/components/Button';
import { useUIStore } from '@/domains/auth/store/authStore';
import { TermsModal } from '@/shared/components/TermsModal';
import { TERMS_DATA, TermsType } from '@/shared/constants/terms';
import { useSignupForm } from '../../hooks/signup/useSignupForm';
import { FormField } from '@/shared/components/FormField';
import { NicknameField } from '../form/NicknameField';
import { EmailField } from '../form/EmailField';
import { PasswordField } from '../form/PasswordField';
import { TermsAgreement } from '../form/TermsAgreement';

interface SignupPageProps {
  className?: string;
}

export function SignupPage({ className = '' }: SignupPageProps) {
  const {
    formData,
    generalError,
    status,
    handleInputChange,
    handleSubmit,
    handleAllAgree,
    handleNicknameValidChange,
    handleEmailValidChange,
  } = useSignupForm();

  // UI 상태 관리 (UI 로직)
  const { openLoginModal } = useUIStore();
  const [activeTermsModal, setActiveTermsModal] = useState<TermsType | null>(null);

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="bg-white rounded-lg">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-600">픽담과 함께 최저가 쇼핑을 시작해보세요</p>
        </div>

        {/* 전체 에러 메시지 */}
        {generalError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-600">{generalError}</p>
          </div>
        )}

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 입력 */}
          <FormField 
            label="이름" 
            icon={<User className="w-4 h-4" />} 
            required 
            error={generalError && generalError.includes('이름') ? generalError : undefined}
          >
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
                           generalError && generalError.includes('이름') ? 'border-red-300' : 'border-gray-300'
                         }`}
              placeholder="실명을 입력하세요"
            />
          </FormField>

          {/* 닉네임 입력 */}
          <NicknameField
            value={formData.nickname}
            onChange={handleInputChange}
            onValidChange={handleNicknameValidChange}
            disabled={status === 'submitting'}
          />

          {/* 생년월일 입력 */}
          <FormField label="생년월일" required error={generalError && generalError.includes('생년월일') ? generalError : undefined}>
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
                           generalError && generalError.includes('생년월일') ? 'border-red-300' : 'border-gray-300'
                         }`}
            />
          </FormField>

          {/* 성별 선택 */}
          <FormField label="성별" required>
            <div className="flex space-x-4">
              {Object.entries(GENDER_LABELS).map(([value, label]) => (
                <label key={value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={value}
                    checked={formData.gender === value}
                    onChange={handleInputChange}
                    disabled={status === 'submitting'}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700 cursor-pointer">{label}</span>
                </label>
              ))}
            </div>
          </FormField>

          {/* 이메일 입력 */}
          <EmailField
            value={formData.email}
            onChange={handleInputChange}
            onValidChange={handleEmailValidChange}
            disabled={status === 'submitting'}
          />

          {/* 비밀번호 입력 */}
          <PasswordField
            value={formData.password}
            onChange={handleInputChange}
            error={generalError && generalError.includes('비밀번호') ? generalError : undefined}
            disabled={status === 'submitting'}
            showStrength={true}
          />

          {/* 비밀번호 확인 입력 */}
          <PasswordField
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={generalError && generalError.includes('비밀번호 확인') ? generalError : undefined}
            disabled={status === 'submitting'}
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력하세요"
            name="confirmPassword"
            id="confirmPassword"
          />

          {/* 약관 동의 */}
          <TermsAgreement
            termsAccepted={formData.termsAccepted}
            privacyAccepted={formData.privacyAccepted}
            marketingAccepted={formData.marketingAccepted}
            onInputChange={handleInputChange}
            onAllAgree={handleAllAgree}
            onShowTerms={setActiveTermsModal}
            errors={{ 
              termsAccepted: generalError && generalError.includes('이용약관') ? generalError : '', 
              privacyAccepted: generalError && generalError.includes('개인정보') ? generalError : ''
            }}
            disabled={status === 'submitting'}
          />

          {/* 회원가입 버튼 */}
          <Button
            type="submit"
            variant="primary"
            size="medium"
            disabled={status === 'submitting'}
            className="w-full"
          >
            {status === 'submitting' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                처리 중...
              </>
            ) : (
              '회원가입'
            )}
          </Button>
        </form>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Button
              type="button"
              variant="ghost"
              size="small"
              onClick={openLoginModal}
              className="font-medium text-primary hover:underline p-0 h-auto"
            >
              로그인
            </Button>
          </p>
        </div>
      </div>
      
      {/* 약관 모달 */}
      {activeTermsModal && (
        <TermsModal
          isOpen={true}
          onClose={() => setActiveTermsModal(null)}
          terms={TERMS_DATA[activeTermsModal]}
        />
      )}
      
    </div>
  );
}