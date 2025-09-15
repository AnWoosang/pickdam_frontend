/// 금액을 #,### 형태로 포맷
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR').format(price);
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