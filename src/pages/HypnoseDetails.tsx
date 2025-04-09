import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Target, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HypnoseDetails() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        to="/psychologie"
        className="inline-flex items-center text-nature-500 hover:text-nature-600 mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à la psychologie
      </Link>

      <section className="prose lg:prose-lg max-w-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-nature-400"
        >
          <div className="h-64 -mx-8 -mt-8 mb-8 overflow-hidden">
            <img
              src="/zen-fountain.jpg"
              alt="Hypnose Thérapeutique"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center mb-6">
            <Leaf className="w-8 h-8 text-nature-400 mr-4" />
            <h2 className="text-3xl font-serif text-nature-500 m-0">L'hypnose : Un outil de relaxation et de gestion du stress</h2>
          </div>

          <div className="space-y-6">
            <p className="text-lg text-nature-500">
              L'hypnose est avant tout un espace de détente et de sérénité, où l'esprit peut souffler et le corps se relâcher. Contrairement aux idées reçues, il ne s'agit ni d'un état de sommeil ni d'une perte de contrôle, mais plutôt d'un moment de pleine conscience, où l'on accède à ses ressources intérieures pour mieux gérer le stress, l'anxiété ou les tensions du quotidien.
            </p>

            <div className="bg-nature-50 p-6 rounded-lg">
              <h3 className="text-xl font-serif text-nature-500 mb-4">Un outil complémentaire aux TCC et au RITMO®</h3>
              <p className="text-nature-500 mb-4">
                Dans ma pratique, j'utilise l'hypnose principalement comme un outil de relaxation profonde, qui favorise l'apaisement et le recentrage. Elle permet de mieux accueillir ses émotions, de prendre du recul face aux difficultés et d'aborder les défis avec plus de calme et de clarté.
              </p>
              <p className="text-nature-500">
                Associée aux TCC (Thérapies Cognitivo-Comportementales), elle aide à modifier certains schémas de pensée négatifs en créant un état de disponibilité mentale propice au changement. Avec le RITMO®, elle facilite le travail sur les souvenirs traumatiques en apportant un cadre sécurisant et apaisant.
              </p>
            </div>

            <div className="bg-nature-50 p-6 rounded-lg">
              <h3 className="text-xl font-serif text-nature-500 mb-4">Quels bienfaits attendre de l'hypnose ?</h3>
              <ul className="space-y-3">
                {[
                  "Diminuer le stress et l'anxiété",
                  "Améliorer la gestion des émotions",
                  "Favoriser un état de sérénité et de bien-être",
                  "Créer un espace de détente profonde"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-nature-400 mr-2 mt-1" />
                    <span className="text-nature-500">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-lg text-nature-500">
              L'hypnose n'est pas une solution miracle, mais un outil puissant et bienveillant, qui accompagne chacun à son rythme vers un mieux-être.
            </p>

            <blockquote className="border-l-4 border-nature-400 pl-4 italic text-nature-500">
              "Un moment pour soi, pour respirer, apaiser l'esprit et avancer plus sereinement."
            </blockquote>
          </div>
        </motion.div>
      </section>
    </main>
  );
}