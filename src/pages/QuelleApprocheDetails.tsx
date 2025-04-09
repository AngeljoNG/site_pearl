import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function QuelleApprocheDetails() {
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
              src="/zen-orchid.jpg"
              alt="Quelle approche thérapeutique"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center mb-6">
            <Users className="w-8 h-8 text-nature-400 mr-4" />
            <h2 className="text-3xl font-serif text-nature-500 m-0">Quelle approche thérapeutique ?</h2>
          </div>

          <p className="text-lg text-nature-500 mb-8">
            Chaque personne est unique, c'est pourquoi j'adapte mon approche thérapeutique en fonction
            de vos besoins spécifiques et de votre situation personnelle.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-nature-50 p-6 rounded-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-32 opacity-10">
                <img
                  src="/Bambou_FondTrans.jpg"
                  alt=""
                  className="h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-serif text-nature-500 flex items-center mb-4">
                  <Target className="w-6 h-6 text-nature-400 mr-3" />
                  Pour qui ?
                </h3>
                <ul className="space-y-3">
                  {[
                    "Adultes en questionnement",
                    "Adolescents en difficulté",
                    "Enfants et leur développement",
                    "Couples en crise",
                    "Familles en reconstruction"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-nature-400 mr-2 mt-1" />
                      <span className="text-nature-500">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-nature-50 p-6 rounded-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-32 opacity-10">
                <img
                  src="/Bambou_FondTrans.jpg"
                  alt=""
                  className="h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-serif text-nature-500 mb-4">Situations traitées</h3>
                <ul className="space-y-3">
                  {[
                    "Difficultés personnelles",
                    "Problèmes relationnels",
                    "Troubles émotionnels",
                    "Périodes de transition",
                    "Questionnements existentiels",
                    "Développement personnel"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-nature-400 mr-2 mt-1" />
                      <span className="text-nature-500">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-nature-50 p-6 rounded-lg mb-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-32 opacity-10">
              <img
                src="/Bambou_FondTrans.jpg"
                alt=""
                className="h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-serif text-nature-500 mb-4">Mon approche</h3>
              <ol className="space-y-4">
                {[
                  "Écoute bienveillante et sans jugement",
                  "Évaluation personnalisée des besoins",
                  "Choix de la méthode thérapeutique adaptée",
                  "Accompagnement sur mesure",
                  "Suivi régulier des progrès",
                  "Ajustement continu de l'approche"
                ].map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-6 h-6 bg-nature-400 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-nature-500">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="bg-nature-100 p-6 rounded-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-32 opacity-10">
              <img
                src="/Bambou_FondTrans.jpg"
                alt=""
                className="h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-serif text-nature-500 mb-4">Mes engagements</h3>
              <ul className="space-y-3">
                {[
                  "Respect de votre rythme et de vos besoins",
                  "Confidentialité absolue",
                  "Approche professionnelle et éthique",
                  "Formation continue et supervision",
                  "Adaptation des outils thérapeutiques"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-nature-400 mr-2 mt-1" />
                    <span className="text-nature-500">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}