import dotenv from "dotenv";
dotenv.config()

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
