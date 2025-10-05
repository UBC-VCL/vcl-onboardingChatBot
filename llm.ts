import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { Pinecone } from '@pinecone-database/pinecone';
import { loadFileFromFolder } from "./helpers/googleAPI.js";

// Load environment variables
dotenv.config();

const GOOGLE_DRIVE_ID = "15DGRVgmBBmvnCKBuYLxJlAXysMQZmMGK";

const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPEN_AI_KEY
})

const pc = new Pinecone({
    apiKey: process.env.PINECONE_KEY!
});

loadFileFromFolder(GOOGLE_DRIVE_ID);