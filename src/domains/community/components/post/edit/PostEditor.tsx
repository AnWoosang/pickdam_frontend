"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { useQuill } from '@/domains/community/hooks/useQuill';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="min-h-[300px] border border-gray-300 rounded-lg p-4">에디터 로딩 중...</div>
});

// Constants
const TITLE_MAX_LENGTH = 99;

// Types
interface PostEditorProps {
  title: string;
  content: string;
  onChange: (updates: { title?: string; content?: string }) => void;
  onErrorChange: (errors: { title?: string; content?: string }) => void;
  titleError?: string;
  contentError?: string;
}

export function PostEditor({
  title,
  content,
  onChange,
  onErrorChange,
  titleError,
  contentError,
}: PostEditorProps) {
  // Quill CSS는 글로벌 CSS에서 처리

  // UI 상태
  
  const handleTitleChange = (newTitle: string) => {
    onChange({ title: newTitle });
    if (titleError) {
      onErrorChange({ title: undefined });
    }
  };

  const handleContentChange = (newContent: string) => {
    onChange({ content: newContent });
    if (contentError) {
      onErrorChange({ content: undefined });
    }
  };

  // Use Quill hook
  const { textLength, modules, handleChange } = useQuill({
    content,
    onChange: handleContentChange
  });
  

  return (
    <div className="space-y-6">
      {/* 제목 입력 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="게시글 제목을 입력하세요"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            titleError ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={TITLE_MAX_LENGTH}
        />
        <div className="flex justify-between items-center text-sm mt-1">
          {titleError ? (
            <p className="text-red-500">{titleError}</p>
          ) : (
            <div />
          )}
          <span className="text-gray-500">{title.length}/{TITLE_MAX_LENGTH}</span>
        </div>
      </div>

      {/* 내용 입력 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            내용 <span className="text-red-500">*</span>
          </label>
        </div>
        
        <div className="space-y-4">
          {/* Quill 에디터 */}
          <div
            className={`relative ${
              contentError ? 'ring-2 ring-red-500' : ''
            }`}
          >
            {/* ReactQuill 컴포넌트 */}
            <ReactQuill
              theme="snow"
              modules={modules}
              value={content}
              onChange={handleChange}
              className="min-h-[300px] quill-editor"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm mt-1">
          {contentError ? (
            <p className="text-red-500">{contentError}</p>
          ) : (
            <div />
          )}
          <span className="text-gray-500">{textLength}자</span>
        </div>
      </div>

    </div>
  );
}