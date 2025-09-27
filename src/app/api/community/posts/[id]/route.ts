import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { PostResponseDto, UpdatePostRequestDto } from '@/domains/community/types/dto/communityDto'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id } = await params

    const { data: rawPost, error } = await supabase
      .from('post')
      .select(`
        *,
        author:member!author_id (
          nickname,
          profile_image_url
        ),
        likes:post_like(
          member_id
        )
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // 현재 사용자의 좋아요 상태 확인 (토큰에서 사용자 ID 가져오기)
    const { data: { user } } = await supabase.auth.getUser()
    const isLiked = user ?
      rawPost.likes?.some((like: { member_id: string }) => like.member_id === user.id) || false :
      false;

    // PostResponseDto 형태로 변환
    const post: PostResponseDto = {
      id: rawPost.id,
      title: rawPost.title,
      content: rawPost.content,
      authorId: rawPost.author_id,
      category: rawPost.category,
      viewCount: rawPost.view_count,
      likeCount: rawPost.like_count,
      commentCount: rawPost.comment_count,
      createdAt: rawPost.created_at,
      updatedAt: rawPost.updated_at,
      isLiked: isLiked,
      author: {
        nickname: rawPost.author.nickname,
        profileImageUrl: rawPost.author.profile_image_url
      }
    }

    return NextResponse.json(createSuccessResponse({ post }))

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id } = await params
    const requestData: UpdatePostRequestDto = await request.json()

    const updateData: {
      title: string;
      content: string;
      updated_at: string;
      category?: string;
    } = {
      title: requestData.title,
      content: requestData.content,
      updated_at: new Date().toISOString()
    }

    // categoryId가 제공되고 유효한 경우에만 업데이트
    if (requestData.categoryId && requestData.categoryId.trim() !== '') {
      updateData.category = requestData.categoryId;
    }

    const { data: rawPost, error } = await supabase
      .from('post')
      .update(updateData)
      .eq('id', id)
      .is('deleted_at', null)
      .select(`
        *,
        author:member!author_id (
          nickname,
          profile_image_url
        ),
        likes:post_like(
          member_id
        )
      `)
      .single()
    

    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // 현재 사용자의 좋아요 상태 확인 (토큰에서 사용자 ID 가져오기)
    const { data: { user } } = await supabase.auth.getUser()
    const isLiked = user ?
      rawPost.likes?.some((like: { member_id: string }) => like.member_id === user.id) || false :
      false;

    // PostResponseDto 형태로 변환
    const post: PostResponseDto = {
      id: rawPost.id,
      title: rawPost.title,
      content: rawPost.content,
      authorId: rawPost.author_id,
      category: rawPost.category,
      viewCount: rawPost.view_count,
      likeCount: rawPost.like_count,
      commentCount: rawPost.comment_count,
      createdAt: rawPost.created_at,
      updatedAt: rawPost.updated_at,
      isLiked: isLiked,
      author: {
        nickname: rawPost.author.nickname,
        profileImageUrl: rawPost.author.profile_image_url
      }
    }

    return NextResponse.json(createSuccessResponse({ post }))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id } = await params

    // RLS가 작성자 권한을 자동으로 확인
    const { error } = await supabase
      .from('post')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null)
    
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