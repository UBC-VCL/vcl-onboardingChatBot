import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import type { Document } from "@langchain/core/documents";
import { Document as DocumnetConstructor } from "@langchain/core/documents";

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,     // maximum size of each chunk (in characters)
    chunkOverlap: 200,   // how many characters overlap between chunks
});

  
export const chunker = async (document: string, file_id:string, title:string): Promise<Document[]> => {
    let result:Document[] = await splitter.createDocuments([document]);
    // Modify each chunk
    const editedChunks = result.map((chunk, i) => {
        // Example modifications
        const cleanedText = chunk.pageContent
        .replace(/\s+/g, " ")              // normalize spaces
        .replace(/“|”/g, '"')              // replace fancy quotes
        .trim();

        return new DocumnetConstructor({
        pageContent: cleanedText,
        metadata: {
            document_id: file_id,
            title,
            chunk_index: i,
            // Optional: character range, timestamp, etc.
        },
        id: `${file_id}-${i}`, // helpful for traceability
        });
    });

    return editedChunks;
}

export const sentenceChunker = (text: string, sentencesPerChunk:number, file_id:string, title:string): Document[] => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || []; // split on ., !, ?
    const chunks: Document[] = [];
  
    for (let i = 0; i < sentences.length; i += sentencesPerChunk) {
      const chunk = sentences.slice(i, i + sentencesPerChunk).join(" ").trim();
      const doc = new DocumnetConstructor({ pageContent: chunk, metadata:{document_id: `${file_id}`, title:`${title}`}, id: `${file_id}-${i}`, // helpful for traceability
    })
      chunks.push(doc);
    }
  
    return chunks;
};