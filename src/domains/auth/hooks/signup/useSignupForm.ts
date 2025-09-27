'use client';

import React, { useCallback, useReducer } from 'react';
import { SignupForm } from '@/domains/auth/types/auth';
import { validateSignup } from '@/domains/auth/validation/signup';
import { Gender } from '@/domains/user/types/user';
import { useSignup } from './useSignupQueries';

// 상태 타입 정의
interface SignupFormState {
  formData: SignupForm;
  generalError: string;
  validationStatus: {
    nickname: boolean;
    email: boolean;
  };
}

// 액션 타입 정의
type SignupFormAction =
  | { type: 'UPDATE_FIELD'; field: keyof SignupForm; value: SignupForm[keyof SignupForm] }
  | { type: 'UPDATE_VALIDATION'; field: 'nickname' | 'email'; isValid: boolean }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_ALL_TERMS'; checked: boolean }
  | { type: 'RESET_FORM' };

// 초기 상태
const initialState: SignupFormState = {
  formData: {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickname: '',
    birthDate: '',
    gender: Gender.MALE,
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false,
  },
  generalError: '',
  validationStatus: {
    nickname: false,
    email: false,
  },
};


// 리듀서 함수
function signupFormReducer(state: SignupFormState, action: SignupFormAction): SignupFormState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
        generalError: '', // 입력 시 에러 초기화
      };
    case 'UPDATE_VALIDATION':
      return {
        ...state,
        validationStatus: {
          ...state.validationStatus,
          [action.field]: action.isValid,
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        generalError: action.error,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        generalError: '',
      };
    case 'SET_ALL_TERMS':
      return {
        ...state,
        formData: {
          ...state.formData,
          termsAccepted: action.checked,
          privacyAccepted: action.checked,
          marketingAccepted: action.checked,
        },
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}


export function useSignupForm() {
  const signupMutation = useSignup();
  const [state, dispatch] = useReducer(signupFormReducer, initialState);

  // 에러 처리 함수
  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
    if (signupMutation.error) {
      signupMutation.reset();
    }
  }, [signupMutation]);

  // 폼 데이터 업데이트 함수
  const updateFormData = useCallback((field: keyof SignupForm, value: SignupForm[keyof SignupForm]) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
    clearErrors();
  }, [clearErrors]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    dispatch({ 
      type: 'UPDATE_FIELD', 
      field: name as keyof SignupForm, 
      value: fieldValue 
    });
    
    clearErrors();
  }, [clearErrors]);

  // 필드 유효성 변경 핸들러들 (비즈니스 로직)
  const handleNicknameValidChange = useCallback((nickname: string, isValid: boolean) => {
    dispatch({ type: 'UPDATE_VALIDATION', field: 'nickname', isValid });
    dispatch({ type: 'UPDATE_FIELD', field: 'nickname', value: nickname });
  }, []);

  const handleEmailValidChange = useCallback((email: string, isValid: boolean) => {
    dispatch({ type: 'UPDATE_VALIDATION', field: 'email', isValid });  
    dispatch({ type: 'UPDATE_FIELD', field: 'email', value: email });
  }, []);

  // 검증 로직
  const runValidation = useCallback(() => {
    // validateSignup 함수를 사용하여 검증
    const validationResult = validateSignup(state.formData);
    const errors: Record<string, string> = { ...validationResult.errors };
    
    // 닉네임/이메일 중복 확인 검증
    if (!state.validationStatus.nickname) {
      errors.nickname = '닉네임 중복확인을 완료해주세요.';
    }
    if (!state.validationStatus.email) {
      errors.email = '이메일 중복확인을 완료해주세요.';
    }
    
    // 추가 유효성 검사 (기존 validateSignup 함수)
    const validation = validateSignup(state.formData);
    const allErrors = { ...errors, ...validation.errors };
    
    return allErrors;
  }, [state.formData, state.validationStatus]);

  // 폼 제출 핸들러 (비즈니스 로직)
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const allErrors = runValidation();
    
    if (Object.keys(allErrors).length > 0) {
      dispatch({ type: 'SET_ERROR', error: Object.values(allErrors)[0] });
      return;
    }

    // 기존 에러 메시지 클리어
    clearErrors();

    try {
      await signupMutation.mutateAsync(state.formData);
      // 성공 처리는 mutation 내부에서 자동으로 리다이렉트됨
    } catch (err) {
      dispatch({ 
        type: 'SET_ERROR', 
        error: err instanceof Error ? err.message : '회원가입에 실패했습니다.' 
      });
    }
  }, [runValidation, clearErrors, signupMutation, state.formData]);

  const handleAllAgree = useCallback((checked: boolean) => {
    dispatch({ type: 'SET_ALL_TERMS', checked });
  }, []);

  return {
    formData: state.formData,
    generalError: state.generalError || signupMutation.error?.message || '',
    isLoading: signupMutation.isPending,
    isSuccess: signupMutation.isSuccess,
    status: signupMutation.isPending ? 'submitting' : signupMutation.isSuccess ? 'success' : 'idle',
    validationStatus: state.validationStatus,
    handleInputChange,
    handleSubmit,
    handleAllAgree,
    handleNicknameValidChange,
    handleEmailValidChange,
    updateFormData,
  };
}