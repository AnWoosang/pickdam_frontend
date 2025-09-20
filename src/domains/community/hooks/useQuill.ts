"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import type ReactQuill from 'react-quill-new';

// 타입 정의
declare global {
  interface Window {
    Quill: any;
  }
}

// Hook interface
interface UseQuillOptions {
  content: string;
  onChange: (content: string) => void;
}

interface UseQuillReturn {
  quillRef: React.RefObject<ReactQuill | null>;
  textLength: number;
  modules: any;
  handleChange: (value: string) => void;
}

export function useQuill({
  content,
  onChange
}: UseQuillOptions): UseQuillReturn {
  const quillRef = useRef<ReactQuill>(null);
  const [textLength, setTextLength] = useState(0);
  const [modulesReady, setModulesReady] = useState(false);

  // 모듈 준비 상태 설정
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setModulesReady(true);
    }
  }, []);

  const modules = useMemo(() => {
    const baseModules: any = {
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
  }, [modulesReady]);

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
    quillRef,
    textLength,
    modules,
    handleChange
  };
}