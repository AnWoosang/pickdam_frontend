/**
 * 비즈니스 로직 에러 클래스
 * 애플리케이션의 비즈니스 규칙 위반이나 도메인 로직 오류를 나타냄
 */
export class BusinessError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: string
  public readonly metadata?: Record<string, unknown>

  constructor(
    code: string,
    message: string,
    statusCode: number = 400,
    details?: string,
    metadata?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'BusinessError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.metadata = metadata

    // Error 클래스 상속을 위한 설정
    Object.setPrototypeOf(this, BusinessError.prototype)
  }

  /**
   * 에러 정보를 JSON 형태로 직렬화
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      metadata: this.metadata,
      stack: this.stack
    }
  }

  /**
   * 클라이언트에 전송할 안전한 에러 정보
   */
  toClientSafe() {
    return {
      code: this.code,
      message: this.message,
      details: this.details
    }
  }
}

/**
 * 비즈니스 에러 생성 헬퍼 함수들
 */
export const createBusinessError = {
  /**
   * 유효하지 않은 입력값
   */
  invalidInput: (message: string, details?: string) =>
    new BusinessError('INVALID_INPUT', message, 400, details),

  /**
   * 필수 필드 누락
   */
  missingRequiredField: (fieldName: string) =>
    new BusinessError('MISSING_REQUIRED_FIELD', `${fieldName}이(가) 필요합니다.`, 400),

  /**
   * 리소스를 찾을 수 없음
   */
  notFound: (resourceName: string) =>
    new BusinessError('RESOURCE_NOT_FOUND', `${resourceName}을(를) 찾을 수 없습니다.`, 404),

  /**
   * 권한 없음
   */
  unauthorized: (message: string = '권한이 없습니다.') =>
    new BusinessError('UNAUTHORIZED', message, 401),

  /**
   * 접근 금지
   */
  forbidden: (message: string = '접근이 금지되었습니다.') =>
    new BusinessError('FORBIDDEN', message, 403),

  /**
   * 중복된 리소스
   */
  duplicate: (resourceName: string) =>
    new BusinessError('DUPLICATE_RESOURCE', `이미 존재하는 ${resourceName}입니다.`, 409),

  /**
   * 비즈니스 규칙 위반
   */
  businessRuleViolation: (message: string, details?: string) =>
    new BusinessError('BUSINESS_RULE_VIOLATION', message, 400, details),

  /**
   * 데이터 처리 오류
   */
  dataProcessing: (message: string, details?: string) =>
    new BusinessError('DATA_PROCESSING_ERROR', message, 422, details)
}