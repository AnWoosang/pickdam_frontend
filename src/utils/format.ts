/// 금액을 #,### 형태로 포맷
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR').format(price);
}

/// 소수점 포함한 금액 포맷 (ex. 12,345.67)
export function formatPriceWithDecimal(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

/// 원화 표기 포맷
export function formatKRW(price: number): string {
  return `${formatPrice(price)}원`;
}

/// cn 함수 (clsx + tailwind-merge)
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}