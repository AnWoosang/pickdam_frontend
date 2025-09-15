import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {const { id: memberId, productId } = await params

    console.log('🔍 찜 상태 확인 API 호출:', { memberId, productId })

    // 찜 상태 확인 - 단일 쿼리로 효율적으로 처리 (hard delete 방식)
    const { data: wishlistItem, error } = await supabaseServer
      .from('wishlist')
      .select('id, created_at')
      .eq('member_id', memberId)
      .eq('product_id', productId)
      .maybeSingle() // 0개 또는 1개 결과만 예상

    if (error) {
      console.error('❌ 찜 상태 확인 에러:', error)
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }

    const isWishlisted = !!wishlistItem
    console.log('✅ 찜 상태 확인 완료:', { memberId, productId, isWishlisted })

    return NextResponse.json(createSuccessResponse({ 
      isWishlisted,
      wishlistId: wishlistItem?.id || null,
      wishlistCreatedAt: wishlistItem?.created_at || null
    }))

  } catch (error) {
    console.error('❌ 찜 상태 확인 API 예외:', error)
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}