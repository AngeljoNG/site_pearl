import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building, Heart } from 'lucide-react';

export function Collaboration() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="max-w-none">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-serif text-nature-500 mb-8"
        >
          Collaborations Professionnelles
        </motion.h2>
        
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-nature-400 w-full"
          >
            <div className="flex items-center mb-6">
              <Building className="w-8 h-8 text-nature-400 mr-4" />
              <h3 className="text-2xl font-serif text-nature-500">Réseau REALISM</h3>
            </div>

            <div className="flex justify-center mb-8">
              <img
                src="/RealismLogo.png"
                alt="Logo REALISM"
                className="h-32 object-contain"
              />
            </div>

            <div className="space-y-6">
              <p className="text-nature-500">
                En tant que psychologue de première ligne au sein du réseau REALISM, j'offre un accompagnement psychologique précoce et accessible aux jeunes de 0 à 23 ans. Ce dispositif permet d'aider les jeunes à surmonter leurs difficultés émotionnelles, relationnelles ou scolaires.
              </p>
              <p className="text-nature-500">
                L'objectif est de proposer une écoute bienveillante, un soutien adapté et des outils concrets pour favoriser leur bien-être et leur épanouissement.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-nature-50 p-6 rounded-lg">
                  <h4 className="text-lg font-serif text-nature-500 mb-4">Services proposés :</h4>
                  <ul className="list-disc pl-5 space-y-2 text-nature-500">
                    <li>Accompagnement psychologique de première ligne</li>
                    <li>Intervention précoce et prévention</li>
                    <li>Soutien aux jeunes et aux familles</li>
                    <li>Orientation vers des services spécialisés si nécessaire</li>
                  </ul>
                </div>
                <div className="bg-nature-50 p-6 rounded-lg">
                  <h4 className="text-lg font-serif text-nature-500 mb-4">Accessibilité financière :</h4>
                  <div className="space-y-3 text-nature-500">
                    <p>
                      Ce dispositif sera proposé en priorité aux personnes fragilisées financièrement. Nous vous remercions de votre compréhension.
                    </p>
                    <p className="font-medium">
                      Vous faites partie des personnes qui ont besoin d'un petit coup de pouce financier ?
                    </p>
                    <p className="italic">
                      Mentionnez-le lors de votre prise de rendez-vous.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-nature-400 w-full"
          >
            <div className="flex items-center mb-2">
              <Heart className="w-8 h-8 text-nature-400 mr-4" />
              <h3 className="text-2xl font-serif text-nature-500">DysMoi</h3>
            </div>

            <div className="flex justify-center my-2">
              <img
                src="/DysMoi_Logo.png"
                alt="Logo DysMoi"
                className="h-48 object-contain"
              />
            </div>

            <div className="space-y-6">
              <p className="text-nature-500">
                "Dys-Moi" est une structure dédiée à la détection et l'accompagnement des neurodiversités. Notre collaboration permet d'offrir un accompagnement spécialisé et global pour les troubles DYS et les difficultés d'apprentissage, en mettant l'accent sur une approche personnalisée qui respecte la singularité de chaque personne.
              </p>

              <div className="bg-nature-50 p-6 rounded-lg space-y-4">
                <p className="text-nature-500">
                  Cette structure unique propose :
                </p>
                <ul className="list-disc pl-5 space-y-2 text-nature-500">
                  <li>Une détection juste et globale des troubles des apprentissages</li>
                  <li>Un accompagnement adapté à tous les âges</li>
                  <li>Une équipe pluridisciplinaire engagée et bienveillante</li>
                  <li>Une approche respectueuse des valeurs et des singularités de chacun</li>
                  <li>Un soutien spécialisé pour les personnes neuroatypiques</li>
                </ul>
              </div>

              <blockquote className="border-l-4 border-nature-300 pl-4 italic text-nature-500">
                "Dys-Moi, c'est une équipe de thérapeutes soucieux du bien-être des personnes neuroatypiques, engagée dans le respect des valeurs et des singularités plurielles."
              </blockquote>

              <div className="bg-nature-50 p-6 rounded-lg">
                <h4 className="text-lg font-serif text-nature-500 mb-4">Notre collaboration permet :</h4>
                <ul className="list-disc pl-5 space-y-2 text-nature-500">
                  <li>Une prise en charge complète des troubles DYS</li>
                  <li>Un accompagnement personnalisé à chaque étape</li>
                  <li>Un suivi adapté aux besoins spécifiques</li>
                  <li>Une approche multidisciplinaire coordonnée</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}