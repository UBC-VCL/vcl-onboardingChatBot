import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from "dotenv";
import { EmbeddedOBJ } from '../types/PineconeTypes.js';

dotenv.config();

const PINECONE_API_KEY = process.env.PINECONE_KEY;

const pc = new Pinecone({
    apiKey: PINECONE_API_KEY!
  });
const PINCECONE_INDEX = pc.index("vcl-vector-db");


export const upsertDocument= async (items:EmbeddedOBJ[]):Promise<void> => {
    console.log(items as any)
    await PINCECONE_INDEX.upsert(items as any)
        .catch(err => {
            throw err
        });

}