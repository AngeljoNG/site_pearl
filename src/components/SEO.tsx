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
    "psychologue Faimes",
    "psychologue Liège",
    "psychologue enfants",
    "psychologue adolescents",

    // Localisation
    "Faimes",
    "Liège",
    "Waremme", 
    "Wallonie",
    "province de Liège",
    "Belgique",
    "consultation Faimes",
    "consultation Liège",

    // Spécialités
    "TCC",
    "RITMO",
    "hypnose",
    "thérapies cognitivo comportementales",
    "graphothérapie",
    "rééducation écriture",
    "thérapie brève",
    "thérapie comportementale", 
    "thérapie cognitive",
    "hypnose thérapeutique",
    "EMDR",

    // Problématiques
    "anxiété",
    "dépression",
    "troubles apprentissage",
    "dysgraphie",
    "stress",
    "difficultés scolaires",
    "traumatisme",
    "phobie",
    "trouble anxieux",
    "burn out",
    "confiance en soi",
    "troubles du sommeil",
    "troubles alimentaires",

    // Services
    "consultation psychologique",
    "suivi thérapeutique",
    "accompagnement enfants",
    "thérapie adolescents",
    "psychologue adultes",
    "bilan graphomoteur",
    "rééducation graphomotrice",
    "psychothérapie",
    "thérapie en ligne",
    "consultation à distance",

    // Collaborations
    "DysMoi",
    "REALISM", 
    "réseau psychologues",
    "psychologue première ligne",
    "PPL",
    "troubles DYS",
    "neurodiversité"
  ],
  image = "/pearl-profile.jpg",
  url = "https://pearlnguyenduy.be"
}: SEOProps) {
  const siteTitle = "Pearl Nguyen Duy";
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content="v46zz3bDohbW2Nvzox6EPgtcAt0mF0cJufQn0QL_VGk" />

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
      <meta property="og:site_name" content="Pearl Nguyen Duy" />
      <meta property="og:locale" content="fr_BE" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Autres balises meta importantes */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="language" content="French" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Pearl Nguyen Duy" />
      <meta name="theme-color" content="#4a6741" />
      <meta name="format-detection" content="telephone=yes" />

      {/* Balises spécifiques à la localisation */}
      <meta name="geo.region" content="BE-WLG" />
      <meta name="geo.placename" content="Faimes" />
      <meta name="geo.position" content="50.6896726;5.2558973" />
      <meta name="ICBM" content="50.6896726, 5.2558973" />

      {/* Liens canoniques et alternates */}
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="fr-BE" href={url} />
    </Helmet>
  );
}