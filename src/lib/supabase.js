import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.warn('Saknar VITE_SUPABASE_URL eller VITE_SUPABASE_ANON_KEY — kopiera .env.example till .env.local')
}

export const supabase = createClient(url ?? '', key ?? '')
