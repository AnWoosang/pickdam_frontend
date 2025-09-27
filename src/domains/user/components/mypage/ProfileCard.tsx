import React, { memo } from 'react';
import { Edit2 } from 'lucide-react';
import { User as UserType } from '@/domains/user/types/user';
import { Button } from '@/shared/components/Button';
import { Avatar } from '@/shared/components/Avatar';

interface ProfileCardProps {
  user: UserType;
  onProfileEdit: () => void;
}

export const ProfileCard = memo<ProfileCardProps>(function ProfileCard({ user, onProfileEdit }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 relative">
      {/* 우측 상단 수정 버튼 */}
      <Button
        onClick={onProfileEdit}
        variant="ghost"
        size="small"
        icon={<Edit2 className="w-4 h-4" />}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded transition-colors"
      />

      <div className="flex items-center space-x-4">
        <Avatar
          src={user.profileImageUrl}
          alt={`${user.name} 프로필 사진`}
          size="large"
        />

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {user.name}
          </h2>
          <p className="text-sm text-gray-600 font-medium">
            @{user.nickname}
          </p>
          <p className="text-sm text-gray-600">
            {user.email}
          </p>
        </div>
      </div>
    </div>
  );
});