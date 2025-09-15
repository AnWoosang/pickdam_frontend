import { MainLayout } from '@/shared/layout/MainLayout';
import { PostDetailPage } from '@/domains/community/components/post/PostDetailPage';

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetail({ params }: PostDetailPageProps) {
  const { id } = await params;

  return (
    <MainLayout showHeader={true} showFooter={true}>
      <PostDetailPage postId={id} />
    </MainLayout>
  );
}