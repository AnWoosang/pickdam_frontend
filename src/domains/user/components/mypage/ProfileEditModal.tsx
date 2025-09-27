'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import { Check, AlertCircle, User, X, Camera } from 'lucide-react';
import { BaseModal } from '@/shared/components/BaseModal';
import { Button } from '@/shared/components/Button';
import { Avatar } from '@/shared/components/Avatar';
import { useProfileModal } from '../../hooks/useUserProfile';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname: string;
  currentProfileImageUrl?: string;
  currentName: string;
  isLoading?: boolean;
}

export function ProfileEditModal({
  isOpen,
  onClose,
  currentNickname,
  currentProfileImageUrl,
  currentName,
  isLoading = false
}: ProfileEditModalProps) {
  const {
    // 닉네임 관련
    nickname,
    error,
    isSaving,
    nicknameCheckStatus,
    isNicknameChanged,
    handleNicknameChange,
    handleCheckDuplicate,

    // 이미지 관련
    currentDisplayImageUrl,

    // 핸들러
    handleImageSelect,
    handleSave,
    resetModal,
    cleanup
  } = useProfileModal({
    currentNickname,
    currentProfileImageUrl,
    onSuccess: onClose
  });

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen, resetModal]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

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

  const handleDuplicateCheck = useCallback(() => {
    handleCheckDuplicate(nickname);
  }, [handleCheckDuplicate, nickname]);

  const handleProfileImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  }, [handleImageSelect]);

  const inputClassName = useMemo(() => {
    const baseClass = 'w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-sm';

    if (error) return `${baseClass} border-warning`;
    if (isNicknameChanged && nicknameCheckStatus === 'available') return `${baseClass} border-primary`;
    return `${baseClass} border-gray-300`;
  }, [error, isNicknameChanged, nicknameCheckStatus]);

  const statusIcon = useMemo(() => {
    if (!isNicknameChanged) return null;

    switch (nicknameCheckStatus) {
      case 'checking':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary"></div>;
      case 'available':
        return <Check className="h-4 w-4 text-primary" />;
      case 'duplicate':
        return <X className="h-4 w-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return null;
    }
  }, [isNicknameChanged, nicknameCheckStatus]);

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="프로필 수정"
      size="medium"
      closable={!isSaving}
      footer={
        <div className="flex justify-end space-x-3 p-6">
          <Button
            variant="secondary"
            size="medium"
            onClick={onClose}
            disabled={isSaving}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={handleSave}
            disabled={isLoading || isSaving}
            isLoading={isSaving}
          >
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </div>
      }
    >
      <div className="p-6">
        {/* 프로필 이미지 수정 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            프로필 사진
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar
                src={currentDisplayImageUrl}
                alt={`${currentName} 프로필 사진`}
                size="large"
              />
              <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 cursor-pointer hover:bg-primary-dark transition-colors">
                <Camera className="w-3 h-3" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                  disabled={isSaving || isLoading}
                />
              </label>
            </div>
            <div className="text-sm text-gray-500">
              클릭하여 프로필 사진을 변경하세요
            </div>
          </div>
        </div>

        {/* 닉네임 수정 */}
        <div className="mb-4">
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            닉네임
          </label>
          <div className="flex gap-2 items-start">
            <div className="flex-1 relative">
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

            {/* 중복확인 버튼 */}
            <Button
              type="button"
              variant="secondary"
              size="medium"
              onClick={handleDuplicateCheck}
              disabled={!nickname.trim() || nickname.length < 2 || nicknameCheckStatus === 'checking' || isSaving || isLoading}
              className="whitespace-nowrap h-10"
            >
              중복확인
            </Button>
          </div>

          {/* 상태 메시지 */}
          {isNicknameChanged && nicknameCheckStatus === 'available' && !error && (
            <p className="mt-1 text-sm text-primary font-semibold">사용 가능한 닉네임입니다.</p>
          )}
          {error && <p className="mt-1 text-sm text-warning font-semibold">{error}</p>}
        </div>

        <div className="text-xs text-gray-500 mb-6 space-y-2">
          <div>• 닉네임은 한달에 한번만 변경 가능해요</div>
          <div>• 닉네임: 2-10자 이내로 입력해주세요</div>
          <div>• 한글, 영문, 숫자만 사용 가능해요</div>
          <div>• 중복된 닉네임은 사용할 수 없어요</div>
          <div>• 프로필 사진: JPG, PNG, JPEG, GIF 파일만 가능</div>
        </div>
      </div>
    </BaseModal>
  );
}