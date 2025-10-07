export interface EmbeddedOBJ {
    id:string;
    values:number[];
    metadata: EmbeddedMetadataOBJ;
}

interface EmbeddedMetadataOBJ {
    docId:string;
    title:string;
    pageContent:string    
}