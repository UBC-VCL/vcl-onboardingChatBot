import dotenv from "dotenv";
import type { Document } from "@langchain/core/documents";
import OpenAI from "openai";

dotenv.config();

const OPEN_AI_API_KEY = process.env.OPEN_AI_KEY;
console.log(OPEN_AI_API_KEY)
const OPEN_AI = new OpenAI({ apiKey: OPEN_AI_API_KEY });
console.log(OPEN_AI)

export const embed = async (chunks:Document[], batchSize:number, retryDelayMs:number):Promise<Document[] | Error> => {
    let result:Document[] = [];

    for (let i = 0; i<chunks.length; i+=batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const texts = batch.map((c) => c.pageContent);
    
        try {
            
            const response = await OPEN_AI.embeddings.create({
                model: "text-embedding-3-small",
                input: texts,
            });
            const batchEmbeddings = response.data.map((d) => d.embedding);

            console.log(batchEmbeddings);

            for (let j = 0; j < batch.length; j++) {
                result.push({
                ...batch[j],
                metadata: {
                  ...batch[j].metadata,
                  embedding: batchEmbeddings[j],
                },
              });
            }
        } catch(err:any) {
            if (err.status === 429 || err.error?.type === "rate_limit_exceeded") {
                console.warn(
                  `Rate limited. Retrying batch ${i / batchSize + 1} after ${retryDelayMs / 1000}s...`
                );
                await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
                i -= batchSize; // re-run same batch
                continue;
              }
        
              console.error("Embedding failed:", err);
              throw err;
            
        }
    }
    
    return result;
}