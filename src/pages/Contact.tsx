import React from 'react';
import { MapPin, Clock, Mail, Phone, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';

export function Contact() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="prose lg:prose-lg mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-serif text-nature-500 text-center mb-8"
        >
          Contact
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-md relative border-l-4 border-nature-400 overflow-hidden"
          >
            <div className="absolute right-0 top-0 h-full w-32 opacity-10">
              <img
                src="/Bambou_FondTrans.jpg"
                alt=""
                className="h-full object-cover"
              />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-nature-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-serif text-nature-500 mb-2">Adresse</h3>
                  <p className="text-nature-500">
                    <span className="text-lg font-medium block">Pearl Nguyen Duy</span>
                    <span className="italic text-nature-400">
                      Rue de les Waleffes 27<br />
                      <span className="text-sm">4317</span> <span className="text-base">Faimes</span><br />
                      Belgique
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-6 h-6 text-nature-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-serif text-nature-500 mb-2">Horaires</h3>
                  <p className="text-nature-500">
                    <span className="font-medium">Du Lundi au Vendredi :</span><br />
                    <span className="text-lg">9h00 - 18h00</span><br />
                    <span className="italic text-nature-400 mt-2 block">Uniquement sur rendez-vous</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-md relative border-l-4 border-nature-400 overflow-hidden"
          >
            <div className="absolute right-0 top-0 h-full w-32 opacity-10">
              <img
                src="/Bambou_FondTrans.jpg"
                alt=""
                className="h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-serif text-nature-500 mb-6">Me contacter</h3>
              <div className="space-y-6">
                <motion.a 
                  whileHover={{ x: 10 }}
                  href="mailto:pearl@nguyen.eu" 
                  className="flex items-center text-nature-500 hover:text-nature-600 transition-colors"
                >
                  <Mail className="w-6 h-6 mr-3" />
                  <span className="text-lg">pearl@nguyen.eu</span>
                </motion.a>
                <motion.a 
                  whileHover={{ x: 10 }}
                  href="tel:+32495863810" 
                  className="flex items-center text-nature-500 hover:text-nature-600 transition-colors"
                >
                  <Phone className="w-6 h-6 mr-3" />
                  <span className="text-lg">+32 495 86 38 10</span>
                </motion.a>
                <motion.a 
                  whileHover={{ x: 10 }}
                  href="https://www.facebook.com/profile.php?id=100064609303954"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-nature-500 hover:text-nature-600 transition-colors"
                >
                  <Facebook className="w-6 h-6 mr-3" />
                  <span className="text-lg">Suivez-moi sur Facebook</span>
                </motion.a>

                <div className="mt-8 pt-6 border-t border-nature-200">
                  <img
                    src="/qr-code-contact.png"
                    alt="QR Code"
                    className="w-32 h-32 mx-auto"
                  />
                  <p className="text-sm text-nature-400 text-center mt-2">Scannez pour me suivre</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2524.925276098558!2d5.2558973!3d50.6896726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c0e1b8b8b8b8b9%3A0x1c1c1c1c1c1c1c1c!2sRue%20de%20les%20Waleffes%2027%2C%204317%20Faimes%2C%20Belgium!5e0!3m2!1sen!2sbe!4v1710835940000!5m2!1sen!2sbe"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg shadow-md"
          ></iframe>
        </motion.div>
      </section>
    </main>
  );
}