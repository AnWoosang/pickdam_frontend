import { NextRequest, NextResponse } from 'next/server';
import { mockPosts } from '@/constants/post-mock-data';
import { PostsResponse, PostSearchParams } from '@/types/community';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // 쿼리 파라미터 파싱
    const params: PostSearchParams = {
      category: searchParams.get('category') || 'all',
      sortBy: (searchParams.get('sortBy') as 'latest' | 'popular' | 'oldest' | 'most_liked' | 'most_viewed') || 'latest',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      query: searchParams.get('query') || undefined,
    };

    // 필터링
    let filteredPosts = [...mockPosts];

    // 카테고리 필터링
    if (params.category && params.category !== 'all') {
      filteredPosts = filteredPosts.filter(
        post => post.category?.id === params.category
      );
    }

    // 검색어 필터링
    if (params.query) {
      const searchTerm = params.query.toLowerCase();
      filteredPosts = filteredPosts.filter(
        post => 
          post.title.toLowerCase().includes(searchTerm) ||
          post.content?.toLowerCase().includes(searchTerm) ||
          post.author.toLowerCase().includes(searchTerm) ||
          post.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // 정렬
    filteredPosts.sort((a, b) => {
      switch (params.sortBy) {
        case 'popular':
          return (b.likeCount || 0) - (a.likeCount || 0);
        case 'most_viewed':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'most_liked':
          return (b.likeCount || 0) - (a.likeCount || 0);
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'latest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    // 페이지네이션
    const total = filteredPosts.length;
    const totalPages = Math.ceil(total / (params.limit || 20));
    const page = params.page || 1;
    const limit = params.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    // 응답 데이터 구성
    const response: PostsResponse = {
      posts: paginatedPosts,
      total,
      page,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    // 응답에 지연 시간 추가 (실제 API 느낌)
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}