"use client";

import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface BannerSectionProps {
  show?: boolean;
  className?: string;
}

export const BannerSection: React.FC<BannerSectionProps> = ({
  show = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const adPushed = useRef(false);

  useEffect(() => {
    if (!show || adPushed.current) return;

    const initAd = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;

      if (width > 0) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adPushed.current = true;
        } catch (e) {
          console.error('AdSense error:', e);
        }
      } else {
        setTimeout(initAd, 100);
      }
    };

    const timer = setTimeout(initAd, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div ref={containerRef} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2492022053829767"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};