import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, Leaf, Droplets, Heart, PenTool, Link as LinkIcon, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { ContactForm } from '../components/ContactForm';

export function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadVideo = async () => {
      if (videoRef.current) {
        try {
          // Reset video element
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
          
          // Load and play
          await videoRef.current.load();
          const playPromise = videoRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Error playing video:", error);
              // If video fails to play, hide the video element and show a fallback background
              if (videoRef.current) {
                videoRef.current.style.display = 'none';
                videoRef.current.parentElement?.classList.add('bg-nature-100');
              }
            });
          }
        } catch (error) {
          console.error("Error with video:", error);
          // Hide video element on error and show fallback background
          if (videoRef.current) {
            videoRef.current.style.display = 'none';
            videoRef.current.parentElement?.classList.add('bg-nature-100');
          }
        }
      }
    };

    loadVideo();

    // Cleanup function
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, []);

  return (
    <>
      <SEO />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <div className="absolute top-0 right-0 -z-10 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
              alt="Fond décoratif"
              className="w-96 h-96 object-cover rounded-full"
            />
          </div>

          <section className="prose lg:prose-lg max-w-none">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row items-center gap-12 mb-16"
            >
              <div className="relative w-64 h-64 flex-shrink-0">
                <motion.div
                  className="absolute inset-0 bg-nature-200 rounded-full"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full overflow-hidden shadow-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src="/pearl-profile.jpg"
                    alt="Pearl Nguyen Duy"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </motion.div>
              </div>
              <div className="flex-1">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-serif text-nature-500 mb-6"
                >
                  Bienvenue dans mon cabinet
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-nature-500 text-lg leading-relaxed"
                >
                  En tant que psychologue clinicienne, thérapeute, graphothérapeute et psychologue de première ligne (PPL), j'accompagne adultes, adolescents et enfants dans leur cheminement vers le mieux-être. Mon approche intégrative combine différentes méthodes thérapeutiques, adaptées à chaque situation et à chaque personne.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-nature-500 text-lg mt-4"
                >
                  Je crois en la capacité de chacun à mobiliser ses ressources intérieures pour surmonter les difficultés et s'épanouir pleinement.
                </motion.p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Link to="/psychologie/tcc" className="no-underline group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-nature-400 h-full relative"
                >
                  <div className="h-52 overflow-hidden rounded-t-xl">
                    <img
                      src="/tcc.jpg"
                      alt="Thérapie"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="eager"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <Heart className="w-5 h-5 text-nature-400 mr-2" />
                      <h3 className="text-xl font-serif text-nature-500">Thérapies Cognitivo-Comportementales</h3>
                    </div>
                    <p className="text-nature-500">Une approche scientifiquement validée pour comprendre et modifier les schémas de pensée et les comportements qui maintiennent la souffrance psychologique.</p>
                    <div className="mt-4 flex items-center text-nature-400 group-hover:text-nature-600">
                      <span>Lire la suite</span>
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>

              <Link to="/psychologie/ritmo" className="no-underline group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-nature-400 h-full relative"
                >
                  <div className="h-52 overflow-hidden rounded-t-xl">
                    <img
                      src="/zen-water-drops.jpg"
                      alt="RITMO"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <Droplets className="w-5 h-5 text-nature-400 mr-2" />
                      <h3 className="text-xl font-serif text-nature-500">RITMO®</h3>
                    </div>
                    <p className="text-nature-500">Une méthode innovante et douce pour le traitement des traumatismes et des blocages émotionnels, inspirée de l'EMDR.</p>
                    <div className="mt-4 flex items-center text-nature-400 group-hover:text-nature-600">
                      <span>Lire la suite</span>
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>

              <Link to="/psychologie/hypnose" className="no-underline group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-nature-400 h-full relative"
                >
                  <div className="h-52 overflow-hidden rounded-t-xl">
                    <img
                      src="/zen-fountain.jpg"
                      alt="Hypnose"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <Leaf className="w-5 h-5 text-nature-400 mr-2" />
                      <h3 className="text-xl font-serif text-nature-500">Hypnose Thérapeutique</h3>
                    </div>
                    <p className="text-nature-500">Une approche douce et naturelle pour accéder à vos ressources intérieures et favoriser le changement.</p>
                    <div className="mt-4 flex items-center text-nature-400 group-hover:text-nature-600">
                      <span>Lire la suite</span>
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden border-l-8 border-grapho-orange"
            >
              <div className="md:flex">
                <div className="md:w-1/2 relative">
                  <img
                    src="/Graphotherapie.jpg"
                    alt="Graphothérapie"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-8 md:w-1/2 bg-gradient-to-br from-grapho-cream to-white">
                  <div className="flex justify-center mb-6">
                    <motion.img
                      src="/Logo.png"
                      alt="Logo Graphothérapie"
                      className="h-32 w-auto"
                      loading="lazy"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-grapho-gray leading-relaxed">
                    Spécialisée en graphothérapie, j'accompagne enfants, adolescents et adultes dans l'amélioration de leur écriture. Cette approche permet de traiter les difficultés d'écriture (dysgraphie), de retrouver confiance et aisance dans l'expression écrite, et d'optimiser son geste graphique pour une écriture plus fluide et personnelle, que ce soit dans un contexte scolaire, professionnel ou personnel.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/graphotherapie"
                      className="inline-flex items-center bg-grapho-orange text-white px-4 py-2 rounded-lg hover:bg-grapho-blue transition-colors duration-300 no-underline"
                    >
                      Découvrir la graphothérapie
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-nature-400"
            >
              <div className="p-8">
                <h3 className="text-2xl font-serif text-nature-500 mb-6">Collaborations Professionnelles</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col items-center p-4 bg-nature-50 rounded-lg"
                  >
                    <div className="h-32 flex items-center justify-center">
                      <img
                        src="/DysMoi_Logo.png"
                        alt="DysMoi Logo"
                        className="h-48 w-auto object-contain"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-nature-500 text-center text-sm mt-4">
                      Centre pluridisciplinaire Neuroatypies : Haut potentiel . Autisme . Troubles des apprentissages
                    </p>
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="mt-2"
                    >
                      <Link to="/collaboration" className="text-sm text-nature-500 hover:text-nature-600 transition-colors no-underline flex items-center">
                        <LinkIcon className="w-4 h-4 mr-2 text-nature-400" />
                        En savoir plus
                      </Link>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col items-center p-4 bg-nature-50 rounded-lg"
                  >
                    <div className="h-32 flex items-center justify-center">
                      <img
                        src="/RealismLogo.png"
                        alt="Realims Logo"
                        className="h-24 w-auto object-contain"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-nature-500 text-center text-sm mt-4">
                      En tant que psychologue de première ligne au sein du réseau REALIMS, j'offre un accompagnement précoce et accessible aux jeunes de 0 à 23 ans.
                    </p>
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="mt-2"
                    >
                      <Link to="/collaboration" className="text-sm text-nature-500 hover:text-nature-600 transition-colors no-underline flex items-center">
                        <LinkIcon className="w-4 h-4 mr-2 text-nature-400" />
                        En savoir plus
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16 grid md:grid-cols-2 gap-8"
            >
              <div className="bg-nature-100 p-8 rounded-2xl shadow-inner relative overflow-hidden border-l-4 border-nature-400">
                <div className="absolute inset-0 -z-10">
                  <img
                    src="/Bambou_FondTrans.jpg"
                    alt=""
                    className="w-full h-full object-cover opacity-5"
                    loading="lazy"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-serif text-nature-500 mb-8">Prendre rendez-vous</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <MapPin className="w-6 h-6 text-nature-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-nature-500 font-medium">Cabinet de consultation</p>
                        <p className="text-nature-400">
                          Rue de les Waleffes 27<br />
                          4317 Faimes<br />
                          Belgique
                        </p>
                      </div>
                    </div>

                    <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-nature-50">
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        playsInline
                        autoPlay
                        loop
                        muted
                        poster="/Zen_pierres.jpg"
                      >
                        <source src="/videos/zen_accueil.webm" type="video/webm" />
                        Votre navigateur ne prend pas en charge la lecture de vidéos.
                      </video>
                    </div>

                    <div className="pt-4 space-y-4">
                      <motion.a 
                        whileHover={{ x: 10 }}
                        href="mailto:pearl@nguyen.eu" 
                        className="flex items-center text-nature-500 hover:text-nature-600 transition-colors no-underline bg-white/50 p-3 rounded-lg"
                      >
                        <Mail className="w-6 h-6 mr-3" />
                        pearl@nguyen.eu
                      </motion.a>
                      <motion.a 
                        whileHover={{ x: 10 }}
                        href="tel:+32495863810" 
                        className="flex items-center text-nature-500 hover:text-nature-600 transition-colors no-underline bg-white/50 p-3 rounded-lg"
                      >
                        <Phone className="w-6 h-6 mr-3" />
                        +32 495 86 38 10
                      </motion.a>
                    </div>

                    <p className="text-nature-500 mt-6 italic text-sm bg-white/50 p-3 rounded-lg">
                      Consultations uniquement sur rendez-vous.<br />
                      Réponse rapide par email ou téléphone.
                    </p>
                  </div>
                </div>
              </div>

              <ContactForm />
            </motion.div>
          </section>
        </div>
      </main>
    </>
  );
}