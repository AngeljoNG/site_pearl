import React, { useState, useEffect } from 'react';
import { Menu, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

export function Header() {
  const location = useLocation();
  const [session, setSession] = useState<any>(null);
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

  return (
    <header className="bg-nature-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center text-center relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-32 w-32 opacity-5">
            <img
              src="/Bambou_FondTrans.jpg"
              alt=""
              className="h-full object-cover"
            />
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-serif text-nature-500"
          >
            Pearl Nguyen Duy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-lg text-nature-500"
          >
            Psychologue – Thérapeute – Graphothérapeute
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-1 text-nature-500 flex items-center"
          >
            <Menu className="w-4 h-4 mr-1" /> Faimes, Liège
          </motion.p>
        </div>
        <nav className="mt-6">
          <ul className="flex justify-center space-x-8">
            {[
              { path: '/', label: 'Accueil' },
              { path: '/psychologie', label: 'Psychologie' },
              { path: '/graphotherapie', label: 'Graphothérapie' },
              { path: '/collaboration', label: 'Collaboration' },
              { path: '/blog', label: 'Blog' },
              { path: '/contact', label: 'Contact' },
              ...(session ? [{ path: '/admin/blog', label: 'Admin', icon: LogIn }] : [])
            ].map((item) => (
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