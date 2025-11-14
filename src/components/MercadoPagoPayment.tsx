import { useState } from 'react';
import { Language } from '../lib/translations';
import { 
  getMercadoPagoBankInfo, 
  getFormattedCLABE, 
  getBeneficiaryName, 
  getInstitutionName,
  getMercadoPagoLink 
} from '../lib/config/mercadopago';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { logger } from '../lib/utils/logger';

interface MercadoPagoPaymentProps {
  lang: Language;
  onCopy?: (field: string) => void;
}

export default function MercadoPagoPayment({ lang, onCopy }: MercadoPagoPaymentProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const bankInfo = getMercadoPagoBankInfo();

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      onCopy?.(field);
    } catch (error) {
      logger.error('Failed to copy:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900">
          {lang === 'es' ? 'Transferencia Bancaria' : 'Bank Transfer'}
        </h3>
        <a
          href={getMercadoPagoLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          {lang === 'es' ? 'Pagar con Mercado Pago' : 'Pay with Mercado Pago'}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* CLABE */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-slate-700">
            CLABE
          </label>
          <button
            onClick={() => handleCopy(getFormattedCLABE(), 'clabe')}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            {copiedField === 'clabe' ? (
              <>
                <Check className="w-4 h-4" />
                {lang === 'es' ? 'Copiado' : 'Copied'}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                {lang === 'es' ? 'Copiar' : 'Copy'}
              </>
            )}
          </button>
        </div>
        <p className="text-lg text-slate-600 font-mono">
          {getFormattedCLABE()}
        </p>
      </div>

      {/* Beneficiario */}
      <div className="border-b border-slate-200 pb-4">
        <label className="text-sm font-bold text-slate-700 block mb-2">
          {lang === 'es' ? 'Beneficiario' : 'Beneficiary'}
        </label>
        <p className="text-lg text-slate-600">
          {getBeneficiaryName()}
        </p>
      </div>

      {/* Institución */}
      <div>
        <label className="text-sm font-bold text-slate-700 block mb-2">
          {lang === 'es' ? 'Institución' : 'Institution'}
        </label>
        <p className="text-lg text-slate-600">
          {getInstitutionName()}
        </p>
      </div>

      {/* Link de pago */}
      <div className="pt-4 border-t border-slate-200">
        <a
          href={getMercadoPagoLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {lang === 'es' ? 'Pagar con Mercado Pago' : 'Pay with Mercado Pago'}
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}

