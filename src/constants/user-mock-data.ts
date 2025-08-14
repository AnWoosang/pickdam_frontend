import { 
  UserProfile, 
  UserSettings, 
  WishlistItem, 
  Order, 
  UserReview, 
  UserStats,
  MypageMenuItem,
  ShippingAddress 
} from '@/types/user';
import { GENDER, LOGIN_PROVIDER } from '@/constants/common';

// 사용자 프로필 목록
export const mockUsers: UserProfile[] = [
  {
    id: 'user1',
    email: 'john.doe@example.com',
    name: '김민수',
    profileImage: 'https://via.placeholder.com/100',
    birthDate: '1990-05-15',
    gender: GENDER.MALE,
    provider: LOGIN_PROVIDER.EMAIL,
    isEmailVerified: true,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'user2',
    email: 'jane.smith@example.com',
    name: '이지영',
    profileImage: 'https://via.placeholder.com/100',
    birthDate: '1995-08-22',
    gender: GENDER.FEMALE,
    provider: LOGIN_PROVIDER.KAKAO,
    isEmailVerified: true,
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
  },
  {
    id: 'user3',
    email: 'park.hyunsoo@gmail.com',
    name: '박현수',
    profileImage: 'https://via.placeholder.com/100',
    birthDate: '1988-12-03',
    gender: GENDER.MALE,
    provider: LOGIN_PROVIDER.GOOGLE,
    isEmailVerified: true,
    createdAt: '2023-06-20T00:00:00Z',
    updatedAt: '2024-10-15T00:00:00Z',
  },
  {
    id: 'user4',
    email: 'choi.soyeon@naver.com',
    name: '최소연',
    profileImage: 'https://via.placeholder.com/100',
    birthDate: '1992-07-18',
    gender: GENDER.FEMALE,
    provider: LOGIN_PROVIDER.NAVER,
    isEmailVerified: true,
    createdAt: '2023-09-05T00:00:00Z',
    updatedAt: '2024-12-10T00:00:00Z',
  },
  {
    id: 'user5',
    email: 'admin@pickdam.com',
    name: '관리자',
    profileImage: 'https://via.placeholder.com/100',
    birthDate: '1985-01-01',
    gender: GENDER.MALE,
    provider: LOGIN_PROVIDER.EMAIL,
    isEmailVerified: true,
    createdAt: '2022-12-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
  },
];

// 현재 로그인한 사용자 (기본값)
export const currentUser: UserProfile = mockUsers[0];

// 사용자 설정
export const mockUserSettings: UserSettings = {
  notifications: {
    marketing: true,
    orderUpdates: true,
    priceAlerts: false,
    communityUpdates: true,
  },
  privacy: {
    profileVisibility: 'public',
    showEmail: false,
    showActivity: true,
  },
  preferences: {
    theme: 'light',
    language: 'ko',
    currency: 'KRW',
  },
};

// 사용자 통계
export const mockUserStats: UserStats = {
  totalOrders: 12,
  totalSpent: 450000,
  wishlistCount: 28,
  reviewCount: 8,
  joinDays: 320,
};

// 마이페이지 메뉴
export const mockMypageMenuItems: MypageMenuItem[] = [
  {
    id: 'profile',
    label: '프로필 관리',
    icon: '👤',
    href: '/mypage/profile',
  },
  {
    id: 'orders',
    label: '주문 내역',
    icon: '📦',
    href: '/mypage/orders',
    badge: 2,
  },
  {
    id: 'wishlist',
    label: '찜한 상품',
    icon: '❤️',
    href: '/mypage/wishlist',
    badge: 28,
  },
  {
    id: 'reviews',
    label: '내 리뷰',
    icon: '⭐',
    href: '/mypage/reviews',
    badge: 8,
  },
  {
    id: 'addresses',
    label: '배송지 관리',
    icon: '📍',
    href: '/mypage/addresses',
  },
  {
    id: 'settings',
    label: '설정',
    icon: '⚙️',
    href: '/mypage/settings',
  },
  {
    id: 'help',
    label: '고객 센터',
    icon: '❓',
    href: '/help',
    isNew: true,
  },
];

// 배송지 목록
export const mockShippingAddresses: ShippingAddress[] = [
  {
    id: 'addr1',
    name: '김민수',
    phoneNumber: '010-1234-5678',
    address: '서울특별시 강남구 테헤란로 123',
    detailAddress: '아파트 101동 1001호',
    zipCode: '06234',
    isDefault: true,
  },
  {
    id: 'addr2',
    name: '김민수',
    phoneNumber: '010-1234-5678',
    address: '경기도 성남시 분당구 판교로 456',
    detailAddress: '오피스텔 202호',
    zipCode: '13487',
    isDefault: false,
  },
];

// 찜한 상품 목록
export const mockWishlistItems: WishlistItem[] = [
  {
    id: 'wish1',
    productId: 'product1',
    productName: '아이폰 15 Pro 256GB',
    productImage: 'https://via.placeholder.com/200',
    brand: 'Apple',
    currentPrice: 1350000,
    originalPrice: 1500000,
    addedAt: '2024-12-01T00:00:00Z',
    isAvailable: true,
  },
  {
    id: 'wish2',
    productId: 'product2',
    productName: '삼성 갤럭시 S24 Ultra',
    productImage: 'https://via.placeholder.com/200',
    brand: 'Samsung',
    currentPrice: 1200000,
    originalPrice: 1400000,
    addedAt: '2024-11-28T00:00:00Z',
    isAvailable: true,
  },
  {
    id: 'wish3',
    productId: 'product3',
    productName: '에어팟 프로 3세대',
    productImage: 'https://via.placeholder.com/200',
    brand: 'Apple',
    currentPrice: 350000,
    originalPrice: 400000,
    addedAt: '2024-11-25T00:00:00Z',
    isAvailable: false,
  },
];

// 주문 내역
export const mockOrders: Order[] = [
  {
    id: 'order1',
    orderNumber: 'PD20241201001',
    status: 'delivered',
    items: [
      {
        id: 'item1',
        productId: 'product1',
        productName: '아이폰 15 Pro 256GB',
        productImage: 'https://via.placeholder.com/200',
        brand: 'Apple',
        quantity: 1,
        unitPrice: 1350000,
        totalPrice: 1350000,
      },
    ],
    totalAmount: 1350000,
    paymentMethod: '신용카드',
    shippingAddress: mockShippingAddresses[0],
    orderedAt: '2024-12-01T10:30:00Z',
    deliveredAt: '2024-12-03T14:20:00Z',
    trackingNumber: '1234567890123',
  },
  {
    id: 'order2',
    orderNumber: 'PD20241125002',
    status: 'shipped',
    items: [
      {
        id: 'item2',
        productId: 'product2',
        productName: '에어팟 프로 3세대',
        productImage: 'https://via.placeholder.com/200',
        brand: 'Apple',
        quantity: 2,
        unitPrice: 350000,
        totalPrice: 700000,
      },
    ],
    totalAmount: 700000,
    paymentMethod: 'PayPal',
    shippingAddress: mockShippingAddresses[1],
    orderedAt: '2024-11-25T15:45:00Z',
    trackingNumber: '9876543210987',
  },
];

// 사용자 리뷰
export const mockUserReviews: UserReview[] = [
  {
    id: 'review1',
    productId: 'product1',
    productName: '아이폰 15 Pro 256GB',
    productImage: 'https://via.placeholder.com/200',
    rating: 5,
    content: '정말 만족스러운 제품입니다. 카메라 성능이 특히 뛰어나고 배터리 지속시간도 좋습니다.',
    images: ['https://via.placeholder.com/300', 'https://via.placeholder.com/300'],
    createdAt: '2024-12-05T00:00:00Z',
    isRecommended: true,
  },
  {
    id: 'review2',
    productId: 'product2',
    productName: '에어팟 프로 3세대',
    productImage: 'https://via.placeholder.com/200',
    rating: 4,
    content: '노이즈 캔슬링 기능이 정말 좋습니다. 음질도 만족스럽고 착용감도 편안해요.',
    createdAt: '2024-11-30T00:00:00Z',
    isRecommended: true,
  },
  {
    id: 'review3',
    productId: 'product3',
    productName: '맥북 에어 M3',
    productImage: 'https://via.placeholder.com/200',
    rating: 5,
    content: '가벼우면서도 성능이 뛰어납니다. 배터리 수명도 길고 디스플레이도 선명해요.',
    createdAt: '2024-11-20T00:00:00Z',
    isRecommended: true,
  },
];

// ID로 사용자 찾기
export const getUserById = (id: string): UserProfile | undefined => {
  return mockUsers.find(user => user.id === id);
};

// 이메일로 사용자 찾기
export const getUserByEmail = (email: string): UserProfile | undefined => {
  return mockUsers.find(user => user.email === email);
};

// 사용자 이름으로 검색
export const searchUsersByName = (name: string): UserProfile[] => {
  return mockUsers.filter(user => 
    user.name.toLowerCase().includes(name.toLowerCase())
  );
};