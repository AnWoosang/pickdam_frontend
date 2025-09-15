'use client';

import React from 'react';
import Image from 'next/image';

import { useImageViewer } from '@/domains/image/hooks/useImageViewer';
import { ImageViewerModal } from '@/shared/components/ImageViewerModal';

interface ImageGalleryProps {
  images: string[];
  alt?: string;
  className?: string;
  imageClassName?: string;
  thumbnailClassName?: string;
  showThumbnails?: boolean;
  aspectRatio?: 'square' | 'video' | 'auto';
  quality?: number;
  priority?: boolean;
}

export function ImageGallery({
  images,
  alt = 'Image',
  className = '',
  imageClassName = '',
  thumbnailClassName = '',
  showThumbnails = true,
  aspectRatio = 'square',
  quality = 85,
  priority = false
}: ImageGalleryProps) {
  const imageViewer = useImageViewer();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: 'aspect-auto'
  };

  if (!images.length) return null;

  const handleImageClick = (index: number) => {
    console.log('ImageGallery click:', { images, index });
    imageViewer.openViewer(images, index);
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className={className}>
      {/* Main Image */}
      <div className="relative mb-4">
        <div 
          className={`${aspectRatioClasses[aspectRatio]} bg-gray-100 rounded-lg overflow-hidden relative cursor-pointer hover:opacity-95 transition-opacity ${imageClassName}`}
          onClick={() => handleImageClick(selectedIndex)}
        >
          <Image
            src={images[selectedIndex]}
            alt={`${alt} ${selectedIndex + 1}`}
            fill
            className="object-cover"
            quality={quality}
            priority={priority}
          />
        </div>
      </div>

      {/* Thumbnails - 1개 이상 이미지가 있을 때만 표시 */}
      {showThumbnails && images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 relative transition-all ${
                selectedIndex === index
                  ? 'border-primary'
                  : 'border-gray-200 hover:border-gray-300'
              } ${thumbnailClassName}`}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Viewer Modal */}
      <ImageViewerModal
        isOpen={imageViewer.isOpen}
        onClose={imageViewer.closeViewer}
        images={imageViewer.images}
        currentIndex={imageViewer.currentIndex}
        onIndexChange={imageViewer.goToImage}
      />
    </div>
  );
}