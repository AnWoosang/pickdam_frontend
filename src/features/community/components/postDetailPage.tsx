'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post, Comment } from '@/types/community';

interface PostDetailPageProps {
  post: Post;
  className?: string;
}

// Mock comments for demonstration
const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    content: '좋은 글이네요! 도움이 많이 됐습니다.',
    author: '댓글러',
    authorId: 'commenter1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likeCount: 3,
  },
  {
    id: '2',
    postId: '1',
    content: '저도 비슷한 경험이 있어서 공감됩니다.',
    author: '경험자',
    authorId: 'commenter2',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likeCount: 1,
  },
];

export function PostDetailPage({ post, className = '' }: PostDetailPageProps) {
  const router = useRouter();
  const [comments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  
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

  const handleBack = () => {
    router.push('/community');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: API 호출
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // TODO: API 호출로 댓글 추가
      setNewComment('');
    }
  };

  const CommentCard = React.memo(({ comment }: { comment: Comment }) => (
    <div className="border-b border-gray-100 py-4 last:border-b-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {comment.author[0]}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-900">{comment.author}</span>
            <span className="text-sm text-gray-500 ml-2">
              {formatDate(comment.createdAt)}
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <span className="sr-only">댓글 옵션</span>
          ⋮
        </button>
      </div>
      
      <p className="text-gray-700 mb-2 ml-11">
        {comment.content}
      </p>
      
      <div className="flex items-center gap-4 ml-11">
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500">
          ❤️ {comment.likeCount || 0}
        </button>
        <button className="text-sm text-gray-500 hover:text-blue-500">
          답글
        </button>
      </div>
    </div>
  ));

  CommentCard.displayName = 'CommentCard';

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* 뒤로가기 버튼 */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 transition-colors"
        >
          ← 목록으로 돌아가기
        </button>
      </div>

      {/* 게시글 헤더 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            {post.isPinned && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                📌 공지
              </span>
            )}
            {post.isPopular && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                🔥 인기
              </span>
            )}
            {post.category && (
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-gray-600">
              공유
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              신고
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {post.author[0]}
                </span>
              </div>
              <span className="font-medium">{post.author}</span>
            </div>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              👁️ {post.viewCount || 0}
            </span>
            <span className="flex items-center gap-1">
              💬 {post.commentCount || 0}
            </span>
          </div>
        </div>

        {/* 태그 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 게시글 본문 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="prose max-w-none">
          {post.content ? (
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          ) : (
            <p className="text-gray-500 italic">내용이 없습니다.</p>
          )}
        </div>

        {/* 게시글 액션 버튼 */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                isLiked
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {isLiked ? '❤️' : '🤍'} {(post.likeCount || 0) + (isLiked ? 1 : 0)}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              📤 공유
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              href={`/community/${post.id}/edit`}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              수정
            </Link>
            <button className="px-4 py-2 text-sm text-red-600 hover:text-red-700">
              삭제
            </button>
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          댓글 {comments.length}개
        </h3>

        {/* 댓글 작성 */}
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">U</span>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 작성하세요..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  댓글 등록
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              첫 번째 댓글을 작성해보세요!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}