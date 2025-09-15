'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import { Check, AlertCircle, User, X } from 'lucide-react';
import { BaseModal } from '@/shared/components/BaseModal';
import { useNicknameEdit } from '../../hooks/useUserProfile';

interface NicknameEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nickname: string) => Promise<void>;
  currentNickname: string;
  isLoading?: boolean;
}

export function NicknameEditModal({
  isOpen,
  onClose,
  onSave,
  currentNickname,
  isLoading = false
}: NicknameEditModalProps) {
  const handleSaveCallback = useCallback(async (newNickname: string) => {
    await onSave(newNickname);
    onClose();
  }, [onSave, onClose]);

  const {
    nickname,
    error,
    isSaving,
    nicknameCheckStatus,
    isNicknameChanged,
    canSave,
    handleNicknameChange,
    handleSave,
    resetNickname
  } = useNicknameEdit({
    currentNickname,
    onSave: handleSaveCallback
  });

  // 모달이 열릴 때 닉네임 초기화
  useEffect(() => {
    if (isOpen) {
      resetNickname();
    }
  }, [isOpen, resetNickname]);

  const handleNicknameInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleNicknameChange(e.target.value);
  }, [handleNicknameChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [handleSave, onClose]);

  const inputClassName = useMemo(() => {
    const baseClass = 'w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500';
    
    if (error) return `${baseClass} border-red-300`;
    if (isNicknameChanged && nicknameCheckStatus === 'available') return `${baseClass} border-green-300`;
    return `${baseClass} border-gray-300`;
  }, [error, isNicknameChanged, nicknameCheckStatus]);

  const statusIcon = useMemo(() => {
    if (!isNicknameChanged) return null;
    
    switch (nicknameCheckStatus) {
      case 'checking':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary"></div>;
      case 'available':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'duplicate':
        return <X className="h-4 w-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  }, [isNicknameChanged, nicknameCheckStatus]);

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="닉네임 수정"
      size="medium"
      closable={!isSaving}
      footer={
        <div className="flex justify-end space-x-3 p-6">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isSaving && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            )}
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      }
    >
      <div className="p-6">
        <div className="mb-4">
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            닉네임
          </label>
          <div className="relative">
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={handleNicknameInputChange}
              onKeyDown={handleKeyDown}
              disabled={isSaving || isLoading}
              className={inputClassName}
              placeholder="닉네임을 입력하세요 (2-10자)"
              maxLength={10}
            />
            
            {/* 닉네임 중복확인 상태 아이콘 */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {statusIcon}
            </div>
          </div>
          
          {/* 상태 메시지 */}
          {isNicknameChanged && nicknameCheckStatus === 'available' && !error && (
            <p className="mt-1 text-sm text-green-600">사용 가능한 닉네임입니다.</p>
          )}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          {!isNicknameChanged && (
            <p className="mt-1 text-sm text-gray-500">현재 사용 중인 닉네임입니다.</p>
          )}
        </div>

        <div className="text-xs text-gray-500 mb-6">
          • 2-10자 이내로 입력해주세요<br />
          • 한글, 영문, 숫자만 사용 가능합니다<br />
          • 중복된 닉네임은 사용할 수 없습니다
        </div>
      </div>
    </BaseModal>
  );
}