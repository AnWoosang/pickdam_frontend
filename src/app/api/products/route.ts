import { NextRequest, NextResponse } from 'next/server'
import { ProductResponseDto } from '@/domains/product/types/dto/productResponseDto'
import {
  createPaginatedResponse,
  createErrorResponse,
  mapApiError,
  getStatusFromErrorCode
} from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 쿼리 파라미터 파싱
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const categories = searchParams.get('categories') // 다중 카테고리 지원
    const inhaleType = searchParams.get('inhaleType') // 호흡방식 필터
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'total_views'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    // 기본 쿼리 구성 (count 옵션 추가)
    let query = supabaseServer
      .from('product')
      .select('*', { count: 'exact' })
      .eq('is_available', true)
    
    // 카테고리 필터 (한국어 -> 영어 매핑)
    const categoryMap: Record<string, string> = {
      '액상': 'LIQUID',
      '기기': 'DEVICE',
      '코일/팟/기타': 'ACCESSORIES'
    }
    
    // 다중 카테고리 또는 단일 카테고리 처리
    if (categories) {
      // 다중 카테고리: "액상,기기" 형태로 전달
      const categoryList = categories.split(',').filter(c => c && c !== 'all')
      if (categoryList.length > 0) {
        const dbCategories = categoryList.map(c => categoryMap[c.trim()] || c.trim())
        query = query.in('product_category', dbCategories)
      }
    } else if (category && category !== 'all') {
      // 단일 카테고리 (기존 호환성 유지)
      const dbCategory = categoryMap[category] || category
      query = query.eq('product_category', dbCategory)
    }
    
    // 호흡방식 필터 (프론트엔드 -> 데이터베이스 매핑)
    if (inhaleType) {
      const inhaleTypeMap: Record<string, string> = {
        'MTL': 'MTL',  // 입호흡 -> MTL
        'DL': 'DTL'    // 폐호흡 -> DTL
      }
      const dbInhaleType = inhaleTypeMap[inhaleType] || inhaleType
      query = query.eq('inhale_type', dbInhaleType)
    }
    
    // 검색 필터
    if (search) {
      query = query.or(`name.ilike.*${search}*,flavor.ilike.*${search}*,brand.ilike.*${search}*`)
    }
    
    // 정렬
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    
    // 페이지네이션
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    
    const { data: products, error, count } = await query
    
    if (error) {
      console.error('Products fetch error:', error)
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // 데이터베이스 결과를 ProductDto 형태로 변환
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productDtos: ProductResponseDto[] = (products || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      thumbnailImageUrl: item.thumbnail_image_url,
      productCategory: item.product_category,
      inhaleType: item.inhale_type,
      flavor: item.flavor,
      capacity: item.capacity,
      brand: item.brand,
      totalViews: item.total_views,
      totalFavorites: item.total_favorites,
      weeklyViews: item.weekly_views,
      isAvailable: item.is_available
    } as ProductResponseDto))
    
    // 페이지네이션 응답 생성
    const totalPages = Math.ceil((count || 0) / limit);
    return NextResponse.json(createPaginatedResponse(productDtos, {
      total: count || 0,
      page: page,
      limit: limit,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}