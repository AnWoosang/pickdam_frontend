"use client";

import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: 'red' | 'primary';
  width?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = '확인',
  cancelText = '취소',
  confirmButtonColor = 'red',
  width = 'w-90'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const confirmButtonClasses = confirmButtonColor === 'red' 
    ? 'bg-warning hover:bg-warningLight' 
    : 'bg-primary hover:bg-primary/90';

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-lg p-6 ${width} mx-4`}>
        <div className="text-center">
          <div className="mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <div className="text-[16px] font-medium text-black mb-6">
            {message.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < message.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-[15px] text-gray-700 font-bold bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer border border-gray-300"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-[15px] text-white font-bold ${confirmButtonClasses} rounded-lg transition-colors cursor-pointer`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}