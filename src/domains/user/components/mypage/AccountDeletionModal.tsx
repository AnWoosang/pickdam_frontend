'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { UserX } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { BaseModal } from '@/shared/components/BaseModal';
import { toast } from 'react-hot-toast';

interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

interface AccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function AccountDeletionModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}: AccountDeletionModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setAgreed(false);
      setConfirmText('');
      setShowConfirmDialog(false);
    }
  }, [isOpen]);

  const handleConfirm = useCallback(() => {
    if (!agreed || confirmText !== '회원탈퇴') return;
    setShowConfirmDialog(true);
  }, [agreed, confirmText]);

  const handleFinalConfirm = useCallback(async () => {
    try {
      await onConfirm();
      setShowConfirmDialog(false);
      onClose();
      toast.success('회원탈퇴가 완료되었습니다.');
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
      setShowConfirmDialog(false);
      
      const apiError = error as ApiError;
      const errorMessage = apiError?.message || '회원탈퇴에 실패했습니다. 다시 시도해주세요.';
      
      toast.error(errorMessage);
    }
  }, [onConfirm, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const modalIcon = useMemo(() => (
    <div className="p-2 bg-red-100 rounded-full">
      <UserX className="w-5 h-5 text-red-600" />
    </div>
  ), []);

  const canConfirm = useMemo(() => 
    agreed && confirmText === '회원탈퇴' && !isLoading,
    [agreed, confirmText, isLoading]
  );

  if (!isOpen) return null;

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={handleClose}
        title="회원탈퇴"
        icon={modalIcon}
        size="medium"
        closable={!isLoading}
        footer={
          <div className="flex justify-end space-x-3 p-6">
            <Button
              onClick={handleClose}
              disabled={isLoading}
              variant="ghost"
              size="medium"
            >
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!canConfirm}
              variant="warning"
              size="medium"
            >
              회원탈퇴
            </Button>
          </div>
        }
      >
        <div className="p-6">
          {/* 탈퇴 전 확인사항 */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900">탈퇴 전 확인사항</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• 탈퇴 후에는 계정 복구가 불가능합니다.</li>
              <li>• 동일한 이메일로 재가입이 가능하지만, 기존 데이터는 복구되지 않습니다.</li>
              <li>• 작성한 게시글과 댓글은 탈퇴 후에도 일정 기간 보관될 수 있습니다.</li>
              <li>• 진행 중인 거래나 문의사항이 있다면 완료 후 탈퇴를 권장합니다.</li>
              <li>• <strong>계정 정보 및 프로필</strong>이 삭제됩니다.</li>
              <li>• <strong>찜한 상품 목록</strong>이 삭제됩니다.</li>
              <li>• <strong>작성한 리뷰</strong>가 삭제됩니다.</li>
              <li>• <strong>작성한 게시글 및 댓글</strong>이 삭제됩니다.</li>
              <li>• <strong>좋아요 기록</strong>이 삭제됩니다.</li>
            </ul>
          </div>

          {/* 동의 체크박스 */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2 mt-0.5 cursor-pointer"
              />
              <span className="text-sm text-gray-700">
                위 내용을 모두 확인했으며, 회원탈퇴에 동의합니다.
              </span>
            </label>

            {/* 확인 입력 */}
            <div>
              <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 mb-2">
                확인을 위해 <span className="text-warning font-semibold">&apos;회원탈퇴&apos;</span>를 입력해주세요
              </label>
              <input
                type="text"
                id="confirmText"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-warning focus:border-transparent 
                         disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="회원탈퇴"
              />
            </div>
          </div>
        </div>
      </BaseModal>

      {/* 최종 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleFinalConfirm}
        message="정말로 회원탈퇴를 진행하시겠습니까?
이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다."
        confirmText="탈퇴하기"
        cancelText="취소"
        confirmButtonColor="red"
        icon="⚠️"
      />
    </>
  );
}