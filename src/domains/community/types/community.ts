// 정렬 기준 타입 (실제 DB 컬럼명 사용)
export type PostSort = 'created_at' | 'view_count' | 'like_count';
export type SortOrder = 'asc' | 'desc';

// ===== 카테고리 관련 =====

// 게시글 카테고리 상수 (ID -> 이름 매핑)
export const POST_CATEGORIES: Record<string, string> = {
  'NOTICE': '공지사항',
  'GENERAL': '자유게시판', 
  'REVIEW': '제품리뷰',
  'QUESTION': '질문답변',
};

// 카테고리 ID 목록
export const POST_CATEGORY_IDS = Object.keys(POST_CATEGORIES);

// 카테고리 타입을 POST_CATEGORIES에서 추출
export type PostCategoryId = keyof typeof POST_CATEGORIES;

// 기본 카테고리 ID
export const DEFAULT_CATEGORY_ID = 'GENERAL';

// 카테고리 검증
export const isValidCategoryId = (id: string): boolean => {
  return id in POST_CATEGORIES;
};

// 카테고리 ID로 카테고리 이름 가져오기
export const getCategoryName = (id: string | undefined): string => {
  if (!id) return '알 수 없음';
  return POST_CATEGORIES[id] || '알 수 없음';
};

// categoryId를 PostCategory 객체로 매핑 (DTO 변환용)
export const mapCategoryIdToCategory = (id: string | undefined): PostCategory | undefined => {
  if (!id) return undefined;
  const name = POST_CATEGORIES[id];
  return name ? { id, name } : undefined;
};

// 기본 게시글 도메인 타입
export interface Post {
  id: string;
  title: string;
  content?: string;
  authorNickname: string; // 닉네임
  authorId: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  category?: PostCategory;
  isPinned?: boolean;
  isDeleted?: boolean;
  isLiked?: boolean; // 현재 사용자가 좋아요했는지
  profileImageUrl?: string;
  images?: string[];
}

// 게시글 상세 정보 (확장된 게시글 타입)
export interface PostDetail extends Post {
  comments?: Comment[];
}

// 게시글 카테고리 도메인 타입
export interface PostCategory {
  id: string;
  name: string;
}

// 게시글 생성 폼 타입
export interface CreatePostForm {
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
}

// 게시글 수정 폼 타입
export interface UpdatePostForm {
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
}

// 댓글 도메인 타입 (지연 로딩 방식)
export interface Comment {
  id: string;
  postId: string;
  parentId?: string; // 구조상 부모 (최대 2레벨용) - DB의 parent_comment_id와 매핑
  replyToCommentId?: string; // 실제 답글 대상 댓글 ID
  replyToUserId?: string; // 멘션할 사용자 ID
  replyToUsername?: string; // 멘션할 사용자명
  content: string;
  author: { nickname: string; profile_image_url?: string }; // 작성자 정보
  authorId: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isDeleted: boolean;
  
  // 통합 쿼리에서 제공되는 필드들
  isLiked?: boolean; // 현재 사용자가 좋아요했는지
  replyCount?: number; // 답글 개수 (지연 로딩용)
  
  // 호환성 유지용 (deprecated)
  profileImageUrl?: string;
  replies?: Comment[]; // 지연 로딩으로 채워짐
  depth?: number;
}