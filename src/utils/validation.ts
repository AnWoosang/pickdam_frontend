// 이메일 validation
export const validateEmail = (email: string): string | null => {
  if (!email) return null;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "이메일 주소가 올바르지 않아요";
  }
  
  return null;
};

// 비밀번호 validation
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("8자 이상이어야 합니다");
  }
  
  if (!/[A-Za-z]/.test(password)) {
    errors.push("영문자가 포함되어야 합니다");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("숫자가 포함되어야 합니다");
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>~]/.test(password)) {
    errors.push("특수문자가 1자이상 포함되어야 합니다");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 비밀번호 확인 validation
export const validatePasswordConfirm = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return null;
  
  if (password !== confirmPassword) {
    return "비밀번호가 일치하지 않아요 확인해 주세요";
  }
  
  return null;
};

// 테스트용 자동 입력 값들
export const TEST_CREDENTIALS = {
  email: "test@example.com",
  password: "TestPass123!",
  validEmails: [
    "test@example.com",
    "user@fitkle.com",
    "admin@test.co.kr"
  ],
  validPasswords: [
    "TestPass123!",
    "MySecure456@",
    "StrongPwd789#"
  ]
};