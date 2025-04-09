import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, Loader, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminAuth, supabase } from '../lib/supabaseClient';
import { sendPasswordResetEmail } from '../lib/emailjs';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AUTHORIZED_EMAILS = ['joelle@nguyen.eu', 'pearl@nguyen.eu'];

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!AUTHORIZED_EMAILS.includes(email)) {
        throw new Error('Accès non autorisé');
      }

      await adminAuth.signIn(email, password);
      onClose();
      navigate('/admin/blog');
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!email) {
        throw new Error('Veuillez saisir votre adresse email');
      }

      if (!AUTHORIZED_EMAILS.includes(email)) {
        throw new Error('Accès non autorisé');
      }

      await sendPasswordResetEmail(email);
      setSuccess('Un email de réinitialisation vous a été envoyé.');
      setTimeout(() => {
        setIsResettingPassword(false);
      }, 3000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError('Erreur lors de l\'envoi de l\'email de réinitialisation. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-nature-500">
                  {isResettingPassword ? 'Réinitialiser le mot de passe' : 'Administration'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-nature-400 hover:text-nature-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
                  {success}
                </div>
              )}

              <form onSubmit={isResettingPassword ? handleResetPassword : handleSubmit} className="space-y-6">
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

                {!isResettingPassword && (
                  <div>
                    <label className="block text-sm font-medium text-nature-500 mb-2">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-nature-200 focus:ring-2 focus:ring-nature-400 focus:border-transparent pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-nature-400 hover:text-nature-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-nature-400 hover:bg-nature-500 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      {isResettingPassword ? 'Envoi en cours...' : 'Connexion en cours...'}
                    </>
                  ) : (
                    <>
                      {isResettingPassword ? (
                        <>
                          <HelpCircle className="w-5 h-5 mr-2" />
                          Envoyer le lien de réinitialisation
                        </>
                      ) : (
                        <>
                          <LogIn className="w-5 h-5 mr-2" />
                          Se connecter
                        </>
                      )}
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsResettingPassword(!isResettingPassword);
                      setError(null);
                      setSuccess(null);
                    }}
                    className="text-sm text-nature-400 hover:text-nature-600 transition-colors"
                  >
                    {isResettingPassword ? (
                      "Retour à la connexion"
                    ) : (
                      "Mot de passe oublié ?"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}