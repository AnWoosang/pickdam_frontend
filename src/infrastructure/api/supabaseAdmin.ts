import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용한 관리자 권한 클라이언트 (RLS 우회)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)