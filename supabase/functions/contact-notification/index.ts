import { createClient } from 'npm:@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
};

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  request_type: string;
  message: string;
  created_at: string;
}

const requestTypes = {
  adult_appointment: 'Rendez-vous Adulte',
  child_appointment: 'Rendez-vous Enfant',
  callback: 'Demande de rappel',
  information: 'Demande d\'informations'
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Get Resend API key
    const resendKey = 're_78Wt7bPi_EbfVqsKTeNVSsXe3rQoDXfV5';

    let payload;
    try {
      const text = await req.text();
      console.log('Raw request body:', text);
      payload = JSON.parse(text);
      console.log('Parsed payload:', payload);
    } catch (error) {
      console.error('Error parsing request body:', error);
      throw new Error(`Invalid JSON payload: ${error.message}`);
    }

    const contact: ContactRequest = payload.record || payload;
    console.log('Contact request data:', {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      request_type: contact.request_type
    });

    const emailBody = `
Nouvelle demande de contact :

Type de demande : ${requestTypes[contact.request_type as keyof typeof requestTypes] || contact.request_type}
Nom : ${contact.name}
Email : ${contact.email}
Téléphone : ${contact.phone || 'Non spécifié'}

Message :
${contact.message}

Date : ${new Date(contact.created_at || new Date()).toLocaleString('fr-BE')}
    `.trim();

    console.log('Preparing to send email via Resend API');

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Pearl Nguyen <contact@pearl-nguyen.eu>',
        to: ['pearl@nguyen.eu'],
        subject: `Nouvelle demande de contact - ${requestTypes[contact.request_type as keyof typeof requestTypes] || 'Contact'}`,
        text: emailBody,
        reply_to: contact.email
      })
    });

    const emailResult = await emailResponse.json();
    console.log('Resend API response:', emailResult);

    if (!emailResponse.ok) {
      throw new Error(`Failed to send email: ${JSON.stringify(emailResult)}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailResult,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in contact notification function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});