'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { PostForm } from '@/domains/community/types/community';
import { usePostQuery, useUpdatePostMutation } from '@/domains/community/hooks/usePostQueries';
import { ROUTES } from '@/app/router/routes';
import { validatePost } from '@/domains/community/validation/post';
import { useUIStore } from '@/domains/auth/store/authStore';

interface FormErrors {
  title?: string;
  content?: string;
  category?: string;
}

export function usePostEditPage(postId: string) {
  const router = useRouter();
  const { user } = useAuthUtils();
  const { showToast } = useUIStore();
  const [formData, setFormData] = useState<Omit<PostForm, 'authorId'>>({
    title: '',
    content: '',
    categoryId: '',
  });
  const [hasFormChanges, setHasFormChanges] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // 게시글 상세 정보 가져오기
  const {
    data: post,
    isLoading,
  } = usePostQuery(postId);

  // 게시글 수정 mutation
  const updatePostMutation = useUpdatePostMutation();

  // 게시글 데이터로 폼 초기화
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content || '',
        categoryId: post.category?.id || '',
      });
      setHasFormChanges(false);
    }
  }, [post]);

  const updateFormData = (updates: Partial<Omit<PostForm, 'authorId'>>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setHasFormChanges(true);
  };

  const validateForm = (): boolean => {
    const validationResult = validatePost({
      title: formData.title,
      content: formData.content,
      categoryId: formData.categoryId
    });

    setErrors(validationResult.errors);
    return validationResult.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    updatePostMutation.mutate({
      id: postId,
      form: {
        title: formData.title,
        content: formData.content,
        categoryId: formData.categoryId!,
        authorId: user?.id || ''
      }
    }, {
      onSuccess: () => {
        showToast('게시글이 수정되었습니다.', 'success');
        router.push(ROUTES.COMMUNITY.DETAIL(postId));
      },
      onError: () => {
        showToast('게시글 수정에 실패했습니다.', 'error');
      }
    });
  };

  return {
    post,
    formData,
    errors,
    isSubmitting: updatePostMutation.isPending,
    isLoading,
    hasChanges: hasFormChanges,
    updateFormData,
    setErrors,
    handleSubmit,
  };
}