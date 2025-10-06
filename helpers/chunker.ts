import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import type { Document } from "@langchain/core/documents";
import { Document as DocumnetConstructor } from "@langchain/core/documents";

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,     // maximum size of each chunk (in characters)
    chunkOverlap: 200,   // how many characters overlap between chunks
});

  
export const chunker = async (document: string): Promise<Document[]> => {
    let result:Document[] = await splitter.createDocuments([document]);

    return result;
}

export const sentenceChunker = (text: string, sentencesPerChunk:number): Document[] => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || []; // split on ., !, ?
    const chunks: Document[] = [];
  
    for (let i = 0; i < sentences.length; i += sentencesPerChunk) {
      const chunk = sentences.slice(i, i + sentencesPerChunk).join(" ").trim();
      const doc = new DocumnetConstructor({ pageContent: chunk })
      chunks.push(doc);
    }
  
    return chunks;
  };