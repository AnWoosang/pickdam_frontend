'use client';

import { ResponsiveLayout } from '@/shared/layout/ResponsiveLayout';
import { PostEditPage } from '@/domains/community/components/post/edit/PostEditPage';

export default function EditPostPage() {
  return (
    <ResponsiveLayout showHeader={true} showFooter={true}>
      <PostEditPage />
    </ResponsiveLayout>
  );
}