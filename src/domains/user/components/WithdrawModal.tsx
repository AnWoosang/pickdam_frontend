'use client';

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { BaseModal } from '@/shared/components/BaseModal';
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
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmWithdraw = async () => {
    try {
      await onWithdraw(form);
      onClose();
    } catch (error) {
      // 에러는 상위에서 처리
    } finally {
      setShowConfirm(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setForm({ reason: undefined });
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
        icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
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
                <div className="text-sm text-red-700">
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                탈퇴 사유를 선택해주세요 (선택사항)
              </label>
              <div className="space-y-3">
                {Object.entries(WITHDRAW_REASON_LABELS).map(([key, label]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="radio"
                      name="reason"
                      value={label}
                      checked={form.reason === label}
                      onChange={(e) => setForm({ reason: e.target.value })}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? '처리 중...' : '탈퇴하기'}
            </button>
          </div>
        </form>
      </BaseModal>

      {/* 확인 다이얼로그 */}
      <BaseModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="회원탈퇴 확인"
        icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
        size="small"
        closable={!isLoading}
        closeOnBackdrop={!isLoading}
      >
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            정말로 탈퇴하시겠습니까?<br />
            이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              아니오
            </button>
            <button
              type="button"
              onClick={handleConfirmWithdraw}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? '처리 중...' : '예'}
            </button>
          </div>
        </div>
      </BaseModal>
    </>
  );
}