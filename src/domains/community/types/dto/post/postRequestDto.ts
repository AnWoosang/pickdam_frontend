import { ImageUploadRequestDto } from '@/domains/image/types/dto/imageDto';

import { PostSort, SortOrder } from '@/domains/community/types/community';
// Post API Request DTOs
export interface PostsRequestParamDto {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: PostSort;
  sortOrder?: SortOrder;
}

export interface CreatePostRequestDto {
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  images?: ImageUploadRequestDto[];
}

export interface UpdatePostRequestDto {
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  images?: ImageUploadRequestDto[];
}

export interface DeletePostRequestDto {
  authorId: string;
}

export interface ViewActionRequestDto {
  memberId?: string;
  anonymousId?: string;
}

export interface LikeActionRequestDto {
  memberId: string;
}