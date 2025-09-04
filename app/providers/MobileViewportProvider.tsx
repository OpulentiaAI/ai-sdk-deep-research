'use client';
import React from 'react';

export function MobileViewportProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (!('visualViewport' in window)) return;
    const root = document.documentElement;
    const onResize = () => {
      const vv = window.visualViewport!;
      const offset = Math.max(0, (window.innerHeight - vv.height - vv.offsetTop) || 0);
      root.style.setProperty('--kb-offset', `${offset}px`);
    };
    window.visualViewport!.addEventListener('resize', onResize);
    window.visualViewport!.addEventListener('scroll', onResize);
    onResize();
    return () => {
      window.visualViewport!.removeEventListener('resize', onResize);
      window.visualViewport!.removeEventListener('scroll', onResize);
      root.style.removeProperty('--kb-offset');
    };
  }, []);
  return <>{children}</>;
}