import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'
import { PostResponseDto } from '@/domains/community/types/dto/communityDto'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const currentUserId = searchParams.get('currentUserId')

    const { data: rawPost, error } = await supabaseServer
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

    // 현재 사용자의 좋아요 상태 확인
    const isLiked = currentUserId ?
      rawPost.likes?.some((like: any) => like.member_id === currentUserId) || false :
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
    const { id } = await params
    const { title, content, categoryId, authorId } = await request.json()
    const { searchParams } = new URL(request.url)
    const currentUserId = searchParams.get('currentUserId')


    const updateData: {
      title: string;
      content: string;
      updated_at: string;
      category?: string;
    } = {
      title,
      content,
      updated_at: new Date().toISOString()
    }

    // categoryId가 제공되고 유효한 경우에만 업데이트
    if (categoryId && categoryId.trim() !== '') {
      updateData.category = categoryId;
    }

    const { data: rawPost, error } = await supabaseServer
      .from('post')
      .update(updateData)
      .eq('id', id)
      .eq('author_id', authorId)
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

    // 현재 사용자의 좋아요 상태 확인
    const isLiked = currentUserId ?
      rawPost.likes?.some((like: any) => like.member_id === currentUserId) || false :
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
    const { id } = await params
    const { authorId } = await request.json()
    
    
    // Soft delete + db trigger (관련 댓글 모두 soft delete , post_image hard delete, post_like, comment_like hard delete)
    const { error } = await supabaseServer
      .from('post')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('author_id', authorId)
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