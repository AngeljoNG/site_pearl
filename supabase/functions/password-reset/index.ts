import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
};

interface RequestPayload {
  email: string;
}

// Get environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Required environment variables are not set');
}

const supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (!req.body) {
      throw new Error('Request body is required');
    }

    const { email }: RequestPayload = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    // Verify the admin user exists
    const { data: adminUser, error: adminCheckError } = await supabaseClient
      .from('admin_users')
      .select('email')
      .eq('email', email)
      .single();

    if (adminCheckError || !adminUser) {
      throw new Error('Invalid email address');
    }

    // Create a random token
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    // Store the reset token in the database
    const { error: insertError } = await supabaseClient
      .from('password_reset_tokens')
      .insert({
        email,
        token,
        expires_at: expiresAt.toISOString()
      });

    if (insertError) {
      console.error('Error storing reset token:', insertError);
      throw new Error('Failed to create password reset token');
    }

    // Get the request origin or use a default
    const origin = req.headers.get('origin') || 'https://pearl-nguyen.eu';
    const resetUrl = `${origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // Send email via EmailJS
    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: 'service_ivdv56i',
        template_id: 'template_t5ishje',
        user_id: 'piPuPKu8t2EeQzSoV',
        template_params: {
          to_email: email,
          reset_url: resetUrl,
          time: new Date().toLocaleString('fr-BE', {
            dateStyle: 'long',
            timeStyle: 'short'
          })
        }
      })
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('EmailJS error:', errorData);
      throw new Error(`Failed to send reset email: ${JSON.stringify(errorData)}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in password reset function:', error);
    
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