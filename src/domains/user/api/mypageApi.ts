import { apiClient } from '@/shared/api/axiosClient'
import { API_ROUTES } from '@/app/router/apiRoutes'
import { PaginatedResponse, ApiResponse } from '@/shared/api/types'
import { PaginationResult } from '@/shared/types/pagination'
import { Review } from '@/domains/review/types/review'

import {
  UserStats,
  MyComment,
  MyPost
} from '@/domains/user/types/mypage';
import {
  MypageStatsResponseDto,
  MyReviewResponseDto,
  MyCommentResponseDto,
  MyPostResponseDto
} from '@/domains/user/types/dto/mypageDto';
import {
  toUserStats,
  toMyPost,
  toMyComment,
  toMyReview
} from '@/domains/user/types/dto/mypageMapper';

export const mypageApi = {
  // 사용자 리뷰 조회 (페이지네이션 지원)
  async getUserReviews(userId: string, page: number, limit: number): Promise<PaginationResult<Review>> {
    const response = await apiClient.get<PaginatedResponse<MyReviewResponseDto>>(`${API_ROUTES.USERS.MY_REVIEWS(userId)}?page=${page}&limit=${limit}`);
    return {
      data: response.data?.map(toMyReview) || [],
      pagination: response.pagination!
    };
  },

  // 사용자 통계 조회 (뷰 사용)
  async getUserStats(userId: string): Promise<UserStats> {
    const response: ApiResponse<{ stats: MypageStatsResponseDto }> = await apiClient.get(API_ROUTES.USERS.STATS(userId));
    return toUserStats(response.data!.stats);
  },

  // 내가 쓴 댓글 조회
  async getMyComments(userId: string, page: number, limit: number): Promise<PaginationResult<MyComment>> {
    const response = await apiClient.get<PaginatedResponse<MyCommentResponseDto>>(`${API_ROUTES.USERS.MY_COMMENTS(userId)}?page=${page}&limit=${limit}`);
    return {
      data: response.data?.map(toMyComment) || [],
      pagination: response.pagination!
    };
  },

  // 내가 쓴 게시글 조회
  async getMyPosts(userId: string, page: number, limit: number): Promise<PaginationResult<MyPost>> {
    const response = await apiClient.get<PaginatedResponse<MyPostResponseDto>>(`${API_ROUTES.USERS.MY_POSTS(userId)}?page=${page}&limit=${limit}`);
    return {
      data: response.data?.map(toMyPost) || [],
      pagination: response.pagination!
    };
  }
}