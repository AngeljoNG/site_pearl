import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

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

    // Send email via EmailJS API
    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: 'service_ivdv56i',
        template_id: 'template_foq7z3j',
        user_id: 'piPuPKu8t2EeQzSoV',
        template_params: {
          from_name: contact.name,
          from_email: contact.email,
          phone: contact.phone,
          request_type: requestTypes[contact.request_type as keyof typeof requestTypes] || contact.request_type,
          message: contact.message,
          reply_to: contact.email,
          time: new Date().toLocaleString('fr-BE', {
            dateStyle: 'long',
            timeStyle: 'short'
          })
        }
      })
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
    }

    const emailResult = await emailResponse.json();
    console.log('EmailJS response:', emailResult);

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