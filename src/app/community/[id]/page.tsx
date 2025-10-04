import { ResponsiveLayout } from '@/shared/layout/ResponsiveLayout';
import { PostDetailPage } from '@/domains/community/components/post/PostDetailPage';

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetail({ params }: PostDetailPageProps) {
  const { id } = await params;

  return (
    <ResponsiveLayout showHeader={true} showFooter={true}>
      <PostDetailPage postId={id} />
    </ResponsiveLayout>
  );
}