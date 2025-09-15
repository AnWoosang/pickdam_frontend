import { NextRequest, NextResponse } from 'next/server'
import { createPaginatedResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {const { id } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = (page - 1) * limit
    
    // 총 개수 조회
    const { count, error: countError } = await supabaseServer
      .from('review')
      .select('*', { count: 'exact', head: true })
      .eq('member_id', id)
      .is('deleted_at', null)
    
    if (countError) {
      throw countError
    }
    
    // 리뷰 목록 조회
    const { data, error } = await supabaseServer
      .from('review')
      .select(`
        *,
        product:product_id (
          id,
          name,
          thumbnail_image_url,
          brand
        )
      `)
      .eq('member_id', id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('User reviews fetch error:', error)
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    const totalPages = Math.ceil((count || 0) / limit)
    
    console.log('🔍 User reviews query result:', {
      userId: id,
      page,
      limit,
      reviewCount: data?.length || 0,
      totalCount: count || 0,
      totalPages,
      reviews: data
    })
    
    return NextResponse.json(createPaginatedResponse(data || [], {
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