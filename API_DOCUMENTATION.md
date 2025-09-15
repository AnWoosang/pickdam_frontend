# Pickdam API Documentation

## Overview
Pickdam API는 전자담배 액상 리뷰 및 커뮤니티 플랫폼을 위한 RESTful API입니다.

## Base URL
```
/api
```

## Authentication
대부분의 엔드포인트는 Supabase Auth를 사용한 쿠키 기반 인증을 사용합니다.

---

# 📱 Authentication Endpoints

## POST /api/auth/check-email
이메일 중복 확인
- **Parameters**: Query `email` (string)
- **Returns**: `{ isDuplicate: boolean }`
- **Auth**: None

## POST /api/auth/login
사용자 로그인
- **Parameters**: `{ email: string, password: string }`
- **Returns**: `{ user: UserData, session: SessionData }`
- **Auth**: None

## POST /api/auth/logout
로그아웃 처리
- **Returns**: `{ success: true }`
- **Auth**: None

## GET /api/auth/me
현재 사용자 정보 조회
- **Returns**: `{ user: UserProfile }`
- **Auth**: Required

## POST /api/auth/resend-email
이메일 인증 재전송
- **Parameters**: `{ email: string, type: 'signup' }`
- **Returns**: `{ message: string, success: boolean }`
- **Auth**: None

## POST /api/auth/signup
회원가입
- **Parameters**: 
  ```json
  {
    "email": "string",
    "password": "string", 
    "name": "string",
    "nickname": "string",
    "birthDate": "string",
    "gender": "string"
  }
  ```
- **Returns**: `{ message: string, emailSent: boolean, user: { id, email } }`
- **Auth**: None

## POST /api/auth/verify-email
이메일 인증 확인
- **Parameters**: `{ token: string, token_hash: string }`
- **Returns**: `{ message: string, user: UserData }`
- **Auth**: Token-based

---

# 💬 Community Endpoints

## GET /api/community/categories
커뮤니티 카테고리 목록
- **Returns**: `Category[]`
- **Auth**: None

## GET /api/community/posts
게시글 목록 (페이지네이션 및 검색)
- **Parameters**: 
  - Query: `page`, `limit`, `category`, `search`, `searchType`, `sortBy`, `sortOrder`
- **Returns**: 
  ```json
  {
    "posts": "Post[]",
    "total": "number",
    "page": "number",
    "totalPages": "number",
    "hasNextPage": "boolean",
    "hasPreviousPage": "boolean"
  }
  ```
- **Auth**: None

## POST /api/community/posts
새 게시글 작성
- **Parameters**: `{ title, content, categoryId, authorId, images? }`
- **Returns**: `{ post: PostData }`
- **Auth**: Required

## GET /api/community/posts/[id]
특정 게시글 상세 조회
- **Parameters**: URL `id`
- **Returns**: `{ post: PostDetailData }`
- **Auth**: None

## PUT /api/community/posts/[id]
게시글 수정
- **Parameters**: `{ title, content, categoryId, authorId, images? }`
- **Returns**: `{ post: PostData }`
- **Auth**: Required (작성자 본인)

## DELETE /api/community/posts/[id]
게시글 삭제 (Soft Delete)
- **Parameters**: `{ authorId }`
- **Returns**: `{ success: boolean }`
- **Auth**: Required (작성자 본인)

## POST /api/community/posts/[id]/like
게시글 좋아요/취소
- **Parameters**: `{ userId }`
- **Returns**: `{ success, liked, likeCount }`
- **Auth**: Required

## GET /api/community/posts/[id]/like
게시글 좋아요 상태 확인
- **Parameters**: Query `userId`
- **Returns**: `{ liked: boolean }`
- **Auth**: Required

## POST /api/community/posts/[id]/view
게시글 조회수 증가
- **Parameters**: `{ memberId?, anonymousId? }`
- **Returns**: `{ success, incremented, newViewCount, reason? }`
- **Auth**: Optional

## GET /api/community/posts/popular
인기 게시글 목록
- **Parameters**: Query `days=7`, `limit=10`
- **Returns**: `PopularPost[]`
- **Auth**: None

## GET /api/community/comments
게시글 댓글 목록
- **Parameters**: Query `postId`, `page`, `limit`
- **Returns**: `{ comments, total, page, limit, totalPages }`
- **Auth**: None

## POST /api/community/comments
댓글 작성
- **Parameters**: `{ content, postId, authorId, parentCommentId? }`
- **Returns**: `{ comment: CommentData }`
- **Auth**: Required

## PUT /api/community/comments/[id]
댓글 수정
- **Parameters**: `{ content }`
- **Returns**: `{ comment: CommentData }`
- **Auth**: Required (작성자 본인)

## DELETE /api/community/comments/[id]
댓글 삭제
- **Returns**: `{ success: boolean }`
- **Auth**: Required (작성자 본인)

## GET /api/community/comments/[id]/like
댓글 좋아요 상태 확인
- **Parameters**: Query `memberId`
- **Returns**: `{ liked: boolean }`
- **Auth**: Required

## POST /api/community/comments/[id]/like
댓글 좋아요/취소
- **Parameters**: `{ memberId }`
- **Returns**: `{ liked, likeCount }`
- **Auth**: Required

---

# 🛍️ Product Endpoints

## GET /api/products
제품 목록 (고급 필터링)
- **Parameters**: 
  - Query: `page`, `limit`, `category`, `categories`, `inhaleType`, `search`, `sortBy`, `sortOrder`
- **Returns**: `{ products, total, page, totalPages }`
- **Auth**: None

## GET /api/products/[id]
제품 상세 정보
- **Parameters**: URL `id`
- **Returns**: `{ product: ProductDetailData }`
- **Auth**: None

## GET /api/products/[id]/price-history
제품 가격 히스토리
- **Parameters**: Query `days=30`
- **Returns**: `{ priceHistory: [{ date, price }] }`
- **Auth**: None

## GET /api/products/[id]/reviews
제품 리뷰 목록
- **Parameters**: Query `page=1`, `limit=5`
- **Returns**: `{ reviews, total, page, limit, totalPages }`
- **Auth**: None

## POST /api/products/[id]/reviews
제품 리뷰 작성
- **Parameters**: 
  ```json
  {
    "memberId": "string",
    "rating": "number",
    "content": "string",
    "sweetness": "number?",
    "menthol": "number?",
    "throatHit": "number?",
    "body": "number?",
    "freshness": "number?",
    "imageUrls": "string[]?"
  }
  ```
- **Returns**: `{ review, message }`
- **Auth**: Required

## GET /api/products/[id]/reviews/average
제품 평균 평점 및 통계
- **Returns**: `{ averageReview: AverageReviewData }`
- **Auth**: None

## GET /api/products/bestsellers
베스트셀러 제품 목록
- **Parameters**: Query `limit=10`
- **Returns**: `{ products }`
- **Auth**: None

## GET /api/products/popular
인기 제품 목록 (조회수 기준)
- **Parameters**: Query `limit=10`
- **Returns**: `{ products }`
- **Auth**: None

---

# ⭐ Review Endpoints


# 📷 Image Upload Endpoints

## POST /api/upload-image
이미지 업로드
- **Parameters**: FormData: `file`, `type`, `userId`
- **Returns**: `{ url, path, fileName }`
- **Auth**: Required

## DELETE /api/upload-image
이미지 삭제
- **Parameters**: Query `imageUrl`
- **Returns**: `{ success, message, filePath }`
- **Auth**: Required

---

# 👤 User Management Endpoints

## POST /api/users/check-email
이메일 사용 가능 여부 확인
- **Parameters**: `{ email }`
- **Returns**: `{ isAvailable, message }`
- **Auth**: None

## GET /api/users/check-nickname
닉네임 중복 확인
- **Parameters**: Query `nickname`
- **Returns**: `{ isDuplicate }`
- **Auth**: None

## PUT /api/users/[id]/profile
사용자 프로필 업데이트
- **Parameters**: User profile update data
- **Returns**: `{ user: UserData }`
- **Auth**: Required

## GET /api/users/[id]/wishlist
사용자 위시리스트 조회
- **Parameters**: Query `page=1`, `limit=20`
- **Returns**: `{ products }`
- **Auth**: Required

## POST /api/users/[id]/wishlist
위시리스트에 제품 추가
- **Parameters**: `{ productId }`
- **Returns**: `{ success, isWishlisted, newFavoriteCount, version }`
- **Auth**: Required

## DELETE /api/users/[id]/wishlist
위시리스트에서 제품 제거
- **Parameters**: `{ productId }`
- **Returns**: `{ success, isWishlisted, newFavoriteCount, version }`
- **Auth**: Required

## GET /api/users/[id]/my-posts
사용자 작성 게시글 목록
- **Parameters**: Query `page=1`, `limit=10`
- **Returns**: `{ posts, totalCount, totalPages, currentPage, limit }`
- **Auth**: Required

---

# 🔧 Technical Features

## Authentication & Security
- **Supabase Auth 통합**: 쿠키 기반 인증 시스템
- **역할 기반 접근 제어**: 관리자/모더레이터 권한 확인
- **입력 검증**: 공통 validation 유틸리티 사용
- **에러 처리**: 일관된 HTTP 상태 코드와 에러 응답

## Database Design
- **Soft Delete**: 실제 삭제 대신 `is_deleted` 플래그 사용
- **Optimistic Locking**: 동시성 제어를 위한 버전 기반 잠금
- **RPC Functions**: 복잡한 작업을 위한 PostgreSQL 저장 프로시저
- **Materialized Views**: 성능 중요 쿼리를 위한 사전 계산된 뷰

## Performance Optimizations
- **페이지네이션**: 모든 목록 엔드포인트에서 커서 기반 페이지네이션
- **캐싱**: 파일 업로드 캐싱 및 조회수 증가 제한
- **배치 연산**: 좋아요/취소 기능을 위한 원자적 연산
- **재시도 로직**: 동시 연산을 위한 재시도 메커니즘

## File Management
- **Supabase Storage**: 이미지 타입별 체계적인 폴더 구조
- **파일 검증**: 업로드 시 크기 및 타입 검증
- **CDN 통합**: 업로드된 이미지의 공개 URL 반환
- **정리 작업**: 스토리지에서 이미지 삭제 지원

## Error Codes
- **400**: Bad Request - 잘못된 요청 매개변수
- **401**: Unauthorized - 인증 필요
- **403**: Forbidden - 권한 없음
- **404**: Not Found - 리소스를 찾을 수 없음
- **409**: Conflict - 중복 데이터 또는 버전 충돌
- **422**: Unprocessable Entity - 검증 실패
- **500**: Internal Server Error - 서버 오류

## Rate Limiting
일부 엔드포인트는 속도 제한이 적용됩니다:
- 이메일 인증 재전송: 1분당 1회
- 조회수 증가: 동일 사용자/게시글 조합당 10분 제한