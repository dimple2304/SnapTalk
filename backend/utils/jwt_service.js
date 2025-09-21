import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/envIndex.js";

export const tokenCreation = ({ id, email }) => {
  try {
    const token = jwt.sign(
      { id, email }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );
    return token;
  } catch (err) {
    throw err; 
  }
};
