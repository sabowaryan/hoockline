export async function getEmbedding(text: string): Promise<number[]> {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/gemini-embedding`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ text }) 
    });
  
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erreur lors de la récupération de l'embedding: ${errText}`);
    }
  
    const data = await response.json();
  
    if (!data.embedding || !Array.isArray(data.embedding)) {
      throw new Error('Embedding non valide dans la réponse');
    }
  
    return data.embedding;
  }
  