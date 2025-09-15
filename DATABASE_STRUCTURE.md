# 픽담 (Pickdam) 데이터베이스 구조 분석

## 프로젝트 개요
- **프로젝트명**: pickdam
- **데이터베이스**: PostgreSQL 17.4.1.074
- **리전**: ap-northeast-2 (Seoul)
- **상태**: ACTIVE_HEALTHY

---

## 📊 테이블 구조

### 1. 사용자 관리 (User Management)

#### `member` 테이블
사용자 기본 정보를 관리하는 메인 테이블
- **Primary Key**: `id` (UUID)
- **주요 필드**:
  - `email` (VARCHAR, UNIQUE) - 사용자 이메일  - NOT NULL
  - `name` (VARCHAR) - 실명 - NOT NULL
  - `nickname` (VARCHAR) - 닉네임 (2-10자 제약) - NOT NULL
  - `profile_image_url` (TEXT) - 프로필 이미지 URL - NULLABLE
  - `birth_date` (DATE) - 생년월일 - - NOT NULL
  - `gender` (VARCHAR) - 성별 (MALE, FEMALE) - - NOT NULL
  - `provider` (VARCHAR) - 로그인 제공자 (EMAIL, KAKAO, NAVER, GOOGLE) - - NOT NULL
  - `role` (VARCHAR) - 권한 (user, admin, moderator) - - NOT NULL
  - `is_email_verified` (BOOLEAN) - 이메일 인증 여부 - - NOT NULL
  - `is_deleted` (BOOLEAN) - 삭제 여부 - - NOT NULL
  - `nickname_updated_at` (TIMESTAMPTZ) - 닉네임 변경 시점 (월별 제한용) - NULLABLE

#### `auth_user_metadata` 테이블
Supabase Auth와 연동되는 사용자 메타데이터
- **Primary Key**: `user_id` (UUID)
- **주요 필드**:
  - `is_deleted` (BOOLEAN) - 삭제 상태
  - `deleted_at` (TIMESTAMPTZ) - 삭제 시점
  - `deleted_reason` (TEXT) - 삭제 사유

---

### 2. 상품 관리 (Product Management)

#### `product` 테이블
전자담배 상품 정보 관리
- **Primary Key**: `id` (UUID)
- **주요 필드**:
  - `name` (VARCHAR) - 상품명 - NOT NULL
  - `price` (NUMERIC) - 가격 - NOT NULL TODO - lowest_price로 변경해야함 
  - `thumbnail_image_url` (TEXT) - 썸네일 이미지  - nullable
  - `product_category` (VARCHAR) - 카테고리 (LIQUID, DEVICE, POD, COIL, ACCESSORY) - - NOT NULL
  - `inhale_type` (VARCHAR) - 흡입 방식 (MTL, DTL) - NOT NULL
  - `flavor` (VARCHAR) - 맛/향 - TODO 지워야함
  - `capacity` (VARCHAR) - 용량 - - NOT NULL
  - `brand` (VARCHAR) - 브랜드 - TODO 지워야함 
  - `total_views`, `weekly_views`, `monthly_views` (INTEGER) - 조회수 통계 - NOT NULL , TODO 주간, 월간 조회수 트리거 필요함 
  - `total_favorites` (INTEGER) - 찜 수 - - NOT NULL
  - `is_available` (BOOLEAN) - 판매 가능 여부 
  - `version` (INTEGER) - 버전 관리 (낙관적 잠금) - TODO 지워야함 

#### `product_image` 테이블
상품 이미지 관리
- **Foreign Key**: `product_id` → `product.id`
- **주요 필드**:
  - `image_url` (TEXT) - 이미지 URL - - NOT NULL
  - `image_order` (INTEGER) - 이미지 순서 - NOT NULL
  - `alt_text` (TEXT) - 대체 텍스트 

#### `seller` 테이블
판매자/쇼핑몰 정보
- **Primary Key**: `id` (UUID)
- **주요 필드**:
  - `name` (VARCHAR, UNIQUE) - 판매자명
  - `description` (TEXT) - 설명
  - `website_url` (TEXT) - 웹사이트
  - `contact_email`, `contact_phone` (VARCHAR) - 연락처
  - `business_registration_number` (VARCHAR) - 사업자등록번호
  - `is_verified`, `is_active` (BOOLEAN) - 인증/활성화 상태 - 필요한가? TODO

#### `product_seller_mapping` 테이블
상품-판매자 매핑 (다대다 관계)
- **Foreign Keys**: 
  - `product_id` → `product.id`
  - `seller_id` → `seller.id`
- **주요 필드**:
  - `price` (NUMERIC) - 판매가격 (≥0)
  - `original_price` (NUMERIC) - 정가 - TODO 필요없음 
  - `shipping_fee` (NUMERIC) - 배송비 (≥0)
  - `stock_quantity` (INTEGER) - 재고수량 (≥0) - TODO 지금은 필요없음
  - `store_url` (TEXT) - 상품 페이지 URL
  - `is_available`, `is_featured` (BOOLEAN) - 판매가능/추천 여부
  - `last_price_update` (TIMESTAMPTZ) - 가격 업데이트 시점

#### `product_price_history` 테이블
상품 가격 이력 관리
- **Foreign Key**: `product_id` → `product.id`
- **주요 필드**:
  - `lowest_price` (NUMERIC) - 최저가
  - `recorded_date` (DATE) - 기록일
  - `source` (VARCHAR) - 데이터 소스 - TODO 활용안되고있음 활용해야함

---

### 3. 리뷰 시스템 (Review System) 

- 리뷰의 생명주기 ? 꼭 상품이 삭제되었다고 해서 리뷰가 삭제되어야할까? 
#### `review` 테이블
상품 리뷰 관리
- **Foreign Keys**: 
  - `member_id` → `member.id` - NOT NULL
  - `product_id` → `product.id` - NOT NULL
- **주요 필드**:
  - `rating` (INTEGER) - 전체 평점 (1-5) - NOT NULL
  - `sweetness` (INTEGER) - 단맛 (1-5, 기본값 3) - NOT NULL
  - `menthol` (INTEGER) - 멘톨 (1-5, 기본값 3) - NOT NULL
  - `throat_hit` (INTEGER) - 목넘김 (1-5, 기본값 3) - NOT NULL
  - `body` (INTEGER) - 무게감 (1-5, 기본값 3) - NOT NULL
  - `freshness` (INTEGER) - 상쾌함 (1-5, 기본값 3) - NOT NULL
  - `content` (TEXT) - 리뷰 내용 - NOT NULL
  - `is_deleted` (BOOLEAN) - 삭제 여부 - NOT NULL

#### `review_image` 테이블
리뷰 이미지 관리
- **Foreign Key**: `review_id` → `review.id`
- **주요 필드**:
  - `image_url` (TEXT) - 이미지 URL - NOT NULL
  - `image_order` (INTEGER) - 이미지 순서 - NOT NULL

---

### 4. 커뮤니티 시스템 (Community System)

#### `post` 테이블
게시글 관리
- **Foreign Key**: `author_id` → `member.id`
- **주요 필드**:
  - `title` (VARCHAR) - 제목 - NOT NULL
  - `content` (TEXT) - 내용 - NOT NULL
  - `category` (VARCHAR) - 카테고리 (NOTICE, GENERAL, REVIEW, QUESTION) - NOT NULL
  - `view_count` (INTEGER) - 조회수 - NOT NULL
  - `like_count` (INTEGER) - 좋아요 수 - NOT NULL
  - `comment_count` (INTEGER) - 댓글 수 - NOT NULL
  - `thumbnail_image_url` (TEXT) - 썸네일 이미지 - NOT NULL
  - `is_deleted` (BOOLEAN) - 삭제 여부 - NOT NULL
  - `version` (INTEGER) - 버전 관리 - 필요없다 TODO 

#### `post_image` 테이블
게시글 이미지 관리
- **Foreign Key**: `post_id` → `post.id`
- **주요 필드**:
  - `image_url` (TEXT) - 이미지 URL
  - `image_name` (TEXT) - 이미지명
  - `file_size` (INTEGER) - 파일 크기
  - `mime_type` (TEXT) - MIME 타입
  - `sort_order` (INTEGER) - 정렬 순서

#### `comment` 테이블 - CaseCade 
댓글 시스템 (계층형 구조)
- **Foreign Keys**: 
  - `post_id` → `post.id`
  - `parent_comment_id` → `comment.id` (대댓글용)
  - `author_id` → `member.id`
- **주요 필드**:
  - `content` (TEXT) - 댓글 내용
  - `like_count` (INTEGER) - 좋아요 수
  - `is_deleted` (BOOLEAN) - 삭제 여부
  - `version` (INTEGER) - 버전 관리

---

### 5. 사용자 활동 관리 (User Activity)

#### `wishlist` 테이블
상품 찜 목록
- **Foreign Keys**: 
  - `member_id` → `member.id`
  - `product_id` → `product.id`
- **주요 필드**:
  - `is_deleted` (BOOLEAN) - 삭제 여부

#### `post_like` 테이블
게시글 좋아요
- **Foreign Keys**: 
  - `post_id` → `post.id`
  - `member_id` → `member.id`

#### `comment_like` 테이블
댓글 좋아요
- **Foreign Keys**: 
  - `comment_id` → `comment.id`
  - `member_id` → `member.id`

---

### 6. 조회 이력 관리 (View History)

#### `post_view_history` 테이블
게시글 조회 이력
- **Foreign Keys**: 
  - `post_id` → `post.id`
  - `member_id` → `member.id`
- **주요 필드**:
  - `anonymous_id` (VARCHAR) - 비로그인 사용자 식별자
  - `viewed_at` (TIMESTAMPTZ) - 조회 시점

#### `product_view_history` 테이블
상품 조회 이력
- **Foreign Keys**: 
  - `product_id` → `product.id`
  - `member_id` → `member.id`
- **주요 필드**:
  - `anonymous_id` (VARCHAR) - 비로그인 사용자 식별자
  - `viewed_at` (TIMESTAMPTZ) - 조회 시점

---

## 🔗 주요 관계 (Relationships)

### 1:N 관계
- `member` ← `post`, `comment`, `review`, `wishlist`
- `product` ← `product_image`, `review`, `wishlist`
- `post` ← `comment`, `post_like`
- `comment` ← `comment_like`

### N:M 관계
- `product` ↔ `seller` (through `product_seller_mapping`)

### 계층형 관계
- `comment` → `comment` (parent_comment_id를 통한 대댓글 구조)

---

## 🛡️ 보안 및 제약조건

### Row Level Security (RLS)
- **모든 테이블**에 RLS 활성화

### Check 제약조건
- **평점 시스템**: 1-5 범위 제한 (`rating`, `sweetness`, `menthol` 등)
- **가격 필드**: 음수 불가 (`price ≥ 0`, `shipping_fee ≥ 0`)
- **재고 수량**: 음수 불가 (`stock_quantity ≥ 0`)
- **닉네임**: 2-10자 제한
- **Enum 제약**: `gender`, `provider`, `role`, `category` 등

### 버전 관리 (Optimistic Locking)
- `post.version`, `comment.version`, `product.version` 필드로 동시성 제어

---

## 📈 성능 및 통계

### 통계 필드
- **상품**: `total_views`, `weekly_views`, `monthly_views`, `total_favorites`
- **게시글**: `view_count`, `like_count`, `comment_count`
- **댓글**: `like_count`

### 인덱스 및 최적화
- **Primary Keys**: 모든 테이블에 UUID 기반 PK
- **Foreign Keys**: 관계 테이블 간 참조 무결성 보장
- **Unique 제약**: `member.email`, `seller.name`

---

## 🗂️ 데이터 타입 분포

### UUID (Primary Keys)
- 모든 테이블의 기본키로 사용

### TIMESTAMPTZ
- 생성/수정 시간: `created_at`, `updated_at`
- 비즈니스 시간: `viewed_at`, `last_price_update`

### BOOLEAN
- 상태 플래그: `is_deleted`, `is_available`, `is_verified`

### VARCHAR/TEXT
- 짧은 텍스트: `name`, `email`, `category`
- 긴 텍스트: `content`, `description`, `image_url`

### NUMERIC
- 가격 정보: 정확한 금액 계산을 위해 NUMERIC 타입 사용

---

## 📝 특이사항

1. **소프트 삭제**: `is_deleted`, `deleted_at` 필드를 통한 논리적 삭제
2. **다국어 지원**: VARCHAR 필드들이 한글을 포함한 다국어 지원
3. **이미지 관리**: 별도 테이블로 이미지 메타데이터 관리
4. **조회 이력**: 로그인/비로그인 사용자 모두 조회 이력 추적
5. **가격 이력**: 상품 가격 변동 이력 별도 관리
6. **계층형 댓글**: 대댓글 지원을 위한 self-referencing 구조



 Supabase 이미지 자동 삭제 시스템 아키텍처

  🏗️ 전체 아키텍처 개요

  Pickdam 프로젝트는 두 가지 방식의 이미지 자동 삭제 시스템을 구축하고
  있습니다:

  1. 직접 웹훅 방식: 개별 이미지 삭제 시 즉시 처리
  2. Cleanup Jobs 방식: 엔티티 전체 삭제 시 배치 처리

  ---
  🗃️ 데이터베이스 테이블 구조

  이미지 테이블

  - review_image - 리뷰 이미지
  - post_image - 게시글 이미지
  - product_image - 상품 이미지

  정리 작업 테이블

  - cleanup_jobs - 배치 삭제 작업 관리

  ---
  ⚡ Triggers (트리거)

  1. 소프트 삭제 감지 트리거

  엔티티가 소프트 삭제될 때 cleanup job을 생성합니다.

  trigger_review_cleanup_job

  CREATE TRIGGER trigger_review_cleanup_job
  AFTER UPDATE OF deleted_at ON public.review
  FOR EACH ROW
  WHEN (((new.deleted_at IS NOT NULL) AND (old.deleted_at IS NULL)))
  EXECUTE FUNCTION add_cleanup_job('review')

  trigger_post_cleanup_job

  CREATE TRIGGER trigger_post_cleanup_job
  AFTER UPDATE OF deleted_at ON public.post
  FOR EACH ROW
  WHEN (((new.deleted_at IS NOT NULL) AND (old.deleted_at IS NULL)))
  EXECUTE FUNCTION add_cleanup_job('post')

  trigger_comment_cleanup_job

  CREATE TRIGGER trigger_comment_cleanup_job
  AFTER UPDATE OF deleted_at ON public.comment
  FOR EACH ROW
  WHEN (((new.deleted_at IS NOT NULL) AND (old.deleted_at IS NULL)))
  EXECUTE FUNCTION add_cleanup_job('comment')

  2. Cleanup Job 실행 트리거

  cleanup_jobs 테이블에 새 작업이 추가되면 즉시 Edge Function을 호출합니다.

  cleanup-job-processor

  CREATE TRIGGER "cleanup-job-processor"
  AFTER INSERT ON public.cleanup_jobs
  FOR EACH ROW
  EXECUTE FUNCTION supabase_functions.http_request(
    'https://jyzusgfmajdarftoxmbk.supabase.co/functions/v1/process-cleanup-jo
  b',
    'POST',
    '{"Content-type":"application/json","Authorization":"Bearer 
  [JWT_TOKEN]"}',
    '{}',
    '5000'
  )

  3. Updated_at 관리 트리거

  각 테이블의 updated_at 필드를 자동으로 갱신합니다.

  ---
  🔧 Database Functions (함수)

  1. add_cleanup_job()

  엔티티가 소프트 삭제될 때 cleanup job을 생성하는 함수입니다.

  BEGIN
    -- 중복 방지: 같은 엔티티의 pending 작업이 이미 있는지 확인
    IF NOT EXISTS (
      SELECT 1 FROM cleanup_jobs
      WHERE entity_type = TG_ARGV[0]
      AND entity_id = NEW.id
      AND status = 'pending'
    ) THEN
      INSERT INTO cleanup_jobs (entity_type, entity_id)
      VALUES (TG_ARGV[0], NEW.id);

      RAISE LOG 'Added cleanup job: % %', TG_ARGV[0], NEW.id;
    END IF;

    RETURN NEW;
  END;

  2. update_cleanup_jobs_updated_at()

  Cleanup job 상태 변경 시 updated_at과 completed_at을 관리합니다.

  BEGIN
    NEW.updated_at = NOW();
    
    -- completed나 failed 상태로 변경시 completed_at 설정
    IF NEW.status IN ('completed', 'failed') AND OLD.status NOT IN
  ('completed', 'failed') THEN
      NEW.completed_at = NOW();
    END IF;

    RETURN NEW;
  END;

  3. cleanup_storage_images() [사용되지 않음]

  이 함수는 정의되어 있지만 실제로는 트리거에 연결되지 않은 상태입니다.

  4. 통계 및 유틸리티 함수들

  - get_cleanup_jobs_summary() - 작업 요약 통계
  - get_failed_cleanup_jobs() - 실패한 작업 조회
  - get_recent_cleanup_stats() - 최근 24시간 통계
  - cleanup_old_jobs() - 오래된 작업 정리

  ---
  🌐 Edge Functions

  1. auto-delete-images

  개별 이미지 삭제 시 즉시 Storage에서 파일을 삭제하는 함수입니다.

  호출 방식: Database Webhook (직접)
  처리 대상: review_image, post_image, product_image DELETE 이벤트

  주요 로직:
  // 1. DELETE 이벤트인지 확인
  if (payload.type !== 'DELETE') return;

  // 2. 이미지 테이블인지 확인
  const imageTableNames = ['review_image', 'post_image', 'product_image'];
  if (!imageTableNames.includes(payload.table)) return;

  // 3. old_record에서 image_url 추출
  const imageUrl = payload.old_record.image_url;

  // 4. Storage URL에서 파일 경로 추출
  // URL: 
  https://[project].supabase.co/storage/v1/object/public/images/[path]
  const bucketName = 'images';
  const filePath = '...'; // URL에서 추출

  // 5. Supabase Storage에서 파일 삭제
  await supabase.storage.from(bucketName).remove([filePath]);

  2. cleanup-storage-images

  Cleanup job에서 호출되어 여러 이미지를 한번에 삭제하는 함수입니다.

  호출 방식: PostgreSQL Function에서 직접 호출
  처리 대상: imageUrls 배열

  주요 로직:
  interface CleanupRequest {
    imageUrls: string[]
  }

  // 각 이미지 URL에 대해 Storage에서 삭제
  for (const imageUrl of imageUrls) {
    const filePath = extractFilePathFromUrl(imageUrl, 'pickdam');
    await supabase.storage.from('pickdam').remove([filePath]);
  }

  3. process-cleanup-job

  Cleanup job을 실제로 처리하는 메인 워커 함수입니다.

  호출 방식: Database Trigger → HTTP Request
  처리 대상: cleanup_jobs INSERT 이벤트

  주요 로직:
  // 1. Job 상태를 processing으로 변경
  await supabase.from('cleanup_jobs')
    .update({ status: 'processing' })
    .eq('id', record.id);

  // 2. 엔티티 타입별 이미지 수집 및 삭제
  switch (job.entity_type) {
    case 'post':
      // post_image 테이블에서 해당 게시글의 모든 이미지 조회
      const postImages = await supabase
        .from('post_image')
        .select('image_url')
        .eq('post_id', job.entity_id);

      // 이미지 레코드 삭제 (DELETE 트리거가 Storage 정리)
      await supabase.from('post_image')
        .delete()
        .eq('post_id', job.entity_id);
      break;

    case 'review': // 동일한 패턴
    // ...
  }

  // 3. Job 상태를 completed/failed로 업데이트

  ---
  🔄 작동 시나리오

  시나리오 1: 개별 이미지 삭제

  graph TD
      A[사용자가 이미지 삭제 버튼 클릭] --> B[Frontend: DELETE
  /api/images/:id]
      B --> C[Backend: review_image 테이블에서 DELETE]
      C --> D[Database Webhook 발생]
      D --> E[auto-delete-images Edge Function 호출]
      E --> F[Supabase Storage에서 파일 삭제]
      F --> G[완료]

  시나리오 2: 전체 엔티티 삭제 (예: 리뷰 삭제)

  graph TD
      A[사용자가 리뷰 삭제] --> B[Backend: review.deleted_at 업데이트]
      B --> C[trigger_review_cleanup_job 실행]
      C --> D[add_cleanup_job 함수 호출]
      D --> E[cleanup_jobs 테이블에 INSERT]
      E --> F[cleanup-job-processor 트리거 실행]
      F --> G[process-cleanup-job Edge Function 호출]
      G --> H[해당 리뷰의 모든 review_image 조회]
      H --> I[review_image 레코드들 DELETE]
      I --> J[각 DELETE마다 auto-delete-images 호출]
      J --> K[Storage 파일들 삭제]
      K --> L[cleanup_jobs 상태를 completed로 업데이트]

  ---
  📊 현재 상태 분석

  ✅ 구현 완료

  - ✅ Cleanup jobs 시스템
  - ✅ Edge Functions (3개)
  - ✅ Database Triggers
  - ✅ 소프트 삭제 감지
  - ✅ 통계 및 모니터링 함수

  ⚠️ 미완성/미연결

  - ❌ auto-delete-images Edge Function이 Database Webhook에 연결되지 않음
  - ❌ cleanup_storage_images 함수가 실제 트리거에 사용되지 않음
  - ❌ 직접 이미지 삭제 시 자동 Storage 정리 미작동

  🔧 개선 필요사항

  1. Database Webhook 설정: auto-delete-images 연결
  2. 트리거 정리: 사용하지 않는 함수 제거 또는 연결
  3. 모니터링: 실패한 작업에 대한 알림 시스템
  4. 재시도 로직: cleanup_jobs의 max_retries 활용

  ---