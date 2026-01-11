import type { Database } from '@/types/supabase';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient<Database>(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.EXPO_PUBLIC_SUPABASE_API_KEY!);
