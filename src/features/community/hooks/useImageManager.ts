import { useState, useRef, useCallback } from 'react';

export function useImageManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const insertImageToText = useCallback((
    imageUrl: string, 
    fileName: string, 
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    content: string,
    onContentChange: (content: string) => void
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const textBefore = content.substring(0, cursorPosition);
    const textAfter = content.substring(cursorPosition);
    
    const imageMarkdown = `\n![${fileName}](${imageUrl})\n`;
    const newContent = textBefore + imageMarkdown + textAfter;
    
    onContentChange(newContent);
    
    setTimeout(() => {
      const newCursorPosition = cursorPosition + imageMarkdown.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  }, []);

  const addImages = useCallback((
    newFiles: File[], 
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    content: string,
    onContentChange: (content: string) => void
  ) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    if (images.length + imageFiles.length > 10) {
      alert('이미지는 최대 10장까지 첨부할 수 있습니다.');
      return;
    }

    imageFiles.forEach(file => {
      setImages(prev => [...prev, file]);

      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrls(prev => [...prev, previewUrl]);

      insertImageToText(previewUrl, file.name, textareaRef, content, onContentChange);
    });
  }, [images.length, insertImageToText]);

  const handleImageUpload = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    content: string,
    onContentChange: (content: string) => void
  ) => {
    const files = Array.from(e.target.files || []);
    addImages(files, textareaRef, content, onContentChange);
    
    if (e.target) {
      e.target.value = '';
    }
  }, [addImages]);

  const removeImage = useCallback((index: number, content: string, onContentChange: (content: string) => void) => {
    const removedImageUrl = imagePreviewUrls[index];
    
    const imageRegex = new RegExp(`!\\[([^\\]]*)\\]\\(${removedImageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)\\n?`, 'g');
    const updatedContent = content.replace(imageRegex, '');
    
    onContentChange(updatedContent);
    
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  }, [imagePreviewUrls, images]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((
    e: React.DragEvent,
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    content: string,
    onContentChange: (content: string) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    addImages(imageFiles, textareaRef, content, onContentChange);
  }, [addImages]);

  const handlePaste = useCallback((
    e: React.ClipboardEvent,
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    content: string,
    onContentChange: (content: string) => void
  ) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '');
          const fileName = `clipboard-image-${timestamp}.${file.type.split('/')[1]}`;
          const renamedFile = new File([file], fileName, { type: file.type });
          imageFiles.push(renamedFile);
        }
      }
    }

    if (imageFiles.length === 0) return;

    e.preventDefault();

    if (images.length + imageFiles.length > 10) {
      alert('이미지는 최대 10장까지 첨부할 수 있습니다.');
      return;
    }

    addImages(imageFiles, textareaRef, content, onContentChange);
  }, [addImages]);

  const cleanupUnusedImages = useCallback((content: string) => {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const usedImageUrls = new Set<string>();
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      const [, , src] = match;
      usedImageUrls.add(src);
    }

    const unusedIndices: number[] = [];
    imagePreviewUrls.forEach((url, index) => {
      if (!usedImageUrls.has(url)) {
        unusedIndices.push(index);
      }
    });

    if (unusedIndices.length > 0) {
      const newImages = images.filter((_, index) => !unusedIndices.includes(index));
      const newPreviewUrls = imagePreviewUrls.filter((_, index) => !unusedIndices.includes(index));
      
      unusedIndices.forEach(index => {
        URL.revokeObjectURL(imagePreviewUrls[index]);
      });

      setImages(newImages);
      setImagePreviewUrls(newPreviewUrls);
    }
  }, [images, imagePreviewUrls]);

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const insertImageAtCursor = useCallback((
    index: number,
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    content: string,
    onContentChange: (content: string) => void
  ) => {
    const imageUrl = imagePreviewUrls[index];
    const fileName = images[index]?.name || `image-${index + 1}`;
    insertImageToText(imageUrl, fileName, textareaRef, content, onContentChange);
  }, [imagePreviewUrls, images, insertImageToText]);

  return {
    fileInputRef,
    images,
    imagePreviewUrls,
    isDragOver,
    handleImageUpload,
    removeImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handlePaste,
    cleanupUnusedImages,
    triggerImageUpload,
    insertImageAtCursor,
  };
}