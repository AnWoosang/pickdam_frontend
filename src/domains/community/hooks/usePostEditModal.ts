"use client";

import { useState, useEffect } from 'react';
import { Post as ApiPost } from '@/domains/community/types/community';
import { usePostImageEditor } from '@/domains/community/hooks/usePostImageEditor';
import { validatePost } from '@/domains/community/validation/post';

interface PostFormData {
  title: string;
  content: string;
  categoryId: string;
}

interface PostFormErrors {
  title?: string;
  content?: string;
  category?: string;
}

interface UsePostEditModalOptions {
  post?: ApiPost;
  isOpen?: boolean;
  onSave?: (data: { title: string; content: string }) => void;
}

export function usePostEditModal({
  post,
  isOpen,
  onSave
}: UsePostEditModalOptions = {}) {
  // Image editor with existing image support
  const imageEditor = usePostImageEditor({
    supportExistingImages: true
  });
  
  const [formData, setFormData] = useState<PostFormData>({
    title: post?.title || '',
    content: post?.content || '',
    categoryId: post?.category?.id || ''
  });
  
  const [errors, setErrors] = useState<PostFormErrors>({});


  // Initialize form data when modal opens (edit mode)
  const parseExistingImages = imageEditor.parseExistingImages;
  
  useEffect(() => {
    if (isOpen && post) {
      setFormData({
        title: post.title,
        content: post.content || '',
        categoryId: post.category?.id || ''
      });
      setErrors({});
      
      // Parse existing images
      if (post.content && parseExistingImages) {
        parseExistingImages(post.content);
      }
    }
  }, [isOpen, post, parseExistingImages]);

  const updateFormData = (updates: Partial<PostFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    
    // Clear errors for updated fields
    const clearedErrors = (Object.keys(updates) as Array<keyof PostFormData>).reduce((acc, key) => {
      if (key in errors) {
        acc[key as keyof PostFormErrors] = undefined;
      }
      return acc;
    }, {} as Partial<PostFormErrors>);
    
    if (Object.keys(clearedErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...clearedErrors }));
    }
  };

  const setFormErrors = (errorUpdates: { title?: string; content?: string; category?: string }) => {
    setErrors(prev => ({ ...prev, ...errorUpdates }));
  };


  const validateForm = () => {
    const validationResult = validatePost({
      title: formData.title,
      content: formData.content || '',
      categoryId: formData.categoryId,
    });
    
    setErrors(validationResult.errors);
    return validationResult.isValid;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!validateForm()) {
      return false;
    }

    try {
      // 1. Upload new images
      let updatedContent = formData.content || '';
      
      const uploadedImages = await imageEditor.uploadNewImages();
      
      // 2. Replace Data URLs with server URLs
      if (uploadedImages.length > 0) {
        updatedContent = imageEditor.replaceDataUrlsWithServerUrls(updatedContent, uploadedImages);
      }

      const finalData = {
        title: formData.title.trim(),
        content: updatedContent,
      };

      if (onSave) {
        onSave(finalData);
      }
      
      return { success: true, data: finalData };
    } catch (error) {
      console.error('Post processing failed:', error);
      // TODO: Add proper error logging/reporting in production
      return { success: false, error };
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      categoryId: ''
    });
    setErrors({});
    imageEditor.resetImages();
  };


  return {
    // 상태
    formData,
    errors,
    imageEditor,
    
    // 액션
    updateFormData,
    setFormErrors,
    validateForm,
    handleSubmit,
    resetForm,
  };
}