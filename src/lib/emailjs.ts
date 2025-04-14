import emailjs from '@emailjs/browser';
import { supabase } from './supabaseClient';

// Initialize EmailJS
emailjs.init("piPuPKu8t2EeQzSoV");

export const sendContactEmail = async (data: {
  name: string;
  email: string;
  phone: string;
  request_type: string;
  message: string;
}) => {
  try {
    const response = await emailjs.send(
      'service_ivdv56i',
      'template_foq7z3j',
      {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        request_type: data.request_type,
        message: data.message,
        reply_to: data.email,
        time: new Date().toLocaleString('fr-BE')
      }
    );

    return response;
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string) => {
  if (!email) {
    throw new Error('Email address is required');
  }

  try {
    console.log('Sending password reset email to:', email);
    
    // Generate a random token
    const token = crypto.randomUUID();
    
    // First store the token in the database
    const { error: dbError } = await supabase
      .from('password_reset_tokens')
      .insert([{
        email,
        token,
        expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      }]);

    if (dbError) {
      console.error('Error storing reset token:', dbError);
      throw new Error('Failed to create password reset token');
    }

    const templateParams = {
      to_name: email.split('@')[0], // Use part before @ as name
      to_email: email,
      email: email, // Add this as a backup
      reset_url: `${window.location.origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`,
      time: new Date().toLocaleString('fr-BE')
    };

    console.log('Template parameters:', templateParams);

    const response = await emailjs.send(
      'service_ivdv56i',
      'template_t5ishje',
      templateParams
    );

    console.log('Password reset email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};