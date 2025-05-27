import { createClient } from '@supabase/supabase-js'


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        'Missing Supabase environment variables. Please check your .env file and make sure it contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
    )
}

export const supabase = createClient(supabaseUrl, supabaseKey) 