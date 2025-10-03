import { Document } from "langchain/document";
import { google } from "googleapis";
import pdf from "pdf-parse";

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

// /**
//  * Load a single PDF from Drive as a LangChain Document[]
//  */
// async function loadPdfFromDrive(fileId: string) {
//   const drive = getDriveClient();

//   // Download file as raw bytes
//   const res = await drive.files.get(
//     { fileId, alt: "media" },
//     { responseType: "arraybuffer" }
//   );

//   const buffer = Buffer.from(res.data as ArrayBuffer);

//   // Extract text from PDF
//   const data = await pdf(buffer);

//   return [
//     new Document({
//       pageContent: data.text,
//       metadata: {
//         source: `drive:${fileId}`,
//         pageCount: data.numpages,
//       },
//     }),
//   ];
// }

/**
 * Load all PDFs inside a given Google Drive folder
 */
export async function loadPdfsFromFolder(folderId: string) {
  const drive = getDriveClient();

  console.log(drive)

  // 1. List all PDFs
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType='application/pdf'`,
    fields: "files(id, name)",
  });

  console.log(res.data.files)
  

  // const files = res.data.files || [];

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
