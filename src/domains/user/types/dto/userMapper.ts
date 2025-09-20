import { User, WishlistLikeInfo } from '@/domains/user/types/user';
import { toRole } from '@/domains/auth/types/dto/authMapper';
import { ToggleWishlistResponseDto } from '@/domains/product/types/dto/productDto';
import {
  UserResponseDto,
  WishlistItemResponseDto
} from './userDto';

export interface WishlistItem {
  id: string;
  memberId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
}


export function toUser(dto: UserResponseDto): User {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    nickname: dto.nickname,
    profileImageUrl: dto.profileImageUrl,
    role: toRole(dto.role)
  };
}

export function toWishlistItem(dto: WishlistItemResponseDto): WishlistItem {
  return {
    id: dto.id,
    memberId: dto.memberId,
    productId: dto.productId,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt
  };
}

export function toWishlistLikeInfo(dto: ToggleWishlistResponseDto): WishlistLikeInfo {
  return {
    isWishlisted: dto.isWishlisted,
    wishlistCount: dto.newFavoriteCount
  };
}

