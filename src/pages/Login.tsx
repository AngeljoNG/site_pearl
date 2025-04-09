import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Key, Loader } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const AUTHORIZED_EMAILS = ['joelle@nguyen.eu', 'pearl@nguyen.eu'];

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user && AUTHORIZED_EMAILS.includes(session.user.email)) {
          navigate('/admin/blog');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error);
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Tentative de connexion pour:', email);
      
      // Vérifier d'abord si l'email est autorisé
      if (!AUTHORIZED_EMAILS.includes(email)) {
        throw new Error('Accès non autorisé');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou mot de passe incorrect');
        }
        throw error;
      }

      if (!data.user) {
        throw new Error('Erreur de connexion');
      }

      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Erreur complète:', error);
      setError(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-nature-400"
      >
        <div className="flex items-center mb-6">
          <Key className="w-8 h-8 text-nature-400 mr-3" />
          <h2 className="text-2xl font-serif text-nature-500">Connexion Administrateur</h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-nature-500 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-nature-200 focus:ring-2 focus:ring-nature-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-nature-500 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-nature-200 focus:ring-2 focus:ring-nature-400 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-nature-400 hover:bg-nature-500 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Se connecter
              </>
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
}