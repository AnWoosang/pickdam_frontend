"use client";

import React, { useEffect, useRef } from "react";

interface SideAdProps {
  show?: boolean;
}

export const SideAd: React.FC<SideAdProps> = ({ show = true }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!show || loadedRef.current) return;
    loadedRef.current = true;

    if (adRef.current) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = '//pl27752357.revenuecpmgate.com/3db0c4bab1658b588e2b81cf8fc2bb26/invoke.js';
      adRef.current.appendChild(script);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div ref={adRef} className="sticky top-4">
      <div id="container-3db0c4bab1658b588e2b81cf8fc2bb26"></div>
    </div>
  );
};