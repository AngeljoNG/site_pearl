import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, PenTool } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function GraphotherapieExercices() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const exercises = [
    { id: 1, image: '/graphotherapie/exercises/Exercice1.jpg', title: 'Exercice 1', description: 'Un petit sourire pour bien positionner ses doigts 😊' },
    { id: 2, image: '/graphotherapie/exercises/Exercice2.jpg', title: 'Exercice 2', description: 'On pose bien la main sous la ligne' },
    { id: 3, image: '/graphotherapie/exercises/Exercice3.jpg', title: 'Exercice 3', description: 'On tourne dans le bons sens ;)' },
    { id: 4, image: '/graphotherapie/exercises/Exercice4.jpg', title: 'Exercice 4', description: 'Une belle position de la main, et ça roule!' },
    { id: 5, image: '/graphotherapie/exercises/Exercice5.jpg', title: 'Exercice 5', description: 'Belle position de main gauche, on voit tout ce que l\'on fait, le poignet est droit, pas de douleur...' },
    { id: 6, image: '/graphotherapie/exercises/Exercice6.jpg', title: 'Exercice 6', description: 'Un petit outils pratique pour garder le crayon en place...' },
    { id: 7, image: '/graphotherapie/exercises/Exercice7.jpg', title: 'Exercice 7', description: 'Attention, je dois tenir ma feuille avec ma main libre ;)' },
    { id: 8, image: '/graphotherapie/exercises/Exercice8.jpg', title: 'Exercice 8', description: 'Ce sourire... Il est contagieux.' }
  ];

  const videos = [
    { id: 1, src: '/graphotherapie/videos/Manip1.mp4', thumbnail: '/graphotherapie/thumbnails/Manip1.jpg', title: 'Manipulation 1', description: "J'apprends à faire mes lacets, une autonomie pour la vie !" },
    { id: 2, src: '/graphotherapie/videos/Manip2.mp4', thumbnail: '/graphotherapie/thumbnails/Manip2.jpg', title: 'Manipulation 2', description: 'Les tracés infinis' },
    { id: 3, src: '/graphotherapie/videos/Manip3.mp4', thumbnail: '/graphotherapie/thumbnails/Manip3.jpg', title: 'Manipulation 3', description: 'La pâte intelligente, multiples exercices ludiques et satisfaisants' },
    { id: 4, src: '/graphotherapie/videos/Manip4.mp4', thumbnail: '/graphotherapie/thumbnails/Manip4.jpg', title: 'Manipulation 4', description: 'La feuille magique' },
    { id: 5, src: '/graphotherapie/videos/Manip5.mp4', thumbnail: '/graphotherapie/thumbnails/Manip5.jpg', title: 'Manipulation 5', description: 'Les toupies en folie' },
    { id: 6, src: '/graphotherapie/videos/Manip6.mp4', thumbnail: '/graphotherapie/thumbnails/Manip6.jpg', title: 'Manipulation 6', description: 'Le sable :)' },
    { id: 7, src: '/graphotherapie/videos/Manip7.mp4', thumbnail: '/graphotherapie/thumbnails/Manip7.jpg', title: 'Manipulation 7', description: 'Les aimants et le déliement des doigts' }
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-grapho-cream">
      <Link 
        to="/graphotherapie"
        className="inline-flex items-center text-grapho-blue hover:text-grapho-orange mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à la graphothérapie
      </Link>

      <section className="prose lg:prose-lg max-w-none">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-serif text-grapho-blue mb-8 flex items-center"
        >
          <PenTool className="w-8 h-8 mr-3 text-grapho-orange" />
          Exercices et Techniques
        </motion.h2>

        <div className="space-y-12">
          {/* Photos des exercices */}
          <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-grapho-orange">
            <h3 className="text-2xl font-serif text-grapho-blue mb-6">Exercices pratiques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.map((exercise) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-grapho-cream rounded-lg overflow-hidden shadow-md border-l-4 border-grapho-blue"
                >
                  <div className="aspect-w-4 aspect-h-3">
                    <img
                      src={exercise.image}
                      alt={exercise.title}
                      className="w-full h-full object-contain bg-white"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-serif text-grapho-blue mb-2">{exercise.title}</h4>
                    <p className="text-sm text-grapho-gray">{exercise.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Vidéos de manipulation */}
          <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-grapho-orange">
            <h3 className="text-2xl font-serif text-grapho-blue mb-6">Vidéos de manipulation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-grapho-cream rounded-lg overflow-hidden shadow-md border-l-4 border-grapho-blue flex flex-col"
                >
                  {selectedVideo === video.src ? (
                    <div className="flex-1">
                      <video
                        src={video.src}
                        controls
                        autoPlay
                        className="w-full h-full object-cover"
                        poster={video.thumbnail}
                      >
                        <source src={video.src} type="video/mp4" />
                        Votre navigateur ne supporte pas la lecture de vidéos.
                      </video>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedVideo(video.src)}
                      className="w-full relative group"
                    >
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={video.thumbnail}
                          alt={`Aperçu de ${video.title}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300">
                          <div className="bg-white rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-8 h-8 text-grapho-blue" />
                          </div>
                        </div>
                      </div>
                    </button>
                  )}
                  <div className="p-4 bg-white mt-0">
                    <h4 className="text-lg font-serif text-grapho-blue mb-2">{video.title}</h4>
                    <p className="text-sm text-grapho-gray">{video.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}