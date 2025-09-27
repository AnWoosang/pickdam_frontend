"use client";

import { useState, useEffect, useMemo } from 'react';

// 타입 정의
declare global {
  interface Window {
    Quill: unknown;
  }
}

// Hook interface
interface UseQuillOptions {
  content: string;
  onChange: (content: string) => void;
}

interface UseQuillReturn {
  textLength: number;
  modules: Record<string, unknown>;
  handleChange: (value: string) => void;
}

export function useQuill({
  content,
  onChange
}: UseQuillOptions): UseQuillReturn {
  const [textLength, setTextLength] = useState(0);

  // 모듈 준비 상태 설정 (사용하지 않으므로 제거)
  useEffect(() => {
    // Window 환경에서만 초기화
  }, []);

  const modules = useMemo(() => {
    const baseModules: Record<string, unknown> = {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link']
      ]
    };

    return baseModules;
  }, []);

  // Handle content changes and text length
  const handleChange = (value: string) => {
    const textOnly = (value || '').replace(/<[^>]*>/g, '').trim();
    setTextLength(textOnly.length);
    onChange(value || '');
  };


  // Update text length when content changes
  useEffect(() => {
    const textOnly = (content || '').replace(/<[^>]*>/g, '').trim();
    setTextLength(textOnly.length);
  }, [content]);

  return {
    textLength,
    modules,
    handleChange
  };
}