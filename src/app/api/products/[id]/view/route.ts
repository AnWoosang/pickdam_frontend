import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { IncrementViewResponseDto } from '@/domains/product/types/dto/productDto'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id } = await params

    // 간소화된 RPC 함수 사용하여 조회수 증가
    const { data, error } = await supabase.rpc('increment_product_view_simple', {
      p_product_id: id
    })
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    // IncrementViewResponseDto 형태로 변환
    const responseDto: IncrementViewResponseDto = {
      success: data.success,
      incremented: true,
      newViewCount: data.view_count
    }

    return NextResponse.json(createSuccessResponse(responseDto))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}