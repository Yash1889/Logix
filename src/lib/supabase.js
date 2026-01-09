import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fdclqgrtrwbbmfjzlbzk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkY2xxZ3J0cndiYm1manpsYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NDk3NTYsImV4cCI6MjA4MzUyNTc1Nn0.1WDDWcjSgJwPbYoJZsWxo-6dhcqnH4j6Pz9X9GOe0Vk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

