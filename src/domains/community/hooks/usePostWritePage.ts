"use client";

import { validatePost } from '@/domains/community/validation/post';
import { useCreatePostMutation } from '@/domains/community/hooks/usePostQueries';
import { PostForm } from '@/domains/community/types/community';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { ROUTES } from '@/app/router/routes';
import { useUIStore } from '@/domains/auth/store/authStore';

interface FormErrors {
  title?: string;
  content?: string;
  category?: string;
}

interface FormData {
  title: string;
  content: string;
  categoryId: string;
}

export function useWritePostPage() {
  const router = useRouter();
  const { user } = useAuthUtils();
  const { showToast } = useUIStore();
  const createPostMutation = useCreatePostMutation();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    categoryId: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates) as Array<keyof FormData>;
    const hasErrorsToCleared = updatedFields.some(field => errors[field as keyof FormErrors]);
    
    if (hasErrorsToCleared) {
      setErrors(prev => {
        const newErrors = { ...prev };
        updatedFields.forEach(field => {
          if (field in newErrors) {
            delete newErrors[field as keyof FormErrors];
          }
        });
        return newErrors;
      });
    }
  }, [errors]);

  const handleCancel = useCallback(() => {
    const hasContent = formData.title || formData.content;
    if (hasContent) {
      setShowCancelDialog(true);
    } else {
      router.push(ROUTES.COMMUNITY.LIST);
    }
  }, [formData.title, formData.content, router]);

  const handleConfirmCancel = useCallback(() => {
    setShowCancelDialog(false);
    router.push(ROUTES.COMMUNITY.LIST);
  }, [router]);

  const handleCloseCancelDialog = useCallback(() => {
    setShowCancelDialog(false);
  }, []);

  const createFormData = useCallback((data: FormData, userId: string): PostForm => ({
    title: data.title,
    content: data.content,
    categoryId: data.categoryId,
    authorId: userId
  }), []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = validatePost(formData);

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return false;
    }

    setErrors({});

    const form = createFormData(formData, user!.id);

    createPostMutation.mutate(
      { form },
      {
        onSuccess: (post) => {
          showToast('게시글이 등록되었습니다.', 'success');
          router.push(ROUTES.COMMUNITY.DETAIL(post.id));
        },
        onError: () => {
          showToast('게시글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
        }
      }
    );
    return true;
  }, [formData, user, createFormData, createPostMutation, router, showToast]);

  return {
    // 상태
    formData,
    errors,
    isSubmitting: createPostMutation.isPending,
    showCancelDialog,
    
    // 액션
    updateFormData,
    setErrors,
    handleCancel,
    handleSubmit,
    handleConfirmCancel,
    handleCloseCancelDialog,
  };
}