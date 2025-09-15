import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'
import {
  createPaginatedResponse,
  createSuccessResponse,
  createErrorResponse,
  mapApiError,
  getStatusFromErrorCode
} from '@/infrastructure/api/supabaseResponseUtils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    
    // 페이지네이션 파라미터
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = (page - 1) * limit
    
    console.log('🔍 찜 목록 페이지네이션 조회 API 호출:', { 
      memberId: id, page, limit, offset 
    })
    
    // 총 개수 조회 (hard delete 방식)
    const { count: totalCount, error: countError } = await supabaseServer
      .from('wishlist')
      .select('*', { count: 'exact', head: true })
      .eq('member_id', id)
    
    if (countError) {
      console.error('❌ 찜 목록 총 개수 조회 에러:', countError)
      const mappedError = mapApiError(countError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // 페이지네이션된 찜 목록 조회 (hard delete 방식)
    const { data: wishlistItems, error } = await supabaseServer
      .from('wishlist')
      .select(`
        id,
        created_at,
        product:product_id (
          id, name, price, thumbnail_image_url, product_category, 
          inhale_type, flavor, capacity, brand, total_views, 
          total_favorites, is_available
        )
      `)
      .eq('member_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('❌ 찜 목록 조회 에러:', error)
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    const products = wishlistItems?.map(item => ({
      ...item.product,
      wishlistId: item.id,
      wishlistCreatedAt: item.created_at
    })) || []
    
    console.log('✅ 찜 목록 페이지네이션 조회 완료:', { 
      products: products.length, 
      totalCount, 
      page, 
      totalPages: Math.ceil((totalCount || 0) / limit)
    })
    
    // 페이지네이션 정보와 함께 반환
    const totalPages = Math.ceil((totalCount || 0) / limit);
    return NextResponse.json(createPaginatedResponse(products, {
      total: totalCount || 0,
      page: page,
      limit: limit,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }))
    
  } catch (error) {
    console.error('❌ 찜 목록 조회 API 예외:', error)
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { productIds } = body
    
    if (!productIds || !Array.isArray(productIds)) {
      const mappedError = mapApiError({ message: 'Product IDs array is required', status: 400 })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    if (productIds.length === 0) {
      const mappedError = mapApiError({ message: 'At least one product ID is required', status: 400 })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    console.log('🗑️ 찜 목록 벌크 삭제 API 호출:', { memberId: id, productIds })
    
    // IN 절을 사용한 벌크 삭제
    const { error } = await supabaseServer
      .from('wishlist')
      .delete()
      .eq('member_id', id)
      .in('product_id', productIds)
    
    if (error) {
      console.error('❌ 찜 목록 벌크 삭제 에러:', error)
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    console.log('✅ 찜 목록 벌크 삭제 완료:', { deletedCount: productIds.length })
    
    return NextResponse.json(createSuccessResponse({
      message: 'Products removed from wishlist successfully',
      deletedCount: productIds.length
    }), { status: 204 })
    
  } catch (error) {
    console.error('❌ 찜 목록 벌크 삭제 API 예외:', error)
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}

