import { useState } from 'react';
import { Language } from '../lib/translations';
import type { PhotoCategory, CategoryPromptConfig } from '../lib/prompts/categoryPrompts';
import { generateCategoryPrompts, getAllCategories, getCategoryInfo } from '../lib/prompts/categoryPrompts';
import { X, Plus, Save, Trash2, Sparkles } from 'lucide-react';

interface PromptManagerProps {
  lang: Language;
  selectedCategory: PhotoCategory | null;
  onPromptsSelected: (prompts: string[]) => void;
  onClose?: () => void;
}

export default function PromptManager({ 
  lang, 
  selectedCategory, 
  onPromptsSelected,
  onClose 
}: PromptManagerProps) {
  const [category, setCategory] = useState<PhotoCategory>(selectedCategory || 'mujer');
  const [variant, setVariant] = useState<'A' | 'B'>('A');
  const [customPrompts, setCustomPrompts] = useState<string[]>(['']);
  const [style, setStyle] = useState('');
  const [occasion, setOccasion] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const categories = getAllCategories();
  const categoryInfo = getCategoryInfo(category);

  const handleAddCustomPrompt = () => {
    setCustomPrompts([...customPrompts, '']);
  };

  const handleRemoveCustomPrompt = (index: number) => {
    setCustomPrompts(customPrompts.filter((_, i) => i !== index));
  };

  const handleCustomPromptChange = (index: number, value: string) => {
    const updated = [...customPrompts];
    updated[index] = value;
    setCustomPrompts(updated);
  };

  const handleGeneratePrompts = () => {
    const config: CategoryPromptConfig = {
      category,
      variant,
      style: style || undefined,
      occasion: occasion || undefined,
      numberOfPeople: category === 'familia' || category === 'grupo' || category === 'equipo' ? numberOfPeople : undefined,
      customPrompt: customPrompts[0] || undefined,
    };

    const generated = generateCategoryPrompts(config, 4);
    const prompts = generated.map(p => p.prompt);
    onPromptsSelected(prompts);
  };

  const handleUseCustomPrompts = () => {
    const validPrompts = customPrompts.filter(p => p.trim().length > 0);
    if (validPrompts.length > 0) {
      onPromptsSelected(validPrompts);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-2xl font-bold">
              {lang === 'es' ? 'Gestionar Prompts' : 'Manage Prompts'}
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {lang === 'es' ? 'Categoría' : 'Category'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const info = getCategoryInfo(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      category === cat
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold">{lang === 'es' ? info.name : info.nameEn}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {lang === 'es' ? info.description : info.descriptionEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Variant Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {lang === 'es' ? 'Variante' : 'Variant'}
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setVariant('A')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  variant === 'A'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold">Versión A</div>
                <div className="text-sm text-slate-500 mt-1">
                  {lang === 'es' ? '100% Fidelidad' : '100% Fidelity'}
                </div>
              </button>
              <button
                onClick={() => setVariant('B')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  variant === 'B'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold">Versión B</div>
                <div className="text-sm text-slate-500 mt-1">
                  {lang === 'es' ? 'Mejoras Realistas' : 'Realistic Enhancements'}
                </div>
              </button>
            </div>
          </div>

          {/* Additional Options */}
          {(category === 'familia' || category === 'grupo' || category === 'equipo') && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {lang === 'es' ? 'Número de Personas' : 'Number of People'}
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)}
                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {lang === 'es' ? 'Estilo (opcional)' : 'Style (optional)'}
              </label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder={lang === 'es' ? 'Ej: Vogue, Editorial' : 'E.g: Vogue, Editorial'}
                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {lang === 'es' ? 'Ocasión (opcional)' : 'Occasion (optional)'}
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder={lang === 'es' ? 'Ej: Navidad, Boda' : 'E.g: Christmas, Wedding'}
                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Custom Prompts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700">
                {lang === 'es' ? 'Prompts Personalizados' : 'Custom Prompts'}
              </label>
              <button
                onClick={handleAddCustomPrompt}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                {lang === 'es' ? 'Agregar' : 'Add'}
              </button>
            </div>
            <div className="space-y-2">
              {customPrompts.map((prompt, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={prompt}
                    onChange={(e) => handleCustomPromptChange(index, e.target.value)}
                    placeholder={lang === 'es' ? 'Escribe tu prompt personalizado aquí...' : 'Write your custom prompt here...'}
                    className="flex-1 p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                    rows={2}
                  />
                  {customPrompts.length > 1 && (
                    <button
                      onClick={() => handleRemoveCustomPrompt(index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={handleGeneratePrompts}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {lang === 'es' ? 'Generar Prompts Automáticos' : 'Generate Automatic Prompts'}
            </button>
            {customPrompts.some(p => p.trim().length > 0) && (
              <button
                onClick={handleUseCustomPrompts}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {lang === 'es' ? 'Usar Prompts Personalizados' : 'Use Custom Prompts'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

