# Supabase HTTP Status Codes Reference

## Overview
Supabase에서 발생하는 다양한 에러의 HTTP 상태 코드 정리

---

## 1. PostgreSQL/PostgREST 에러

### 데이터베이스 제약조건 위반
```
UNIQUE_VIOLATION (23505) → 409 Conflict
NOT_NULL_VIOLATION (23502) → 400 Bad Request  
FOREIGN_KEY_VIOLATION (23503) → 400 Bad Request
CHECK_VIOLATION (23514) → 400 Bad Request
```

### 권한 관련
```
INSUFFICIENT_PRIVILEGE (42501) → 403 Forbidden
```

### 리소스 찾기 실패
```
UNDEFINED_TABLE (42P01) → 404 Not Found
UNDEFINED_COLUMN (42703) → 400 Bad Request
```

### 일반 데이터베이스 에러
```
기타 DB 에러 → 500 Internal Server Error
```

---

## 2. Supabase Auth 에러

### 인증 실패 (401 Unauthorized)
- `invalid_credentials`: 잘못된 로그인 정보
- `bad_jwt`: 유효하지 않은 JWT 토큰
- `session_expired`: 세션 만료
- `session_not_found`: 세션을 찾을 수 없음
- `token_expired`: 토큰 만료

### 권한 부족 (403 Forbidden)
- `insufficient_aal`: 인증 수준 부족 (MFA 필요)
- `user_banned`: 사용자 계정 정지

### 잘못된 요청 (400 Bad Request)
- `bad_json`: 잘못된 JSON 형식
- `email_not_confirmed`: 이메일 미인증
- `validation_failed`: 유효성 검증 실패
- `weak_password`: 약한 비밀번호
- `email_address_invalid`: 유효하지 않은 이메일

### 리소스 찾기 실패 (404 Not Found)
- `user_not_found`: 사용자를 찾을 수 없음
- `invite_not_found`: 초대 링크 만료/미존재
- `flow_state_not_found`: PKCE flow 상태 없음

### 중복/충돌 (409 Conflict)
- `email_exists`: 이미 존재하는 이메일
- `user_already_exists`: 이미 존재하는 사용자
- `conflict`: 일반적인 데이터베이스 충돌

### 제한사항 (429 Too Many Requests)
- `too_many_requests`: 과도한 요청
- 실제 HTTP 상태: 429

### 서비스 제한 (422/403)
- `signup_disabled`: 회원가입 비활성화
- `email_provider_disabled`: 이메일 프로바이더 비활성화

### 서버 에러 (500 Internal Server Error)
- `unexpected_failure`: 예상치 못한 실패
- 데이터베이스 트리거 오류

---

## 3. Supabase Storage 에러

### 리소스 찾기 실패 (404 Not Found)
- `NoSuchBucket`: 버킷이 존재하지 않음
- `NoSuchKey`: 파일/키가 존재하지 않음
- `NoSuchUpload`: 업로드가 존재하지 않음
- `TenantNotFound`: 테넌트를 찾을 수 없음

### 인증 에러 (401 Unauthorized)
- `InvalidJWT`: 유효하지 않은 JWT

### 잘못된 요청 (400 Bad Request)
- `InvalidRequest`: 잘못된 요청 형식
- `InvalidBucketName`: 유효하지 않은 버킷명
- `InvalidKey`: 유효하지 않은 키
- `InvalidMimeType`: 유효하지 않은 MIME 타입
- `InvalidUploadId`: 유효하지 않은 업로드 ID

### 권한 부족 (403 Forbidden)
- `AccessDenied`: 접근 거부
- `InvalidSignature`: 유효하지 않은 서명
- `SignatureDoesNotMatch`: 서명 불일치

### 중복/충돌 (409 Conflict)
- `ResourceAlreadyExists`: 리소스 이미 존재
- `KeyAlreadyExists`: 키 이미 존재
- `BucketAlreadyExists`: 버킷 이미 존재

### 콘텐츠 길이 필요 (411 Length Required)
- `MissingContentLength`: Content-Length 헤더 누락

### 파일 크기 초과 (413 Payload Too Large)
- `EntityTooLarge`: 업로드 파일 크기 초과

### 범위 오류 (416 Range Not Satisfiable)
- `InvalidRange`: 유효하지 않은 범위 요청

### 리소스 잠김 (423 Locked)
- `ResourceLocked`: 리소스가 잠겨있음

### 서버 에러 (500 Internal Server Error)
- `InternalError`: 내부 서버 에러
- `DatabaseError`: 데이터베이스 에러

### 게이트웨이 타임아웃 (504 Gateway Timeout)
- `DatabaseTimeout`: 데이터베이스 타임아웃

---

## 4. Supabase Edge Functions 에러

### 성공 (2XX)
- 정상적인 Edge Function 응답

### 리다이렉트 (3XX)
- `Response.redirect()` 사용시

### 클라이언트 에러 (4XX)
- **401 Unauthorized**: JWT 검증 실패 (Verify JWT 옵션 활성화시)
- **404 Not Found**: Edge Function을 찾을 수 없음
- **405 Method Not Allowed**: 지원하지 않는 HTTP 메서드

### 서버 에러 (5XX)
- **500 Internal Server Error**: 미처리 예외 (`WORKER_ERROR`)
- **503 Service Unavailable**: Function 시작 실패 (`BOOT_ERROR`)
- **504 Gateway Timeout**: 요청 타임아웃
- **546 Resource Limit**: 리소스 제한 초과 (`WORKER_LIMIT`) - Custom Code

---

## 5. Supabase Platform 에러

### 프로젝트 에러 (54X - Custom Codes)
- **540 Project Paused**: 프로젝트 일시중지
  - 비활성 상태 (Free Plan)
  - 소유자 요청
  - 남용으로 인한 일시중지

- **544 Project API Gateway Timeout**: API 게이트웨이 타임아웃
  - 구성된 시간 제한 내 요청 완료되지 않음
  - 장시간 실행 쿼리 방지 목적

- **546 Edge Functions Resource Limit**: Edge Function 리소스 제한
  - `WORKER_LIMIT` 리소스 제한으로 실행 중단

### 서비스 제한 (402 Payment Required)
- 공정 사용 정책으로 인한 제한
- `exceeded_*`: 사용량 한도 초과
- `overdue_payment`: 미납 요금

---

## 주요 매핑 규칙

### PostgreSQL → HTTP Status
```typescript
UNIQUE_VIOLATION (23505) → 409 Conflict
NOT_NULL_VIOLATION (23502) → 400 Bad Request
FOREIGN_KEY_VIOLATION (23503) → 400 Bad Request  
INSUFFICIENT_PRIVILEGE (42501) → 403 Forbidden
기타 DB 에러 → 500 Internal Server Error
```

### Auth 에러 → HTTP Status
```typescript
invalid_credentials → 401 Unauthorized
user_not_found → 404 Not Found
email_exists → 409 Conflict
validation_failed → 400 Bad Request
weak_password → 400 Bad Request
too_many_requests → 429 Too Many Requests
insufficient_aal → 403 Forbidden
```

### Storage 에러 → HTTP Status
```typescript
NoSuchBucket/NoSuchKey → 404 Not Found
InvalidJWT → 401 Unauthorized
AccessDenied → 403 Forbidden
EntityTooLarge → 413 Payload Too Large
ResourceAlreadyExists → 409 Conflict
InvalidRequest → 400 Bad Request
```

---

## 결론

Supabase에서는 **표준 HTTP 상태 코드**와 함께 **구체적인 에러 코드**를 제공합니다:

1. **HTTP Status Code**: 브라우저/클라이언트가 이해하는 표준 코드
2. **Error Code**: Supabase 특화 상세 에러 코드 (문자열)
3. **Message**: 사용자/개발자를 위한 에러 설명

이를 통해 프론트엔드에서는 **HTTP Status로 일반적인 처리**를, **Error Code로 구체적인 처리**를 구분할 수 있습니다.