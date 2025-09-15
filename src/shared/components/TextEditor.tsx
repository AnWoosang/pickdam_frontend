'use client';

import { useRef } from 'react';
import {
  Edit,
  Eye,
  ImageIcon
} from 'lucide-react';

import { Button } from '@/shared/components/Button';

interface TextEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onPaste?: (e: React.ClipboardEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isDragOver?: boolean;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  showPreview?: boolean;
  contentError?: string;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  label?: string;
  required?: boolean;
}

export function TextEditor({
  content,
  onContentChange,
  onPaste,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragOver = false,
  placeholder = "내용을 입력하세요",
  rows = 10,
  maxLength,
  showPreview = false,
  contentError,
  textareaRef,
  label = "내용",
  required = false
}: TextEditorProps) {
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const actualTextareaRef = textareaRef || internalTextareaRef;


  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {showPreview && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="small"
              className="text-gray-600"
            >
              <Edit className="w-4 h-4 mr-1" />
              편집
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="small"
              className="text-gray-600"
            >
              <Eye className="w-4 h-4 mr-1" />
              미리보기
            </Button>
          </div>
        )}
      </div>
      
      <div 
        className={`relative ${isDragOver ? 'ring-2 ring-primary ring-opacity-50' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <textarea
          ref={actualTextareaRef}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          onPaste={onPaste}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y ${
            contentError ? 'border-red-500' : isDragOver ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
        />
        {isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg border-2 border-dashed border-primary pointer-events-none">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 text-primary mx-auto mb-2" />
              <p className="text-primary font-medium">이미지를 여기에 드롭하세요</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center text-sm mt-1">
        {contentError ? (
          <p className="text-red-500">{contentError}</p>
        ) : (
          <div />
        )}
        {maxLength && (
          <span className="text-gray-500">{content.length}/{maxLength}</span>
        )}
      </div>
    </div>
  );
}