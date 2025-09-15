// 간단한 로거 구현

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: unknown;
}

class Logger {
  private minLevel: LogLevel = LogLevel.INFO;
  private context?: string;

  constructor(context?: string) {
    this.context = context;
    
    // 개발환경에서는 DEBUG 레벨부터 로그 출력
    if (process.env.NODE_ENV === 'development') {
      this.minLevel = LogLevel.DEBUG;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private formatMessage(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const context = entry.context ? `[${entry.context}] ` : '';
    return `${entry.timestamp} ${levelName} ${context}${entry.message}`;
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: this.context,
      data,
    };

    const formattedMessage = this.formatMessage(entry);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, data ? data : '');
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, data ? data : '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, data ? data : '');
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, data ? data : '');
        break;
    }
  }

  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, message, data);
  }

  // 컨텍스트가 있는 새로운 로거 생성
  child(context: string): Logger {
    return new Logger(this.context ? `${this.context}:${context}` : context);
  }

  // 로그 레벨 설정
  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }
}

// 기본 로거 인스턴스
export const logger = new Logger();

// 컨텍스트별 로거 생성 헬퍼
export const createLogger = (context: string): Logger => {
  return new Logger(context);
};

// 타입 export
export type { LogEntry };
export { Logger };