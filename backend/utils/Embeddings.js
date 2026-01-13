import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


function normalizeVector(vector) {
  let sum =0;
  vector.forEach((v)=>{
    sum = sum + v*v; 
  });
  const norm = Math.sqrt(sum);
  return vector.map(v => v / norm);
}

export default async function generateEmbeddings(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid text for embedding");
  }

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    taskType: "SEMANTIC_SIMILARITY",
    outputDimensionality: 768
  });

  const embedding = response.embeddings[0].values;

  return normalizeVector(embedding);
}
