import { useState } from 'react';
import { Language } from '../lib/translations';
import type { PhotoCategory } from '../lib/prompts/categoryPrompts';
import { getAllCategories, getCategoryInfo } from '../lib/prompts/categoryPrompts';
import { User, Users, Baby, Dog, Cat, Home, UsersRound, Briefcase } from 'lucide-react';

interface CategorySelectorProps {
  lang: Language;
  onCategorySelected: (category: PhotoCategory) => void;
  selectedCategory?: PhotoCategory | null;
}

const categoryIcons: Record<PhotoCategory, typeof User> = {
  mujer: User,
  hombre: User,
  pareja: Users,
  nino: Baby,
  nina: Baby,
  mascota_perro: Dog,
  mascota_gato: Cat,
  familia: Home,
  grupo: UsersRound,
  equipo: Briefcase,
};

export default function CategorySelector({ 
  lang, 
  onCategorySelected, 
  selectedCategory 
}: CategorySelectorProps) {
  const categories = getAllCategories();

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-slate-900 mb-4 text-center">
        {lang === 'es' 
          ? 'Selecciona la categoría de tus fotos' 
          : 'Select your photos category'}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => {
          const info = getCategoryInfo(category);
          const Icon = categoryIcons[category];
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              onClick={() => onCategorySelected(category)}
              className={`p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-2 ${
                isSelected ? 'text-blue-600' : 'text-slate-600'
              }`} />
              <div className={`font-semibold text-sm ${
                isSelected ? 'text-blue-700' : 'text-slate-700'
              }`}>
                {lang === 'es' ? info.name : info.nameEn}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

