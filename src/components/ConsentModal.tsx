import { AlertTriangle, Shield, X } from 'lucide-react';
import { useState } from 'react';
import { Language, translations } from '../lib/translations';

interface ConsentModalProps {
  lang: Language;
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function ConsentModal({ lang, isOpen, onAccept, onDecline }: ConsentModalProps) {
  const [agreed, setAgreed] = useState(false);
  const t = translations[lang].consent;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <h2 className="text-2xl font-bold">{t.title}</h2>
            </div>
            <button
              onClick={onDecline}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="flex items-start gap-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl mb-6">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-900 mb-1">{t.warning}</h3>
              <p className="text-red-800 text-sm leading-relaxed">
                {t.content}
              </p>
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            {t.terms.map((term, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-sm font-bold mt-0.5">
                  {index + 1}
                </div>
                <span className="text-slate-700 leading-relaxed">{term}</span>
              </li>
            ))}
          </ul>

          <div className="border-t-2 border-slate-200 pt-6">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-6 h-6 rounded border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
              </div>
              <span className="text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                {t.checkbox}
              </span>
            </label>
          </div>
        </div>

        <div className="border-t-2 border-slate-200 p-6 bg-slate-50 flex gap-4">
          <button
            onClick={onDecline}
            className="flex-1 py-3 px-6 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl transition-colors"
          >
            {t.decline}
          </button>
          <button
            onClick={onAccept}
            disabled={!agreed}
            className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all duration-300 ${
              agreed
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
