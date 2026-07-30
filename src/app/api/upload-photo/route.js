import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is not configured.' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const formData = await req.formData();
  const file = formData.get('file');
  const fileName = formData.get('fileName');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
  }

  const fileExt = file.name.split('.').pop();
  const safeName = fileName ? String(fileName) : `${Date.now()}`;
  const uploadName = `${safeName}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('passport-photos')
    .upload(uploadName, file, { upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData, error: urlError } = supabase.storage
    .from('passport-photos')
    .getPublicUrl(uploadName);

  if (urlError) {
    return NextResponse.json({ error: urlError.message }, { status: 500 });
  }

  return NextResponse.json({ publicUrl: publicUrlData.publicUrl });
}
