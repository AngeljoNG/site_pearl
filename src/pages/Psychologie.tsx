import React, { useState } from 'react';
import { Brain, Heart, Leaf, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DomainModal } from '../components/DomainModal';

export function Psychologie() {
  const [selectedDomain, setSelectedDomain] = useState<{
    title: string;
    description: string;
    image: string;
  } | null>(null);

  const domains = [
    {
      title: "Anxiété et stress",
      image: "/zen-stones-water.jpg",
      description: "L'anxiété et le stress, ce sont ces vagues invisibles qui déferlent en silence, laissant le cœur s'emballer, l'esprit s'égarer et le souffle se raccourcir, même lorsque tout semble calme autour de soi. C'est une tempête intérieure que personne ne voit, mais que l'on ressent comme un poids qui étouffe et dérobe la paix.\n\nÀ travers une approche personnalisée combinant TCC, RITMO® et techniques de relaxation, nous travaillons ensemble pour identifier les sources de stress, développer des stratégies d'adaptation efficaces et retrouver un équilibre émotionnel."
    },
    {
      title: "Dépression",
      image: "/zen-water-drops.jpg",
      description: "La dépression, c'est comme marcher dans un brouillard épais où chaque pas pèse lourd, où la lumière paraît lointaine et les couleurs fanées. C'est sentir son énergie s'effriter, comme un souffle qui s'éteint lentement, laissant place à une fatigue qui dépasse le corps et envahit l'âme.\n\nMon approche thérapeutique vise à vous aider à comprendre les mécanismes de la dépression, à retrouver progressivement l'énergie et le goût des choses, et à reconstruire une image positive de vous-même et de votre avenir."
    },
    {
      title: "Traumatismes",
      image: "/Zen_pierres.jpg",
      description: "Les traumatismes, ce sont des éclats du passé qui s'accrochent au présent, des blessures invisibles qui résonnent encore dans le silence, comme un écho persistant qu'on porte en soi, même lorsque tout semble calme autour.\n\nGrâce à des techniques spécialisées comme le RITMO®, nous travaillons en douceur pour apaiser les souvenirs douloureux, dépasser les blocages émotionnels et retrouver un sentiment de sécurité intérieure."
    },
    {
      title: "Phobies",
      image: "/zen-plumeria.jpg",
      description: "Ce sont des peurs démesurées qui se dressent comme des ombres géantes, où même un simple papillon peut devenir une tempête.\n\nÀ travers une approche progressive et respectueuse de votre rythme, nous utilisons des techniques comportementales et cognitives pour vous aider à comprendre et surmonter vos peurs, retrouvant ainsi une vie plus sereine et épanouie."
    },
    {
      title: "Troubles du sommeil",
      image: "/zen-fountain.jpg",
      description: "Ce sont des nuits sans repos, où les pensées s'enlacent comme des vagues déferlantes, empêchant le corps de trouver l'apaisement.\n\nEnsemble, nous explorerons les facteurs qui perturbent votre sommeil et mettrons en place des stratégies adaptées pour retrouver des nuits réparatrices et un rythme naturel de repos."
    },
    {
      title: "Difficultés relationnelles",
      image: "/zen-orchid.jpg",
      description: "Ce sont des ponts fragiles qui tremblent sous le poids des non-dits, des élans brisés par la peur d'être trop ou pas assez.\n\nLa thérapie offre un espace pour comprendre les dynamiques relationnelles, améliorer la communication et développer des relations plus satisfaisantes et authentiques."
    },
    {
      title: "Burn Out",
      image: "/Zen_Pierre_Fleur.jpg",
      description: "C'est une flamme qui s'éteint doucement, épuisée d'avoir trop brillé, laissant place à un crépuscule où l'effort ne trouve plus d'écho.\n\nNotre travail thérapeutique vise à vous accompagner dans la reconstruction de vos ressources, la redéfinition de vos limites et la restauration d'un équilibre vie professionnelle-vie personnelle."
    },
    {
      title: "Troubles alimentaires",
      image: "/zen-stones-bamboo.jpg",
      description: "Ce sont des batailles silencieuses avec soi-même, où chaque repas devient une épreuve, un dialogue complexe entre le corps et l'esprit.\n\nQu'il s'agisse d'anorexie, de boulimie ou de compulsions alimentaires, nous travaillons ensemble pour comprendre les mécanismes sous-jacents, restaurer une relation saine à l'alimentation et développer une image corporelle plus positive."
    }
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif text-nature-500 mb-12">Psychologie Clinique</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Link to="/psychologie/tcc" className="no-underline group">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-nature-400"
          >
            <div className="pt-6">
              <div className="h-48 overflow-hidden">
                <img
                  src="/tcc.jpg"
                  alt="TCC"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Brain className="w-6 h-6 text-nature-400 mr-3" />
                <h2 className="text-xl font-serif text-nature-500">Thérapies Cognitivo-Comportementales</h2>
              </div>
              <p className="text-nature-500">
                Les TCC permettent de comprendre et modifier les pensées et comportements qui maintiennent la souffrance psychologique. Particulièrement efficaces pour l'anxiété, la dépression, et les phobies.
              </p>
              <div className="mt-4 flex items-center text-nature-400 group-hover:text-nature-600">
                <span>En savoir plus</span>
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </motion.div>
        </Link>

        <Link to="/psychologie/ritmo" className="no-underline group">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-nature-400"
          >
            <div className="pt-6">
              <div className="h-48 overflow-hidden">
                <img
                  src="/zen-water-drops.jpg"
                  alt="RITMO"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Heart className="w-6 h-6 text-nature-400 mr-3" />
                <h2 className="text-xl font-serif text-nature-500">RITMO®</h2>
              </div>
              <p className="text-nature-500">
                Technique proche de l'EMDR, le RITMO® aide à traiter les traumatismes et les blocages émotionnels à travers des mouvements oculaires guidés et un travail sur les émotions.
              </p>
              <div className="mt-4 flex items-center text-nature-400 group-hover:text-nature-600">
                <span>En savoir plus</span>
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </motion.div>
        </Link>

        <Link to="/psychologie/hypnose" className="no-underline group">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-nature-400"
          >
            <div className="pt-6">
              <div className="h-48 overflow-hidden">
                <img
                  src="/zen-fountain.jpg"
                  alt="Hypnose"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Leaf className="w-6 h-6 text-nature-400 mr-3" />
                <h2 className="text-xl font-serif text-nature-500">Hypnose Thérapeutique</h2>
              </div>
              <p className="text-nature-500">
                L'hypnose thérapeutique permet d'accéder aux ressources inconscientes pour surmonter les difficultés, gérer le stress et développer la confiance en soi.
              </p>
              <div className="mt-4 flex items-center text-nature-400 group-hover:text-nature-600">
                <span>En savoir plus</span>
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </motion.div>
        </Link>

        <Link to="/psychologie/quelle-approche" className="no-underline group">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-nature-400"
          >
            <div className="pt-6">
              <div className="h-48 overflow-hidden">
                <img
                  src="/zen-orchid.jpg"
                  alt="Quelle approche"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-nature-400 mr-3" />
                <h2 className="text-xl font-serif text-nature-500">Quelle approche thérapeutique ?</h2>
              </div>
              <p className="text-nature-500">
                J'accompagne les adultes, adolescents et enfants dans leurs difficultés psychologiques, en adaptant l'approche thérapeutique à chaque situation.
              </p>
              <div className="mt-4 flex items-center text-nature-400 group-hover:text-nature-600">
                <span>En savoir plus</span>
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-serif text-nature-500 mb-8">Domaines d'intervention</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {domains.map((domain, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border-l-4 border-nature-400"
              onClick={() => setSelectedDomain(domain)}
            >
              <div className="pt-4">
                <div className="h-32 overflow-hidden">
                  <img
                    src={domain.image}
                    alt={domain.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-nature-500 font-medium text-center">{domain.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {selectedDomain && (
        <DomainModal
          isOpen={!!selectedDomain}
          onClose={() => setSelectedDomain(null)}
          title={selectedDomain.title}
          description={selectedDomain.description}
          image={selectedDomain.image}
        />
      )}
    </main>
  );
}