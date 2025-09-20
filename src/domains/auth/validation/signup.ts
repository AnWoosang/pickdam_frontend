// 회원가입 관련 validation 함수들
import { validateEmail, validatePassword, validatePasswordConfirm, validateNickname } from '@/shared/validation/common';
import { Gender } from '@/domains/user/types/user';
import { SignupForm } from '@/domains/auth/types/auth';

// 이름 validation
export const validateName = (name: string): string | null => {
  if (!name || name.length === 0) {
    return '이름을 입력해주세요.';
  }

  // 공백 검사 (모든 공백 불허)
  if (/\s/.test(name)) {
    return '이름에는 공백을 사용할 수 없습니다.';
  }
  
  if (name.length < 2) {
    return '이름은 2자 이상이어야 합니다.';
  }
  
  if (name.length > 20) {
    return '이름은 20자 이하여야 합니다.';
  }
  
  // 한글 이름: 완성형 한글만 허용 (자음, 모음 단독 입력 방지)
  const koreanOnlyRegex = /^[가-힣]+$/;
  // 영문 이름: 대소문자만 허용
  const englishOnlyRegex = /^[a-zA-Z]+$/;
  
  if (!koreanOnlyRegex.test(name) && !englishOnlyRegex.test(name)) {
    return '이름은 완성된 한글 또는 영문만 입력 가능합니다.';
  }
  
  return null;
};

// 생년월일 validation
export const validateBirthDate = (birthDate: string): string | null => {
  if (!birthDate) {
    return '생년월일을 입력해주세요.';
  }
  
  const today = new Date();
  const birth = new Date(birthDate);
  
  // 유효한 날짜인지 확인
  if (isNaN(birth.getTime())) {
    return '올바른 날짜를 입력해주세요.';
  }
  
  // 미래 날짜 검증
  if (birth > today) {
    return '미래 날짜는 입력할 수 없습니다.';
  }
  
  // 나이 제한 (19세 이상)
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (age < 19 || (age === 19 && monthDiff < 0) || 
      (age === 19 && monthDiff === 0 && today.getDate() < birth.getDate())) {
    return '만 19세 이상만 가입 가능합니다.';
  }
  
  // 너무 오래된 날짜 검증 (150세 이상)
  if (age > 150) {
    return '올바른 생년월일을 입력해주세요.';
  }
  
  return null;
};

// 성별 validation
export const validateGender = (gender: Gender): string | null => {
  if (!gender) {
    return '성별을 선택해주세요.';
  }
  
  const validGenders = Object.values(Gender);
  if (!validGenders.includes(gender)) {
    return '올바른 성별을 선택해주세요.';
  }
  
  return null;
};

// 약관 동의 validation
export const validateTermsAcceptance = (termsAccepted: boolean, privacyAccepted: boolean): {
  termsError: string | null;
  privacyError: string | null;
} => {
  return {
    termsError: termsAccepted ? null : '이용약관에 동의해주세요.',
    privacyError: privacyAccepted ? null : '개인정보 처리방침에 동의해주세요.'
  };
};

// 회원가입 전체 validation
export interface SignupValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    nickname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    birthDate?: string;
    gender?: string;
    termsAccepted?: string;
    privacyAccepted?: string;
  };
}

export const validateSignup = (data: SignupForm): SignupValidationResult => {
  const errors: SignupValidationResult['errors'] = {};
  
  // 이름 검증
  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;
  
  // 닉네임 검증
  const nicknameError = validateNickname(data.nickname);
  if (nicknameError) errors.nickname = nicknameError;
  
  // 이메일 검증
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  // 비밀번호 검증
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors.join(', ');
  }
  
  // 비밀번호 확인 검증
  const confirmPasswordError = validatePasswordConfirm(data.password, data.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  // 생년월일 검증
  const birthDateError = validateBirthDate(data.birthDate);
  if (birthDateError) errors.birthDate = birthDateError;
  
  // 성별 검증
  const genderError = validateGender(data.gender);
  if (genderError) errors.gender = genderError;
  
  // 약관 동의 검증
  const { termsError, privacyError } = validateTermsAcceptance(data.termsAccepted, data.privacyAccepted);
  if (termsError) errors.termsAccepted = termsError;
  if (privacyError) errors.privacyAccepted = privacyError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};