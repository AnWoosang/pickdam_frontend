'use client';

import { useState, useCallback, useEffect } from 'react';
import { useUIStore } from '@/domains/auth/store/authStore';
import { useImageUploadQuery } from '@/domains/image/hooks/useImageUploadQueries';
import { useUpdateProfile } from './mypage/useMyPageQueries';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { validateImages } from '@/domains/image/validation/image';
import { useNicknameCheck } from '@/shared/hooks/useNicknameCheck';
import { ApiErrorCode } from '@/shared/error/errorCodes';
import { BusinessError } from '@/shared/error/BusinessError';

interface UseProfileEditorProps {
  currentNickname: string;
  currentProfileImageUrl?: string;
  onSuccess?: () => void;
}

export function useProfileEditor({
  currentNickname,
  currentProfileImageUrl,
  onSuccess
}: UseProfileEditorProps) {
  const { showToast } = useUIStore();
  const { user } = useAuthUtils();
  const updateProfileMutation = useUpdateProfile();
  const imageUploadMutation = useImageUploadQuery();

  // 이미지 관련 상태
  const [profileImageUrl, setProfileImageUrl] = useState(currentProfileImageUrl || '');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // 닉네임 검증 훅 사용
  const {
    nickname,
    nicknameStatus,
    error: validationError,
    isChecking,
    handleNicknameChange: originalHandleNicknameChange,
    handleCheckDuplicate
  } = useNicknameCheck();

  // 초기값 설정
  useEffect(() => {
    originalHandleNicknameChange(currentNickname);
  }, [currentNickname, originalHandleNicknameChange]);

  // 안정적인 닉네임 변경 핸들러
  const handleNicknameChange = useCallback((newNickname: string) => {
    originalHandleNicknameChange(newNickname);
  }, [originalHandleNicknameChange]);

  // 프로필 수정 관련 로직
  const isNicknameChanged = nickname.trim() !== currentNickname;
  const canSave = nicknameStatus === 'available' && !isSaving && isNicknameChanged;
  const displayError = validationError;
  const isLoading = isSaving || isChecking;

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

  // 통합 저장 로직
  const handleProfileSave = useCallback((newNickname: string) => {
    if (!user?.id) {
      showToast('로그인이 필요합니다', 'error');
      return;
    }

    setIsSaving(true);

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
            onError: (error: Error) => {
              if (error instanceof BusinessError && error.code === ApiErrorCode.NICKNAME_CHANGE_LIMIT_EXCEEDED) {
                showToast('닉네임은 한 달에 한 번만 변경 가능합니다', 'error');
              } else {
                showToast('프로필 업데이트에 실패했습니다', 'error');
              }
            },
            onSettled: () => {
              setIsSaving(false);
            }
          });
        },
        onError: () => {
          showToast('이미지 업로드에 실패했습니다', 'error');
          setIsSaving(false);
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
          onError: (error: Error) => {
            if (error instanceof BusinessError && error.code === ApiErrorCode.NICKNAME_CHANGE_LIMIT_EXCEEDED) {
              showToast('닉네임은 한 달에 한 번만 변경 가능합니다', 'error');
            } else {
              showToast('프로필 업데이트에 실패했습니다', 'error');
            }
          },
          onSettled: () => {
            setIsSaving(false);
          }
        });
      } else {
        setIsSaving(false);
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

  // 저장 핸들러
  const handleSave = useCallback(() => {
    const trimmedNickname = nickname.trim();

    // 현재 닉네임과 동일한 경우
    if (trimmedNickname === currentNickname) {
      handleProfileSave(trimmedNickname);
      return;
    }

    // 중복확인이 필요한 경우
    if (nicknameStatus !== 'available') {
      showToast('닉네임 중복확인이 필요합니다', 'error');
      return;
    }

    // 중복확인이 완료된 경우 저장
    handleProfileSave(trimmedNickname);
  }, [nickname, currentNickname, nicknameStatus, handleProfileSave, showToast]);

  // 모달 초기화
  const resetForm = useCallback(() => {
    handleNicknameChange(currentNickname);
    setProfileImageUrl(currentProfileImageUrl || '');
    setSelectedImageFile(null);

    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
      setPreviewImageUrl('');
    }
  }, [currentNickname, currentProfileImageUrl, previewImageUrl, handleNicknameChange]);

  // 메모리 정리
  const cleanup = useCallback(() => {
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
    }
  }, [previewImageUrl]);

  return {
    // 닉네임 관련
    nickname,
    error: displayError,
    nicknameCheckStatus: nicknameStatus,
    isNicknameChanged,
    canSave,
    handleNicknameChange,
    handleCheckDuplicate,

    // 이미지 관련
    profileImageUrl,
    selectedImageFile,
    previewImageUrl,
    currentDisplayImageUrl: previewImageUrl || profileImageUrl,
    isUploading: imageUploadMutation.isPending,

    // 상태
    isSaving,
    isLoading,

    // 핸들러
    handleImageSelect,
    handleSave,
    resetForm,
    cleanup
  };
}