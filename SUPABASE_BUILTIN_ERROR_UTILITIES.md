# Supabase Built-in 에러 유틸리티 활용 가이드

## 개요

`@supabase/supabase-js`는 각 서비스별로 built-in 에러 타입 가드 함수들을 제공합니다. 이를 활용하면 수동 에러 매핑을 크게 간소화할 수 있습니다.

## Available Built-in 에러 유틸리티들

### 1. Auth 에러 (@supabase/auth-js)

```typescript
import { 
  isAuthError, 
  isAuthApiError, 
  isAuthSessionMissingError,
  isAuthWeakPasswordError,
  isAuthRetryableFetchError,
  isAuthImplicitGrantRedirectError,
  AuthError,
  AuthApiError
} from '@supabase/supabase-js'
```

**주요 유틸리티:**
- `isAuthError(error: unknown): error is AuthError` - 모든 Auth 에러
- `isAuthApiError(error: unknown): error is AuthApiError` - Auth API 에러 (가장 유용)
- `isAuthSessionMissingError(error: any): error is AuthSessionMissingError` - 세션 누락
- `isAuthWeakPasswordError(error: unknown): error is AuthWeakPasswordError` - 약한 비밀번호
- `isAuthRetryableFetchError(error: unknown): error is AuthRetryableFetchError` - 재시도 가능한 에러
- `isAuthImplicitGrantRedirectError(error: any): error is AuthImplicitGrantRedirectError` - OAuth 리다이렉트 에러

### 2. Storage 에러 (@supabase/storage-js)

```typescript
import { isStorageError, StorageError } from '@supabase/supabase-js'
```

**주요 유틸리티:**
- `isStorageError(error: unknown): error is StorageError` - 모든 Storage 에러

### 3. PostgREST 에러 (@supabase/postgrest-js)

```typescript
import { PostgrestError } from '@supabase/supabase-js'
```

**체크 방법:**
- `error instanceof PostgrestError` - PostgREST 에러 (별도 타입 가드 함수 없음)

## 개선된 에러 매핑 예시

### Before (수동 매핑)
```typescript
function mapAuthError(error: ApiError, errorMessage: string): MappedError | null {
  const errorCode = error.code?.toLowerCase();
  
  if (errorCode === SUPABASE_ERROR_CODES.INVALID_CREDENTIALS || 
      errorMessage.includes('invalid email or password')) {
    return {
      code: ApiErrorCode.INVALID_CREDENTIALS,
      message: API_ERROR_MESSAGES[ApiErrorCode.INVALID_CREDENTIALS],
      details: error.message
    }
  }
  // ... 더 많은 수동 매핑
}
```

### After (Built-in 유틸리티 활용)
```typescript
import { 
  isAuthApiError, 
  isAuthSessionMissingError,
  isAuthWeakPasswordError,
  isStorageError,
  PostgrestError 
} from '@supabase/supabase-js'

function mapSupabaseError(error: unknown): MappedError {
  // 1. Auth 에러 체크
  if (isAuthApiError(error)) {
    // AuthApiError는 status와 code를 가지고 있음
    return mapAuthApiError(error)
  }
  
  if (isAuthSessionMissingError(error)) {
    return {
      code: ApiErrorCode.UNAUTHORIZED,
      message: API_ERROR_MESSAGES[ApiErrorCode.UNAUTHORIZED],
      details: error.message
    }
  }
  
  if (isAuthWeakPasswordError(error)) {
    return {
      code: ApiErrorCode.WEAK_PASSWORD,
      message: API_ERROR_MESSAGES[ApiErrorCode.WEAK_PASSWORD],
      details: error.message,
      metadata: {
        reasons: error.reasons // 약한 비밀번호 이유들
      }
    }
  }
  
  // 2. Storage 에러 체크
  if (isStorageError(error)) {
    return mapStorageError(error)
  }
  
  // 3. PostgREST 에러 체크
  if (error instanceof PostgrestError) {
    return mapPostgrestError(error)
  }
  
  // 4. 일반 에러
  return mapGenericError(error)
}

function mapAuthApiError(error: AuthApiError): MappedError {
  // AuthApiError는 구조화된 정보를 제공함
  // error.status: HTTP 상태 코드
  // error.code: 구체적 에러 코드 (optional)
  // error.message: 에러 메시지
  
  // HTTP 상태 코드로 먼저 분류
  switch (error.status) {
    case 400:
      if (error.message.includes('invalid')) {
        return {
          code: ApiErrorCode.INVALID_CREDENTIALS,
          message: API_ERROR_MESSAGES[ApiErrorCode.INVALID_CREDENTIALS],
          details: error.message
        }
      }
      break
    case 422:
      return {
        code: ApiErrorCode.WEAK_PASSWORD,
        message: API_ERROR_MESSAGES[ApiErrorCode.WEAK_PASSWORD],
        details: error.message
      }
    case 429:
      return {
        code: ApiErrorCode.TOO_MANY_REQUESTS,
        message: API_ERROR_MESSAGES[ApiErrorCode.TOO_MANY_REQUESTS],
        details: error.message
      }
  }
  
  // 기본 처리
  return {
    code: ApiErrorCode.INTERNAL_SERVER_ERROR,
    message: API_ERROR_MESSAGES[ApiErrorCode.INTERNAL_SERVER_ERROR],
    details: error.message
  }
}
```

## 장점

1. **타입 안전성**: TypeScript 타입 가드로 완전한 타입 안전성 보장
2. **코드 간소화**: 수동 문자열 매칭 대신 구조화된 에러 정보 활용
3. **유지보수성**: Supabase 업데이트에 따른 에러 포맷 변경에 더 안정적
4. **정확성**: 각 에러 클래스가 제공하는 구체적 정보 활용 (예: `AuthWeakPasswordError.reasons`)

## 결론

Built-in 에러 유틸리티들을 활용하면:
- 수동 매핑 코드를 크게 줄일 수 있습니다
- 더 정확하고 안정적인 에러 처리가 가능합니다
- Supabase의 구조화된 에러 정보를 완전히 활용할 수 있습니다

다만 모든 에러 시나리오를 커버하지는 않으므로, 핵심적인 에러들은 built-in 유틸리티로 처리하고 나머지는 기존 방식을 보완적으로 사용하는 하이브리드 접근법이 권장됩니다.