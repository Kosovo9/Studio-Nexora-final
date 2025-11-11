import { useState } from 'react';
import { Search, Camera, Building, Trees, Home, Calendar, Crown, Building2, Briefcase, Check } from 'lucide-react';
import { categories, type PromptData, searchPrompts } from '../data/prompts';
import { Language } from '../lib/translations';

interface ScenarioSelectorProps {
  lang: Language;
  onSelectScenario: (prompt: PromptData) => void;
  selectedScenario?: PromptData;
}

const iconMap: Record<string, any> = {
  Camera,
  Building,
  Trees,
  Home,
  Calendar,
  Crown,
  Building2,
  Briefcase
};

export default function ScenarioSelector({ lang, onSelectScenario, selectedScenario }: ScenarioSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('studio');
  const [searchQuery, setSearchQuery] = useState('');

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const prompts = searchQuery
    ? searchPrompts(searchQuery)
    : currentCategory?.prompts || [];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {lang === 'es' ? 'Elige tu Escenario Perfecto' : 'Choose Your Perfect Scenario'}
        </h2>
        <p className="text-lg text-slate-600">
          {lang === 'es'
            ? 'Más de 100 locaciones profesionales disponibles'
            : '100+ professional locations available'}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder={lang === 'es' ? 'Buscar escenarios...' : 'Search scenarios...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none text-lg"
        />
      </div>

      {!searchQuery && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = iconMap[category.icon];
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <Icon className={`w-8 h-8 mb-3 ${
                  selectedCategory === category.id ? 'text-blue-600' : 'text-slate-600'
                }`} />
                <h3 className={`font-bold mb-1 ${
                  selectedCategory === category.id ? 'text-blue-900' : 'text-slate-900'
                }`}>
                  {category.name}
                </h3>
                <p className="text-sm text-slate-600">{category.prompts.length} opciones</p>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onSelectScenario(prompt)}
            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-xl hover:-translate-y-1 ${
              selectedScenario?.id === prompt.id
                ? 'border-blue-500 bg-blue-50 shadow-xl'
                : 'border-slate-200 hover:border-blue-300 bg-white'
            }`}
          >
            {selectedScenario?.id === prompt.id && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}

            <div className="space-y-3">
              <h3 className={`text-xl font-bold ${
                selectedScenario?.id === prompt.id ? 'text-blue-900' : 'text-slate-900'
              }`}>
                {prompt.name}
              </h3>

              <div className="flex flex-wrap gap-2">
                {prompt.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap mt-2">
                <span className={`text-sm font-semibold ${
                  prompt.difficulty === 'basic' ? 'text-green-600' :
                  prompt.difficulty === 'intermediate' ? 'text-blue-600' :
                  'text-purple-600'
                }`}>
                  {prompt.difficulty === 'basic' ? 'Básico' :
                   prompt.difficulty === 'intermediate' ? 'Intermedio' :
                   'Avanzado'}
                </span>

                {prompt.seasonal && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                    <Calendar className="w-3 h-3" />
                    {lang === 'es' ? 'Noviembre 2025' : 'November 2025'}
                  </span>
                )}

                {prompt.isPopular && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                    <Crown className="w-3 h-3" />
                    {lang === 'es' ? 'Más Popular' : 'Most Popular'}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {prompts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-slate-600">
            {lang === 'es'
              ? 'No se encontraron escenarios. Intenta otra búsqueda.'
              : 'No scenarios found. Try another search.'}
          </p>
        </div>
      )}
    </div>
  );
}
