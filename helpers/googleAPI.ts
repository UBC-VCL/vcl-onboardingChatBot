import { google } from "googleapis";
import { chunker, sentenceChunker } from "./chunker.js";
import { embed } from "./embedder.js";
import type { Document } from "@langchain/core/documents";

/**
 * Authenticate with Google Drive
 */
function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./credentials.json", // service account credentials file
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return google.drive({ version: "v3", auth });
}

/**
 * Load a single PDF from Drive as a LangChain Document[]
 */
interface GoogleFile {
  id:string;
  name:string;
}
async function loadFileFromDrive(file: GoogleFile): Promise<number | Error> {
  const drive = getDriveClient();
  const res = await drive.files.get(
    { fileId: file.id, alt: "media" },
    { responseType: "text" } 
  );

  const chunked:Document[] =  await sentenceChunker(res.data.toString(), 2, file.id, file.name);

  const embedded:number | Error = await embed(chunked);
  
  return 0;
}

/**
 * Load all PDFs inside a given Google Drive folder
 */
export async function loadFileFromFolder(folderId: string) {
  const drive = getDriveClient();

  let files:any = []; // holds id's of the PDF's that we want to read from the Google Drive

  try {
    // 1. List all PDFs
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='text/markdown'`,
      fields: "files(id, name)",
    });

    // console.log(res.data.files)

    if (res.status !== 200) {
      throw new Error(`Unexpected status code: ${res.status}`);
    }
    files = res.data.files!
  } catch (err) {
    console.log(err)
    return
    
  }

  // iterate through each PDF and do whatever needs to be done
  // for (let x=0; x<files.length; x++) {
  //   await loadPdfFromDrive(files[x].id!)
  // }
  try {
    const isEmbedded = await loadFileFromDrive(files[0]);

  } catch (err) {

  }
}
