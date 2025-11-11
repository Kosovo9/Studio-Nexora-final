import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Language } from '../lib/translations';

interface PreviewComparisonProps {
  lang: Language;
  originalImages: string[];
  versionA: string[];
  versionB: string[];
  onSelectVersion: (version: 'A' | 'B', imageIndex: number) => void;
}

export default function PreviewComparison({
  lang,
  originalImages,
  versionA,
  versionB,
  onSelectVersion
}: PreviewComparisonProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVersions, setSelectedVersions] = useState<Record<number, 'A' | 'B'>>({});

  const handleSelectVersion = (version: 'A' | 'B') => {
    setSelectedVersions((prev) => ({
      ...prev,
      [currentIndex]: version
    }));
    onSelectVersion(version, currentIndex);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % originalImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + originalImages.length) % originalImages.length);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          {lang === 'es' ? 'Selecciona tu Versión Favorita' : 'Select Your Favorite Version'}
        </h3>
        <p className="text-slate-600">
          {lang === 'es'
            ? 'Imagen {current} de {total}'
            : 'Image {current} of {total}'}
            .replace('{current}', String(currentIndex + 1))
            .replace('{total}', String(originalImages.length))
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="relative group">
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-semibold z-10">
            {lang === 'es' ? 'Versión A - Similar' : 'Version A - Similar'}
          </div>

          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl">
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2 tracking-wider">PREVIEW</div>
              <div className="text-sm opacity-75">
                {lang === 'es' ? 'Marca de agua removida al pagar' : 'Watermark removed after payment'}
              </div>
            </div>
          </div>

          <img
            src={versionA[currentIndex]}
            alt="Version A"
            className="w-full aspect-[3/4] object-cover rounded-2xl shadow-2xl opacity-60"
          />

          <button
            onClick={() => handleSelectVersion('A')}
            className={`absolute bottom-4 left-4 right-4 py-4 rounded-xl font-semibold transition-all duration-300 ${
              selectedVersions[currentIndex] === 'A'
                ? 'bg-blue-600 text-white shadow-xl scale-105'
                : 'bg-white/90 backdrop-blur-sm text-slate-900 hover:bg-white'
            }`}
          >
            {selectedVersions[currentIndex] === 'A' ? (
              <span className="flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                {lang === 'es' ? 'Seleccionada' : 'Selected'}
              </span>
            ) : (
              lang === 'es' ? 'Seleccionar Versión A' : 'Select Version A'
            )}
          </button>
        </div>

        <div className="relative group">
          <div className="absolute top-4 right-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold z-10">
            {lang === 'es' ? 'Versión B - Mejorada' : 'Version B - Enhanced'}
          </div>

          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl">
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2 tracking-wider">PREVIEW</div>
              <div className="text-sm opacity-75">
                {lang === 'es' ? 'Marca de agua removida al pagar' : 'Watermark removed after payment'}
              </div>
            </div>
          </div>

          <img
            src={versionB[currentIndex]}
            alt="Version B"
            className="w-full aspect-[3/4] object-cover rounded-2xl shadow-2xl opacity-60"
          />

          <button
            onClick={() => handleSelectVersion('B')}
            className={`absolute bottom-4 left-4 right-4 py-4 rounded-xl font-semibold transition-all duration-300 ${
              selectedVersions[currentIndex] === 'B'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-xl scale-105'
                : 'bg-white/90 backdrop-blur-sm text-slate-900 hover:bg-white'
            }`}
          >
            {selectedVersions[currentIndex] === 'B' ? (
              <span className="flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                {lang === 'es' ? 'Seleccionada' : 'Selected'}
              </span>
            ) : (
              lang === 'es' ? 'Seleccionar Versión B' : 'Select Version B'
            )}
          </button>
        </div>
      </div>

      {originalImages.length > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevImage}
            className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-2">
            {originalImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-blue-600 w-8' : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextImage}
            className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
        <p className="text-center text-slate-700">
          {lang === 'es' ? (
            <>
              <strong>Versión A:</strong> Mantiene 200% de similitud con tus rasgos originales
              <br />
              <strong>Versión B:</strong> Mejora realista manteniendo tu esencia
            </>
          ) : (
            <>
              <strong>Version A:</strong> Maintains 200% similarity with your original features
              <br />
              <strong>Version B:</strong> Realistic enhancement while keeping your essence
            </>
          )}
        </p>
      </div>
    </div>
  );
}
