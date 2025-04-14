import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { sendContactEmail } from '../lib/emailjs';
import { supabase } from '../lib/supabaseClient';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  request_type: 'adult_appointment' | 'child_appointment' | 'callback' | 'information';
  message: string;
}

const requestTypes = {
  adult_appointment: 'Rendez-vous Adulte',
  child_appointment: 'Rendez-vous Enfant',
  callback: 'Demande de rappel',
  information: 'Demande d\'informations'
};

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    request_type: 'adult_appointment',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send email via EmailJS
      await sendContactEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        request_type: requestTypes[formData.request_type],
        message: formData.message
      });

      // Store in Supabase
      const { error: dbError } = await supabase
        .from('contact_requests')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          request_type: formData.request_type,
          message: formData.message,
          status: 'sent'
        }]);

      if (dbError) {
        console.error('Error storing contact request:', dbError);
        // Don't show error to user since email was sent successfully
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        request_type: 'adult_appointment',
        message: ''
      });
    } catch (err: any) {
      console.error('Error sending email:', err);
      setError('Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md relative border-l-4 border-nature-400"
    >
      <div className="absolute right-0 top-0 h-full w-32 opacity-10">
        <img
          src="/Bambou_FondTrans.jpg"
          alt=""
          className="h-full object-cover"
        />
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-serif text-nature-500 mb-6">Formulaire de contact</h3>

        {success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-50 text-green-700 p-4 rounded-lg mb-6"
          >
            Votre message a été envoyé avec succès. Je vous recontacterai dans les plus brefs délais.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-nature-500 mb-2">
                Type de demande *
              </label>
              <select
                name="request_type"
                value={formData.request_type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-nature-200 focus:ring-2 focus:ring-nature-400 focus:border-transparent"
                required
              >
                <optgroup label="Rendez-vous">
                  <option value="adult_appointment">Rendez-vous Adulte</option>
                  <option value="child_appointment">Rendez-vous Enfant</option>
                </optgroup>
                <optgroup label="Autres demandes">
                  <option value="callback">Être rappelé(e)</option>
                  <option value="information">Demande d'informations</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-nature-500 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-nature-200 focus:ring-2 focus:ring-nature-400 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nature-500 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-nature-200 focus:ring-2 focus:ring-nature-400 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nature-500 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-nature-200 focus:ring-2 focus:ring-nature-400 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nature-500 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
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
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Envoyer
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}