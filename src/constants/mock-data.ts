import { Post, PostCategory } from '@/types/community';

// 게시글 카테고리 목 데이터
export const mockCategories: PostCategory[] = [
  { id: 'general', name: '자유게시판', color: '#6B7280' },
  { id: 'review', name: '제품리뷰', color: '#10B981' },
  { id: 'question', name: '질문답변', color: '#3B82F6' },
  { id: 'tips', name: '팁&노하우', color: '#F59E0B' },
  { id: 'notice', name: '공지사항', color: '#EF4444' },
];

// 게시글 목 데이터
export const mockPosts: Post[] = [
  {
    id: '1',
    title: '첫 번째 게시글입니다',
    content: '안녕하세요! 커뮤니티에 첫 게시글을 작성합니다.\n\n전자담배에 대한 다양한 정보를 공유하고 싶어요.',
    author: '홍길동',
    authorId: 'user1',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    viewCount: 128,
    likeCount: 15,
    commentCount: 3,
    category: mockCategories[0], // 자유게시판
    tags: ['인사', '첫글'],
    isPopular: false,
    isPinned: false,
  },
  {
    id: '2',
    title: '전자담배 추천 좀 해주세요!',
    content: '전자담배 입문자인데요, 어떤 제품을 구매해야 할지 고민입니다.\n\n멘솔맛을 좋아하고, 가격은 5만원 이하로 생각하고 있어요.\n\n추천 부탁드립니다!',
    author: '임꺽정',
    authorId: 'user2',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    viewCount: 267,
    likeCount: 42,
    commentCount: 18,
    category: mockCategories[2], // 질문답변
    tags: ['추천', '입문자', '멘솔'],
    isPopular: true,
    isPinned: false,
  },
  {
    id: '3',
    title: '멘솔 vs 과일향 비교 후기',
    content: '지난달부터 여러 맛을 시도해봤는데요.\n\n개인적으로 멘솔이 더 깔끔하고 좋은 것 같아요.\n\n과일향은 너무 달달해서 금방 질리네요.',
    author: '이순신',
    authorId: 'user3',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6시간 전
    viewCount: 89,
    likeCount: 8,
    commentCount: 5,
    category: mockCategories[1], // 제품리뷰
    tags: ['멘솔', '과일향', '비교'],
    isPopular: false,
    isPinned: false,
  },
  {
    id: '4',
    title: '[공지] 커뮤니티 이용 규칙 안내',
    content: '안녕하세요, 관리자입니다.\n\n커뮤니티를 이용하시면서 지켜주셔야 할 규칙들을 안내드립니다.\n\n1. 서로 존중하는 마음으로 소통해주세요\n2. 욕설이나 비방은 금지입니다\n3. 광고성 글은 삭제될 수 있습니다\n\n즐거운 커뮤니티가 되도록 함께 만들어가요!',
    author: '관리자',
    authorId: 'admin',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 전
    viewCount: 456,
    likeCount: 23,
    commentCount: 7,
    category: mockCategories[4], // 공지사항
    tags: ['공지', '규칙'],
    isPopular: false,
    isPinned: true,
  },
  {
    id: '5',
    title: '코일 교체 시기 알아보는 꿀팁',
    content: '코일 교체 시기를 놓치면 맛도 별로고 건강에도 좋지 않아요.\n\n제가 사용하는 방법들을 소개합니다:\n\n1. 맛이 탄맛이 날 때\n2. 연기량이 현저히 줄어들 때\n3. 색깔이 검게 변했을 때\n\n보통 1주일에서 10일 정도가 적당한 것 같아요.',
    author: '베테랑',
    authorId: 'user4',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12시간 전
    viewCount: 198,
    likeCount: 34,
    commentCount: 12,
    category: mockCategories[3], // 팁&노하우
    tags: ['코일', '교체시기', '팁'],
    isPopular: true,
    isPinned: false,
  },
];