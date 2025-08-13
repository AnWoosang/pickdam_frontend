import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/mainLayout';
import { PostDetailPage } from '@/features/community/components/postDetailPage';
import { mockPosts } from '@/constants/mock-data';

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetail({ params }: PostDetailPageProps) {
  const { id } = await params;
  
  // Mock 데이터에서 해당 게시글 찾기
  const post = mockPosts.find(p => p.id === id);
  
  if (!post) {
    notFound();
  }

  return (
    <MainLayout showHeader={true} showFooter={true}>
      <div className="py-8">
        <PostDetailPage post={post} />
      </div>
    </MainLayout>
  );
}

// 정적 파라미터 생성 (옵션)
export async function generateStaticParams() {
  return mockPosts.map((post) => ({
    id: post.id,
  }));
}