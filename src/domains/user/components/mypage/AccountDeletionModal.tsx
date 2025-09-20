'use client';

import React from 'react';
import { WithdrawModal } from '@/domains/user/components/WithdrawModal';
import { WithdrawMemberForm } from '@/domains/user/types/user';

interface AccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (form?: WithdrawMemberForm) => Promise<void>;
  isLoading?: boolean;
}

export function AccountDeletionModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}: AccountDeletionModalProps) {
  const handleWithdraw = async (form: WithdrawMemberForm) => {
    await onConfirm(form);
  };

  return (
    <WithdrawModal
      isOpen={isOpen}
      onClose={onClose}
      onWithdraw={handleWithdraw}
      isLoading={isLoading}
    />
  );
}