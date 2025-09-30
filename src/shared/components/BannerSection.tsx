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
  const ad3Ref = useRef<HTMLDivElement>(null);
  const ad4Ref = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!show || loadedRef.current) return;
    loadedRef.current = true;

    // 첫 번째 광고 로드 (728x90)
    if (ad1Ref.current) {
      const config1 = document.createElement('script');
      config1.type = 'text/javascript';
      config1.text = `
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
        config2.text = `
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

    // 세 번째 광고 로드 (160x300)
    setTimeout(() => {
      if (ad3Ref.current) {
        const config3 = document.createElement('script');
        config3.type = 'text/javascript';
        config3.text = `
          atOptions = {
            'key': '90756d515f1fef2d23141e7d371f9c5c',
            'format': 'iframe',
            'height': 300,
            'width': 160,
            'params': {}
          };
        `;
        ad3Ref.current.appendChild(config3);

        const invoke3 = document.createElement('script');
        invoke3.type = 'text/javascript';
        invoke3.src = '//www.highperformanceformat.com/90756d515f1fef2d23141e7d371f9c5c/invoke.js';
        ad3Ref.current.appendChild(invoke3);
      }
    }, 2000);

    // // 네 번째 광고 로드 (새 광고)
    // setTimeout(() => {
    //   if (ad4Ref.current) {
    //     const script4 = document.createElement('script');
    //     script4.async = true;
    //     script4.setAttribute('data-cfasync', 'false');
    //     script4.src = '//pl27752357.revenuecpmgate.com/3db0c4bab1658b588e2b81cf8fc2bb26/invoke.js';
    //     ad4Ref.current.appendChild(script4);
    //   }
    // }, 3000);
  }, [show]);

  if (!show) return null;

  return (
    <Container variant={containerVariant} className={className}>
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
  );
};