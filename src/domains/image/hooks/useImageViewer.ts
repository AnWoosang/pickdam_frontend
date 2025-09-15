"use client";

import { useState, useCallback } from 'react';

export function useImageViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openViewer = useCallback((imageList: string[], initialIndex: number = 0) => {
    setImages(imageList);
    setCurrentIndex(initialIndex);
    setIsOpen(true);
  }, []);

  const closeViewer = useCallback(() => {
    setIsOpen(false);
    setCurrentIndex(0);
    setImages([]);
  }, []);

  const goToImage = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  }, [images.length]);

  return {
    isOpen,
    images,
    currentIndex,
    openViewer,
    closeViewer,
    goToImage,
  };
}