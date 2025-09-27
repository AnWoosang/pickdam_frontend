'use client';

import { Post } from '@/domains/community/types/community';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/Button';
import { Avatar } from '@/shared/components/Avatar';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Divider } from '@/shared/components/Divider';
import { IoShareOutline } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';
import { IoTrashOutline } from 'react-icons/io5';
import { IoHeart, IoEye, IoChatbubble } from 'react-icons/io5';
import { formatAbsoluteDate } from '@/shared/utils/Format';
import { User } from '@/domains/user/types/user';
import { usePostHeader } from '@/domains/community/hooks/usePostHeader';
import { ROUTES } from '@/app/router/routes';

interface PostHeaderProps {
  post: Post;
  user: User | null;
  onPostDelete?: () => void;
}

export const PostHeader: React.FC<PostHeaderProps> = ({
  post,
  user,
  onPostDelete
}) => {
  const router = useRouter();

  // UI 상태 관리
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 비즈니스 로직
  const {
    isOwner,
    handleConfirmDelete,
    handleShare,
  } = usePostHeader({ post, user, onPostDelete });

  // UI 핸들러들
  const handleEdit = () => {
    router.push(ROUTES.COMMUNITY.EDIT(post.id));
  };
  
  const handleDelete = () => setShowDeleteDialog(true);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1 mr-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {post.title}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="small" icon={<IoShareOutline size={16} />} onClick={handleShare}>
            <span className="sr-only">공유하기</span>
          </Button>
          {isOwner && (
            <>
              <Button variant="ghost" size="small" icon={<MdEdit size={16} />} onClick={handleEdit}>
                <span className="sr-only">수정</span>
              </Button>
              <Button variant="ghost" size="small" icon={<IoTrashOutline size={16} />} onClick={handleDelete}>
                <span className="sr-only">삭제</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between font-medium text-sm text-black mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar 
              src={post.profileImageUrl}
              alt={`${post.authorNickname} 프로필 사진`}
              size="small"
            />
            <span className="font-medium text-black">
              {post.authorNickname}
            </span>
          </div>
          <span>{formatAbsoluteDate(post.createdAt)}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <IoEye className="text-gray-500" size={14} /> {post.viewCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <IoHeart className="text-red-500" size={14} /> {post.likeCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <IoChatbubble className="text-gray-500" size={14} /> {post.commentCount || 0}
          </span>
        </div>
      </div>
      <Divider color="medium" spacing="none" />

      {/* 게시글 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          setShowDeleteDialog(false);
          handleConfirmDelete();
        }}
        message="게시글을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
      />
    </div>
  );
};