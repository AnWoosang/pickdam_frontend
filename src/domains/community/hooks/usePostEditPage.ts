'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { Post, PostForm } from '@/domains/community/types/community';
import { usePostQuery, useUpdatePostMutation } from '@/domains/community/hooks/usePostQueries';

interface FormErrors {
  title?: string;
  content?: string;
  category?: string;
}

export function usePostEditPage(postId: string) {
  const router = useRouter();
  const { user } = useAuthUtils();
  const [formData, setFormData] = useState<Omit<PostForm, 'authorId'>>({
    title: '',
    content: '',
    categoryId: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // 게시글 상세 정보 가져오기
  const {
    data: post,
    isLoading,
    error
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
    }
  }, [post]);

  const updateFormData = (updates: Partial<Omit<PostForm, 'authorId'>>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const setFormErrors = (errorUpdates: Partial<FormErrors>) => {
    setErrors(prev => ({ ...prev, ...errorUpdates }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    } else if (formData.title.length > 99) {
      newErrors.title = '제목은 99자 이하로 입력해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    }

    if (!formData.categoryId) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // 게시글 업데이트
      await updatePostMutation.mutateAsync({
        id: postId,
        form: {
          title: formData.title,
          content: formData.content,
          categoryId: formData.categoryId!,
          authorId: user?.id || ''
        }
      });

      // 게시글 상세 페이지로 이동
      router.push(`/community/${postId}`);
    } catch (error) {
      console.error('게시글 수정 실패:', error);
    }
  };

  return {
    post,
    formData,
    errors,
    isSubmitting: updatePostMutation.isPending,
    isLoading,
    updateFormData,
    setFormErrors,
    handleSubmit,
  };
}