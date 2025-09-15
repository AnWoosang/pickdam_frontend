"use client";

import { useRef, useState, useCallback, useEffect } from 'react';

// Quill types
interface QuillModule {
  [key: string]: unknown;
}

interface QuillToolbar {
  addHandler?: (name: string, handler: () => void) => void;
}

interface QuillInstance {
  root: HTMLElement;
  on: (event: string, handler: () => void) => void;
  getText: () => string;
  getModule: (name: string) => QuillToolbar | unknown;
  getSelection: () => { index: number } | null;
  getLength: () => number;
  insertEmbed: (index: number, type: string, value: string) => void;
  setSelection: (index: number) => void;
}

// Quill configuration
const QUILL_TOOLBAR_CONFIG = [
  [{ 'header': [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'align': [] }],
  ['blockquote', 'code-block'],
  ['link', 'image']
];

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'align', 'blockquote', 'code-block', 'link', 'image'
];

const QUILL_RESIZE_CONFIG = {
  locale: {
    center: 'center'
  }
};

const QUILL_THEME = 'snow';

function createQuillModules(includeResize = true) {
  const modules: QuillModule = {
    toolbar: QUILL_TOOLBAR_CONFIG
  };

  if (includeResize) {
    try {
      modules.resize = QUILL_RESIZE_CONFIG;
    } catch (_error) {
      // Resize module not available, using basic configuration
    }
  }

  return modules;
}

async function registerQuillModules() {
  try {
    const [quillModule, resizeModule] = await Promise.all([
      import('quill'),
      import('@botom/quill-resize-module')
    ]);

    const QuillClass = quillModule.default;
    const ResizeModule = resizeModule.default || resizeModule;
    
    QuillClass.register('modules/resize', ResizeModule);
    return { QuillClass, hasResize: true };
  } catch (_error) {
    const quillModule = await import('quill');
    return { QuillClass: quillModule.default, hasResize: false };
  }
}

// Hook interface
interface UseQuillOptions {
  content: string;
  onChange: (content: string) => void;
  onImageButtonClick?: () => void;
}

interface UseQuillReturn {
  quillRef: React.RefObject<HTMLDivElement | null>;
  quillInstance: QuillInstance | null;
  textLength: number;
  insertImage: (imageUrl: string) => void;
}

export function useQuill({ 
  content, 
  onChange, 
  onImageButtonClick 
}: UseQuillOptions): UseQuillReturn {
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<QuillInstance | null>(null);
  const [textLength, setTextLength] = useState(0);

  // Initialize Quill instance
  useEffect(() => {
    if (typeof window !== 'undefined' && !quillInstanceRef.current && quillRef.current) {
      registerQuillModules().then(({ QuillClass, hasResize }) => {
        if (!quillRef.current || quillInstanceRef.current) return;
        
        // Clear existing content
        quillRef.current.innerHTML = '';
        
        const modules = createQuillModules(hasResize);
        
        const quill = new QuillClass(quillRef.current, {
          theme: QUILL_THEME,
          modules,
          formats: QUILL_FORMATS
        });
        
        // Setup text change handler
        quill.on('text-change', () => {
          const html = quill.root.innerHTML;
          const textOnly = quill.getText().trim();
          setTextLength(textOnly.length);
          onChange(html);
        });
        
        // Setup image button handler
        if (onImageButtonClick) {
          const toolbar = quill.getModule('toolbar') as QuillToolbar;
          if (toolbar && toolbar.addHandler) {
            toolbar.addHandler('image', onImageButtonClick);
          }
        }
        
        quillInstanceRef.current = quill;
        
        // Set initial content
        if (content) {
          quill.root.innerHTML = content;
        }
      });
    }

    // Cleanup function
    return () => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current = null;
      }
    };
  }, [onChange, onImageButtonClick, content]);

  // Sync content changes
  useEffect(() => {
    if (quillInstanceRef.current && content !== quillInstanceRef.current.root.innerHTML) {
      quillInstanceRef.current.root.innerHTML = content;
    }
  }, [content]);

  // Insert image function
  const insertImage = useCallback((imageUrl: string) => {
    if (quillInstanceRef.current) {
      const quill = quillInstanceRef.current;
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      
      // Load image and insert
      const img = new window.Image();
      img.onload = () => {
        quill.insertEmbed(index, 'image', imageUrl);
        quill.setSelection(index + 1);
      };
      
      img.onerror = () => {
        // Fallback insertion even if image fails to load
        quill.insertEmbed(index, 'image', imageUrl);
        quill.setSelection(index + 1);
      };
      
      img.src = imageUrl;
    }
  }, []);

  return {
    quillRef,
    quillInstance: quillInstanceRef.current,
    textLength,
    insertImage
  };
}