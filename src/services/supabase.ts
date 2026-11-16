import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const FOTO_MAX_BYTES = 2 * 1024 * 1024;
export const FOTO_TIPOS = ['image/jpeg', 'image/png', 'image/webp'];

export async function uploadFotoPerfil(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const caminho = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from('fotos-perfil')
    .upload(caminho, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error('Erro no upload da foto:', error);
    throw new Error(
      `Não foi possível enviar a foto de perfil: ${error.message}`,
    );
  }

  return supabase.storage.from('fotos-perfil').getPublicUrl(caminho).data
    .publicUrl;
}
