'use client';

import React from 'react';
import Link from 'next/link';
import { Post } from '@/types/community';
import { Button } from '@/components/common/Button';
import { Divider } from '@/components/common/Divider';
import { IoShareOutline } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';
import { IoTrashOutline } from 'react-icons/io5';
import { IoHeart, IoEye, IoChatbubble } from 'react-icons/io5';

interface PostHeaderProps {
  post: Post;
  formatDate: (dateString: string) => string;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  isEditing?: boolean;
  editedTitle?: string;
  onTitleChange?: (value: string) => void;
  onCancelEdit?: () => void;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ 
  post, 
  formatDate, 
  onEdit, 
  onDelete, 
  onShare, 
  isEditing = false,
  editedTitle = '',
  onTitleChange,
  onCancelEdit
}) => {
  return (
    <div>
      {/* 게시판 정보 */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 ">
        <span>📋</span>
        <Link 
          href={post.category?.id ? `/community?category=${post.category.id}` : '/community'}
          className="font-medium hover:text-gray-700 hover:underline transition-colors cursor-pointer"
        >
          {post.category?.name || '자유게시판'}
        </Link>
        <span>›</span>
        <span>게시글</span>
      </div>

      <div className="flex items-start justify-between mb-8 mt-8">
        <div className="flex-1 mr-4">
          {isEditing ? (
            <textarea
              value={editedTitle}
              onChange={(e) => onTitleChange?.(e.target.value)}
              className="w-full text-3xl font-bold text-black bg-white border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              placeholder="제목을 입력하세요"
              rows={2}
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900">
              {post.title}
            </h1>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button variant="primary" size="small" onClick={onEdit}>
                저장
              </Button>
              <Button variant="secondary" size="small" onClick={onCancelEdit}>
                취소
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="small" icon={<IoShareOutline size={16} />} onClick={onShare}>
                <span className="sr-only">공유하기</span>
              </Button>
              <Button variant="ghost" size="small" icon={<MdEdit size={16} />} onClick={onEdit}>
                <span className="sr-only">수정</span>
              </Button>
              <Button variant="ghost" size="small" icon={<IoTrashOutline size={16} />} onClick={onDelete}>
                <span className="sr-only">삭제</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between font-medium text-sm text-black mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-black">
                {post.author[0]}
              </span>
            </div>
            <span className="font-medium text-black">{post.author}</span>
          </div>
          <span>{formatDate(post.createdAt)}</span>
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
    </div>
  );
};