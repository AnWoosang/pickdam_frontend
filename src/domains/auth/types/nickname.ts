// 닉네임 검증 상태 타입 정의
export type NicknameStatus = 
  | 'idle'        // 초기 상태
  | 'invalid'     // 닉네임 형식 유효하지 않음
  | 'checking'    // 중복 확인 중
  | 'available'   // 사용 가능
  | 'duplicate'   // 중복됨
  | 'error';      // API 에러

// 닉네임 검증 결과
export interface NicknameValidationResult {
  status: NicknameStatus;
  error: string;
  isValid: boolean;
  canCheck: boolean;
}

// 닉네임 필드 Props
export interface NicknameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidChange: (nickname: string, isValid: boolean) => void;
  disabled?: boolean;
}