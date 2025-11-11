/**
 * Generador de Códigos de Afiliado
 * Genera códigos únicos: AFF-XXXXX
 * NO afecta UI/UX
 */

import { supabase } from '../../supabase';

/**
 * Genera un código único de afiliado: AFF-XXXXX
 * Verifica que no exista en la base de datos
 */
export async function generateAffiliateCode(
  baseName?: string
): Promise<string> {
  let code: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    if (baseName) {
      // Generar código basado en nombre: AFF-JUAN24
      const cleanName = baseName
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .substring(0, 4);
      const randomNum = Math.floor(Math.random() * 100);
      code = `AFF-${cleanName}${randomNum}`;
    } else {
      // Generar código aleatorio: AFF-A1B2C3
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let randomStr = '';
      for (let i = 0; i < 6; i++) {
        randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      code = `AFF-${randomStr}`;
    }

    // Verificar si el código ya existe
    const { data, error } = await supabase
      .from('affiliates')
      .select('affiliate_code')
      .eq('affiliate_code', code)
      .single();

    isUnique = !data; // Si no hay data, el código es único
    attempts++;
  }

  if (!isUnique) {
    throw new Error('No se pudo generar un código único después de varios intentos');
  }

  return code!;
}

/**
 * Genera un código personalizado basado en el nombre del afiliado
 */
export function generateCustomAffiliateCode(fullName: string): string {
  const nameParts = fullName.toUpperCase().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts[1] || '';
  
  // Tomar primeras 4 letras del nombre y primeras 2 del apellido
  const nameCode = (firstName.substring(0, 4) + lastName.substring(0, 2)).replace(/[^A-Z]/g, '');
  
  // Agregar año actual
  const year = new Date().getFullYear().toString().slice(-2);
  
  return `AFF-${nameCode}${year}`;
}

