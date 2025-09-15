import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * 서버에서 인증된 요청을 처리하기 위한 Supabase 클라이언트
 * 쿠키를 통해 사용자 세션을 읽을 수 있음
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        }
      }
    }
  )
}