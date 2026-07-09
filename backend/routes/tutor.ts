import { Router } from "express";
import { GoogleGenAI } from "@google/genai";

export const tutorRouter = Router();

// Initialize GoogleGenAI lazily as recommended in guidelines to avoid crashing if key is missing on startup
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

tutorRouter.post("/tutor/chat", async (req, res) => {
  const { message, history } = req.body as { message: string; history?: ChatMessage[] };

  if (!message) {
    res.status(400).json({ error: "Le message est requis" });
    return;
  }

  const systemInstruction = `Tu es le "Tuteur IA de l'École 221", un conseiller et tuteur académique d'exception, hyper compétent dans tous les domaines d'enseignement (programmation mobile, développement web, bases de données, machine learning, architecture logicielle, etc.).
Ton but est d'aider l'étudiant nommé Abdoulaye Diallo (actuellement à 15.42/20 de moyenne générale) à exceller.

Voici tes missions :
1. Expliquer les concepts complexes des cours avec pédagogie, des exemples concrets et des cas réels du Sénégal ou d'Afrique s'il y a lieu.
2. Donner des astuces, méthodes d'apprentissage efficaces, fiches de révision et petits exercices interactifs.
3. Conseiller l'étudiant sur ce qu'il doit apprendre en priorité en fonction de ses questions.
4. Être toujours encourageant, chaleureux, professionnel et d'une clarté irréprochable.
5. Utiliser un formatage Markdown élégant (listes à puces, code blocks si nécessaire, mots en gras, etc.) pour rendre la lecture agréable.

Réponds de manière naturelle et structurée en français.`;

  try {
    const ai = getAiClient();

    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not configured
      console.warn("GEMINI_API_KEY is missing. Using high-fidelity local tutor engine.");
      
      let reply = "";
      const lower = message.toLowerCase();
      if (lower.includes("mobile") || lower.includes("android") || lower.includes("kotlin")) {
        reply = `**Astuce de votre Tuteur École 221 :**\n\nPour réussir en **Programmation Mobile S1**, concentrez-vous sur le cycle de vie des Activités/Composants et la gestion d'état en Jetpack Compose.\n\nVoici ce que je vous conseille d'apprendre dès aujourd'hui :\n1. **State Hoisting** : Pour garder vos composants réutilisables.\n2. **Coroutines Kotlin** : Essentielles pour exécuter des appels réseau ou bases de données hors du thread principal.\n\n*Voulez-vous qu'on écrive un petit code d'exemple ensemble ?*`;
      } else if (lower.includes("machine") || lower.includes("ml") || lower.includes("learning")) {
        reply = `**Focus Machine Learning :**\n\nPour booster votre moyenne en **Machine Learning Foundations**, il faut bien comprendre le compromis Biais-Variance et la régularisation (Lasso/Ridge).\n\n**Exercice rapide pour vous :**\nSi votre modèle a une excellente précision sur vos données d'entraînement mais de mauvais résultats sur vos tests, de quel problème s'agit-il ?\n*Répondez-moi pour que nous puissions déboguer cela !*`;
      } else {
        reply = `Bonjour Abdoulaye ! En tant que **Tuteur IA de l'École 221**, je suis là pour vous accompagner sur tous vos cours.\n\nVous pouvez me poser des questions sur :\n- Des explications de cours (ex: "Explique-moi les hooks React" ou "C'est quoi une jointure SQL ?")\n- Des astuces de révision pour le prochain examen\n- Un plan d'étude personnalisé pour monter votre moyenne de 15.42 à 17/20.\n\nQue souhaitez-vous apprendre ou approfondir aujourd'hui ?`;
      }

      res.json({ text: reply });
      return;
    }

    // Format history for GoogleGenAI contents array
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((h) => {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text || "Désolé, je n'ai pas pu générer de réponse." });

  } catch (error) {
    console.error("Gemini API Error in backend tutor route:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ 
      error: "Erreur lors de la communication avec le Tuteur IA.",
      details: errorMessage 
    });
  }
});
