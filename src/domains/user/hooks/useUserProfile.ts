'use client';

import { useState, useCallback, useEffect } from 'react';
import { useNicknameCheck } from '@/shared/hooks/useNicknameCheck';
import { useUIStore } from '@/domains/auth/store/authStore';
import { useImageUploadQuery } from '@/domains/image/hooks/useImageUploadQueries';
import { useUpdateProfile } from './mypage/useMyPageQueries';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { validateImages } from '@/domains/image/validation/image';

// 에러 메시지 상수
const ERROR_MESSAGES = {
  SAME_NICKNAME: '현재 닉네임과 동일합니다.',
  MONTHLY_LIMIT: '닉네임은 한 달에 한 번만 변경할 수 있습니다.',
  DUPLICATE: '이미 사용 중인 닉네임입니다.',
  VALIDATION_REQUIRED: '닉네임 중복확인을 완료해주세요.',
  DEFAULT: '닉네임 변경에 실패했습니다. 다시 시도해주세요.'
} as const;

interface UseProfileEditProps {
  currentNickname: string;
  onSave: (nickname: string) => void;
}

export function useProfileEdit({ currentNickname, onSave }: UseProfileEditProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>('');
  
  // 공통 닉네임 검증 훅 사용
  const {
    nickname,
    nicknameStatus,
    error: validationError,
    isChecking,
    handleNicknameChange,
    handleCheckDuplicate
  } = useNicknameCheck();

  // 초기값 설정
  useEffect(() => {
    handleNicknameChange(currentNickname);
  }, [currentNickname]);

  // 프로필 수정 관련 로직
  const isNicknameChanged = nickname.trim() !== currentNickname;
  const resetNickname = useCallback(() => {
    handleNicknameChange(currentNickname);
  }, [currentNickname]);
  
  const handleSave = useCallback(() => {
    // 현재 닉네임과 동일한 경우
    if (nickname.trim() === currentNickname) {
      setSaveError(ERROR_MESSAGES.SAME_NICKNAME);
      return;
    }

    // 중복확인이 필요한 경우
    if (nicknameStatus !== 'available') {
      setSaveError(validationError || ERROR_MESSAGES.VALIDATION_REQUIRED);
      return;
    }

    setIsSaving(true);
    setSaveError('');

    onSave(nickname.trim());
    resetNickname();
    setIsSaving(false);
  }, [nickname, nicknameStatus, validationError, onSave, resetNickname, currentNickname]);

  // 계산된 값들 (로딩 상태 개선)
  const isLoading = isSaving || isChecking;
  const canSave = nicknameStatus === 'available' && !isLoading && isNicknameChanged;
  const displayError = saveError || validationError;

  return {
    nickname,
    error: displayError,
    isSaving,
    nicknameCheckStatus: nicknameStatus,
    isNicknameChanged,
    canSave,
    handleNicknameChange,
    handleCheckDuplicate,
    handleSave,
    resetNickname
  };
}

// 프로필 수정 모달용 통합 훅
interface UseProfileModalProps {
  currentNickname: string;
  currentProfileImageUrl?: string;
  onSuccess?: () => void;
}

export function useProfileModal({
  currentNickname,
  currentProfileImageUrl,
  onSuccess
}: UseProfileModalProps) {
  const { showToast } = useUIStore();
  const { user } = useAuthUtils();
  const updateProfileMutation = useUpdateProfile();

  // 이미지 관련 상태
  const [profileImageUrl, setProfileImageUrl] = useState(currentProfileImageUrl || '');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');

  // 이미지 업로드 뮤테이션
  const imageUploadMutation = useImageUploadQuery();

  // 닉네임 편집 훅
  const nicknameEdit = useProfileEdit({
    currentNickname,
    onSave: (newNickname: string) => {
      handleProfileSave(newNickname);
    }
  });

  // 통합 저장 로직
  const handleProfileSave = useCallback((newNickname: string) => {
    if (!user?.id) {
      showToast('로그인이 필요합니다', 'error');
      return;
    }

    // 이미지 파일이 선택된 경우 먼저 업로드
    if (selectedImageFile) {
      imageUploadMutation.mutate({
        files: [selectedImageFile],
        contentType: 'profile'
      }, {
        onSuccess: (uploadedImages) => {
          const finalImageUrl = uploadedImages[0]?.url || profileImageUrl;
          const updateData = {
            nickname: newNickname.trim(),
            profileImageUrl: finalImageUrl
          };

          updateProfileMutation.mutate({
            userId: user.id,
            updates: updateData
          }, {
            onSuccess: () => {
              showToast('프로필이 성공적으로 업데이트되었습니다', 'success');
              onSuccess?.();
            },
            onError: () => {
              showToast('프로필 업데이트에 실패했습니다', 'error');
            }
          });
        },
        onError: () => {
          showToast('이미지 업로드에 실패했습니다', 'error');
        }
      });
    } else {
      // 이미지가 없는 경우 바로 저장
      const updateData: { nickname?: string; profileImageUrl?: string } = {};

      if (newNickname.trim() !== currentNickname) {
        updateData.nickname = newNickname.trim();
      }

      if (profileImageUrl && profileImageUrl !== currentProfileImageUrl) {
        updateData.profileImageUrl = profileImageUrl;
      }

      // 변경사항이 있는 경우에만 업데이트
      if (Object.keys(updateData).length > 0) {
        updateProfileMutation.mutate({
          userId: user.id,
          updates: updateData
        }, {
          onSuccess: () => {
            showToast('프로필이 성공적으로 업데이트되었습니다', 'success');
            onSuccess?.();
          },
          onError: () => {
            showToast('프로필 업데이트에 실패했습니다', 'error');
          }
        });
      } else {
        onSuccess?.();
      }
    }
  }, [
    user?.id,
    selectedImageFile,
    imageUploadMutation,
    profileImageUrl,
    currentNickname,
    currentProfileImageUrl,
    updateProfileMutation,
    showToast,
    onSuccess
  ]);

  // 이미지 선택 핸들러
  const handleImageSelect = useCallback((file: File) => {

    // 이미지 파일 검증
    const validationResult = validateImages({ files: [file], contentType: 'profile' });

    if (!validationResult.isValid) {
      showToast(validationResult.errors[0], 'error');
      return;
    }

    setSelectedImageFile(file);

    // 이전 미리보기 URL 정리
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewImageUrl(newPreviewUrl);
  }, [previewImageUrl, showToast]);

  // 모달 초기화
  const resetModal = useCallback(() => {
    nicknameEdit.resetNickname();
    setProfileImageUrl(currentProfileImageUrl || '');
    setSelectedImageFile(null);

    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
      setPreviewImageUrl('');
    }
  }, [currentProfileImageUrl, previewImageUrl]);

  // 메모리 정리
  const cleanup = useCallback(() => {
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
    }
  }, [previewImageUrl]);

  // 통합 저장 핸들러 (닉네임 변경 여부에 따른 로직)
  const handleSave = useCallback(() => {
    const trimmedNickname = nicknameEdit.nickname.trim();

    // 닉네임이 변경되지 않은 경우 바로 저장
    if (trimmedNickname === currentNickname) {
      handleProfileSave(trimmedNickname);
      return;
    }

    // 닉네임이 변경된 경우 중복확인 체크
    if (nicknameEdit.nicknameCheckStatus !== 'available') {
      showToast('닉네임 중복확인이 필요합니다', 'error');
      return;
    }

    // 중복확인이 완료된 경우 저장
    nicknameEdit.handleSave();
  }, [nicknameEdit, currentNickname, handleProfileSave, showToast]);

  return {
    // 닉네임 관련
    ...nicknameEdit,

    // 이미지 관련
    profileImageUrl,
    selectedImageFile,
    previewImageUrl,
    currentDisplayImageUrl: previewImageUrl || profileImageUrl,
    isUploading: imageUploadMutation.isPending,

    // 핸들러
    handleImageSelect,
    handleSave,
    resetModal,
    cleanup,

    // 상태
    isSaving: nicknameEdit.isSaving || imageUploadMutation.isPending || updateProfileMutation.isPending,
  };
}