import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import type { Document } from "@langchain/core/documents";
import { Document as DocumnetConstructor } from "@langchain/core/documents";

const SPLITTER = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,     // maximum size of each chunk (in characters)
    chunkOverlap: 200,   // how many characters overlap between chunks
});

const clearMarkdownSyntax = (string:string):string => {
    return (
        string
            .replace(/\s+/g, " ")            
            .replace(/“|”/g, '"')            
            .replace(/```[\s\S]*?```/g, "")
            .replace(/`([^`]*)`/g, "$1")
            .replace(/!\[.*?\]\(.*?\)/g, "")
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .replace(/^#{1,6}\s*/gm, "")
            .replace(/^\s{0,3}>\s?/gm, "")
            .replace(/^\s*[-*+]\s+/gm, "")
            .replace(/^\s*\d+\.\s+/gm, "")
            .replace(/(\*\*|__)(.*?)\1/g, "$2")
            .replace(/(\*|_)(.*?)\1/g, "$2")
            .replace(/^-{3,}$/gm, "")
            .replace(/\n{2,}/g, "\n")
    )
}

  
export const chunker = async (document: string, file_id:string, title:string): Promise<Document[]> => {
    let result:Document[] = await SPLITTER.createDocuments([document]);
    // Modify each chunk
    const editedChunks = result.map((chunk, i) => {
        const cleanedText = chunk.pageContent.trim();

        return new DocumnetConstructor({
            pageContent: cleanedText,
            metadata: {
                document_id: file_id,
                title,
                chunk_index: i,
            },
            id: `${file_id}-${i}`,
        });
    });

    return editedChunks;
}

export const sentenceChunker = (text: string, sentencesPerChunk:number, file_id:string, title:string): Document[] => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || []; 
    const chunks: Document[] = [];
  
    for (let i = 0; i < sentences.length; i += sentencesPerChunk) {
      const chunk = clearMarkdownSyntax(sentences.slice(i, i + sentencesPerChunk).join(" ").trim());
      const doc = new DocumnetConstructor({ 
            pageContent: chunk, 
            metadata:{
                document_id: `${file_id}`, 
                title:`${title}`}, 
                id: `${file_id}-${i}`, // helpful for traceability
        })      
      chunks.push(doc);
    }
  
    return chunks;
};