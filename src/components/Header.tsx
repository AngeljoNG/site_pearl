import React, { useState, useEffect } from 'react';
import { Menu, LogIn, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

export function Header() {
  const location = useLocation();
  const [session, setSession] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const menuItems = [
    { path: '/', label: 'Accueil' },
    { path: '/psychologie', label: 'Psychologie' },
    { path: '/graphotherapie', label: 'Graphothérapie' },
    { path: '/collaboration', label: 'Collaboration' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
    ...(session ? [{ path: '/admin/blog', label: 'Admin', icon: LogIn }] : [])
  ];

  return (
    <header className="sticky top-0 bg-nature-200/95 backdrop-blur-sm shadow-md relative z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center text-center relative">
          <div 
            className="absolute right-0 top-0 h-full w-96 opacity-10 transform scale-150 origin-right"
            style={{
              maskImage: 'linear-gradient(to left, black, transparent)',
              WebkitMaskImage: 'linear-gradient(to left, black, transparent)'
            }}
          >
            <img
              src="/Bambou_FondTrans.jpg"
              alt=""
              className="h-full w-full object-cover transform -scale-x-100"
              style={{
                filter: 'contrast(150%) brightness(150%)'
              }}
            />
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-serif text-nature-500"
          >
            Pearl Nguyen Duy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-base md:text-lg text-nature-500"
          >
            Psychologue – Thérapeute – Graphothérapeute
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-1 text-sm md:text-base text-nature-500 flex items-center"
          >
            <Menu className="w-4 h-4 mr-1" /> Faimes, Liège
          </motion.p>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-center mt-4">
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative p-3 rounded-full bg-nature-300/80 backdrop-blur-sm text-white hover:bg-nature-400 transition-all duration-300 shadow-lg"
            whileTap={{ scale: 0.95 }}
            aria-label="Menu"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              className="md:hidden mt-4 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border border-nature-100 overflow-hidden"
            >
              <nav className="py-2">
                <ul className="space-y-1">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link 
                        to={item.path}
                        className={`block px-6 py-3 ${
                          isActive(item.path) 
                            ? 'bg-nature-50 text-nature-700' 
                            : 'text-nature-500 hover:bg-nature-50 active:bg-nature-100'
                        } transition-colors`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="flex items-center">
                          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                          {item.label}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Navigation */}
        <nav className="hidden md:block mt-6">
          <ul className="flex justify-center space-x-8">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className="relative block"
                >
                  <div className="relative px-4 py-2">
                    <motion.span
                      className={`relative z-10 font-medium flex items-center ${
                        isActive(item.path) ? 'text-nature-700' : 'text-nature-500'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                      {item.label}
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-nature-300 rounded-full"
                      initial={false}
                      animate={{
                        scale: isActive(item.path) ? 1 : 0,
                        opacity: isActive(item.path) ? 1 : 0
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-nature-100 rounded-full"
                      initial={false}
                      whileHover={{
                        scale: 1,
                        opacity: 1
                      }}
                      animate={{
                        scale: 0,
                        opacity: 0
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}