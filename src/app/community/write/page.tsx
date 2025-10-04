import { ResponsiveLayout } from '@/shared/layout/ResponsiveLayout';
import { PostWritePage } from '@/domains/community/components/post/write/PostWritePage';
import { ProtectedRoute } from '@/domains/auth/components/ProtectedRoute';

export default function CommunityWrite() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout showHeader={true} showFooter={false}>
        <PostWritePage />
      </ResponsiveLayout>
    </ProtectedRoute>
  );
}