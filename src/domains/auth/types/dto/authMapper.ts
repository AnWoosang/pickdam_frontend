import { LoginProvider, Role, LOGIN_PROVIDER_LABELS, USER_ROLE_LABELS, Session } from '../auth';
import { SessionResponseDto } from './authDto';

export function toProvider(providerString: string): LoginProvider {
  const provider = Object.entries(LOGIN_PROVIDER_LABELS)
    .find(([_, label]) => label === providerString)?.[0] as LoginProvider;
  
  return provider || LoginProvider.EMAIL;
}

export function toRole(roleString: string): Role {
  const role = Object.entries(USER_ROLE_LABELS)
    .find(([_, label]) => label === roleString)?.[0] as Role;

  return role || Role.USER;
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