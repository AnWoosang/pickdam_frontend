import { useRef, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/common/Button';
import { ImageIcon, Eye, Edit } from 'lucide-react';

interface PostEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDragOver: boolean;
  isPreviewMode: boolean;
  onPreviewModeChange: (isPreview: boolean) => void;
  titleError?: string;
  contentError?: string;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export function PostEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onPaste,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragOver,
  isPreviewMode,
  onPreviewModeChange,
  titleError,
  contentError,
  textareaRef,
}: PostEditorProps) {
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const actualTextareaRef = textareaRef || internalTextareaRef;

  const renderPreviewContent = useMemo(() => {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index);
        if (textBefore) {
          parts.push(
            <div key={`text-${lastIndex}`} className="whitespace-pre-wrap">
              {textBefore}
            </div>
          );
        }
      }

      const [, alt, src] = match;
      parts.push(
        <div key={`img-${match.index}`} className="my-4">
          <Image
            src={src}
            alt={alt}
            width={600}
            height={400}
            className="max-w-full h-auto rounded-lg border border-gray-300"
            style={{ maxHeight: '400px' }}
          />
          <p className="text-sm text-gray-500 mt-1">{alt}</p>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      const textAfter = content.substring(lastIndex);
      if (textAfter) {
        parts.push(
          <div key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {textAfter}
          </div>
        );
      }
    }

    return parts.length > 0 ? parts : (
      <div className="text-gray-400 italic">
        내용을 입력하면 여기에 미리보기가 표시됩니다.
      </div>
    );
  }, [content]);

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
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="게시글 제목을 입력하세요"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            titleError ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={99}
        />
        <div className="flex justify-between items-center text-sm mt-1">
          {titleError ? (
            <p className="text-red-500">{titleError}</p>
          ) : (
            <div />
          )}
          <span className="text-gray-500">{title.length}/99</span>
        </div>
      </div>

      {/* 내용 입력 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            내용 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="small"
              onClick={() => onPreviewModeChange(false)}
              className={!isPreviewMode ? 'bg-primary/10 text-primary' : 'text-gray-600'}
            >
              <Edit className="w-4 h-4 mr-1" />
              편집
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="small"
              onClick={() => onPreviewModeChange(true)}
              className={isPreviewMode ? 'bg-primary/10 text-primary' : 'text-gray-600'}
            >
              <Eye className="w-4 h-4 mr-1" />
              미리보기
            </Button>
          </div>
        </div>
        
        {!isPreviewMode ? (
          <div 
            className={`relative ${isDragOver ? 'ring-2 ring-primary ring-opacity-50' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <textarea
              ref={actualTextareaRef}
              id="content"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              onPaste={onPaste}
              placeholder="게시글 내용을 입력하세요&#10;&#10;💡 팁: &#10;• 이미지를 드래그해서 텍스트 중간에 삽입&#10;• 아래 이미지를 클릭해서 커서 위치에 삽입&#10;• Ctrl+V로 클립보드 이미지 붙여넣기&#10;• 이미지 선택하면 자동으로 커서 위치에 삽입됩니다"
              rows={15}
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
        ) : (
          <div className="w-full min-h-[384px] px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
            <div className="prose max-w-none">
              {renderPreviewContent}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm mt-1">
          {contentError ? (
            <p className="text-red-500">{contentError}</p>
          ) : (
            <div />
          )}
          <span className="text-gray-500">{content.length}자</span>
        </div>
      </div>
    </div>
  );
}