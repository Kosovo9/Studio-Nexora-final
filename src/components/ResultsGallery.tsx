import { useState, useEffect } from 'react';
import { Download, Image as ImageIcon, X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Language } from '../lib/translations';
import { supabase, STORAGE_BUCKETS } from '../lib/supabase';

interface GeneratedPhoto {
  id: string;
  order_id: string;
  upload_id: string;
  version: 'A' | 'B';
  image_url: string;
  watermarked_url: string;
  status: string;
  created_at: string;
}

interface ResultsGalleryProps {
  lang: Language;
  orderId: string;
  onClose?: () => void;
}

export default function ResultsGallery({ lang, orderId, onClose }: ResultsGalleryProps) {
  const [photos, setPhotos] = useState<GeneratedPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<GeneratedPhoto | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    loadPhotos();
  }, [orderId]);

  const loadPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_photos')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPhotos(data);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (photo: GeneratedPhoto) => {
    setDownloading(photo.id);
    try {
      // Get the unwatermarked image URL
      const imageUrl = photo.watermarked_url || photo.image_url;
      
      // Fetch the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexora-${photo.version}-${photo.id.substring(0, 8)}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading photo:', error);
      alert(lang === 'es' ? 'Error al descargar la imagen' : 'Error downloading image');
    } finally {
      setDownloading(null);
    }
  };

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from(STORAGE_BUCKETS.GENERATED_PHOTOS).getPublicUrl(path);
    return data.publicUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">{lang === 'es' ? 'Cargando fotos...' : 'Loading photos...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center">
            <ImageIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {lang === 'es' ? 'No hay fotos disponibles' : 'No photos available'}
            </h3>
            <p className="text-slate-600">
              {lang === 'es' ? 'Las fotos se generarán después del pago' : 'Photos will be generated after payment'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {onClose && (
          <button
            onClick={onClose}
            className="mb-8 text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2 transition-colors"
          >
            ← {lang === 'es' ? 'Volver' : 'Back'}
          </button>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {lang === 'es' ? 'Tus Fotos Profesionales' : 'Your Professional Photos'}
          </h1>
          <p className="text-slate-600">
            {lang === 'es' ? `${photos.length} fotos generadas` : `${photos.length} photos generated`}
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={photo.watermarked_url || photo.image_url}
                  alt={`Version ${photo.version}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-semibold">
                      {lang === 'es' ? 'Ver en tamaño completo' : 'View full size'}
                    </p>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg font-semibold text-sm">
                  {lang === 'es' ? 'Versión' : 'Version'} {photo.version}
                </div>
              </div>
              <div className="p-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(photo);
                  }}
                  disabled={downloading === photo.id}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  {downloading === photo.id
                    ? lang === 'es'
                      ? 'Descargando...'
                      : 'Downloading...'
                    : lang === 'es'
                    ? 'Descargar'
                    : 'Download'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Full Size Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 p-3 bg-white/90 hover:bg-white rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-900" />
              </button>
              <img
                src={selectedPhoto.watermarked_url || selectedPhoto.image_url}
                alt={`Version ${selectedPhoto.version}`}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="mt-4 flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                <div>
                  <p className="font-semibold text-slate-900">
                    {lang === 'es' ? 'Versión' : 'Version'} {selectedPhoto.version}
                  </p>
                  <p className="text-sm text-slate-600">
                    {new Date(selectedPhoto.created_at).toLocaleDateString(
                      lang === 'es' ? 'es-MX' : 'en-US'
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleDownload(selectedPhoto)}
                  disabled={downloading === selectedPhoto.id}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  {downloading === selectedPhoto.id
                    ? lang === 'es'
                      ? 'Descargando...'
                      : 'Downloading...'
                    : lang === 'es'
                    ? 'Descargar'
                    : 'Download'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

