import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { Pinecone } from '@pinecone-database/pinecone';

// Load environment variables
dotenv.config();

const GOOGLE_DRIVE_ID = "kk1o6EerV2RM6gRWTLBOWdWMgcUmQ_r";

const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPEN_AI_KEY
})

const pc = new Pinecone({
    apiKey: process.env.PINECONE_KEY!
});