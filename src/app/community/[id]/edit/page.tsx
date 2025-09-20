'use client';

import { MainLayout } from '@/shared/layout/MainLayout';
import { PostEditPage } from '@/domains/community/components/post/edit/PostEditPage';

export default function EditPostPage() {
  return (
    <MainLayout showHeader={true} showFooter={true}>
      <PostEditPage />
    </MainLayout>
  );
}