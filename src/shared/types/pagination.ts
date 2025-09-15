// 도메인 레이어에서 사용할 페이지네이션 결과 타입
export interface PaginationResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit?: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}