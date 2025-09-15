"use client";

import { validatePost } from '@/domains/community/validation/post';
import { useCreatePostMutation } from '@/domains/community/hooks/usePostQueries';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/domains/auth/store/authStore';
import { ROUTES } from '@/app/router/routes';
import { BusinessError, createBusinessError } from '@/shared/error/BusinessError';

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
  const { user } = useAuthStore();
  const createPostMutation = useCreatePostMutation();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    categoryId: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  // 에러 핸들러
  const createErrorHandler = useCallback((defaultMessage: string) => 
    (error: unknown): BusinessError => {
      if (error instanceof BusinessError) return error;
      if (error instanceof Error) return createBusinessError.dataProcessing(defaultMessage, error.message);
      return createBusinessError.dataProcessing(defaultMessage);
    }, 
    []
  );

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

  const createFormData = useCallback((data: FormData, userId: string) => ({
    title: data.title,
    content: data.content,
    categoryId: data.categoryId,
    authorId: userId
  }), []);

  const handleSubmit = useCallback(async (imageUrls: string[] = [], customFormData?: FormData) => {
    const dataToUse = customFormData || formData;
    
    const validationResult = validatePost(dataToUse);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return false;
    }
    
    setErrors({});

    // ProtectedRoute와 canCreatePost로 이미 인증 확인됨
    const form = createFormData(dataToUse, user!.id);
    
    createPostMutation.mutate(
      { form, imageUrls },
      {
        onSuccess: (post) => {
          toast.success('게시글이 등록되었습니다.');
          // 생성된 게시글 상세 페이지로 이동
          router.push(ROUTES.COMMUNITY.DETAIL(post.id));
        },
        onError: (error) => {
          const processedError = createErrorHandler('게시글 등록에 실패했습니다.')(error);
          console.error('Post creation failed:', processedError);
          toast.error(processedError.message);
        }
      }
    );
    return true;
  }, [formData, user, createFormData, createPostMutation, createErrorHandler, router]);

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