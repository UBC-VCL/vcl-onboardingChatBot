import dotenv from "dotenv";
import { loadFileFromFolder } from "./helpers/googleAPI.js";

// Load environment variables
dotenv.config();

const GOOGLE_DRIVE_ID = "15DGRVgmBBmvnCKBuYLxJlAXysMQZmMGK";

loadFileFromFolder(GOOGLE_DRIVE_ID);