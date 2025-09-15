import { getCategoryName, Post, PostDetail } from '@/domains/community/types/community';
import { PostResponseDto } from '@/domains/community/types/dto/post/postResponseDto';
// PostDto를 Post 도메인 타입으로 변환
export function toPost(dto: PostResponseDto): Post {
  return {
    id: dto.id,
    title: dto.title,
    content: dto.content,
    authorNickname: dto.author.nickname,
    authorId: dto.author_id,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    viewCount: dto.view_count,
    likeCount: dto.like_count,
    commentCount: dto.comment_count,
    category: {
      id: dto.category,
      name: getCategoryName(dto.category)
    },
    isPinned: false, // 백엔드 응답에 없음
    isDeleted: !!dto.deleted_at,
    isLiked: false, // 백엔드 응답에 없음 (별도 API 필요)
    profileImageUrl: dto.author.profile_image_url,
    images: dto.images?.map(img => img.image_url) || []
  };
}

// PostDto를 PostDetail 도메인 타입으로 변환
export function toPostDetail(dto: PostResponseDto): PostDetail {
  return {
    ...toPost(dto),
    comments: [] // 댓글은 별도 API로 로드됨
  };
}
