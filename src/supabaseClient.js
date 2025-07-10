// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hyhgcqwmktnyrvxbspqc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5aGdjcXdta3RueXJ2eGJzcHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTM0MTYsImV4cCI6MjA2NjgyOTQxNn0.ztCqXcVvT_BGLAKd42K2QSVQtY2ttNy1J9D9JdmSArA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
