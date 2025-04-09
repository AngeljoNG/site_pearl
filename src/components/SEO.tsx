import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export function SEO({ 
  title = "Pearl Nguyen Duy - Psychologue, Thérapeute, Graphothérapeute à Faimes",
  description = "Psychologue clinicienne, thérapeute et graphothérapeute à Faimes. Spécialisée en TCC, RITMO®, hypnose et graphothérapie. Accompagnement personnalisé pour adultes, adolescents et enfants.",
  keywords = [
    // Mots-clés principaux
    "psychologue",
    "thérapeute",
    "graphothérapeute",
    "psychologue clinicienne",

    // Localisation
    "Faimes",
    "Liège",
    "Waremme",
    "Wallonie",
    "province de Liège",

    // Spécialités
    "TCC",
    "RITMO",
    "hypnose",
    "thérapies cognitivo comportementales",
    "graphothérapie",
    "rééducation écriture",

    // Problématiques
    "anxiété",
    "dépression",
    "troubles apprentissage",
    "dysgraphie",
    "stress",
    "difficultés scolaires",

    // Services
    "consultation psychologique",
    "suivi thérapeutique",
    "accompagnement enfants",
    "thérapie adolescents",
    "psychologue adultes"
  ],
  image = "/pearl-profile.jpg",
  url = "https://pearl-nguyen.eu"
}: SEOProps) {
  const siteTitle = "Pearl Nguyen Duy";
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      {/* Balises meta de base */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Autres balises meta importantes */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="French" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Pearl Nguyen Duy" />

      {/* Balises spécifiques à la localisation */}
      <meta name="geo.region" content="BE-WLG" />
      <meta name="geo.placename" content="Faimes" />
      <meta name="geo.position" content="50.6896726;5.2558973" />
      <meta name="ICBM" content="50.6896726, 5.2558973" />

      {/* Liens canoniques et alternates */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}