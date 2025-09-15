# Supabase 완전한 에러 카탈로그

Supabase 공식 문서를 바탕으로 모든 서비스의 에러 포맷과 코드를 정리합니다.

## 1. Auth 에러

### 에러 타입
1. **API 에러**: Supabase Auth API에서 발생
2. **클라이언트 에러**: 클라이언트 라이브러리 상태에서 발생

### 언어별 에러 클래스
```typescript
// JavaScript/TypeScript
AuthError (기본 클래스)
├── AuthApiError (API 에러)
└── CustomAuthError (클라이언트 에러)

// Dart
AuthException (기본 클래스)
└── AuthApiException (API 에러)

// Swift
AuthError enum
└── .api() (API 에러 케이스)

// Python
AuthError (기본 클래스)
└── AuthApiError (API 에러)

// Kotlin
RestException
├── AuthRestException (API 에러)
├── AuthWeakPasswordException (약한 비밀번호)
└── AuthSessionMissingException (세션 누락)
```

### Auth API 에러 포맷
```json
{
  "code": 400,
  "error_code": "invalid_credentials", 
  "msg": "Invalid login credentials"
}
```

### 주요 Auth 에러 코드
- `anonymous_provider_disabled`: 익명 로그인 비활성화
- `bad_code_verifier`: PKCE flow 코드 검증 실패
- `bad_jwt`: 유효하지 않은 JWT
- `captcha_failed`: CAPTCHA 검증 실패
- `email_exists`: 이메일 이미 존재
- `invalid_credentials`: 잘못된 로그인 정보
- `weak_password`: 약한 비밀번호
- `email_not_confirmed`: 이메일 미인증
- `user_not_found`: 사용자 없음
- `too_many_requests`: 요청 과다
- `session_expired`: 세션 만료
- `validation_failed`: 유효성 검사 실패

### Auth HTTP 상태 코드
- **400 Bad Request**: 잘못된 요청
- **401 Unauthorized**: 인증 필요
- **403 Forbidden**: 기능 사용 불가
- **422 Unprocessable Entity**: 처리할 수 없는 요청
- **429 Too Many Requests**: 속도 제한 위반
- **500 Internal Server Error**: 서비스 저하
- **501 Not Implemented**: 기능 미활성화

## 2. Storage 에러

### Storage 에러 포맷
```json
{
  "code": "error_code",
  "message": "error_message"
}
```

### Legacy 포맷 (지원 중단 예정)
```json
{
  "httpStatusCode": 400,
  "code": "error_code",
  "message": "error_message"
}
```

### 주요 Storage 에러 코드
- `NoSuchBucket`: 버킷이 존재하지 않음
- `NoSuchKey`: 파일/키가 존재하지 않음  
- `EntityTooLarge`: 파일 크기 초과
- `InvalidJWT`: 유효하지 않은 JWT
- `AccessDenied`: 접근 거부
- `ResourceAlreadyExists`: 리소스 이미 존재
- `InvalidFileType`: 유효하지 않은 파일 형식
- `QuotaExceeded`: 할당량 초과

## 3. PostgREST/Database 에러

### PostgREST 에러 포맷
```json
{
  "code": "42501",
  "details": "Key (id)=(uuid) already exists.",
  "hint": null,
  "message": "new row violates row-level security policy for table \"member\""
}
```

### 주요 PostgreSQL 에러 코드
- `23505`: UNIQUE_VIOLATION (중복 키)
- `23502`: NOT_NULL_VIOLATION (NULL 제약조건)
- `23503`: FOREIGN_KEY_VIOLATION (외래 키 제약조건)
- `23514`: CHECK_VIOLATION (체크 제약조건)
- `42501`: INSUFFICIENT_PRIVILEGE (권한 부족)
- `42P01`: UNDEFINED_TABLE (테이블 없음)
- `42703`: UNDEFINED_COLUMN (컬럼 없음)
- `22P02`: INVALID_TEXT_REPRESENTATION (타입 오류)

## 4. Edge Functions 에러

### Edge Functions 에러 포맷
```json
{
  "error": "error_message"
}
```

### 클라이언트측 에러 타입
- `FunctionsHttpError`: 함수가 반환한 4xx/5xx 에러
- `FunctionsRelayError`: 네트워크 릴레이 에러
- `FunctionsFetchError`: 함수에 도달할 수 없음

### Edge Functions HTTP 상태
- **200**: 성공
- **400**: 클라이언트 에러
- **401**: JWT 검증 실패 (Verify JWT 활성화시)
- **404**: Edge Function 없음
- **405**: 지원하지 않는 HTTP 메서드
- **500**: 미처리 예외 (WORKER_ERROR)
- **503**: Function 시작 실패 (BOOT_ERROR)
- **504**: 요청 타임아웃
- **546**: 리소스 제한 초과 (WORKER_LIMIT) - Custom

## 5. Realtime 에러

### 주요 Realtime 에러 코드
- `InvalidJWTExpiration`: JWT 만료 시간 잘못됨
- `JwtSignatureError`: JWT 서명 검증 실패
- `MalformedJWT`: JWT 형식 불량

## 6. Platform 에러

### Custom HTTP 상태 코드
- **540**: Project Paused (프로젝트 일시중지)
- **544**: Project API Gateway Timeout (API 게이트웨이 타임아웃)
- **546**: Edge Functions Resource Limit (리소스 제한)

### 일반 에러
- **402**: Payment Required (결제 필요)
- **500**: Internal Server Error (내부 서버 에러)

## 7. Auth Hooks 에러

### Auth Hooks 에러 포맷
```json
{
  "error": {
    "http_code": 429,
    "message": "You can only verify a factor once every 10 seconds."
  }
}
```

## 에러 처리 베스트 프랙티스

### 1. 에러 식별
```typescript
// ✅ 권장: error.code와 error.name 사용
if (error.code === 'invalid_credentials') {
  // 처리 로직
}

// ❌ 비권장: HTTP 상태 코드에만 의존
if (error.status === 400) {
  // 너무 일반적
}
```

### 2. 타입 검사
```typescript
// JavaScript
import { isAuthApiError } from '@supabase/supabase-js'
if (isAuthApiError(error)) {
  // AuthApiError 처리
}

// TypeScript
if (error instanceof AuthApiError) {
  console.log(error.code) // 구체적인 에러 코드
}
```

### 3. 언어별 처리
각 언어마다 고유한 에러 클래스와 처리 방식이 있으므로 해당 언어의 문서를 참조하세요.

## 결론

Supabase는 서비스별로 다른 에러 포맷을 사용하지만, 모두 표준 HTTP 상태 코드와 함께 구체적인 에러 정보를 제공합니다. 에러 처리 시에는 HTTP 상태 코드보다는 서비스별 에러 코드(`error_code`, `code` 등)를 우선 사용하는 것이 권장됩니다.