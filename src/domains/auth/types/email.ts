// 이메일 검증 상태 타입 정의
export type EmailStatus = 
  | 'idle'        // 초기 상태
  | 'invalid'     // 이메일 형식 유효하지 않음
  | 'checking'    // 중복 확인 중
  | 'available'   // 사용 가능
  | 'duplicate'   // 중복됨
  | 'error';      // API 에러

// 이메일 검증 결과
export interface EmailValidationResult {
  status: EmailStatus;
  error: string;
  isValid: boolean;
  canCheck: boolean;
}

// 이메일 필드 Props
export interface EmailFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidChange: (email: string, isValid: boolean) => void;
  disabled?: boolean;
}