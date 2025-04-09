import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TCCDetails() {
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
              src="/tcc.jpg"
              alt="Thérapies Cognitivo-Comportementales"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center mb-6">
            <Brain className="w-8 h-8 text-nature-400 mr-4" />
            <h2 className="text-3xl font-serif text-nature-500 m-0">Les Thérapies Cognitivo-Comportementales (TCC) : une approche concrète et efficace</h2>
          </div>

          <div className="space-y-6">
            <p className="text-lg text-nature-500">
              Les Thérapies Cognitivo-Comportementales (TCC) sont des thérapies brèves et structurées qui aident à mieux comprendre le lien entre nos pensées, nos émotions et nos comportements. L'objectif est d'identifier les schémas de pensée ou les habitudes qui entretiennent une souffrance, et de les modifier progressivement à l'aide de stratégies adaptées.
            </p>

            <p className="text-lg text-nature-500">
              Cette approche repose sur des techniques validées scientifiquement et est particulièrement efficace pour traiter l'anxiété, la dépression, les phobies, les troubles obsessionnels compulsifs (TOC), le stress, les troubles du sommeil, et bien d'autres difficultés du quotidien.
            </p>

            <div className="bg-nature-50 p-6 rounded-lg">
              <h3 className="text-xl font-serif text-nature-500 mb-4">Comment cela fonctionne ?</h3>
              <p className="text-nature-500 mb-4">
                Les TCC sont interactives et s'adaptent à chaque personne. Lors des séances, nous travaillons ensemble pour :
              </p>
              <ul className="space-y-3">
                {[
                  "Prendre conscience des pensées automatiques qui influencent les émotions et les comportements",
                  "Expérimenter de nouvelles façons de penser ou d'agir, en mettant en place des exercices concrets",
                  "Apprendre à mieux gérer ses émotions et ses réactions face aux situations difficiles",
                  "Développer des outils durables pour retrouver un équilibre et une meilleure qualité de vie"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-nature-400 mr-2 mt-1" />
                    <span className="text-nature-500">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-lg text-nature-500">
              Cette approche permet d'obtenir des résultats concrets en donnant à chacun des clés pour mieux gérer ses difficultés au quotidien.
            </p>

            <blockquote className="border-l-4 border-nature-400 pl-4 italic text-nature-500">
              "Changer sa façon de penser, c'est aussi changer sa façon de vivre."
            </blockquote>
          </div>
        </motion.div>
      </section>
    </main>
  );
}