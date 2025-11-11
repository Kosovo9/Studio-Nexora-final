/**
 * Generador de Códigos de Referido
 * Genera códigos únicos: REF-XXXXX
 * NO afecta UI/UX
 */

import { supabase } from '../../supabase';

/**
 * Genera un código único de referido: REF-XXXXX
 */
export async function generateReferralCode(
  baseName?: string
): Promise<string> {
  let code: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    if (baseName) {
      const cleanName = baseName.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 4);
      const randomNum = Math.floor(Math.random() * 100);
      code = `REF-${cleanName}${randomNum}`;
    } else {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let randomStr = '';
      for (let i = 0; i < 6; i++) {
        randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      code = `REF-${randomStr}`;
    }

    // Verificar si el código ya existe
    const { data } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('code', code)
      .single();

    isUnique = !data;
    attempts++;
  }

  if (!isUnique) {
    throw new Error('No se pudo generar un código único después de varios intentos');
  }

  return code!;
}

