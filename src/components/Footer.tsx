import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { LoginModal } from './LoginModal';
import packageJson from '../../package.json';

export function Footer() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <footer className="bg-nature-50 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center">
          <p className="text-nature-500">© Pearl Nguyen Duy – Tous droits réservés</p>
          <div className="flex items-center gap-4 mt-2">
            <Link to="/mentions-legales" className="text-sm text-nature-400 hover:text-nature-600">
              Mentions légales
            </Link>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-nature-400 hover:text-nature-600 transition-colors p-1 opacity-50 hover:opacity-100"
              aria-label="Administration"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-xs text-nature-400 opacity-50">v{packageJson.version}</div>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </footer>
  );
}