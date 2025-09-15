// 비밀번호 강도 타입 정의
export interface PasswordStrength {
  strength: number;
  text: string;
  color: string;
  requirements: string[];
}

// 비밀번호 필드 Props
export interface PasswordFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  showStrength?: boolean;
  label?: string;
  placeholder?: string;
  name?: string;
  id?: string;
}