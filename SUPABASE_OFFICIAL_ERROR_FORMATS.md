# Supabase 공식 에러 포맷 정리

Supabase 공식 문서 기반으로 모든 서비스의 에러 응답 포맷을 정리합니다.

## 1. Storage 에러

### 현재 포맷
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

## 2. Auth 에러

### API 에러 (서버측 Auth API 에러)
```json
{
  "code": 400,
  "error_code": "invalid_credentials",
  "msg": "Invalid login credentials"
}
```

### Auth Hooks HTTP 에러
```json
{
  "error": {
    "http_code": 429,
    "message": "You can only verify a factor once every 10 seconds."
  }
}
```

### 클라이언트측 에러 타입들
- `FunctionsHttpError`: 함수가 반환한 에러 (4xx/5xx)
- `FunctionsRelayError`: 클라이언트-Supabase 간 네트워크 에러
- `FunctionsFetchError`: 함수에 전혀 도달할 수 없는 경우

## 3. PostgREST/Database 에러

### 표준 PostgREST 에러
```json
{
  "code": "42501",
  "details": "Key (id)=(uuid) already exists.",
  "hint": null,
  "message": "new row violates row-level security policy for table \"member\""
}
```

### 사용자 정의 PostgreSQL 에러
PostgreSQL 함수에서 다음과 같이 정의:
```sql
raise sqlstate 'PGRST' using
  message = json_build_object(
    'code', '123',
    'message', 'Payment Required',
    'details', 'Quota exceeded',
    'hint', 'Upgrade your plan'
  )::text,
  detail = json_build_object(
    'status', 402,
    'headers', json_build_object(
      'X-Powered-By', 'Nerd Rage'
    )
  )::text;
```

## 4. Edge Functions 에러

### 서버측 에러 응답
```json
{
  "error": "error_message"
}
```

### 클라이언트측 에러 처리
```javascript
if (error instanceof FunctionsHttpError) {
  const errorMessage = await error.context.json()
  // 함수가 반환한 에러
} else if (error instanceof FunctionsRelayError) {
  // 네트워크/릴레이 에러
} else if (error instanceof FunctionsFetchError) {
  // 함수에 도달할 수 없음
}
```

## 5. 일반 API 응답

### 성공 응답
```json
{
  "result": [/* data */],
  "error": null
}
```

### 에러 응답  
```json
{
  "result": null,
  "error": "error_message"
}
```

## HTTP 상태 코드

모든 Supabase 서비스는 표준 HTTP 상태 코드를 사용:

- **200**: 성공
- **201**: 생성 성공  
- **400**: 잘못된 요청
- **401**: 인증 필요
- **403**: 권한 부족
- **404**: 리소스 없음
- **409**: 충돌 (중복 등)
- **422**: 처리할 수 없는 엔티티
- **429**: 너무 많은 요청
- **500**: 서버 내부 에러

## 로그에서 에러 분석

Edge Logs에서 에러 분석을 위한 SQL:
```sql
select
  cast(timestamp as datetime) as timestamp,
  status_code,
  event_message,
  path
from edge_logs
cross join unnest(metadata) as metadata
cross join unnest(response) as response
cross join unnest(request) as request
where
  status_code >= 400
  and regexp_contains(path, '^/rest/v1/');
```

## 결론

**Supabase는 서비스별로 다른 에러 포맷을 사용하지만, 모두 표준 HTTP 상태 코드와 함께 제공됩니다:**

1. **Storage**: `{code, message}`
2. **Auth**: `{code, error_code, msg}` 또는 `{error: {http_code, message}}`
3. **PostgREST**: `{code, details, hint, message}`
4. **Edge Functions**: `{error: message}` + 클라이언트 에러 클래스들
5. **일반 API**: `{result, error}` 형태