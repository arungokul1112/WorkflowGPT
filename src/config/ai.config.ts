import dotenv from 'dotenv';

dotenv.config();

export const aiConfig = {
  groqApiKey: process.env.GROQ_API_KEY || '',
  modelName: 'llama-3.3-70b-versatile', // Updated to supported version
  temperature: 0.1,
  maxTokens: 1024,
};
