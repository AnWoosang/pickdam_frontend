// Session DTO to Domain 매퍼

import { Session } from '../auth';
import { SessionResponseDto } from './loginDto';

/**
 * SessionResponseDto를 Session 도메인 객체로 변환
 */
export function toSession(dto: SessionResponseDto): Session {
  return {
    access_token: dto.access_token,
    refresh_token: dto.refresh_token,
    expires_in: dto.expires_in,
    expires_at: dto.expires_at,
    token_type: dto.token_type
  };
}