"use client";

import Image from 'next/image';

export enum AdBannerSize {
  leaderboard = 'leaderboard', // 728x90 또는 반응형
  rectangle = 'rectangle', // 300x250
  skyscraper = 'skyscraper', // 160x600
}

interface AdBannerProps {
  size: AdBannerSize;
  imageUrl: string;
  link?: string;
  alt?: string;
}

const sizeClasses = {
  [AdBannerSize.leaderboard]: 'aspect-[728/90] max-w-[728px]',
  [AdBannerSize.rectangle]: 'aspect-[300/250] max-w-[300px]',
  [AdBannerSize.skyscraper]: 'aspect-[160/600] max-w-[160px]',
};

export function AdBanner({ 
  size, 
  imageUrl, 
  link, 
  alt = '광고 배너' 
}: AdBannerProps) {
  const content = (
    <div className={`w-full ${sizeClasses[size]} bg-ad-banner rounded-lg overflow-hidden mx-auto`}>
      <Image
        src={imageUrl}
        alt={alt}
        width={728}
        height={90}
        className="object-cover w-full h-full"
      />
    </div>
  );

  if (link) {
    return (
      <a 
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}