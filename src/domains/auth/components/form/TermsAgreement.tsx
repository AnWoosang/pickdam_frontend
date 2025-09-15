'use client';
import React, { useMemo } from 'react';
import { Button } from '@/shared/components/Button';
import { TermsType } from '@/shared/constants/terms';

interface TermsAgreementProps {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted?: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAllAgree: (checked: boolean) => void;
  onShowTerms: (type: TermsType) => void;
  errors: Record<string, string>;
  disabled?: boolean;
}

export function TermsAgreement({
  termsAccepted,
  privacyAccepted,
  marketingAccepted,
  onInputChange,
  onAllAgree,
  onShowTerms,
  errors,
  disabled = false
}: TermsAgreementProps) {
  // 전체 동의 상태를 메모이제이션
  const allAgreed = useMemo(() => 
    termsAccepted && privacyAccepted && (marketingAccepted ?? false), 
    [termsAccepted, privacyAccepted, marketingAccepted]
  );

  // 약관 항목들을 배열로 관리
  const termsItems = useMemo(() => [
    {
      id: 'termsAccepted',
      name: 'termsAccepted',
      checked: termsAccepted,
      label: '이용약관 동의',
      required: true,
      termsType: 'terms' as TermsType,
      error: errors.termsAccepted
    },
    {
      id: 'privacyAccepted',
      name: 'privacyAccepted', 
      checked: privacyAccepted,
      label: '개인정보 처리방침 동의',
      required: true,
      termsType: 'privacy' as TermsType,
      error: errors.privacyAccepted
    },
    {
      id: 'marketingAccepted',
      name: 'marketingAccepted',
      checked: marketingAccepted ?? false,
      label: '마케팅 정보 수신 동의',
      required: false,
      termsType: 'marketing' as TermsType,
      error: undefined
    }
  ], [termsAccepted, privacyAccepted, marketingAccepted, errors]);

  return (
    <div className="space-y-3 pt-4">
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center">
          <input
            id="allAgree"
            type="checkbox"
            checked={allAgreed}
            onChange={(e) => onAllAgree(e.target.checked)}
            disabled={disabled}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="allAgree" className="ml-2 block text-sm font-semibold text-gray-900 cursor-pointer">
            전체 동의
          </label>
        </div>
      </div>

      <div className="space-y-2 pl-6">
        {termsItems.map((item) => (
          <div key={item.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id={item.id}
                  name={item.name}
                  type="checkbox"
                  checked={item.checked}
                  onChange={onInputChange}
                  disabled={disabled}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor={item.id} className="ml-2 block text-sm font-semibold text-gray-700 cursor-pointer">
                  {item.label} {item.required ? <span className="text-red-500">*</span> : '(선택)'}
                </label>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => onShowTerms(item.termsType)}
                className="text-sm text-primary underline p-0 h-auto"
              >
                보기
              </Button>
            </div>
            {item.error && <p className="text-sm text-red-600">{item.error}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}