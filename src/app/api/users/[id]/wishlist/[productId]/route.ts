import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {const { id, productId } = await params
    
    if (!productId) {
      const mappedError = mapApiError({ message: 'Product ID is required', status: StatusCodes.BAD_REQUEST })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // 새로운 RPC 함수로 위시리스트 토글
    const { data, error } = await supabaseServer.rpc('toggle_product_wishlist', {
      p_product_id: productId,
      p_member_id: id
    })
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    return NextResponse.json(createSuccessResponse({ 
      success: data.success,
      isWishlisted: data.wishlisted,
      newWishlistCount: data.wishlist_count
    }), { status: 201 })
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {
    const { id, productId } = await params
    
    if (!productId) {
      const mappedError = mapApiError({ message: 'Product ID is required', status: StatusCodes.BAD_REQUEST })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // 새로운 RPC 함수로 위시리스트 토글 (DELETE도 같은 함수 사용)
    const { data, error } = await supabaseServer.rpc('toggle_product_wishlist', {
      p_product_id: productId,
      p_member_id: id
    })
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    return new NextResponse(null, { status: 204 })
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}