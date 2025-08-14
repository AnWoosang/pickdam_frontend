import { PostCategory } from '@/types/community';

// 게시글 카테고리 상수
export const POST_CATEGORIES: PostCategory[] = [
  { id: 'notice', name: '공지사항', color: '#EF4444' },
  { id: 'general', name: '자유게시판', color: '#6B7280' },
  { id: 'review', name: '제품리뷰', color: '#10B981' },
  { id: 'question', name: '질문답변', color: '#3B82F6' },
];

// 카테고리 ID로 카테고리 정보 찾기
export const getCategoryById = (id: string): PostCategory | undefined => {
  return POST_CATEGORIES.find(category => category.id === id);
};

// 카테고리 ID로 카테고리 이름 가져오기
export const getCategoryName = (id: string | undefined): string => {
  if (!id) return '알 수 없음';
  const category = getCategoryById(id);
  return category?.name || '알 수 없음';
};

// 카테고리 ID로 카테고리 색상 가져오기
export const getCategoryColor = (id: string | undefined): string => {
  if (!id) return '#6B7280';
  const category = getCategoryById(id);
  return category?.color || '#6B7280';
};

// 기본 카테고리 ID
export const DEFAULT_CATEGORY_ID = 'general';

// 카테고리 검증
export const isValidCategoryId = (id: string): boolean => {
  return POST_CATEGORIES.some(category => category.id === id);
};