'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/community';
import { mockComments } from '@/constants/post-mock-data';
import { PostHeader } from './PostHeader';
import { PostContent } from './PostContent';
import { CommentSection } from './CommentSection';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

interface PostDetailPageProps {
  post: Post;
}

export function PostDetailPage({ post }: PostDetailPageProps) {
  const router = useRouter();
  
  // 해당 게시글의 댓글만 필터링
  const comments = useMemo(() => {
    return mockComments.filter(comment => comment.postId === post.id);
  }, [post.id]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content || '');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  const handleLike = () => {
    setIsLiked(!isLiked);
    // 구현 예정: API 호출
  };

  const handleEdit = () => {
    if (isEditing) {
      // 저장하기
      // 구현 예정: API 호출로 게시글 수정
      console.log('게시글 수정:', { title: editedTitle, content: editedContent });
      setIsEditing(false);
    } else {
      // 수정 모드 시작
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(post.title);
    setEditedContent(post.content || '');
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    // 구현 예정: API 호출로 게시글 삭제
    console.log('게시글 삭제');
    setShowDeleteDialog(false);
    router.push('/community');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: window.location.href,
        });
      } catch (error) {
        // 사용자가 공유를 취소한 경우 (AbortError) 또는 다른 에러
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('공유 중 오류가 발생했습니다:', error);
          // 공유 실패 시 클립보드 복사로 대체
          try {
            await navigator.clipboard.writeText(window.location.href);
            alert('공유에 실패하여 링크를 클립보드에 복사했습니다.');
          } catch (clipboardError) {
            console.error('클립보드 복사도 실패했습니다:', clipboardError);
          }
        }
        // AbortError인 경우 사용자가 취소한 것이므로 아무것도 하지 않음
      }
    } else {
      // 브라우저가 Web Share API를 지원하지 않는 경우
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크가 클립보드에 복사되었습니다.');
      } catch (error) {
        console.error('클립보드 복사 중 오류가 발생했습니다:', error);
        // 클립보드 접근이 안 되는 경우 수동으로 URL 표시
        prompt('다음 링크를 복사하세요:', window.location.href);
      }
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // 구현 예정: API 호출로 댓글 추가
      setNewComment('');
    }
  };

  return (
    <div>
      {/* 통합 게시글 컨테이너 */}
      <div className="bg-white py-6">
        <PostHeader 
          post={post}
          formatDate={formatDate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShare={handleShare}
          isEditing={isEditing}
          editedTitle={editedTitle}
          onTitleChange={setEditedTitle}
          onCancelEdit={handleCancelEdit}
        />
        
        <PostContent 
          post={post}
          isLiked={isLiked}
          onLike={handleLike}
          isEditing={isEditing}
          editedContent={editedContent}
          onContentChange={setEditedContent}
        />
        
        <CommentSection 
          comments={comments}
          newComment={newComment}
          onCommentChange={setNewComment}
          onCommentSubmit={handleCommentSubmit}
          formatDate={formatDate}
        />
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        message="게시글을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        confirmButtonColor="red"
      />
    </div>
  );
}