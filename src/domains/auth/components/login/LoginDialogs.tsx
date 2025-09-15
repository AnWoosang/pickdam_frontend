import React, { useMemo } from 'react';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';

interface LoginDialogsProps {
  // Error dialog
  showErrorDialog: boolean;
  errorMessage?: string;
  onCloseErrorDialog: () => void;
  
  // Resend dialog
  showResendDialog: boolean;
  unverifiedEmail?: string;
  isResending: boolean;
  onResendConfirm: () => void;
  onResendCancel: () => void;
  
  // Success dialog
  showSuccessDialog: boolean;
  successMessage?: string;
  onCloseSuccessDialog: () => void;
}

export function LoginDialogs({
  showErrorDialog,
  errorMessage,
  onCloseErrorDialog,
  showResendDialog,
  unverifiedEmail,
  isResending,
  onResendConfirm,
  onResendCancel,
  showSuccessDialog,
  successMessage,
  onCloseSuccessDialog,
}: LoginDialogsProps) {
  // 다이얼로그 설정을 메모이제이션
  const dialogConfigs = useMemo(() => [
    {
      key: 'resend',
      show: showResendDialog,
      priority: 1, // 가장 높은 우선순위
      props: {
        isOpen: showResendDialog,
        onClose: onResendCancel,
        onConfirm: onResendConfirm,
        message: `이메일 인증이 필요합니다.\n${unverifiedEmail}로 인증 메일을 다시 보내드릴까요?`,
        confirmText: isResending ? "발송중..." : "메일 재전송",
        cancelText: "취소",
        confirmButtonColor: "primary" as const,
        width: "w-96",
        icon: "📧"
      }
    },
    {
      key: 'success',
      show: showSuccessDialog,
      priority: 2,
      props: {
        isOpen: showSuccessDialog,
        onClose: onCloseSuccessDialog,
        onConfirm: onCloseSuccessDialog,
        message: successMessage || "",
        confirmText: "확인",
        cancelText: "닫기",
        confirmButtonColor: "primary" as const,
        width: "w-96",
        icon: "✅"
      }
    },
    {
      key: 'error',
      show: showErrorDialog,
      priority: 3, // 가장 낮은 우선순위
      props: {
        isOpen: showErrorDialog,
        onClose: onCloseErrorDialog,
        onConfirm: onCloseErrorDialog,
        message: errorMessage || `로그인에 실패하였습니다.\n아이디와 비밀번호를 확인해주세요.`,
        confirmText: "확인",
        cancelText: "닫기",
        confirmButtonColor: "red" as const,
        width: "w-80"
      }
    }
  ], [
    showErrorDialog, errorMessage, onCloseErrorDialog,
    showResendDialog, unverifiedEmail, isResending, onResendConfirm, onResendCancel,
    showSuccessDialog, successMessage, onCloseSuccessDialog
  ]);

  // 표시할 다이얼로그를 우선순위에 따라 선택
  const activeDialog = useMemo(() => {
    return dialogConfigs.find(dialog => dialog.show);
  }, [dialogConfigs]);

  return (
    <>
      {activeDialog && (
        <ConfirmDialog {...activeDialog.props} />
      )}
    </>
  );
}