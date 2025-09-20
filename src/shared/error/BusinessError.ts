import { MappedError } from '@/shared/api/types'

/**
 * 비즈니스 로직 에러 클래스
 * 애플리케이션의 비즈니스 규칙 위반이나 도메인 로직 오류를 나타냄
 */
export class BusinessError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: string

  constructor(
    code: string,
    message: string,
    statusCode: number = 400,
    details?: string
  ) {
    super(message)
    this.name = 'BusinessError'
    this.code = code
    this.statusCode = statusCode
    this.details = details

    // Error 클래스 상속을 위한 설정
    Object.setPrototypeOf(this, BusinessError.prototype)
  }

}

export const createBusinessError = {
  unauthorized: (message: string = '권한이 없습니다.') =>
    new BusinessError('UNAUTHORIZED', message, 401),

  dataProcessing: (message: string, details?: string) =>
    new BusinessError('DATA_PROCESSING_ERROR', message, 422, details),

  fromMappedError: (mappedError: MappedError) =>
    new BusinessError(
      mappedError.errorCode,
      mappedError.message,
      mappedError.statusCode,
      mappedError.details
    )
}