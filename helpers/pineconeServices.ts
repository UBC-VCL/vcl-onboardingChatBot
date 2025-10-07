import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from "dotenv";

dotenv.config();

const PINECONE_API_KEY = process.env.PINECONE_KEY;

const pc = new Pinecone({
  apiKey: PINECONE_API_KEY!
});

export const insertDocument= () => {
    
}