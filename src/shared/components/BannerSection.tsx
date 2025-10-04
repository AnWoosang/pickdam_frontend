"use client";

import React, { useEffect, useRef } from "react";
import { Container } from "@/shared/layout/Container";

interface BannerSectionProps {
  show?: boolean;
  className?: string;
  containerVariant?: 'default' | 'wide' | 'narrow' | 'full';
}

export const BannerSection: React.FC<BannerSectionProps> = ({
  show = true,
  className = "",
  containerVariant = 'default',
}) => {
  const ad1Ref = useRef<HTMLDivElement>(null);
  const ad2Ref = useRef<HTMLDivElement>(null);
  const mobileAdRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!show || loadedRef.current) return;
    loadedRef.current = true;

    // 첫 번째 광고 로드 (728x90)
    if (ad1Ref.current) {
      const config1 = document.createElement('script');
      config1.type = 'text/javascript';
      config1.innerHTML = `
        atOptions = {
          'key': 'd309d8fcd9cea9584bb49b33bdd07f69',
          'format': 'iframe',
          'height': 90,
          'width': 650,
          'params': {}
        };
      `;
      ad1Ref.current.appendChild(config1);

      const invoke1 = document.createElement('script');
      invoke1.type = 'text/javascript';
      invoke1.src = '//www.highperformanceformat.com/d309d8fcd9cea9584bb49b33bdd07f69/invoke.js';
      ad1Ref.current.appendChild(invoke1);
    }

    // 두 번째 광고 로드 (728x90)
    setTimeout(() => {
      if (ad2Ref.current) {
        const config2 = document.createElement('script');
        config2.type = 'text/javascript';
        config2.innerHTML = `
          atOptions = {
            'key': 'd309d8fcd9cea9584bb49b33bdd07f69',
            'format': 'iframe',
            'height': 90,
            'width': 650,
            'params': {}
          };
        `;
        ad2Ref.current.appendChild(config2);

        const invoke2 = document.createElement('script');
        invoke2.type = 'text/javascript';
        invoke2.src = '//www.highperformanceformat.com/d309d8fcd9cea9584bb49b33bdd07f69/invoke.js';
        ad2Ref.current.appendChild(invoke2);
      }
    }, 1000);

    // 모바일 광고 로드 (320x50) - 하나만
    if (mobileAdRef.current) {

      const mobileConfig = document.createElement('script');
      mobileConfig.type = 'text/javascript';
      mobileConfig.innerHTML = `
        atOptions = {
          'key': '0d77d52098b59b5403152e26ae08c2dc',
          'format': 'iframe',
          'height': 50,
          'width': 320,
          'params': {}
        };
      `;
      mobileAdRef.current.appendChild(mobileConfig);

      const mobileInvoke = document.createElement('script');
      mobileInvoke.type = 'text/javascript';
      mobileInvoke.src = '//www.highperformanceformat.com/0d77d52098b59b5403152e26ae08c2dc/invoke.js';
      mobileInvoke.async = true;
      mobileAdRef.current.appendChild(mobileInvoke);
    }
  }, [show]);

  if (!show) return null;

  return (
    <>
      {/* 데스크톱: 가로로 나란히 */}
      <Container variant={containerVariant} className={`hidden md:block ${className}`}>
        <div className="flex items-center justify-between w-full">
          <div
            ref={ad1Ref}
            style={{
              width: '728px',
              height: '90px',
              transform: 'scale(0.75)',
              transformOrigin: 'left center',
              marginRight: '-140px'
            }}
          ></div>
          <div
            ref={ad2Ref}
            style={{
              width: '728px',
              height: '90px',
              transform: 'scale(0.75)',
              transformOrigin: 'right center',
              marginLeft: '-150px'
            }}
          ></div>
        </div>
      </Container>

      {/* 모바일: 광고 한 개만 */}
      <div className={`md:hidden ${className}`}>
        <div
          ref={mobileAdRef}
          className="mobile-ad-container flex items-center justify-center w-full border-0"
          style={{
            minHeight: '50px',
            height: '50px'
          }}
        ></div>
      </div>

      <style jsx global>{`
        .mobile-ad-container {
          background: transparent !important;
          border: none !important;
        }
        .mobile-ad-container iframe {
          width: 320px !important;
          height: 50px !important;
          border: 0 !important;
        }
      `}</style>
    </>
  );
};