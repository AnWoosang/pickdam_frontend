"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { RecentProductsTab } from '@/shared/layout/header/components/RecentProductsTab';
import { WishlistTab } from '@/shared/layout/header/components/WishlistTab';
import { User } from '@/domains/user/types/user';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

type TabType = 'recent' | 'wishlist';

export const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<TabType>('recent');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white md:hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">
          {activeTab === 'recent' ? '최근 본 상품' : '찜한 상품'}
        </h2>
        <Button
          onClick={onClose}
          variant="ghost"
          size="small"
          noFocus={true}
          icon={<X className="w-5 h-5" />}
          className="!p-1.5 !rounded-full hover:bg-gray-100"
        />
      </div>

      {/* 탭 */}
      <div className="flex border-b border-gray-200">
        <Button
          onClick={() => setActiveTab('recent')}
          variant="ghost"
          className={`flex-1 !rounded-none !py-3 !text-sm !font-medium transition-colors ${
            activeTab === 'recent'
              ? '!text-primary border-b-2 border-primary'
              : '!text-gray-500 hover:!text-gray-700'
          }`}
          noFocus
        >
          최근 본 상품
        </Button>
        <Button
          onClick={() => setActiveTab('wishlist')}
          variant="ghost"
          className={`flex-1 !rounded-none !py-3 !text-sm !font-medium transition-colors ${
            activeTab === 'wishlist'
              ? '!text-primary border-b-2 border-primary'
              : '!text-gray-500 hover:!text-gray-700'
          }`}
          noFocus
        >
          찜한 상품
        </Button>
      </div>

      {/* 컨텐츠 */}
      <div className="overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
        {activeTab === 'recent' ? (
          <div className="p-4">
            <RecentProductsTab isActive={true} onToggle={() => {}} isMobileModal={true} />
          </div>
        ) : (
          <div className="p-4">
            <WishlistTab user={user} isActive={true} onToggle={() => {}} isMobileModal={true} />
          </div>
        )}
      </div>
    </div>
  );
};
