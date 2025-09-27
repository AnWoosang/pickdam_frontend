'use client';

import React from 'react';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import {
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { BaseModal } from '@/shared/components/BaseModal';
import { Button } from '@/shared/components/Button';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export function ImageViewerModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange
}: ImageViewerModalProps) {
  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    onIndexChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    onIndexChange(newIndex);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      handlePrevious();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    } else if (event.key === 'Escape') {
      onClose();
    }
  };

  if (!images.length || currentIndex < 0 || currentIndex >= images.length) {
    return null;
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      closable={true}
      closeOnBackdrop={true}
      title="이미지 보기"
    >
      <div 
        className="relative w-full h-[80vh] flex flex-col bg-white"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* 이미지 영역 */}
        <div className="relative flex-1 flex items-center justify-center px-6 py-4"
             style={{ minHeight: '400px' }}
        >
          {/* Previous Button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="medium"
              onClick={handlePrevious}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-10"
              icon={<ChevronLeft className="w-6 h-6" />}
            />
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="medium"
              onClick={handleNext}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-10"
              icon={<ChevronRight className="w-6 h-6" />}
            />
          )}

          {/* Main Image with Zoom */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Zoom>
              <Image
                src={images[currentIndex]}
                alt={`이미지 ${currentIndex + 1}/${images.length}`}
                width={800}
                height={600}
                className="object-contain max-w-full max-h-full w-auto h-auto border border-gray-300 rounded-lg shadow-lg"
              />
            </Zoom>
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200"></div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex justify-center px-6 py-4">
            <div className="flex gap-2 max-w-full overflow-x-auto">
              {images.map((image, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="small"
                  onClick={() => onIndexChange(index)}
                  className={`relative w-12 h-12 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 p-0 ${
                    index === currentIndex
                      ? 'border-primary'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`썸네일 ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}