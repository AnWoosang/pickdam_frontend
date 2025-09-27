import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 브라우저용 클라이언트 (클라이언트 컴포넌트에서 사용)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase