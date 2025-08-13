import { TermsContent, SignupStep } from '@/types/signup';

// 약관 내용 Mock 데이터
export const mockTermsContent: TermsContent[] = [
  {
    id: 'terms',
    title: '이용약관',
    required: true,
    lastUpdated: '2024-01-01',
    content: `
# 픽담 이용약관

## 제1조 (목적)
본 약관은 픽담(이하 "회사")이 제공하는 전자담배 정보 비교 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

## 제2조 (용어의 정의)
1. "서비스"란 회사가 제공하는 전자담배 제품 정보, 가격 비교, 리뷰 등의 서비스를 말합니다.
2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.

## 제3조 (서비스의 제공 및 변경)
1. 회사는 다음과 같은 서비스를 제공합니다:
   - 전자담배 제품 정보 및 가격 비교
   - 사용자 리뷰 및 평점 서비스
   - 커뮤니티 서비스

## 제4조 (이용자의 의무)
이용자는 서비스 이용 시 다음 행위를 하여서는 안 됩니다:
- 타인의 개인정보 도용
- 허위 정보 등록
- 불법적인 목적으로의 서비스 이용

이용약관의 전체 내용은 별도 페이지에서 확인하실 수 있습니다.
    `
  },
  {
    id: 'privacy',
    title: '개인정보 처리방침',
    required: true,
    lastUpdated: '2024-01-01',
    content: `
# 개인정보 처리방침

## 1. 개인정보의 처리목적
픽담은 다음의 목적을 위하여 개인정보를 처리합니다:
- 회원가입 의사 확인, 회원제 서비스 제공
- 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산
- 민원처리 및 고객상담

## 2. 개인정보의 처리 및 보유기간
- 회원정보: 회원탈퇴 시까지
- 서비스 이용기록: 3년
- 결제정보: 5년

## 3. 개인정보의 제3자 제공
회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.

개인정보 처리방침의 전체 내용은 별도 페이지에서 확인하실 수 있습니다.
    `
  },
  {
    id: 'marketing',
    title: '마케팅 정보 수신 동의',
    required: false,
    lastUpdated: '2024-01-01',
    content: `
# 마케팅 정보 수신 동의 (선택)

## 수집하는 개인정보의 항목
- 이메일 주소, 휴대폰 번호

## 개인정보의 수집 및 이용목적
- 신상품 소식, 이벤트 정보 등 광고성 정보 전송
- 맞춤형 서비스 제공 및 상품 추천
- 설문조사 및 이벤트 참여 기회 제공

## 개인정보의 보유 및 이용기간
- 동의철회 시까지 또는 회원탈퇴 시까지

## 동의를 거부할 권리
마케팅 정보 수신에 대한 동의를 거부하실 수 있으며, 동의를 거부하는 경우에도 서비스 이용에는 제한이 없습니다.
    `
  }
];

// 회원가입 단계 Mock 데이터
export const mockSignupSteps: SignupStep[] = [
  {
    id: 'info',
    title: '기본정보',
    description: '이름, 이메일, 비밀번호를 입력해주세요',
    isCompleted: false,
    isCurrent: true,
  },
  {
    id: 'verification',
    title: '이메일 인증',
    description: '이메일로 발송된 인증코드를 입력해주세요',
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: 'terms',
    title: '약관 동의',
    description: '이용약관 및 개인정보 처리방침에 동의해주세요',
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: 'complete',
    title: '가입완료',
    description: '회원가입이 완료되었습니다',
    isCompleted: false,
    isCurrent: false,
  }
];

// 비밀번호 강도 체크 함수
export const checkPasswordStrength = (password: string) => {
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

// 이메일 유효성 검사 함수
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호 유효성 검사 함수
export const validatePassword = (password: string): boolean => {
  // 8자 이상, 영문자와 숫자 포함
  return password.length >= 8 && /(?=.*[a-zA-Z])(?=.*\d)/.test(password);
};

