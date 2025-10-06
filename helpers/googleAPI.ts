import { google } from "googleapis";
import { chunker, sentenceChunker } from "./chunker.js";

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
async function loadFileFromDrive(fileId: string) {
  const drive = getDriveClient();

  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "text" }
  );

  // console.log(typeof res.data);
  // console.log(await chunker(res.data.toString()));
  console.log(await sentenceChunker(res.data.toString(), 2));

  
    
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
  console.log(files[0])
  await loadFileFromDrive(files[0].id)

  



  // if (files.length === 0) {
  //   console.log("No PDFs found in folder.");
  //   return [];
  // }

  // let allDocs: Document[] = [];

  // // 2. Process each PDF
  // for (const file of files) {
  //   console.log(`Processing PDF: ${file.name} (${file.id})`);
  //   const docs = await loadPdfFromDrive(file.id!);

  //   // Attach filename in metadata too
  //   docs.forEach(doc => {
  //   //   doc.metadata.filename = file.name;
  //       console.log(doc.metadata)
  //   });

  //   allDocs.push(...docs);
  // }

  // console.log(`Loaded ${allDocs.length} docs from ${files.length} PDFs.`);
  // return allDocs;
}
