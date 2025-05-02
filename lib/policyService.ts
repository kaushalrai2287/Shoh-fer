import { createClient } from "../utils/supabase/client";
const supabase = createClient();

// Save or update the policy content based on title
export async function savePolicyToSupabase(content: any, title: string) {
  const { data, error } = await supabase
    .from('policies')
    .upsert(
      [{ title, content: JSON.stringify(content) }],
      { onConflict: 'title' } // Ensures "title" is unique and updates existing
    );

  if (error) {
    console.error('Error saving policy:', error.message);
  } else {
    console.log('Policy saved/updated:', data);
  }
}

// Retrieve policy content by title
export async function getPolicyFromSupabase(title: string) {
  const { data, error } = await supabase
    .from('policies')
    .select('content')
    .eq('title', title)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }

  return data?.content ?? '';
}
