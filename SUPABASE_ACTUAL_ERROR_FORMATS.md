# Supabase 실제 에러 포맷 분석

## 요약

Supabase MCP를 통해 실제 에러 포맷을 확인한 결과, 현재 정의한 타입과 실제 응답 형태가 다릅니다.

## 실제 에러 응답 포맷

### 1. PostgreSQL/PostgREST 에러
```json
{
  "error": {
    "name": "Error",
    "message": "Failed to run sql query: ERROR:  23505: duplicate key value violates unique constraint \"member_pkey\"\nDETAIL:  Key (id)=(3cc9f127-3e84-46fd-aeab-65644732adf7) already exists.\n"
  }
}
```

**특징:**
- 모든 정보가 `message` 문자열 안에 포함됨
- PostgreSQL 에러 코드(23505)는 메시지 내에서 파싱해야 함
- `DETAIL`, `HINT` 등의 정보도 메시지 내에 포함

### 2. 다른 에러 사례들

**NOT NULL 제약조건 위반 (23502):**
```json
{
  "error": {
    "name": "Error", 
    "message": "Failed to run sql query: ERROR:  23502: null value in column \"id\" of relation \"member\" violates not-null constraint\nDETAIL:  Failing row contains (null, test@example.com, Test User, ...).\n"
  }
}
```

**CHECK 제약조건 위반 (23514):**
```json
{
  "error": {
    "name": "Error",
    "message": "Failed to run sql query: ERROR:  23514: new row for relation \"member\" violates check constraint \"check_nickname_length\"\nDETAIL:  Failing row contains (...).\n"
  }
}
```

**FOREIGN KEY 제약조건 위반 (23503):**
```json
{
  "error": {
    "name": "Error",
    "message": "Failed to run sql query: ERROR:  23503: insert or update on table \"member\" violates foreign key constraint \"fk_member_auth_user\"\nDETAIL:  Key (id)=(b502f753-4bb7-4289-8408-c611c826599e) is not present in table \"users\".\n"
  }
}
```

**UUID 타입 오류 (22P02):**
```json
{
  "error": {
    "name": "Error",
    "message": "Failed to run sql query: ERROR:  22P02: invalid input syntax for type uuid: \"duplicate-test\"\nLINE 1: INSERT INTO member (id, email, name, birth_date, gender, provider) VALUES ('duplicate-test', ...);\n"
  }
}
```

## 문제점

### 현재 타입 정의 (잘못됨)
```typescript
export interface PostgrestError {
  code: string
  details: string
  hint: string
  message: string
}

export interface ApiError {
  code?: string
  message: string
}
```

### 실제 응답 형태
```typescript
// 실제로는 모든 에러가 이 형태
{
  error: {
    name: string,
    message: string  // 모든 정보가 여기 포함됨
  }
}
```

## 필요한 수정사항

1. **타입 정의 수정**: 실제 Supabase 응답에 맞게 타입 재정의
2. **에러 파싱 로직 개선**: 메시지 문자열에서 PostgreSQL 에러 코드와 세부사항 추출
3. **에러 매핑 로직 개선**: 파싱된 정보를 바탕으로 적절한 ApiErrorCode로 변환

## 다음 단계

Auth 에러와 Storage 에러도 확인하여 전체적인 에러 포맷 패턴 파악 필요.