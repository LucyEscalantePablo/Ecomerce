import { supabase } from './supabase';

export const uploadFile = async (file: File, onProgress?: (loading: boolean) => void) => {
  if (onProgress) onProgress(true);
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (error) throw new Error(error.message);

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error.message);
    alert(`Error al subir imagen: ${error.message}\n\nAsegúrate de que el bucket "products" existe y tiene acceso público en Supabase Storage.`);
    return null;
  } finally {
    if (onProgress) onProgress(false);
  }
};
