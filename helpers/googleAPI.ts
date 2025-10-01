import { Document } from "langchain/document";
import { google } from "googleapis";
import pdf from "pdf-parse";

async function loadPdfFromDrive(fileId: string) {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "arraybuffer" }
  );

  const buffer = Buffer.from(res.data as ArrayBuffer);

  const data = await pdf(buffer);

  return [
    new Document({
      pageContent: data.text,
      metadata: { source: `drive:${fileId}` },
    }),
  ];
}
