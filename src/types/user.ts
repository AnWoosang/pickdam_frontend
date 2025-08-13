// 사용자 프로필 관련 타입 정의

// 사용자 기본 정보
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  provider?: 'email' | 'kakao' | 'naver' | 'google';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

// 사용자 설정
export interface UserSettings {
  notifications: {
    marketing: boolean;
    orderUpdates: boolean;
    priceAlerts: boolean;
    communityUpdates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
    showActivity: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'ko' | 'en';
    currency: 'KRW' | 'USD';
  };
}

// 찜한 상품 타입
export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  brand: string;
  currentPrice: number;
  originalPrice?: number;
  addedAt: string;
  isAvailable: boolean;
}

// 주문 내역 타입
export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  orderedAt: string;
  deliveredAt?: string;
  trackingNumber?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ShippingAddress {
  id: string;
  name: string;
  phoneNumber?: string;
  address: string;
  detailAddress?: string;
  zipCode: string;
  isDefault: boolean;
}

// 리뷰 타입
export interface UserReview {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: string;
  updatedAt?: string;
  isRecommended: boolean;
}

// 사용자 활동 통계
export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  wishlistCount: number;
  reviewCount: number;
  joinDays: number;
}

// 마이페이지 메뉴 아이템
export interface MypageMenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
  isNew?: boolean;
}

// 사용자 프로필 업데이트 데이터
export interface ProfileUpdateData {
  name?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  profileImage?: string;
}

// 비밀번호 변경 데이터
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 주소록 관리
export interface AddressBookItem extends ShippingAddress {
  createdAt: string;
  updatedAt?: string;
}

// 알림 설정 업데이트 데이터
export interface NotificationUpdateData {
  marketing?: boolean;
  orderUpdates?: boolean;
  priceAlerts?: boolean;
  communityUpdates?: boolean;
}

// 탈퇴 요청 데이터
export interface AccountDeletionData {
  reason: string;
  feedback?: string;
  password: string;
}