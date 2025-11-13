import { Sparkles, Zap, Eye } from 'lucide-react';
import { Language, translations } from '../lib/translations';
import AnimatedCarousel from './AnimatedCarousel';

interface HeroProps {
  lang: Language;
  onGetStarted: () => void;
}

export default function Hero({ lang, onGetStarted }: HeroProps) {
  const t = translations[lang].hero;

  // Fotos de mujeres para carrusel izquierdo
  const womenCarouselImages = [
    'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop'
  ];

  // Fotos de hombres para carrusel derecho
  const menCarouselImages = [
    'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    'https://images.pexels.com/photos/1043475/pexels-photo-1043475.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    'https://images.pexels.com/photos/1043476/pexels-photo-1043476.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    'https://images.pexels.com/photos/1043477/pexels-photo-1043477.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    'https://images.pexels.com/photos/1043478/pexels-photo-1043478.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    'https://images.pexels.com/photos/1043479/pexels-photo-1043479.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    'https://images.pexels.com/photos/1043480/pexels-photo-1043480.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop'
  ];

  const handleViewExamples = () => {
    const samplesSection = document.getElementById('samples');
    if (samplesSection) {
      samplesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-black text-white overflow-hidden min-h-screen">
      {/* Fondo de la Tierra desde el espacio */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <img
          src="/image.png"
          alt="Earth from space"
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback si la imagen no carga
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
      </div>

      {/* Carrusel de mujeres - Izquierda (parte media) */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 w-64 opacity-25 hover:opacity-40 transition-opacity duration-500 z-10 hidden lg:block">
        <AnimatedCarousel images={womenCarouselImages} direction="left" />
      </div>

      {/* Carrusel de hombres - Derecha (parte media) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-64 opacity-25 hover:opacity-40 transition-opacity duration-500 z-10 hidden lg:block">
        <AnimatedCarousel images={menCarouselImages} direction="right" />
      </div>

      {/* Contenido principal centrado */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex items-center min-h-screen z-20">
        <div className="text-center max-w-5xl mx-auto w-full">
          {/* Badge "IA de última generación" */}
          <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-10">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-base font-semibold text-white">
              {lang === 'es' ? 'IA de última generación' : 'Next-generation AI'}
            </span>
          </div>

          {/* Título principal con colores específicos */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold mb-8 leading-tight">
            <span className="text-white block">{lang === 'es' ? 'Transforma tus' : 'Transform your'}</span>
            <span className="block">
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {lang === 'es' ? 'Selfies' : 'Selfies'}
              </span>
              <span className="text-white"> {lang === 'es' ? 'en' : 'into'} </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {lang === 'es' ? 'Fotos' : 'Photos'}
              </span>
            </span>
            <span className="text-white block">{lang === 'es' ? 'Profesionales' : 'Professional'}</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-2xl md:text-3xl text-white/90 mb-6 font-medium">
            {lang === 'es' 
              ? '¡Tú eliges el estudio y la locación que te gusta!' 
              : 'You choose the studio and location you like!'}
          </p>

          {/* Descripción */}
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            {lang === 'es'
              ? 'Crea imágenes profesionales hiper-realistas con Inteligencia Artificial. Sin fotógrafo, sin estudio, sin complicaciones. Resultados en 5 minutos.'
              : 'Create hyper-realistic professional images with Artificial Intelligence. No photographer, no studio, no complications. Results in 5 minutes.'}
          </p>

          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-10 py-5 rounded-xl text-xl font-bold transition-all duration-300 shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105"
            >
              {lang === 'es' ? 'Comenzar Ahora' : 'Start Now'}
              <Zap className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleViewExamples}
              className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white/50 bg-black/20 backdrop-blur-sm text-white px-10 py-5 rounded-xl text-xl font-bold transition-all duration-300 hover:bg-white/10 hover:scale-105"
            >
              <Eye className="w-6 h-6" />
              {lang === 'es' ? 'Ver Ejemplos' : 'View Examples'}
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-2">50K+</div>
              <div className="text-lg md:text-xl text-white/80">{lang === 'es' ? 'Clientes Felices' : 'Happy Clients'}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-2">5 Min</div>
              <div className="text-lg md:text-xl text-white/80">{lang === 'es' ? 'Entrega Rápida' : 'Fast Delivery'}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-2">100+</div>
              <div className="text-lg md:text-xl text-white/80">{lang === 'es' ? 'Estilos Únicos' : 'Unique Styles'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
