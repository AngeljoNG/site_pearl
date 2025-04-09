import React from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, History, Star, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { supabase } from '../lib/supabaseClient';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
}

interface SearchResult {
  title: string;
  description: string;
  url: string;
  category: string;
  keywords?: string[];
  synonyms?: string[];
}

// Données statiques de recherche
const staticSearchData: SearchResult[] = [
  {
    title: "Graphothérapie",
    description: "Retrouvez une écriture fluide et sereine à tout âge",
    url: "/graphotherapie",
    category: "Services",
    keywords: ["écriture", "rééducation", "graphomotricité", "dysgraphie"],
    synonyms: ["rééducation écriture", "problèmes écriture", "difficulté écriture"]
  },
  {
    title: "Exercices de Graphothérapie",
    description: "Découvrez les exercices et techniques pour améliorer l'écriture",
    url: "/graphotherapie/exercices",
    category: "Services",
    keywords: ["exercices", "techniques", "pratique", "amélioration"]
  },
  {
    title: "Thérapies Cognitivo-Comportementales (TCC)",
    description: "Une approche scientifiquement validée pour comprendre et modifier les schémas de pensée",
    url: "/psychologie/tcc",
    category: "Psychologie",
    keywords: ["TCC", "thérapie", "comportement", "cognition"],
    synonyms: ["thérapie comportementale", "thérapie cognitive"]
  },
  {
    title: "RITMO®",
    description: "Une méthode innovante pour le traitement des traumatismes",
    url: "/psychologie/ritmo",
    category: "Psychologie",
    keywords: ["RITMO", "traumatisme", "EMDR", "thérapie"],
    synonyms: ["traitement trauma", "thérapie trauma"]
  },
  {
    title: "Hypnose Thérapeutique",
    description: "Une approche douce pour accéder à vos ressources intérieures",
    url: "/psychologie/hypnose",
    category: "Psychologie",
    keywords: ["hypnose", "relaxation", "thérapie", "bien-être"],
    synonyms: ["hypnothérapie", "séance hypnose"]
  },
  {
    title: "Quelle approche thérapeutique ?",
    description: "Découvrez quelle approche correspond le mieux à vos besoins",
    url: "/psychologie/quelle-approche",
    category: "Psychologie",
    keywords: ["thérapie", "approche", "méthode", "accompagnement"]
  },
  {
    title: "Domaines d'intervention",
    description: "Anxiété, stress, dépression, traumatismes et autres domaines d'intervention",
    url: "/psychologie/domaines-intervention",
    category: "Psychologie",
    keywords: ["anxiété", "stress", "dépression", "trauma", "phobie"],
    synonyms: ["troubles", "problèmes", "difficultés"]
  },
  {
    title: "Collaboration DysMoi",
    description: "Structure dédiée à la détection et l'accompagnement des neurodiversités",
    url: "/collaboration",
    category: "Collaborations",
    keywords: ["DysMoi", "neurodiversité", "troubles DYS", "apprentissage"],
    synonyms: ["neuroatypie", "troubles apprentissage"]
  },
  {
    title: "Réseau REALISM",
    description: "Accompagnement psychologique précoce pour les jeunes de 0 à 23 ans",
    url: "/collaboration",
    category: "Collaborations",
    keywords: ["REALISM", "jeunes", "accompagnement", "psychologie"],
    synonyms: ["aide psychologique", "soutien jeunes"]
  },
  {
    title: "Contact",
    description: "Prenez rendez-vous ou contactez-moi pour plus d'informations",
    url: "/contact",
    category: "Contact",
    keywords: ["rendez-vous", "contact", "consultation", "information"],
    synonyms: ["prise de rendez-vous", "consultation"]
  }
];

const fuse = new Fuse(staticSearchData, {
  keys: [
    { name: 'title', weight: 1 },
    { name: 'description', weight: 0.8 },
    { name: 'keywords', weight: 0.9 },
    { name: 'category', weight: 0.6 },
    { name: 'synonyms', weight: 0.9 }
  ],
  threshold: 0.3,
  includeScore: true,
  ignoreLocation: true,
  useExtendedSearch: true
});

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 5;

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [search, setSearch] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [blogResults, setBlogResults] = React.useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Charger les recherches récentes depuis localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Fonction pour rechercher dans les articles du blog
  const searchBlogPosts = async (searchTerm: string) => {
    try {
      setLoading(true);
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('id, title, excerpt')
        .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convertir les résultats du blog en format SearchResult
      const blogSearchResults: SearchResult[] = (posts || []).map(post => ({
        title: post.title,
        description: post.excerpt,
        url: `/blog/${post.id}`,
        category: 'Articles du Blog'
      }));

      setBlogResults(blogSearchResults);
    } catch (error) {
      console.error('Erreur lors de la recherche dans le blog:', error);
      setBlogResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Effectuer la recherche
  React.useEffect(() => {
    if (search) {
      // Recherche dans les données statiques
      const staticResults = fuse.search(search).map(result => result.item);
      setResults(staticResults);

      // Recherche dans les articles du blog
      searchBlogPosts(search);
    } else {
      setResults([]);
      setBlogResults([]);
    }
  }, [search]);

  const addToRecentSearches = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)]
      .slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSelect = (url: string, term?: string) => {
    if (term) {
      addToRecentSearches(term);
    }
    navigate(url);
    onClose();
    setSearch('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Combiner les résultats statiques et du blog
  const allResults = [...results, ...blogResults];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            className="max-w-2xl w-full mx-auto mt-20 bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <Command className="w-full">
              <div className="flex items-center border-b border-gray-100 p-4">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  ref={inputRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 outline-none text-lg"
                  placeholder="Rechercher..."
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                {search === '' && recentSearches.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between px-2 py-1">
                      <div className="text-sm font-medium text-gray-500 flex items-center">
                        <History className="w-4 h-4 mr-1" />
                        Recherches récentes
                      </div>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Effacer
                      </button>
                    </div>
                    <div className="mt-1">
                      {recentSearches.map((term) => (
                        <Command.Item
                          key={term}
                          onSelect={() => setSearch(term)}
                          className="px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center text-sm text-gray-600"
                        >
                          {term}
                        </Command.Item>
                      ))}
                    </div>
                  </div>
                )}

                {loading ? (
                  <div className="py-14 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nature-500 mx-auto mb-4"></div>
                    Recherche en cours...
                  </div>
                ) : allResults.length === 0 && search !== '' ? (
                  <div className="py-14 text-center text-gray-500">
                    Aucun résultat trouvé pour "{search}"
                  </div>
                ) : allResults.length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(
                      allResults.reduce((acc, item) => {
                        if (!acc[item.category]) {
                          acc[item.category] = [];
                        }
                        acc[item.category].push(item);
                        return acc;
                      }, {} as Record<string, SearchResult[]>)
                    ).map(([category, items]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-sm font-medium text-gray-500 flex items-center">
                          {category === 'Articles du Blog' ? (
                            <BookOpen className="w-4 h-4 mr-1" />
                          ) : (
                            <Star className="w-4 h-4 mr-1" />
                          )}
                          {category}
                        </div>
                        <div className="mt-1">
                          {items.map((item) => (
                            <Command.Item
                              key={item.url}
                              onSelect={() => handleSelect(item.url, search)}
                              className="px-4 py-3 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center justify-between group"
                            >
                              <div>
                                <div className="font-medium">{item.title}</div>
                                <div className="text-sm text-gray-500">
                                  {item.description}
                                </div>
                                {item.keywords && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {item.keywords.map(keyword => (
                                      <span
                                        key={keyword}
                                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                                      >
                                        {keyword}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                            </Command.Item>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-14 text-center text-gray-500">
                    Commencez à taper pour rechercher...
                  </div>
                )}
              </Command.List>

              <div className="p-4 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                  Appuyez sur <kbd className="px-2 py-1 bg-gray-100 rounded">↵</kbd> pour sélectionner
                </div>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}