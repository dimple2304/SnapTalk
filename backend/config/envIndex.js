import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    PORT,
    DB_CONNECTION_STRING,
    DB_PASSWORD,
    EMAIL_ID,
    EMAIL_PASS,
    IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT
} = process.env;
