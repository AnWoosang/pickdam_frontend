'use client';

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { BaseModal } from '@/shared/components/BaseModal';
import { Button } from '@/shared/components/Button';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { WithdrawMemberForm, WITHDRAW_REASON_LABELS } from '@/domains/user/types/user';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (form: WithdrawMemberForm) => Promise<void>;
  isLoading?: boolean;
}

export function WithdrawModal({
  isOpen,
  onClose,
  onWithdraw,
  isLoading = false
}: WithdrawModalProps) {
  const [form, setForm] = useState<WithdrawMemberForm>({
    reason: undefined
  });
  const [isCustomReason, setIsCustomReason] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmWithdraw = async () => {
    try {
      await onWithdraw(form);
      onClose();
    } catch {
      // 에러는 상위에서 처리
    } finally {
      setShowConfirm(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setForm({ reason: undefined });
      setIsCustomReason(false);
      setShowConfirm(false);
      onClose();
    }
  };

  return (
    <>
      {/* 회원탈퇴 모달 */}
      <BaseModal
        isOpen={isOpen && !showConfirm}
        onClose={handleClose}
        title="회원탈퇴"
        size="medium"
        closable={!isLoading}
        closeOnBackdrop={!isLoading}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* 경고 메시지 */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-2">회원탈퇴 시 다음 사항에 유의해주세요:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>작성하신 게시글과 댓글이 삭제됩니다</li>
                    <li>찜한 상품 목록이 모두 삭제됩니다</li>
                    <li>작성하신 리뷰가 삭제됩니다</li>
                    <li>탈퇴 후 동일한 이메일로 재가입이 가능합니다</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 탈퇴 사유 선택 */}
            <div>
              <label className="block text-sm font-medium text-black mb-3">
                탈퇴 사유를 선택해주세요
              </label>
              <div className="space-y-3">
                {Object.entries(WITHDRAW_REASON_LABELS).map(([key, label]) => (
                  <label key={key} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="reason"
                      value={label}
                      checked={label === '기타' ? isCustomReason : form.reason === label}
                      onChange={(e) => {
                        if (label === '기타') {
                          setIsCustomReason(true);
                          setForm({ reason: '' });
                        } else {
                          setIsCustomReason(false);
                          setForm({ reason: e.target.value });
                        }
                      }}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>

              {/* 기타 사유 입력 필드 */}
              {isCustomReason && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-black mb-2">
                    구체적인 사유를 입력해주세요
                  </label>
                  <textarea
                    value={form.reason || ''}
                    onChange={(e) => setForm({ reason: e.target.value })}
                    placeholder="탈퇴 사유를 자세히 입력해주세요..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring focus:ring-warning focus:border-warning text-sm font-semibold"
                    rows={3}
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {form.reason?.length || 0}/500
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-3 mt-8">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="warning"
              disabled={isLoading}
              isLoading={isLoading}
              className="flex-1"
            >
              탈퇴하기
            </Button>
          </div>
        </form>
      </BaseModal>

      {/* 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmWithdraw}
        title="회원탈퇴"
        message="정말로 탈퇴하시겠습니까?"
        confirmText="예"
        cancelText="아니오"
        confirmVariant="destructive"
        icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
        isLoading={isLoading}
        width="w-96"
      />
    </>
  );
}