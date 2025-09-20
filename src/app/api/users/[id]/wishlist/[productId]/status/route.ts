import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {const { id: memberId, productId } = await params


    // 찜 상태 확인 - 단일 쿼리로 효율적으로 처리 (hard delete 방식)
    const { data: wishlistItem, error } = await supabaseServer
      .from('wishlist')
      .select('id, created_at')
      .eq('member_id', memberId)
      .eq('product_id', productId)
      .maybeSingle() // 0개 또는 1개 결과만 예상

    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    const isWishlisted = !!wishlistItem

    return NextResponse.json(createSuccessResponse({ 
      isWishlisted,
      wishlistId: wishlistItem?.id || null,
      wishlistCreatedAt: wishlistItem?.created_at || null
    }))

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}