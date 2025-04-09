import React from 'react';
import { motion } from 'framer-motion';

export function MentionsLegales() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="prose lg:prose-lg">
        <h2 className="text-3xl font-serif text-nature-500">Mentions Légales</h2>

        <div className="space-y-8 mt-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md relative border-l-4 border-nature-400 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div className="absolute right-0 top-0 h-full w-32 opacity-10">
              <img
                src="/Bambou_FondTrans.jpg"
                alt=""
                className="h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-serif text-nature-500">Identité du praticien</h3>
              <div className="flex flex-col md:flex-row gap-8 items-start mt-4">
                <div className="flex-grow">
                  <p className="text-nature-500">
                    <span className="text-2xl font-bold text-nature-600 block mb-2">Pearl Nguyen Duy</span>
                    <span className="text-lg font-medium text-nature-500 block mb-2">
                      Psychologue Clinicienne - <span className="text-nature-400">Thérapeute</span> - <span className="text-nature-600">Graphothérapeute</span>
                    </span>
                    <span className="italic text-nature-400">
                      Rue de les Waleffes 27<br />
                      <span className="text-sm">4317</span> <span className="text-base">Faimes</span><br />
                      0495 86 38 10<br />
                      Belgique
                    </span>
                  </p>
                </div>
                <div className="w-48">
                  <img
                    src="/stamp.jpg"
                    alt="Cachet professionnel"
                    className="w-full rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {[
            {
              title: "Qualifications professionnelles",
              delay: 0.2,
              content: (
                <p className="text-nature-500">
                  <span className="block py-1 hover:translate-x-2 transition-transform duration-300">• Master en psychologie clinique - Université de Liège</span>
                  <span className="block py-1 hover:translate-x-2 transition-transform duration-300">• Psychologue agréée par la Commission des Psychologues</span>
                  <span className="block py-1 hover:translate-x-2 transition-transform duration-300">• Numéro d'agrément : <span className="font-medium">7-05774-95</span></span>
                  <span className="block py-1 hover:translate-x-2 transition-transform duration-300">• Compy: <span className="font-medium">81 22223 20</span></span>
                  <span className="block py-1 hover:translate-x-2 transition-transform duration-300">• Inscrite à la Commission des Psychologues de Belgique</span>
                </p>
              )
            },
            {
              title: "Contact professionnel",
              delay: 0.3,
              content: (
                <p className="text-nature-500">
                  <span className="block py-1 hover:translate-x-2 transition-transform duration-300">Téléphone : +32 495 86 38 10</span>
                  <span className="block py-1 hover:translate-x-2 transition-transform duration-300">Email : pearl@nguyen.eu</span>
                </p>
              )
            },
            {
              title: "Protection des données (RGPD)",
              delay: 0.4,
              content: (
                <>
                  <p className="text-nature-500">
                    En tant que psychologue, je suis tenue au secret professionnel (article 458 du Code pénal belge). Les informations que vous me confiez sont strictement confidentielles et ne sont en aucun cas partagées avec des tiers.
                  </p>
                  <p className="text-nature-500 mt-4">
                    Conformément au Règlement Général sur la Protection des Données (RGPD) :
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-nature-500">
                    <li className="py-1 hover:translate-x-2 transition-transform duration-300">Vos données personnelles sont collectées uniquement dans le cadre du suivi thérapeutique</li>
                    <li className="py-1 hover:translate-x-2 transition-transform duration-300">Vous disposez d'un droit d'accès, de rectification et de suppression de vos données</li>
                    <li className="py-1 hover:translate-x-2 transition-transform duration-300">Les notes prises durant les séances sont conservées de manière sécurisée</li>
                    <li className="py-1 hover:translate-x-2 transition-transform duration-300">Aucune donnée n'est partagée avec des tiers sans votre consentement explicite</li>
                  </ul>
                </>
              )
            },
            {
              title: "Cadre légal de la pratique",
              delay: 0.5,
              content: (
                <p className="text-nature-500">
                  La pratique est exercée dans le respect du code de déontologie des psychologues belges, sous la supervision de la Commission des Psychologues. Les consultations sont soumises à la législation belge en vigueur.
                </p>
              )
            },
            {
              title: "Propriété intellectuelle",
              delay: 0.6,
              content: (
                <p className="text-nature-500">
                  L'ensemble du contenu de ce site (textes, images, logo) est protégé par le droit d'auteur. Toute reproduction ou utilisation sans autorisation préalable est interdite.
                </p>
              )
            }
          ].map((section, index) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: section.delay }}
              className="bg-white p-6 rounded-lg shadow-md relative border-l-4 border-nature-400 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="absolute right-0 top-0 h-full w-32 opacity-10">
                <img
                  src="/Bambou_FondTrans.jpg"
                  alt=""
                  className="h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-serif text-nature-500">{section.title}</h3>
                <div className="mt-4">
                  {section.content}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}