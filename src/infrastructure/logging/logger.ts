/**
 * 개발환경 전용 로거 (react-native-logs 기반)
 * 프로덕션에서는 완전히 제거되어 성능에 영향을 주지 않습니다.
 */

import { logger as rnLogger, consoleTransport } from 'react-native-logs';

// 개발환경 체크
const isDevelopment = (): boolean => {
  return typeof window !== 'undefined'
    ? window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')
    : process.env.NODE_ENV === 'development';
};

// 로거 설정
const defaultConfig = {
  severity: isDevelopment() ? 'debug' as const : 'error' as const,
  transport: isDevelopment() ? [consoleTransport] : [],
  transportOptions: {
    colors: {
      info: 'blueBright' as const,
      warn: 'yellowBright' as const,
      error: 'redBright' as const,
      debug: 'black' as const,
    },
  },
  async: true,
  dateFormat: 'time' as const,
  printLevel: true,
  printDate: true,
  enabled: isDevelopment(),
};

// 메인 로거 인스턴스
const mainLogger = rnLogger.createLogger(defaultConfig);

/**
 * 개발환경 전용 로거 클래스
 */
class DevLogger {
  private context?: string;
  private logger: any;

  constructor(context?: string) {
    this.context = context;
    this.logger = context
      ? rnLogger.createLogger({
          ...defaultConfig,
          severity: defaultConfig.severity,
        })
      : mainLogger;
  }

  /**
   * 메시지 포맷팅 (컨텍스트 포함)
   */
  private formatMessage(message: string): string {
    return this.context ? `[${this.context}] ${message}` : message;
  }

  /**
   * 디버그 로그 - 개발 중 상세한 정보
   */
  debug(message: string, ...args: unknown[]): void {
    if (!isDevelopment()) return;
    this.logger.debug(this.formatMessage(message), ...args);
  }

  /**
   * 정보 로그 - 일반적인 정보
   */
  info(message: string, ...args: unknown[]): void {
    if (!isDevelopment()) return;
    this.logger.info(this.formatMessage(message), ...args);
  }

  /**
   * 경고 로그 - 주의가 필요한 상황
   */
  warn(message: string, ...args: unknown[]): void {
    if (!isDevelopment()) return;
    this.logger.warn(this.formatMessage(message), ...args);
  }

  /**
   * 에러 로그 - 오류 상황 (프로덕션에서도 출력)
   */
  error(message: string, ...args: unknown[]): void {
    this.logger.error(this.formatMessage(message), ...args);
  }

  /**
   * 성공 로그 - 성공적인 작업 완료
   */
  success(message: string, ...args: unknown[]): void {
    if (!isDevelopment()) return;
    this.logger.info(`✅ ${this.formatMessage(message)}`, ...args);
  }

  /**
   * 그룹 로그 시작 - 관련된 로그들을 그룹화
   */
  group(label: string): void {
    if (!isDevelopment()) return;
    console.group(`🔍 ${label}`);
  }

  /**
   * 그룹 로그 종료
   */
  groupEnd(): void {
    if (!isDevelopment()) return;
    console.groupEnd();
  }

  /**
   * 테이블 형태로 데이터 출력
   */
  table(data: Record<string, unknown> | unknown[]): void {
    if (!isDevelopment()) return;
    console.table(data);
  }

  /**
   * 시간 측정 시작
   */
  time(label: string): void {
    if (!isDevelopment()) return;
    console.time(label);
  }

  /**
   * 시간 측정 종료
   */
  timeEnd(label: string): void {
    if (!isDevelopment()) return;
    console.timeEnd(label);
  }

  /**
   * 조건부 로그 - 조건이 false일 때만 출력
   */
  assert(condition: boolean, message: string, ...args: unknown[]): void {
    if (!isDevelopment()) return;
    console.assert(condition, this.formatMessage(message), ...args);
  }

  /**
   * 스택 트레이스 출력
   */
  trace(message?: string): void {
    if (!isDevelopment()) return;
    if (message) {
      this.debug(message);
    }
    console.trace();
  }

  /**
   * 새로운 컨텍스트를 가진 로거 생성
   */
  child(context: string): DevLogger {
    const newContext = this.context ? `${this.context}:${context}` : context;
    return new DevLogger(newContext);
  }

  /**
   * 개발환경 여부 확인
   */
  get isEnabled(): boolean {
    return isDevelopment();
  }

  /**
   * 원본 react-native-logs 로거 접근
   */
  get raw() {
    return this.logger;
  }
}

// 기본 로거 인스턴스
export const logger = new DevLogger();

// 컨텍스트별 로거 생성 헬퍼
export const createLogger = (context: string): DevLogger => {
  return new DevLogger(context);
};

// 함수형 API (간편 사용)
export const log = {
  debug: (message: string, ...args: unknown[]) => logger.debug(message, ...args),
  info: (message: string, ...args: unknown[]) => logger.info(message, ...args),
  warn: (message: string, ...args: unknown[]) => logger.warn(message, ...args),
  error: (message: string, ...args: unknown[]) => logger.error(message, ...args),
  success: (message: string, ...args: unknown[]) => logger.success(message, ...args),
  group: (label: string) => logger.group(label),
  groupEnd: () => logger.groupEnd(),
  table: (data: Record<string, unknown> | unknown[]) => logger.table(data),
  time: (label: string) => logger.time(label),
  timeEnd: (label: string) => logger.timeEnd(label),
  assert: (condition: boolean, message: string, ...args: unknown[]) => logger.assert(condition, message, ...args),
  trace: (message?: string) => logger.trace(message),
};

// React 컴포넌트용 헬퍼
export const useLogger = (componentName: string) => {
  return createLogger(componentName);
};

// 미리 정의된 컨텍스트별 로거들
export const errorLogger = createLogger('ErrorBoundary');
export const apiLogger = createLogger('API');
export const storeLogger = createLogger('Store');
export const routerLogger = createLogger('Router');
export const hookLogger = createLogger('Hook');
export const componentLogger = createLogger('Component');

// 로그 레벨 타입 export (react-native-logs 호환)
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export default logger;