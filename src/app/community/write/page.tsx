import { MainLayout } from '@/shared/layout/MainLayout';
import { PostWritePage } from '@/domains/community/components/post/write/PostWritePage';
import { ProtectedRoute } from '@/domains/auth/components/ProtectedRoute';

export default function CommunityWrite() {
  return (
    <ProtectedRoute>
      <MainLayout showHeader={true} showFooter={false}>
        <PostWritePage />
      </MainLayout>
    </ProtectedRoute>
  );
}