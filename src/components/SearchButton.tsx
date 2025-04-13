import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchDialog } from './SearchDialog';

export function SearchButton() {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-nature-400 text-white p-3 rounded-full shadow-lg hover:bg-nature-500 transition-colors flex items-center gap-2 group z-40"
      >
        <Search className="w-5 h-5" />
        <span className="hidden md:group-hover:inline">
          Rechercher
          <span className="ml-2 text-sm opacity-75">⌘K</span>
        </span>
      </motion.button>
      <SearchDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}