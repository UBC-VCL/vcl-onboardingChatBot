import dotenv from "dotenv";
import type { Document } from "@langchain/core/documents";
import OpenAI from "openai";

dotenv.config();

const OPEN_AI_API_KEY = process.env.OPENAI_API_KEY;
const OPEN_AI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const embed = async (chunks:Document[]):Promise<number | Error> => {


    for (let i = 0; i<chunks.length; i++) {

        const text = chunks[i].pageContent;

        const response = await OPEN_AI.embeddings.create({
            model: "text-embedding-3-small", // or "text-embedding-3-large"
            input: text,
        });
    }
    
    return 0;
}