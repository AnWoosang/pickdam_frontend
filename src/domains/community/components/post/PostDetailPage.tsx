'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PostHeader } from '@/domains/community/components/post/PostHeader';
import { PostContent } from '@/domains/community/components/post/PostContent';
import { CommentSection } from '@/domains/community/components/comment/CommentSection';
import { usePostDetailPage } from '@/domains/community/hooks/usePostDetailPage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { Breadcrumb, BreadcrumbItem } from '@/shared/components/Breadcrumb';
import { ROUTES } from '@/app/router/routes';

interface PostDetailPageProps {
  postId: string;
}

export function PostDetailPage({ postId }: PostDetailPageProps) {
  const router = useRouter();
  // 부모에서 관리해야 할 상태와 로직
  const {
    post,
    loading,
    queryError,
    user,
    deletePost,
  } = usePostDetailPage({ postId });

  
  const handlePostDelete = () => {
    deletePost({
      onSuccess: () => {
        router.push(ROUTES.COMMUNITY.LIST);
      },
    });
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  // 에러 상태
  if (queryError) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <ErrorMessage 
          message="게시글을 불러오는데 실패했습니다. 잠시 후 다시 실행해주세요."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // 게시글이 없는 경우
  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">게시글을 찾을 수 없습니다</h2>
          <button 
            onClick={() => router.push(ROUTES.COMMUNITY.LIST)}
            className="text-primary hover:text-primaryDark underline"
          >
            커뮤니티로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 브레드크럼브 아이템 생성
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: '홈', href: '/' },
    { label: '커뮤니티', href: '/community' },
    { label: '게시글', isActive: true }
  ];


  return (
    <div>
      {/* 브레드크럼브 */}
      <div className="bg-white">
        <div className="mt-5">
          <Breadcrumb 
            items={breadcrumbItems}
          />
        </div>
      </div>

      {/* 통합 게시글 컨테이너 */}
      <div className="bg-white py-5">
        <PostHeader 
          post={post}
          user={user}
          onPostDelete={handlePostDelete}
        />
        
        <PostContent 
          post={post}
        />
        
        <CommentSection
          postId={postId}
          postCommentCount={post.commentCount}
        />
      </div>

    </div>
  );
}