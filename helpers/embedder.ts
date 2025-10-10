import dotenv from "dotenv";
import type { Document } from "@langchain/core/documents";
import OpenAI from "openai";
import { EmbeddedOBJ } from "../types/PineconeTypes.js";
import { OpenAIEmbeddings } from "@langchain/openai";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPEN_AI = new OpenAI({ apiKey: OPENAI_API_KEY });
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small"
});

export const langchainEmbedder = async (chunks: Document[], batchSize:number, retryDelayMs:number):Promise<EmbeddedOBJ[]> => {

  let result:EmbeddedOBJ[] = [];

  for (let i=0; i<chunks.length;i+=batchSize) {
    let currentBatch = chunks.slice(i, i+batchSize);

    const texts = currentBatch.map(item => item.pageContent);
    let success = false;
    try {
      const embedded:number[][] = await embeddings.embedDocuments(texts);
      embedded.map((item, index) => {
        const currentChunk = currentBatch[index];

          result.push({
            id: currentChunk.id!,
            values: item,
            metadata: {
              docId: currentChunk.metadata.document_id,
              title:currentChunk.metadata.title,
              pageContent: currentChunk.pageContent,
            },  
          })
      })  
      success = true;
    } catch (err:any) {
      if (err.status === 429 || err.error?.type === "rate_limit_exceeded") {
        console.warn(`Rate limited. Retrying batch ${i / batchSize + 1} after ${retryDelayMs / 1000}s...`);
        await new Promise((r) => setTimeout(r, retryDelayMs));
      } else {
        throw err;
      }
    } 
  }
  return result;
};

export const embed = async (chunks:Document[], batchSize:number, retryDelayMs:number):Promise<EmbeddedOBJ[]> => {
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
            
            
        }
    }
    
    return result;
}