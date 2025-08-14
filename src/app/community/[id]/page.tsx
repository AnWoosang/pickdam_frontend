import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { PostDetailPage } from '@/features/community/components/detail/PostDetailPage';
import { getPostById } from '@/constants/post-mock-data';

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetail({ params }: PostDetailPageProps) {
  const { id } = await params;
  
  // Mock 데이터에서 해당 게시글 찾기
  const post = getPostById(id);
  
  if (!post) {
    notFound();
  }

  return (
    <MainLayout showHeader={true} showFooter={true}>
        <PostDetailPage post={post} />
    </MainLayout>
  );
}

// 정적 파라미터 생성 (옵션)
export async function generateStaticParams() {
  const { mockPosts } = await import('@/constants/post-mock-data');
  return mockPosts.map((post) => ({
    id: post.id,
  }));
}