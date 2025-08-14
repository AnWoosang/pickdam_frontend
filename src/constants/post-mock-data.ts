import { Post, Comment } from '@/types/community';
import { POST_CATEGORIES } from './postCategories';

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
    category: POST_CATEGORIES[1], // 자유게시판
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
    category: POST_CATEGORIES[3], // 질문답변
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
    category: POST_CATEGORIES[2], // 제품리뷰
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
    category: POST_CATEGORIES[0], // 공지사항
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
    category: POST_CATEGORIES[1], // 자유게시판
  },
  // 추가 게시글들
  {
    id: '6',
    title: 'IQOS vs 릴 vs 글로 비교 후기',
    content: '3대 브랜드를 모두 사용해본 후기입니다.\n\n각각의 장단점을 정리해보겠습니다.\n\n1. IQOS: 맛이 깔끔하고 냄새가 적음\n2. 릴: 연기량이 많고 멘솔이 시원함\n3. 글로: 가격이 저렴하고 스틱 종류가 다양함\n\n개인적으로는 IQOS가 가장 만족스러웠어요.',
    author: '3사비교맨',
    authorId: 'user21',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    viewCount: 342,
    likeCount: 28,
    commentCount: 14,
    category: POST_CATEGORIES[2],
  },
  {
    id: '7',
    title: '금연 성공담 - 전자담배로 끊는 방법',
    content: '담배를 20년간 피우다가 전자담배로 금연에 성공했습니다.\n\n처음에는 반신반의했는데 정말 효과가 있더라구요.\n\n단계적으로 니코틴 함량을 줄여가면서 6개월만에 완전 금연했어요.\n\n같은 고민을 하시는 분들께 도움이 되길 바랍니다.',
    author: '금연성공자',
    authorId: 'user22',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    viewCount: 567,
    likeCount: 89,
    commentCount: 42,
    category: POST_CATEGORIES[1],
  },
  {
    id: '8',
    title: '액상 보관 방법과 유통기한',
    content: '액상을 제대로 보관하지 않으면 맛이 변하거나 상할 수 있어요.\n\n올바른 보관 방법:\n1. 직사광선 피해서 서늘한 곳에 보관\n2. 뚜껑을 꽉 닫아서 공기 접촉 차단\n3. 냉장고 보관은 권하지 않음\n\n보통 개봉 후 6개월 이내에 사용하는 것이 좋습니다.',
    author: '액상전문가',
    authorId: 'user23',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 156,
    likeCount: 23,
    commentCount: 8,
    category: POST_CATEGORIES[1],
  },
  {
    id: '9',
    title: '입문자를 위한 전자담배 용어 정리',
    content: '전자담배를 시작하면서 모르는 용어가 많아서 정리해봤어요.\n\n- 코일: 액상을 가열하는 부품\n- 아토마이저: 연기를 만드는 장치\n- 배터리: 전력을 공급하는 부품\n- 옴: 저항값 (낮을수록 연기량 많음)\n- PG/VG: 액상의 주요 성분\n\n초보자분들께 도움이 되었으면 좋겠어요!',
    author: '용어박사',
    authorId: 'user24',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 234,
    likeCount: 31,
    commentCount: 12,
    category: POST_CATEGORIES[1],
  },
  {
    id: '10',
    title: '여행갈 때 전자담배 휴대 주의사항',
    content: '해외여행 갈 때 전자담배 가져가시는 분들 주의하세요!\n\n항공기 탑승 시 주의사항:\n1. 배터리는 반드시 기내 휴대\n2. 액상은 100ml 이하로 제한\n3. 기내에서 사용 절대 금지\n4. 일부 국가는 반입 금지\n\n미리 확인하고 준비하세요.',
    author: '여행러',
    authorId: 'user25',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 189,
    likeCount: 15,
    commentCount: 6,
    category: POST_CATEGORIES[1],
  },
  {
    id: '11',
    title: 'DIY 액상 만들기 체험기',
    content: '직접 액상을 만들어봤습니다!\n\n재료: PG, VG, 니코틴, 향료\n비율: PG 30% + VG 70% + 니코틴 3mg + 향료 10%\n\n생각보다 어렵지 않았고 비용도 절약되네요.\n하지만 정확한 계량이 중요해요.',
    author: 'DIY마스터',
    authorId: 'user26',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 298,
    likeCount: 45,
    commentCount: 21,
    category: POST_CATEGORIES[2],
  },
  {
    id: '12',
    title: '전자담배 청소 및 관리 방법',
    content: '전자담배를 오래 사용하려면 정기적인 청소가 필수예요.\n\n청소 방법:\n1. 분해 후 부품별로 청소\n2. 알코올로 닦아내기\n3. 완전히 말린 후 조립\n\n월 1회 정도 청소하면 오래 사용할 수 있어요.',
    author: '청소왕',
    authorId: 'user27',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 167,
    likeCount: 19,
    commentCount: 9,
    category: POST_CATEGORIES[1],
  },
  {
    id: '13',
    title: '멘솔 액상 추천 Best 10',
    content: '멘솔 애호가가 추천하는 베스트 액상들입니다.\n\n1. 아이스 민트\n2. 페퍼민트 쿨링\n3. 유칼립투스\n4. 스피어민트\n5. 더블 멘솔\n...\n\n각각의 특징과 맛을 자세히 리뷰했어요.',
    author: '멘솔킹',
    authorId: 'user28',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 445,
    likeCount: 67,
    commentCount: 28,
    category: POST_CATEGORIES[2],
  },
  {
    id: '14',
    title: '전자담배와 일반담배 비교 분석',
    content: '건강적인 측면에서 두 제품을 비교해봤습니다.\n\n전자담배의 장점:\n- 타르가 없음\n- 냄새가 적음\n- 주변인 피해 적음\n\n단점:\n- 니코틴 중독 여전함\n- 장기 영향 불분명\n\n개인의 선택이 중요할 것 같아요.',
    author: '분석가',
    authorId: 'user29',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 623,
    likeCount: 45,
    commentCount: 67,
    category: POST_CATEGORIES[1],
  },
  {
    id: '15',
    title: '배터리 관리와 안전 수칙',
    content: '전자담배 배터리는 올바르게 관리해야 안전해요.\n\n주의사항:\n1. 과충전 금지\n2. 고온 노출 피하기\n3. 손상된 배터리 즉시 교체\n4. 정품 충전기 사용\n\n안전이 가장 중요합니다!',
    author: '안전지킴이',
    authorId: 'user30',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 234,
    likeCount: 28,
    commentCount: 11,
    category: POST_CATEGORIES[1],
  },
  {
    id: '16',
    title: '과일맛 액상 순위 매겨보기',
    content: '과일맛 액상을 좋아하는 분들을 위한 순위입니다!\n\n1위: 수박 - 시원하고 달콤\n2위: 딸기 - 향이 진하고 맛있음\n3위: 망고 - 트로피컬한 느낌\n4위: 포도 - 새콤달콤\n5위: 사과 - 깔끔한 맛\n\n개인적인 취향이니 참고만 하세요!',
    author: '과일러버',
    authorId: 'user31',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 356,
    likeCount: 42,
    commentCount: 19,
    category: POST_CATEGORIES[2],
  },
  {
    id: '17',
    title: '전자담배 관련 법규 정리',
    content: '전자담배 관련 법규가 계속 바뀌고 있어서 정리해봤어요.\n\n현재 규정:\n- 19세 미만 판매금지\n- 광고 제한\n- 금연구역에서 사용금지\n- 니코틴 함량 표기 의무\n\n법규를 잘 지켜야겠어요.',
    author: '법규지킴이',
    authorId: 'user32',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 198,
    likeCount: 15,
    commentCount: 7,
    category: POST_CATEGORIES[1],
  },
  {
    id: '18',
    title: '겨울철 전자담배 사용 팁',
    content: '추운 겨울에 전자담배 사용할 때 주의할 점들입니다.\n\n겨울철 팁:\n1. 배터리 성능 저하 주의\n2. 액상이 걸쭉해질 수 있음\n3. 결로 현상 방지\n4. 실내외 온도차 고려\n\n미리 준비하면 겨울에도 문제없어요!',
    author: '겨울전문가',
    authorId: 'user33',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 123,
    likeCount: 18,
    commentCount: 5,
    category: POST_CATEGORIES[1],
  },
  {
    id: '19',
    title: '담배맛 액상 리뷰 모음',
    content: '일반담배에서 전자담배로 넘어오시는 분들을 위한 리뷰입니다.\n\n담배맛 액상들:\n1. 클래식 토바코\n2. 버지니아 블렌드\n3. 터키시 토바코\n4. 아메리칸 블렌드\n\n각각의 특징을 자세히 설명드릴게요.',
    author: '토바코마니아',
    authorId: 'user34',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 267,
    likeCount: 31,
    commentCount: 14,
    category: POST_CATEGORIES[2],
  },
  {
    id: '20',
    title: '온라인 vs 오프라인 구매 비교',
    content: '전자담배 제품을 어디서 사는 게 좋을까요?\n\n온라인 장점:\n- 가격이 저렴\n- 종류가 다양\n- 리뷰 확인 가능\n\n오프라인 장점:\n- 직접 확인 가능\n- 즉시 구매\n- AS 편리\n\n상황에 맞게 선택하시면 될 것 같아요.',
    author: '쇼핑고수',
    authorId: 'user35',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 189,
    likeCount: 22,
    commentCount: 9,
    category: POST_CATEGORIES[1],
  },
];

// 댓글 목 데이터
export const mockComments: Comment[] = [
  {
    id: 'comment1',
    postId: '1',
    content: '좋은 글 감사합니다! 저도 전자담배에 관심이 많아서 유용한 정보네요.',
    author: '김철수',
    authorId: 'user5',
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20시간 전
    likeCount: 3,
  },
  {
    id: 'comment2',
    postId: '1',
    content: '앞으로도 좋은 정보 많이 공유해주세요!',
    author: '박영희',
    authorId: 'user6',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18시간 전
    likeCount: 1,
  },
  {
    id: 'comment3',
    postId: '1',
    content: '저도 입문자라서 이런 글이 정말 도움이 됩니다 ㅎㅎ',
    author: '이민수',
    authorId: 'user7',
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(), // 15시간 전
    likeCount: 2,
  },
  {
    id: 'comment4',
    postId: '2',
    content: '저는 IQOS 추천드려요! 멘솔맛도 좋고 가격도 적당합니다.',
    author: '전문가123',
    authorId: 'user8',
    createdAt: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(), // 46시간 전
    likeCount: 12,
  },
  {
    id: 'comment5',
    postId: '2',
    content: '릴 시리즈도 괜찮아요. 특히 릴 하이브리드는 멘솔이 진짜 시원해요.',
    author: '베이퍼',
    authorId: 'user9',
    createdAt: new Date(Date.now() - 44 * 60 * 60 * 1000).toISOString(), // 44시간 전
    likeCount: 8,
  },
  {
    id: 'comment6',
    postId: '2',
    content: '글로 시리즈는 어떠신가요? 친구가 추천해줬는데...',
    author: '궁금이',
    authorId: 'user10',
    createdAt: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString(), // 42시간 전
    likeCount: 2,
  },
  {
    id: 'comment7',
    postId: '2',
    content: '@궁금이 글로도 괜찮은데 멘솔은 아이코스가 더 시원한 것 같아요',
    author: '전문가123',
    authorId: 'user8',
    createdAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(), // 40시간 전
    likeCount: 5,
    parentCommentId: 'comment6',
  },
  {
    id: 'comment8',
    postId: '3',
    content: '저도 멘솔파인데 과일향은 정말 금방 질리더라구요. 공감합니다!',
    author: '멘솔러버',
    authorId: 'user11',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
    likeCount: 4,
  },
  {
    id: 'comment9',
    postId: '3',
    content: '과일향도 브랜드마다 다른데, 혹시 어떤 브랜드로 시도해보셨나요?',
    author: '과일맛탐험가',
    authorId: 'user12',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4시간 전
    likeCount: 1,
  },
  {
    id: 'comment10',
    postId: '3',
    content: '릴과 아이코스 둘 다 써봤는데 멘솔은 아이코스가 확실히 나은 것 같아요.',
    author: '비교맨',
    authorId: 'user13',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3시간 전
    likeCount: 6,
  },
  {
    id: 'comment11',
    postId: '4',
    content: '규칙 안내 감사합니다. 모두가 즐거운 커뮤니티가 되었으면 좋겠어요!',
    author: '선량한시민',
    authorId: 'user14',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6일 전
    likeCount: 15,
  },
  {
    id: 'comment12',
    postId: '4',
    content: '좋은 취지입니다. 다들 매너있게 소통해요~',
    author: '매너왕',
    authorId: 'user15',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6일 전
    likeCount: 8,
  },
  {
    id: 'comment13',
    postId: '5',
    content: '정말 유용한 팁이네요! 저는 맛으로만 판단했는데 색깔도 체크해봐야겠어요.',
    author: '초보자',
    authorId: 'user16',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10시간 전
    likeCount: 7,
  },
  {
    id: 'comment14',
    postId: '5',
    content: '코일 교체 주기가 생각보다 짧네요. 경제적으로 부담이 될 것 같은데 어떠신가요?',
    author: '절약러',
    authorId: 'user17',
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), // 9시간 전
    likeCount: 3,
  },
  {
    id: 'comment15',
    postId: '5',
    content: '@절약러 코일 가격이 부담스럽긴 하지만 건강 생각하면 꼭 교체해야죠!',
    author: '베테랑',
    authorId: 'user4',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8시간 전
    likeCount: 12,
    parentCommentId: 'comment14',
  },
  {
    id: 'comment16',
    postId: '5',
    content: '코일 관리 방법도 궁금해요. 세척이나 다른 관리법이 있을까요?',
    author: '관리맨',
    authorId: 'user18',
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7시간 전
    likeCount: 5,
  },
  {
    id: 'comment17',
    postId: '5',
    content: '이런 꿀팁 정말 감사해요. 다음에는 액상 관리 팁도 부탁드려요!',
    author: '팁수집가',
    authorId: 'user19',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6시간 전
    likeCount: 9,
  },
  {
    id: 'comment18',
    postId: '5',
    content: '1주일에서 10일이면 생각보다 자주 교체해야 하는군요. 참고하겠습니다!',
    author: '메모장',
    authorId: 'user20',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
    likeCount: 4,
  },
];

// 유틸리티 함수들
export const getPostById = (id: string): Post | undefined => {
  return mockPosts.find(post => post.id === id);
};

export const getCommentsByPostId = (postId: string): Comment[] => {
  return mockComments.filter(comment => comment.postId === postId);
};

