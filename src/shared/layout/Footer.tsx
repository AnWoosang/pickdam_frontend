"use client";

import React, { useState } from 'react';

import { Container } from '@/shared/layout/Container';
import { TermsModal } from '@/shared/components/TermsModal';
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from '@/shared/constants/terms';

interface FooterProps {
  containerVariant?: 'default' | 'wide' | 'narrow' | 'full';
}

export const Footer: React.FC<FooterProps> = ({ 
  containerVariant = 'default' 
}) => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-white py-6 md:py-8 border-t border-gray-100">
        <Container variant={containerVariant}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* 회사 정보 */}
            <div>
              <h3 className="text-base md:text-lg font-bold text-textHeading mb-2 md:mb-4">Pickdam</h3>
              <p className="text-xs md:text-sm text-textDefault">
                <span className="font-medium">Contact:</span> pickdam100@gmail.com
              </p>
            </div>

            {/* 약관 및 정책 */}
            <div>
              <h4 className="text-sm md:text-base font-semibold text-textHeading mb-2 md:mb-3">약관 및 정책</h4>
              <ul className="flex flex-row md:flex-col gap-3 md:gap-2 text-xs md:text-sm text-textDefault">
                <li>
                  <button
                    onClick={() => setIsTermsModalOpen(true)}
                    className="hover:text-textHeading transition-colors cursor-pointer text-left"
                  >
                    이용약관
                  </button>
                </li>
                <li className="flex items-center md:hidden">
                  <span className="text-gray-300">|</span>
                </li>
                <li>
                  <button
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="hover:text-textHeading transition-colors cursor-pointer text-left"
                  >
                    개인정보처리방침
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* 하단 저작권 및 추가 정보 */}
          <div className="mt-4 md:mt-6 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs md:text-sm text-hintText">
              <p>© 2025 Pickdam. All rights reserved.</p>
            </div>
          </div>
        </Container>
      </footer>

      {/* 모달들 */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        terms={TERMS_OF_SERVICE}
      />
      
      <TermsModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        terms={PRIVACY_POLICY}
      />
    </>
  );
};