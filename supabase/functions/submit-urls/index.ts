import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// URLs à soumettre
const urls = [
  'https://pearlnguyenduy.be/',
  'https://pearlnguyenduy.be/psychologie',
  'https://pearlnguyenduy.be/graphotherapie',
  'https://pearlnguyenduy.be/collaboration',
  'https://pearlnguyenduy.be/blog',
  'https://pearlnguyenduy.be/contact',
  'https://pearlnguyenduy.be/psychologie/tcc',
  'https://pearlnguyenduy.be/psychologie/ritmo',
  'https://pearlnguyenduy.be/psychologie/hypnose',
  'https://pearlnguyenduy.be/psychologie/quelle-approche',
  'https://pearlnguyenduy.be/psychologie/domaines-intervention',
  'https://pearlnguyenduy.be/graphotherapie/exercices'
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Soumettre les URLs à l'API IndexNow de Bing
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        host: 'pearlnguyenduy.be',
        key: 'C65BAB1B39F3F26EF19F7C8AEBEB5AF9',
        keyLocation: 'https://pearlnguyenduy.be/C65BAB1B39F3F26EF19F7C8AEBEB5AF9.txt',
        urlList: urls
      })
    });

    const result = await response.json();

    return new Response(
      JSON.stringify({ success: true, result }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    );
  }
});