import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { WishlistItemResponseDto } from '@/domains/user/types/dto/userDto'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id: memberId, productId } = await params

    // 찜 상태 확인 - 단일 쿼리로 효율적으로 처리 (hard delete 방식)
    const { data: wishlistItem, error } = await supabase
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

    // WishlistItemResponseDto 형태로 변환
    const responseDto: WishlistItemResponseDto = {
      id: wishlistItem?.id || '',
      memberId: memberId,
      productId: productId,
      createdAt: wishlistItem?.created_at || '',
      updatedAt: wishlistItem?.created_at || '' // 업데이트가 없으므로 created_at 사용
    }

    return NextResponse.json(createSuccessResponse({
      isWishlisted,
      wishlistItem: isWishlisted ? responseDto : null
    }))

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}