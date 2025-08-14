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

// 게시글 제목 validation
export const validatePostTitle = (title: string): string | null => {
  if (!title.trim()) {
    return "제목을 입력해주세요.";
  }
  
  const trimmedTitle = title.trim();
  
  if (trimmedTitle.length < 2) {
    return "제목은 최소 2자 이상이어야 합니다.";
  }
  
  if (trimmedTitle.length >= 100) {
    return "제목은 100자 미만이어야 합니다.";
  }
  
  // 특수문자만으로 구성된 제목 금지
  if (/^[^a-zA-Z0-9가-힣\s]+$/.test(trimmedTitle)) {
    return "제목에 문자나 숫자를 포함해주세요.";
  }
  
  // 연속된 특수문자 제한 (3개 이상)
  if (/[!@#$%^&*()_+={}\[\]|\\:";'<>?,./-]{3,}/.test(trimmedTitle)) {
    return "특수문자는 연속으로 3개 이상 사용할 수 없습니다.";
  }
  
  return null;
};

// 게시글 내용 validation
export const validatePostContent = (content: string): string | null => {
  if (!content.trim()) {
    return "내용을 입력해주세요.";
  }
  
  const trimmedContent = content.trim();
  
  if (trimmedContent.length < 10) {
    return "내용은 최소 10자 이상이어야 합니다.";
  }
  
  if (trimmedContent.length > 10000) {
    return "내용은 10,000자를 초과할 수 없습니다.";
  }
  
  // 의미있는 내용인지 검사 (반복 문자 제한)
  if (/(.)\1{9,}/.test(trimmedContent)) {
    return "같은 문자를 10번 이상 연속으로 사용할 수 없습니다.";
  }
  
  // 줄바꿈만 있는 내용 금지
  const contentWithoutNewlines = trimmedContent.replace(/\n/g, '').trim();
  if (contentWithoutNewlines.length < 5) {
    return "의미있는 내용을 작성해주세요.";
  }
  
  return null;
};

// 카테고리 validation
export const validatePostCategory = (categoryId: string | undefined): string | null => {
  if (!categoryId) {
    return "카테고리를 선택해주세요.";
  }
  
  return null;
};

// 게시글 전체 validation (제목, 내용, 카테고리 통합)
export interface PostValidationResult {
  isValid: boolean;
  errors: {
    title?: string;
    content?: string;
    category?: string;
  };
}

export const validatePost = (data: {
  title: string;
  content: string;
  categoryId: string | undefined;
}): PostValidationResult => {
  const errors: PostValidationResult['errors'] = {};
  
  const titleError = validatePostTitle(data.title);
  if (titleError) errors.title = titleError;
  
  const contentError = validatePostContent(data.content);
  if (contentError) errors.content = contentError;
  
  const categoryError = validatePostCategory(data.categoryId);
  if (categoryError) errors.category = categoryError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 이름 validation
export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return '이름을 입력해주세요.';
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return '이름은 2자 이상이어야 합니다.';
  }
  
  if (trimmedName.length > 50) {
    return '이름은 50자 이하여야 합니다.';
  }
  
  if (!/^[가-힣a-zA-Z\s]+$/.test(trimmedName)) {
    return '이름은 한글 또는 영문만 입력 가능합니다.';
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
export const validateGender = (gender: string): string | null => {
  if (!gender) {
    return '성별을 선택해주세요.';
  }
  
  if (!['male', 'female'].includes(gender)) {
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
    email?: string;
    password?: string;
    confirmPassword?: string;
    birthDate?: string;
    gender?: string;
    termsAccepted?: string;
    privacyAccepted?: string;
  };
}

export const validateSignup = (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  gender: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}): SignupValidationResult => {
  const errors: SignupValidationResult['errors'] = {};
  
  // 이름 검증
  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;
  
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