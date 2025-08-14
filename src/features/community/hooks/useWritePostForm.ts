import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreatePostData } from '@/types/community';
import { validatePost } from '@/utils/validation';

interface FormErrors {
  title?: string;
  content?: string;
  category?: string;
}

export function useWritePostForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    content: '',
    categoryId: undefined,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateTitle = (value: string) => {
    setFormData(prev => ({ ...prev, title: value }));
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
  };

  const updateContent = (value: string) => {
    setFormData(prev => ({ ...prev, content: value }));
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: undefined }));
    }
  };

  const updateCategory = (categoryId: string) => {
    setFormData(prev => ({ ...prev, categoryId }));
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: undefined }));
    }
  };

  const handleCancel = () => {
    const hasContent = formData.title || formData.content;
    if (hasContent) {
      if (confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
        router.push('/community');
      }
    } else {
      router.push('/community');
    }
  };

  const handleSubmit = async (images: File[]) => {
    const validationResult = validatePost(formData);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return false;
    }
    
    setErrors({});
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('게시글이 등록되었습니다.');
      router.push('/community');
      return true;
    } catch {
      alert('게시글 등록에 실패했습니다.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    updateTitle,
    updateContent,
    updateCategory,
    handleCancel,
    handleSubmit,
  };
}