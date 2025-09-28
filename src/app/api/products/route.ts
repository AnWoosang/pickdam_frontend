import { NextRequest, NextResponse } from 'next/server'
import { ProductResponseDto } from '@/domains/product/types/dto/productDto'
import {
  createPaginatedResponse,
  createErrorResponse,
  mapApiError
} from '@/infrastructure/api/supabaseResponseUtils'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { searchParams } = new URL(request.url)

    // 쿼리 파라미터 파싱
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const categories = searchParams.get('categories') // 다중 카테고리 지원
    const inhaleType = searchParams.get('inhaleType') // 호흡방식 필터
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'totalViews'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // camelCase -> snake_case 변환
    const SORT_FIELD_MAP: Record<string, string> = {
      totalViews: 'total_views',
      totalFavorites: 'total_favorites',
      weeklyViews: 'weekly_views',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      price: 'price',
      name: 'name'
    } as const;

    const dbSortBy = SORT_FIELD_MAP[sortBy] || sortBy;

    // 기본 쿼리 구성 (count 옵션 추가)
    let query = supabase
      .from('product')
      .select('*', { count: 'exact' })
    
    // 카테고리 필터 (한국어 -> DB 저장값 매핑)
    const categoryMap: Record<string, string | string[]> = {
      '액상': 'LIQUID',
      '기기': 'DEVICE',
      '팟': 'POD',
      '코일': 'COIL',
      '악세서리': 'ACCESSORY',
      '코일/팟/기타': ['POD', 'COIL', 'ACCESSORY']
    }
    
    // 다중 카테고리 또는 단일 카테고리 처리
    if (categories) {
      // 다중 카테고리: "액상,기기" 형태로 전달
      const categoryList = categories.split(',').filter(c => c && c !== 'all')
      if (categoryList.length > 0) {
        const dbCategories = categoryList.flatMap(c => {
          const mapped = categoryMap[c.trim()] || c.trim()
          return Array.isArray(mapped) ? mapped : [mapped]
        })
        query = query.in('product_category', dbCategories)
      }
    } else if (category && category !== 'all') {
      // 단일 카테고리 (기존 호환성 유지)
      const mapped = categoryMap[category] || category
      if (Array.isArray(mapped)) {
        query = query.in('product_category', mapped)
      } else {
        query = query.eq('product_category', mapped)
      }
    }
    
    // 호흡방식 필터 (프론트엔드 -> 데이터베이스 매핑)
    if (inhaleType) {
      const inhaleTypeMap: Record<string, string> = {
        'MTL': 'MTL',  // 입호흡 -> MTL
        'DTL': 'DTL'   // 폐호흡 -> DTL
      }
      const dbInhaleType = inhaleTypeMap[inhaleType] || inhaleType
      query = query.eq('inhale_type', dbInhaleType)
    }
    
    // 검색 필터
    if (search) {
      query = query.or(`name.ilike.*${search}*,brand.ilike.*${search}*`)
    }
    
    // 정렬 (변환된 DB 필드명 사용)
    query = query.order(dbSortBy, { ascending: sortOrder === 'asc' })
    
    // 페이지네이션
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    
    const { data: products, error, count } = await query
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    const productDtos: ProductResponseDto[] = (products || []).map((item: Record<string, unknown>) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      thumbnailImageUrl: item.thumbnail_image_url,
      productCategory: item.product_category,
      inhaleType: item.inhale_type,
      capacity: item.capacity,
      brand: item.brand,
      totalViews: item.total_views,
      totalFavorites: item.total_favorites,
      weeklyViews: item.weekly_views,
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
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}