import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getSEOSettings, generateStructuredData, getDefaultSEOSettings, type SEOSettings } from '../services/seo';

export function SEOManager() {
  const location = useLocation();
  const [seoSettings, setSeoSettings] = useState<SEOSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSEOSettings = async () => {
      setLoading(true);
      
      try {
        // Essayer de récupérer les paramètres depuis la base de données
        const settings = await getSEOSettings(location.pathname);
        
        if (settings) {
          setSeoSettings(settings);
        } else {
          // Utiliser les paramètres par défaut si aucun n'est trouvé
          const defaultSettings = getDefaultSEOSettings(location.pathname);
          setSeoSettings(defaultSettings as SEOSettings);
        }
      } catch (error) {
        console.error('Error loading SEO settings:', error);
        // Fallback vers les paramètres par défaut
        const defaultSettings = getDefaultSEOSettings(location.pathname);
        setSeoSettings(defaultSettings as SEOSettings);
      } finally {
        setLoading(false);
      }
    };

    loadSEOSettings();
  }, [location.pathname]);

  if (loading || !seoSettings) {
    return null;
  }

  const baseUrl = window.location.origin;
  const currentUrl = seoSettings.canonical_url || `${baseUrl}${location.pathname}`;
  const structuredData = generateStructuredData(seoSettings);

  return (
    <Helmet>
      {/* Titre de la page */}
      <title>{seoSettings.title}</title>
      
      {/* Meta tags de base */}
      {seoSettings.description && (
        <meta name="description" content={seoSettings.description} />
      )}
      
      {seoSettings.keywords && (
        <meta name="keywords" content={seoSettings.keywords} />
      )}
      
      <meta name="robots" content={seoSettings.robots || 'index, follow'} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={seoSettings.og_title || seoSettings.title} />
      <meta property="og:description" content={seoSettings.og_description || seoSettings.description} />
      <meta property="og:site_name" content="Clicklone" />
      <meta property="og:locale" content="fr_FR" />
      
      {seoSettings.og_image && (
        <>
          <meta property="og:image" content={seoSettings.og_image} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={seoSettings.og_title || seoSettings.title} />
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={seoSettings.twitter_title || seoSettings.og_title || seoSettings.title} />
      <meta name="twitter:description" content={seoSettings.twitter_description || seoSettings.og_description || seoSettings.description} />
      
      {(seoSettings.twitter_image || seoSettings.og_image) && (
        <meta name="twitter:image" content={seoSettings.twitter_image || seoSettings.og_image} />
      )}
      
      {/* Meta tags additionnels pour le SEO */}
      <meta name="author" content="Clicklone" />
      <meta name="generator" content="Clicklone - Générateur IA" />
      <meta name="theme-color" content="#9333ea" />
      
      {/* Preconnect pour améliorer les performances */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.stripe.com" />
      
      {/* DNS Prefetch pour les domaines externes */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//api.stripe.com" />
      
      {/* Données structurées Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Meta tags pour les moteurs de recherche spécifiques */}
      <meta name="google-site-verification" content="" />
      <meta name="msvalidate.01" content="" />
      
      {/* Meta tags pour les réseaux sociaux additionnels */}
      <meta property="fb:app_id" content="" />
      <meta name="twitter:site" content="@clicklone" />
      <meta name="twitter:creator" content="@clicklone" />
      
      {/* Meta tags pour l'application mobile */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Clicklone" />
      
      {/* Meta tags pour Windows */}
      <meta name="msapplication-TileColor" content="#9333ea" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Alternate languages */}
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}${location.pathname}`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${location.pathname}`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${location.pathname}`} />
    </Helmet>
  );
}