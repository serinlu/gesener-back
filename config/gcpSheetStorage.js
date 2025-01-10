import { Storage } from "@google-cloud/storage";
import { fileURLToPath } from "url";
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: path.join(__dirname, '../amazing-zephyr-439000-e3-598779247099.json'),
});

const bucketName = process.env.GCP_SHEET_BUCKET_NAME || 'gesener'
const sheetBucket = storage.bucket(bucketName)

export { storage, sheetBucket }