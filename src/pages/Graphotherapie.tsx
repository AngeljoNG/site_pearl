import React, { useState, useEffect } from 'react';
import { PenTool, BookOpen, Brain, Target, ArrowRight, Pause, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WritingQuill } from '../components/WritingQuill';

export function Graphotherapie() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const beforeAfterCases = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    image: `/graphotherapie/before-after/AvantApres${i + 1}.jpg`,
    description: `Exemple ${i + 1} d'amélioration de l'écriture`
  }));

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % beforeAfterCases.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, beforeAfterCases.length]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      scale: 1.03,
      transition: { duration: 0.3 }
    }
  };

  const floatingAnimation = {
    y: [-5, 5],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-grapho-cream">
      <section className="prose lg:prose-lg max-w-none">
        <motion.div 
          animate={floatingAnimation}
          className="flex justify-center mb-8"
        >
          <img
            src="/Logo.png"
            alt="Logo Graphothérapie"
            className="h-32 w-auto"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white p-8 rounded-lg shadow-md mb-8 border-l-4 border-grapho-orange relative overflow-hidden"
        >
          <motion.div
            className="absolute -right-16 -top-16 w-48 h-48 opacity-10 rotate-12"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <PenTool className="w-full h-full text-grapho-orange" />
          </motion.div>

          <h2 className="text-2xl font-serif text-grapho-blue mb-4">
            La graphothérapie : Retrouver une écriture fluide et sereine, à tout âge
          </h2>
          <p className="text-grapho-gray">
            L'écriture est un outil essentiel de communication et d'apprentissage, mais pour certains, 
            elle peut devenir une source de fatigue, de douleur ou de frustration. Une écriture efficace 
            repose sur quatre critères fondamentaux : elle doit être lisible, suffisamment rapide, non 
            douloureuse et satisfaire celui qui l'écrit. Lorsqu'un de ces éléments fait défaut, cela 
            peut engendrer une perte de confiance et des difficultés scolaires ou professionnelles.
          </p>
        </motion.div>
        
        <WritingQuill text="Le bilan et la rééducation" />

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white p-6 rounded-lg shadow-md border-l-4 border-grapho-blue transform-gpu"
            onHoverStart={() => setHoveredCard(1)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <div className="flex items-center mb-4">
              <PenTool className="w-6 h-6 text-grapho-orange mr-3" />
              <h3 className="text-xl font-serif text-grapho-blue">Le Bilan</h3>
            </div>
            <motion.div
              animate={hoveredCard === 1 ? { scale: 1.05 } : { scale: 1 }}
              className="bg-grapho-cream p-4 rounded-lg mb-4"
            >
              <p className="text-grapho-gray">
                Une évaluation complète de l'écriture est réalisée à travers un bilan graphomoteur 
                personnalisé. Cette étape cruciale permet de comprendre l'origine des difficultés et 
                d'établir un programme de rééducation adapté aux besoins spécifiques de chaque personne.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white p-6 rounded-lg shadow-md border-l-4 border-grapho-orange transform-gpu"
            onHoverStart={() => setHoveredCard(2)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 text-grapho-blue mr-3" />
              <h3 className="text-xl font-serif text-grapho-blue">La Rééducation</h3>
            </div>
            <motion.div
              animate={hoveredCard === 2 ? { scale: 1.05 } : { scale: 1 }}
              className="bg-grapho-cream p-4 rounded-lg mb-4"
            >
              <p className="text-grapho-gray">
                Un programme personnalisé est mis en place, combinant exercices ciblés et activités 
                adaptées pour optimiser le geste d'écriture. Nous travaillons sur l'ergonomie, la 
                fluidité du mouvement et le confort graphique, permettant ainsi de développer une 
                écriture harmonieuse et efficiente.
              </p>
            </motion.div>
          </motion.div>
        </div>

        <WritingQuill text="Pour qui et pourquoi ?" className="transform rotate-2" />

        <motion.div 
          variants={cardVariants}
          whileHover="hover"
          className="mt-12 bg-white p-8 rounded-lg shadow-md border-l-4 border-grapho-orange relative overflow-hidden"
        >
          <motion.div
            className="absolute -right-16 -top-16 w-48 h-48 opacity-10"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Target className="w-full h-full text-grapho-orange" />
          </motion.div>

          <h3 className="text-2xl font-serif text-grapho-blue mb-6 flex items-center">
            <Brain className="w-6 h-6 text-grapho-orange mr-2" />
            Pourquoi consulter un graphothérapeute ?
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-grapho-cream p-6 rounded-lg"
            >
              <h4 className="text-xl font-serif text-grapho-blue mb-4">Pour qui ?</h4>
              <ul className="space-y-3 text-grapho-gray">
                <motion.li 
                  className="flex items-center"
                  whileHover={{ x: 10 }}
                >
                  <PenTool className="w-5 h-5 text-grapho-orange mr-2" />
                  Les enfants et adolescents rencontrant des difficultés d'écriture
                </motion.li>
                <motion.li 
                  className="flex items-center"
                  whileHover={{ x: 10 }}
                >
                  <PenTool className="w-5 h-5 text-grapho-blue mr-2" />
                  Les personnes présentant une dysgraphie ou une dyspraxie
                </motion.li>
                <motion.li 
                  className="flex items-center"
                  whileHover={{ x: 10 }}
                >
                  <PenTool className="w-5 h-5 text-grapho-orange mr-2" />
                  Les adultes souhaitant améliorer leur écriture
                </motion.li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-grapho-cream p-6 rounded-lg"
            >
              <h4 className="text-xl font-serif text-grapho-blue mb-4">Objectifs</h4>
              <ul className="space-y-3 text-grapho-gray">
                <motion.li 
                  className="flex items-center"
                  whileHover={{ x: 10 }}
                >
                  <PenTool className="w-5 h-5 text-grapho-orange mr-2" />
                  Développer une écriture lisible et efficace
                </motion.li>
                <motion.li 
                  className="flex items-center"
                  whileHover={{ x: 10 }}
                >
                  <PenTool className="w-5 h-5 text-grapho-blue mr-2" />
                  Retrouver confiance et aisance dans l'expression écrite
                </motion.li>
                <motion.li 
                  className="flex items-center"
                  whileHover={{ x: 10 }}
                >
                  <PenTool className="w-5 h-5 text-grapho-orange mr-2" />
                  Optimiser le geste graphique et réduire la fatigue
                </motion.li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        <WritingQuill text="Les résultats" className="transform -rotate-1" />

        <motion.div 
          variants={cardVariants}
          className="mt-8 bg-white p-8 rounded-lg shadow-md border-l-4 border-grapho-orange"
        >
          <h3 className="text-2xl font-serif text-grapho-blue mb-6">Résultats de la rééducation</h3>
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden shadow-md">
              <button 
                onClick={togglePlayPause}
                className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <div className="relative aspect-w-16 aspect-h-9">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={beforeAfterCases[currentImageIndex].image}
                    alt={beforeAfterCases[currentImageIndex].description}
                    className="max-w-full max-h-full object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
              </div>
            </div>
            <div className="bg-grapho-cream p-4 rounded-lg">
              <p className="text-grapho-gray italic text-center">
                Du premier trait hésitant à l'écriture libérée, chaque ligne raconte une histoire de 
                progrès et de confiance retrouvée.
              </p>
            </div>
          </div>
        </motion.div>

        <WritingQuill text="Découvrir plus" />

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="mt-8 flex justify-center"
        >
          <Link 
            to="/graphotherapie/exercices"
            className="inline-flex items-center bg-grapho-orange text-white px-8 py-4 rounded-lg hover:bg-grapho-blue transition-colors text-lg font-medium shadow-lg hover:shadow-xl transform transition-transform"
          >
            Découvrir les exercices et techniques
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}