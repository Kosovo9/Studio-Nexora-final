import { Language, translations } from '../lib/translations';

interface SampleGalleryProps {
  lang: Language;
}

export default function SampleGallery({ lang }: SampleGalleryProps) {
  const t = translations[lang].samples;

  const samples = [
    {
      before: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=600',
      after: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Professional'
    },
    {
      before: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600',
      after: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Business'
    },
    {
      before: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600',
      after: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Creative'
    },
    {
      before: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600',
      after: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Elegant'
    }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-slate-300">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {samples.map((sample, index) => (
            <div
              key={index}
              className="group relative bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <div className="grid grid-cols-2 divide-x divide-slate-700">
                <div className="relative overflow-hidden">
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-medium z-10">
                    Original
                  </div>
                  <img
                    src={sample.before}
                    alt="Original"
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-medium z-10">
                    AI Enhanced
                  </div>
                  <img
                    src={sample.after}
                    alt="AI Enhanced"
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="p-4 bg-slate-800/50 backdrop-blur-sm">
                <p className="text-center text-sm font-medium text-slate-300">
                  {sample.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
