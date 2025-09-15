import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {const { id } = await params
    const { reason } = await request.json()
    
    console.log('🚀 회원탈퇴 시작 (Soft Delete):', { id, reason })
    
    const currentTime = new Date().toISOString()
    
    // 1. 탈퇴 사유 기록 (선택사항)
    if (reason) {
      try {
        await supabaseServer.from('withdrawal_log').insert({
          member_id: id,
          reason,
          withdrawn_at: currentTime
        })
        console.log('✅ 탈퇴 사유 기록 완료')
      } catch (logError) {
        console.warn('⚠️ 탈퇴 사유 기록 실패:', logError)
        // 로그 실패해도 탈퇴는 계속 진행
      }
    }
    
    // 2. 관련 데이터 정리 (Soft Delete 또는 익명화)
    console.log('📋 관련 데이터 정리 시작')
    
    try {
      // 찜목록 soft delete
      await supabaseServer.from('wishlist')
        .update({ deleted_at: currentTime })
        .eq('member_id', id)
      console.log('✅ 찜목록 soft delete 완료')
      
      // 리뷰 soft delete (또는 익명화)
      await supabaseServer.from('review')
        .update({ deleted_at: currentTime })
        .eq('member_id', id)
      console.log('✅ 리뷰 soft delete 완료')
      
      // 게시글/댓글 작성자 NULL로 변경 (데이터 보존, 익명화)
      await supabaseServer.from('post').update({ author_id: null }).eq('author_id', id)
      await supabaseServer.from('comment').update({ author_id: null }).eq('author_id', id)
      console.log('✅ 게시글/댓글 작성자 익명화 완료')
      
    } catch (cleanupError) {
      console.error('❌ 관련 데이터 정리 실패:', cleanupError)
      // 데이터 정리 실패해도 탈퇴는 계속 진행
    }
    
    // 3. Member 테이블 Soft Delete
    console.log('📋 Member Soft Delete 시작')
    
    const { error: memberSoftDeleteError } = await supabaseServer
      .from('member')
      .update({
        deleted_at: currentTime,
        deleted_reason: reason || null,
        // 개인정보 마스킹 (GDPR 준수)
        email: `deleted_${id.substring(0, 8)}@withdrawn.user`,
        name: '탈퇴한 사용자',
        nickname: '탈퇴한사용자',
        profile_image_url: null,
        birth_date: '1900-01-01', // 기본값으로 마스킹
      })
      .eq('id', id)
    
    if (memberSoftDeleteError) {
      console.error('❌ Member soft delete 실패:', memberSoftDeleteError)
      const mappedError = mapApiError(memberSoftDeleteError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    console.log('✅ Member soft delete 완료')
    
    // 4. Auth 사용자 Soft Delete (직접 처리)
    try {
      console.log('📋 Auth 사용자 Soft Delete 시작')
      
      const { error: authUpdateError } = await supabaseServer.auth.admin.updateUserById(id, {
        app_metadata: { deleted_at: currentTime }
      })
      
      if (authUpdateError) {
        throw new Error(`Auth soft delete 실패: ${authUpdateError.message}`)
      }
      
      console.log('✅ Auth 사용자 soft delete 완료')
      
    } catch (authDeleteError) {
      console.error('❌ Auth 사용자 soft delete 실패:', authDeleteError)
      // Auth soft delete 실패해도 Member는 이미 처리되었으므로 경고만 로그
      console.warn('⚠️ Auth 사용자 soft delete가 실패했습니다. 관리자가 확인 필요')
    }
    
    console.log('🎉 회원탈퇴 완료 (Soft Delete):', id)
    
    return NextResponse.json(createSuccessResponse({ message: '회원탈퇴가 완료되었습니다.' }), { status: 204 })
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}