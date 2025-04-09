import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Target, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RITMODetails() {
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
              src="/zen-water-drops.jpg"
              alt="RITMO Thérapie"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center mb-6">
            <Droplets className="w-8 h-8 text-nature-400 mr-4" />
            <h2 className="text-3xl font-serif text-nature-500 m-0">Le RITMO® : Une technique douce pour surmonter les traumatismes</h2>
          </div>

          <div className="space-y-6">
            <p className="text-lg text-nature-500">
              Le RITMO® (Retraitement de l'Information Traumatique par les Mouvements Oculaires) est une méthode inspirée de l'EMDR (Eye Movement Desensitization and Reprocessing). Mise au point par Lili Ruggieri, elle combine les stimulations bilatérales et des techniques de PNL (Programmation Neuro-Linguistique) pour aider à digérer des souvenirs douloureux et à apaiser leurs impacts émotionnels.
            </p>

            <div className="bg-nature-50 p-6 rounded-lg">
              <h3 className="text-xl font-serif text-nature-500 mb-4">Comment cela fonctionne ?</h3>
              <p className="text-nature-500 mb-4">
                Lorsqu'un événement traumatisant survient, le cerveau peut mal stocker l'information, laissant des traces émotionnelles vives qui ressurgissent sous forme de stress, d'angoisses ou de blocages. Le RITMO® aide à retraiter ces souvenirs en stimulant les capacités naturelles du cerveau à intégrer et dépasser l'événement.
              </p>
              <p className="text-nature-500">
                Cette approche douce et respectueuse permet de travailler sur les émotions difficiles tout en restant dans un cadre sécurisant et bienveillant. Le processus s'adapte au rythme de chacun, permettant une évolution progressive vers un mieux-être.
              </p>
            </div>

            <div className="bg-nature-50 p-6 rounded-lg">
              <h3 className="text-xl font-serif text-nature-500 mb-4">Pour qui et pour quoi ?</h3>
              <p className="text-nature-500 mb-4">Le RITMO® est particulièrement efficace pour :</p>
              <ul className="space-y-3">
                {[
                  "Les traumatismes (accidents, violences, deuils, etc.)",
                  "Les phobies, les angoisses et le stress post-traumatique",
                  "Le manque de confiance en soi ou les blocages émotionnels"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-nature-400 mr-2 mt-1" />
                    <span className="text-nature-500">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-lg text-nature-500">
              C'est une approche douce, rapide et efficace, qui permet à chacun de se libérer de certaines empreintes du passé et d'avancer avec plus de sérénité.
            </p>

            <blockquote className="border-l-4 border-nature-400 pl-4 italic text-nature-500">
              "On ne peut pas changer le passé, mais on peut alléger son poids sur notre présent."
            </blockquote>
          </div>
        </motion.div>
      </section>
    </main>
  );
}