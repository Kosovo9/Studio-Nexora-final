import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Language } from '../lib/translations';

interface PhotoUploadProps {
  lang: Language;
  maxPhotos: number;
  onPhotosSelected: (photos: File[]) => void;
}

export default function PhotoUpload({ lang, maxPhotos, onPhotosSelected }: PhotoUploadProps) {
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    setError(null);
    const newFiles = Array.from(files);

    if (selectedPhotos.length + newFiles.length > maxPhotos) {
      setError(
        lang === 'es'
          ? `Solo puedes subir hasta ${maxPhotos} fotos`
          : `You can only upload up to ${maxPhotos} photos`
      );
      return;
    }

    const validFiles = newFiles.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setError(lang === 'es' ? 'Solo se permiten imágenes' : 'Only images are allowed');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(
          lang === 'es'
            ? 'Las imágenes deben ser menores a 10MB'
            : 'Images must be smaller than 10MB'
        );
        return false;
      }
      return true;
    });

    const updatedPhotos = [...selectedPhotos, ...validFiles];
    setSelectedPhotos(updatedPhotos);
    onPhotosSelected(updatedPhotos);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = selectedPhotos.filter((_, i) => i !== index);
    setSelectedPhotos(updatedPhotos);
    onPhotosSelected(updatedPhotos);
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-3 border-dashed rounded-2xl p-8 transition-all duration-300 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={selectedPhotos.length >= maxPhotos}
        />

        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {lang === 'es' ? 'Arrastra tus fotos aquí' : 'Drag your photos here'}
          </h3>

          <p className="text-slate-600 mb-4">
            {lang === 'es' ? 'o haz clic para seleccionar' : 'or click to select'}
          </p>

          <div className="text-sm text-slate-500">
            {lang === 'es'
              ? `Máximo ${maxPhotos} fotos • Hasta 10MB por imagen`
              : `Maximum ${maxPhotos} photos • Up to 10MB per image`}
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-500">
            <span className="px-3 py-1 bg-slate-100 rounded-full">JPG</span>
            <span className="px-3 py-1 bg-slate-100 rounded-full">PNG</span>
            <span className="px-3 py-1 bg-slate-100 rounded-full">WEBP</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {selectedPhotos.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {selectedPhotos.map((photo, index) => (
            <div
              key={index}
              className="relative group bg-slate-100 rounded-xl overflow-hidden aspect-square"
            >
              <img
                src={URL.createObjectURL(photo)}
                alt={`Selected ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                <button
                  onClick={() => removePhoto(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                {index + 1}
              </div>
            </div>
          ))}

          {selectedPhotos.length < maxPhotos && (
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl aspect-square flex items-center justify-center hover:border-blue-400 transition-colors cursor-pointer group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFiles(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                <p className="text-sm text-slate-500 group-hover:text-blue-600 transition-colors">
                  {lang === 'es' ? 'Agregar más' : 'Add more'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
