import dotenv from "dotenv";
import type { Document } from "@langchain/core/documents";
import OpenAI from "openai";
import { EmbeddedOBJ } from "../types/PineconeTypes.js";

dotenv.config();

const OPEN_AI_API_KEY = process.env.OPEN_AI_KEY;
const OPEN_AI = new OpenAI({ apiKey: OPEN_AI_API_KEY });

export const embed = async (chunks:Document[], batchSize:number, retryDelayMs:number):Promise<EmbeddedOBJ[] | Error> => {
    let result:EmbeddedOBJ[] = [];
    console.log(chunks.length)

    for (let i = 0; i<chunks.length; i+=batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const texts = batch.map((c) => c.pageContent);
    
        try {
            
            const response = await OPEN_AI.embeddings.create({
                model: "text-embedding-3-small",
                input: texts,
            });
            const batchEmbeddings:number[][] = response.data.map((d) => d.embedding);

            for (let j = 0; j < batch.length; j++) {
                result.push({
                id: batch[j].id!,
                values: batchEmbeddings[j],
                metadata: {
                  docId: batch[j].metadata.document_id,
                  title:batch[j].metadata.title,
                  pageContent: batch[j].pageContent,
                },
              });
            }
        } catch(err:any) {
            if (err.status === 429 || err.error?.type === "rate_limit_exceeded") {
                console.warn(
                  `Rate limited. Retrying batch ${i / batchSize + 1} after ${retryDelayMs / 1000}s...`
                );
                await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
                i -= batchSize; 
                continue;
              }
        
              console.error("Embedding failed:", err);
              throw err;
            
        }
    }
    
    return result;
}