/// 금액을 #,### 형태로 포맷
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR').format(price);
}

/// 원화 표기 포맷
export function formatKRW(price: number): string {
  return `${formatPrice(price)}원`;
}

/// 날짜 포맷팅 (상대적 시간)
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `${days}일 전`;
  } else if (hours > 0) {
    return `${hours}시간 전`;
  } else {
    return '방금 전';
  }
};

/// 날짜 포맷팅 (절대적 시간)
export const formatAbsoluteDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/// cn 함수 (clsx + tailwind-merge)
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}