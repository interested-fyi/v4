import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ehivnmchdkesbcgoipum.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;