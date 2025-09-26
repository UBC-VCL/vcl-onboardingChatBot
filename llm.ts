import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log(process.env.OPEN_AI_KEY);

const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPEN_AI_KEY
})

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });