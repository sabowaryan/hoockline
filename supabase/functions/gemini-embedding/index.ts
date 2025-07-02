// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai';

// --- Headers CORS ---
// Ces en-têtes sont nécessaires pour autoriser les requêtes provenant de votre application web.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Pour le développement. En production, remplacez * par votre domaine (ex: 'https://mon-app.com')
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// --- Initialisation de l'API Gemini ---
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
if (!GEMINI_API_KEY) {
  console.error("La variable d'environnement GEMINI_API_KEY n'est pas définie.");
  // Il est préférable de ne pas démarrer le serveur si la config est manquante.
  // Dans le contexte de Deno Deploy, une erreur ici arrêtera le déploiement.
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'embedding-001' });

// --- Fonction utilitaire pour les réponses avec CORS ---
function createResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

// --- Fonction de validation du texte ---
function validateTextInput(body: any): { isValid: boolean; error?: string; text?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Corps de requête invalide' };
  }

  const { text } = body;

  if (!text) {
    return { isValid: false, error: 'Le champ "text" est requis' };
  }

  if (typeof text !== 'string') {
    return { isValid: false, error: 'Le champ "text" doit être une chaîne de caractères' };
  }

  if (text.trim().length === 0) {
    return { isValid: false, error: 'Le champ "text" ne peut pas être vide' };
  }

  if (text.length > 10000) {
    return { isValid: false, error: 'Le texte ne peut pas dépasser 10000 caractères' };
  }

  return { isValid: true, text: text.trim() };
}

// --- Serveur principal ---
serve(async (req) => {
  // --- Gestion de la requête preflight OPTIONS ---
  // C'est l'étape cruciale pour que le CORS fonctionne.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // --- Vérification de la méthode de requête ---
  if (req.method !== 'POST') {
    return createResponse({ error: 'Méthode non autorisée' }, 405);
  }

  // --- Vérification de la clé API (sécurité) ---
  if (!GEMINI_API_KEY) {
    return createResponse({ error: 'Configuration du serveur incomplète' }, 500);
  }

  // --- Authentification Supabase (optionnelle pour cette fonction) ---
  // Décommentez si vous voulez forcer l'authentification
  /*
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return createResponse({ error: 'Token d\'authentification requis' }, 401);
  }
  */

  try {
    // --- Validation des données de la requête ---
    const requestBody = await req.json();
    const validation = validateTextInput(requestBody);

    if (!validation.isValid) {
      return createResponse({ error: validation.error }, 400);
    }

    const text = validation.text!;

    // --- Appel à l'API Gemini ---
    const result = await model.embedContent({
      content: { parts: [{ text }], role: 'user' }
    });

    const embedding = result.embedding?.values;

    if (!embedding) {
      throw new Error("L'API Gemini n'a pas retourné d'embedding.");
    }

    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new Error("L'embedding retourné par l'API Gemini est invalide.");
    }

    console.log(`Embedding généré avec succès pour un texte de ${text.length} caractères`);

    return createResponse({
      embedding,
      dimensions: embedding.length,
      success: true
    });

  } catch (error) {
    console.error("Erreur lors de la génération de l'embedding:", error);

    // Masquer les détails de l'erreur au client pour la sécurité
    const errorMessage = error instanceof Error ? error.message : 'Erreur interne du serveur';
    
    // Distinguer les erreurs d'API des erreurs internes
    const isAPIError = error instanceof Error && (
      error.message.includes('API') || 
      error.message.includes('quota') || 
      error.message.includes('authentication')
    );

    return createResponse({
      error: 'Erreur lors du traitement de la demande',
      details: isAPIError ? 'Erreur de l\'API Gemini' : errorMessage,
      success: false
    }, isAPIError ? 503 : 500);
  }
});