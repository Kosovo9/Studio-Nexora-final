export type LegalKind = 'terms'|'privacy'|'cookies';

const BASE: Record<string, Record<LegalKind, string[]>> = {
  es: {
    terms: [
      'Estos Términos rigen el uso de nuestros sitios y servicios.',
      'Al usar la plataforma, aceptas cumplir con todas las políticas aplicables.',
      'Prohibido abuso, fraude o uso que viole leyes.',
      'Servicios pueden cambiar; notificaremos cambios sustanciales.',
      'Limitación de responsabilidad en la medida permitida por la ley.',
      'Ley aplicable: se indicará en contratos/órdenes de servicio.'
    ],
    privacy: [
      'Recopilamos datos mínimos para operar y mejorar la plataforma.',
      'Usamos cookies y analítica conforme a nuestra política.',
      'Compartimos con proveedores solo lo necesario (p. ej. pagos, hosting).',
      'Puedes ejercer derechos de acceso, rectificación y eliminación según tu país.',
      'Guardamos datos el tiempo estrictamente necesario.',
      'Contáctanos para cualquier solicitud de privacidad.'
    ],
    cookies: [
      'Usamos cookies esenciales, de preferencia y analíticas.',
      'Puedes gestionar cookies desde tu navegador.',
      'Algunas funciones requieren cookies esenciales.',
      'Analítica anonimizada cuando sea posible.',
      'Cumplimos con normativas locales cuando apliquen.',
      'Consulta la versión completa para detalles.'
    ]
  },
  en: {
    terms: [
      'These Terms govern the use of our sites and services.',
      'By using the platform, you agree to comply with all applicable policies.',
      'Abuse, fraud, or unlawful use is prohibited.',
      'Services may change; we will notify substantial changes.',
      'Liability is limited to the extent permitted by law.',
      'Governing law will be set in contracts/service orders.'
    ],
    privacy: [
      'We collect minimal data to operate and improve the platform.',
      'We use cookies and analytics per our policy.',
      'We share with vendors only what is necessary (e.g., payments, hosting).',
      'You may exercise data rights per your jurisdiction.',
      'We retain data only as strictly necessary.',
      'Contact us for any privacy request.'
    ],
    cookies: [
      'We use essential, preference, and analytics cookies.',
      'You can manage cookies from your browser.',
      'Some features require essential cookies.',
      'Analytics is anonymized when possible.',
      'We comply with local regulations where applicable.',
      'See the full version for details.'
    ]
  }
};

/** Idiomas adicionales reusan EN o ES como fallback rápido */
const FALL_EN = ['pt','fr','de','it','zh','ja','ko','ar','hi','ru'];
for (const k of FALL_EN) BASE[k] = BASE.en;

export function legalTexts(lang = 'es') {
  const k = Object.prototype.hasOwnProperty.call(BASE, lang) ? lang : (lang.startsWith('es')?'es':'en');
  return BASE[k];
}

