import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSuccessResponse } from '@/infrastructure/api/supabaseResponseUtils'

export async function POST(_request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    // 모든 쿠키 확인
    const allCookies = cookieStore.getAll()
    const authCookies = allCookies.filter(cookie => 
      cookie.name.startsWith('sb-') &&              // sb- 로 시작하는 모든 쿠키
      cookie.name.includes('auth-token')            // auth-token이 포함된 쿠키
    )
    
    const response = NextResponse.json(createSuccessResponse({ message: '로그아웃 완료' }))
    
    authCookies.forEach(cookie => {
      response.cookies.set(cookie.name, '', { 
        expires: new Date(0),
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    })
    
    return response
    
  } catch (_error) {
    // 에러 발생 시에도 기본 패턴으로 쿠키 정리 시도
    const response = NextResponse.json(createSuccessResponse({ message: '로그아웃 완료' }))
    
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    allCookies.forEach(cookie => {
      if (cookie.name.startsWith('sb-') && cookie.name.includes('auth')) {
        response.cookies.set(cookie.name, '', { 
          expires: new Date(0),
          path: '/',
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })
      }
    })
    
    return response
  }
}