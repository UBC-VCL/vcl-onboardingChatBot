import dotenv from "dotenv";
import type { Document } from "@langchain/core/documents";
import OpenAI from "openai";

dotenv.config();

const OPEN_AI_API_KEY = process.env.OPEN_AI_KEY;
console.log(OPEN_AI_API_KEY)
const OPEN_AI = new OpenAI({ apiKey: OPEN_AI_API_KEY });
console.log(OPEN_AI)

export const embed = async (chunks:Document[]):Promise<number | Error> => {
    for (let i = 0; i<chunks.length; i++) {
        try {
            console.log('hi')

            const text = chunks[i].pageContent;
            
            console.log(text)

            const response = await OPEN_AI.embeddings.create({
                model: "text-embedding-3-small",
                input: text,
            });

            console.log(response.data[0].embedding)
            console.log('hello')
        } catch(err) {
            console.log(err)
        }
    }
    
    return 0;
}