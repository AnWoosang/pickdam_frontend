"use client";

import React, { useEffect } from 'react';
import { Button } from './Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'destructive' | 'warning' | 'primary';
  width?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  title?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = '예',
  cancelText = '아니오',
  confirmVariant = 'destructive',
  width = 'w-90',
  icon,
  isLoading = false,
  title
}: ConfirmDialogProps) {
  // 키보드 이벤트 핸들러 (로딩 중일 때는 비활성화)
  useEffect(() => {
    if (!isOpen || isLoading) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onConfirm();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onClose, isLoading]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-lg ${width} mx-4`}>
        {/* 헤더 영역 */}
        {(title || icon) && (
          <div className="px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {icon && <div className="flex-shrink-0">{icon}</div>}
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            </div>
          </div>
        )}

        {/* 내용 영역 */}
        <div className="p-6">
          <div className="text-gray-700 mb-6">
            {message.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < message.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              variant={confirmVariant}
              onClick={onConfirm}
              disabled={isLoading}
              isLoading={isLoading}
              className="flex-1"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}