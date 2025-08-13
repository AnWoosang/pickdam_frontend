"use client";

import React from 'react';
import { Container } from './container';

interface FooterProps {
  containerVariant?: 'default' | 'wide' | 'narrow' | 'full';
}

export const Footer: React.FC<FooterProps> = ({ 
  containerVariant = 'default' 
}) => {
  return (
    <footer className="bg-grayBackground border-t border-grayLight py-8">
      <Container variant={containerVariant}>
        <div className="grid grid-cols-4 gap-6">
          {/* 회사 정보 */}
          <div>
            <h3 className="text-lg font-bold text-textHeading mb-4">Pickdam</h3>
            <p className="text-sm text-textDefault">
              최고의 베이프 제품을<br />
              합리적인 가격으로
            </p>
          </div>

          {/* 고객서비스 */}
          <div>
            <h4 className="font-semibold text-textHeading mb-3">고객서비스</h4>
            <ul className="space-y-2 text-sm text-textDefault">
              <li><a href="#" className="hover:text-textHeading transition-colors cursor-pointer">고객센터</a></li>
              <li><a href="#" className="hover:text-textHeading transition-colors cursor-pointer">자주 묻는 질문</a></li>
              <li><a href="#" className="hover:text-textHeading transition-colors cursor-pointer">배송 안내</a></li>
              <li><a href="#" className="hover:text-textHeading transition-colors cursor-pointer">교환/반품</a></li>
            </ul>
          </div>

          {/* 회사 */}
          <div>
            <h4 className="font-semibold text-textHeading mb-3">회사</h4>
            <ul className="space-y-2 text-sm text-textDefault">
              <li><a href="#" className="hover:text-textHeading transition-colors cursor-pointer">회사 소개</a></li>
              <li><a href="#" className="hover:text-textHeading transition-colors cursor-pointer">채용 정보</a></li>
              <li><a href="#" className="hover:text-textHeading transition-colors cursor-pointer">제휴 문의</a></li>
            </ul>
          </div>

          {/* 약관 및 정책 */}
          <div>
            <h4 className="font-semibold text-textHeading mb-3">약관 및 정책</h4>
            <ul className="space-y-2 text-sm text-textDefault">
              <li><a href="#" className="hover:text-textHeading transition-colors cursor-pointer">이용약관</a></li>
              <li><a href="#" className="hover:text-textHeading transition-colors cursor-pointer">개인정보처리방침</a></li>
              <li><a href="#" className="hover:text-textHeading transition-colors cursor-pointer">쿠키 정책</a></li>
            </ul>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="border-t border-grayLight mt-8 pt-6 text-center">
          <p className="text-sm text-hintText">
            © 2024 Pickdam. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};