// 공통 validation 함수들 - 여러 기능에서 재사용되는 검증

// 비밀번호 강도 타입 정의
export interface PasswordStrength {
  strength: number;
  text: string;
  color: string;
  requirements: string[];
  score: number;
}

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

// 닉네임 validation
export const validateNickname = (nickname: string): string | null => {
  if (!nickname.trim()) {
    return '닉네임을 입력해주세요.';
  }
  
  const trimmedNickname = nickname.trim();
  
  if (trimmedNickname.length < 2) {
    return '닉네임은 2자 이상이어야 합니다.';
  }
  
  if (trimmedNickname.length > 10) {
    return '닉네임은 10자 이하여야 합니다.';
  }
  
  // 한글, 영문, 숫자만 허용 (공백 제외)
  if (!/^[가-힣a-zA-Z0-9]+$/.test(trimmedNickname)) {
    return '닉네임은 한글, 영문, 숫자만 입력 가능합니다.';
  }
  
  // 부적절한 단어 검사 (기본적인 것들만)
  const inappropriateWords = ['admin', 'administrator', 'test', 'null', 'undefined'];
  if (inappropriateWords.some(word => trimmedNickname.toLowerCase().includes(word))) {
    return '사용할 수 없는 닉네임입니다.';
  }
  
  return null;
};

// 비밀번호 강도 체크 함수
export const checkPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return { strength: 0, text: '', color: 'bg-gray-200', requirements: [], score: 0 };
  
  let score = 0;
  const requirements: string[] = [];

  // 길이 체크 (8자 이상)
  if (password.length >= 8) {
    score += 25;
    requirements.push('8자 이상');
  } else if (password.length >= 6) {
    score += 15;
  }

  // 대소문자 체크
  if (/[a-z]/.test(password)) {
    score += 15;
    requirements.push('소문자');
  }
  if (/[A-Z]/.test(password)) {
    score += 15;
    requirements.push('대문자');
  }

  // 숫자 체크
  if (/\d/.test(password)) {
    score += 20;
    requirements.push('숫자');
  }

  // 특수문자 체크
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 25;
    requirements.push('특수문자');
  }

  // 강도 계산
  let strength = 0;
  let text = '';
  let color = 'bg-gray-200';

  if (score >= 80) {
    strength = 4;
    text = '매우 강함';
    color = 'bg-green-500';
  } else if (score >= 60) {
    strength = 3;
    text = '강함';
    color = 'bg-blue-500';
  } else if (score >= 40) {
    strength = 2;
    text = '보통';
    color = 'bg-yellow-500';
  } else if (score >= 20) {
    strength = 1;
    text = '약함';
    color = 'bg-orange-500';
  } else if (score > 0) {
    strength = 1;
    text = '매우 약함';
    color = 'bg-red-500';
  }

  return {
    strength,
    text,
    color,
    requirements,
    score
  };
};