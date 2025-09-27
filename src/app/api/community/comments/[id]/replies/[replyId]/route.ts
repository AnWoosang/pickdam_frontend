import { NextRequest, NextResponse } from 'next/server'
import { createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; replyId: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { replyId } = await params

    // 답글 삭제용 RPC 함수 호출 (답글 1개만 삭제, 게시글 댓글 수 1 감소)
    const { error: rpcError } = await supabase
      .rpc('delete_reply_and_update_count', {
        p_reply_id: replyId
      })

    if (rpcError) {
      const mappedError = mapApiError(rpcError)
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