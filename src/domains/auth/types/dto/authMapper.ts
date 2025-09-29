import { Role, Session } from '../auth';
import { SessionResponseDto } from './authDto';

export function toRole(roleString: string): Role {
  // Role enum 값으로 직접 매칭
  if (Object.values(Role).includes(roleString as Role)) {
    return roleString as Role;
  }
  
  return Role.USER;
}

export function toSession(dto: SessionResponseDto): Session {
  return {
    accessToken: dto.accessToken,
    refreshToken: dto.refreshToken,
    expiresIn: dto.expiresIn,
    expiresAt: dto.expiresAt,
    tokenType: dto.tokenType
  };
}