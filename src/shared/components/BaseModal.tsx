'use client';

import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'full';
  children: ReactNode;
  footer?: ReactNode;
  closable?: boolean;
  closeOnBackdrop?: boolean;
  preventBodyScroll?: boolean;
  className?: string;
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  icon,
  size = 'medium',
  children,
  footer,
  closable = true,
  closeOnBackdrop = true,
  preventBodyScroll = false,
  className = ''
}: BaseModalProps) {
  // 배경 스크롤 방지 (TermsModal에서 사용)
  useEffect(() => {
    if (isOpen && preventBodyScroll) {
      const scrollY = window.scrollY;
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, preventBodyScroll]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-4xl',
    xlarge: 'max-w-6xl',
    full: 'w-screen h-screen max-w-none max-h-none'
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${size === 'full' ? 'bg-black/90' : 'bg-black/30'} ${size === 'full' ? '' : 'p-4'}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`${size === 'full' ? '' : 'bg-white rounded-lg shadow-xl'} w-full ${sizeClasses[size]} ${size === 'full' ? '' : 'max-h-[90vh] overflow-y-auto'} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        {(title || closable) && size !== 'full' && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="flex items-center justify-center">
                  {icon}
                </div>
              )}
              {title && (
                <h2 className="text-lg font-semibold text-gray-900">
                  {title}
                </h2>
              )}
            </div>
            {closable && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                aria-label="닫기"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        )}

        {/* 내용 */}
        <div className={`${size === 'full' ? 'w-full h-full' : 'flex-1'}`}>
          {children}
        </div>

        {/* 푸터 */}
        {footer && size !== 'full' && (
          <div className="border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}