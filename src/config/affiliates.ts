export type Affiliate = { name: string; baseUrl: string; trackingId?: string; active: boolean };

export const AFFILIATES: Affiliate[] = [
  { name: 'Mercado Libre', baseUrl: 'https://mercadolibre.com', trackingId: 'ML-XXXX', active: true },
  { name: 'Temu',           baseUrl: 'https://temu.com',          trackingId: 'TM-XXXX', active: true },
  { name: 'Alibaba',        baseUrl: 'https://alibaba.com',       trackingId: 'ALB-XXXX', active: true },
  { name: 'Amazon',         baseUrl: 'https://amazon.com',        trackingId: 'AMZ-XXXX', active: true },
  { name: 'AliExpress',     baseUrl: 'https://aliexpress.com',    trackingId: 'AEX-XXXX', active: true },
];

