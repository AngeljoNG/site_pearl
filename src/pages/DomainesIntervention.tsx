import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DomainesIntervention() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const domains = [
    {
      title: "Anxiété et stress",
      image: "/zen-stones-bamboo.jpg",
      description: "L'anxiété et le stress, ce sont ces vagues invisibles qui déferlent en silence, laissant le cœur s'emballer, l'esprit s'égarer et le souffle se raccourcir, même lorsque tout semble calme autour de soi. C'est une tempête intérieure que personne ne voit, mais que l'on ressent comme un poids qui étouffe et dérobe la paix. À travers une approche personnalisée combinant TCC, RITMO® et techniques de relaxation, nous travaillons ensemble pour identifier les sources de stress, développer des stratégies d'adaptation efficaces et retrouver un équilibre émotionnel."
    },
    {
      title: "Dépression",
      image: "/zen-water-drops.jpg",
      description: "La dépression, c'est comme marcher dans un brouillard épais où chaque pas pèse lourd, où la lumière paraît lointaine et les couleurs fanées. C'est sentir son énergie s'effriter, comme un souffle qui s'éteint lentement, laissant place à une fatigue qui dépasse le corps et envahit l'âme. Mon approche thérapeutique vise à vous aider à comprendre les mécanismes de la dépression, à retrouver progressivement l'énergie et le goût des choses, et à reconstruire une image positive de vous-même et de votre avenir."
    },
    {
      title: "Traumatismes",
      image: "/zen-stones-water.jpg",
      description: "Les traumatismes, ce sont des éclats du passé qui s'accrochent au présent, des blessures invisibles qui résonnent encore dans le silence, comme un écho persistant qu'on porte en soi, même lorsque tout semble calme autour. Grâce à des techniques spécialisées comme le RITMO®, nous travaillons en douceur pour apaiser les souvenirs douloureux, dépasser les blocages émotionnels et retrouver un sentiment de sécurité intérieure."
    },
    {
      title: "Phobies",
      image: "/zen-plumeria.jpg",
      description: "Ce sont des peurs démesurées qui se dressent comme des ombres géantes, où même un simple papillon peut devenir une tempête. À travers une approche progressive et respectueuse de votre rythme, nous utilisons des techniques comportementales et cognitives pour vous aider à comprendre et surmonter vos peurs, retrouvant ainsi une vie plus sereine et épanouie."
    },
    {
      title: "Troubles du sommeil",
      image: "/zen-fountain.jpg",
      description: "Ce sont des nuits sans repos, où les pensées s'enlacent comme des vagues déferlantes, empêchant le corps de trouver l'apaisement. Ensemble, nous explorerons les facteurs qui perturbent votre sommeil et mettrons en place des stratégies adaptées pour retrouver des nuits réparatrices et un rythme naturel de repos."
    },
    {
      title: "Difficultés relationnelles",
      image: "/zen-orchid.jpg",
      description: "Ce sont des ponts fragiles qui tremblent sous le poids des non-dits, des élans brisés par la peur d'être trop ou pas assez. La thérapie offre un espace pour comprendre les dynamiques relationnelles, améliorer la communication et développer des relations plus satisfaisantes et authentiques."
    },
    {
      title: "Burn Out",
      image: "/Zen_Pierre_Fleur.jpg",
      description: "C'est une flamme qui s'éteint doucement, épuisée d'avoir trop brillé, laissant place à un crépuscule où l'effort ne trouve plus d'écho. Notre travail thérapeutique vise à vous accompagner dans la reconstruction de vos ressources, la redéfinition de vos limites et la restauration d'un équilibre vie professionnelle-vie personnelle."
    },
    {
      title: "Troubles alimentaires",
      image: "/Zen_pierres.jpg",
      description: "Ce sont des batailles silencieuses avec soi-même, où chaque repas devient une épreuve, un dialogue complexe entre le corps et l'esprit. Qu'il s'agisse d'anorexie, de boulimie ou de compulsions alimentaires, nous travaillons ensemble pour comprendre les mécanismes sous-jacents, restaurer une relation saine à l'alimentation et développer une image corporelle plus positive."
    }
  ];

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
          className="space-y-8"
        >
          <div className="flex items-center mb-6">
            <Brain className="w-8 h-8 text-nature-400 mr-4" />
            <h2 className="text-3xl font-serif text-nature-500 m-0">Domaines d'intervention</h2>
          </div>

          <p className="text-lg text-nature-500">
            Chaque difficulté est unique et mérite une attention particulière. Mon approche intégrative me permet d'adapter les outils thérapeutiques à vos besoins spécifiques, vous accompagnant ainsi vers un mieux-être durable.
          </p>

          <div className="space-y-6">
            {domains.map((domain, index) => (
              <motion.div
                key={domain.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-nature-400 flex flex-col md:flex-row gap-6 overflow-hidden group hover:shadow-xl transition-shadow"
              >
                <div className="md:w-1/4 flex-shrink-0">
                  <div className="h-32 md:h-40 rounded-lg overflow-hidden">
                    <img
                      src={domain.image}
                      alt={domain.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-serif text-nature-500 mb-3 group-hover:text-nature-600 transition-colors">{domain.title}</h3>
                  <p className="text-nature-500 leading-relaxed">{domain.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}