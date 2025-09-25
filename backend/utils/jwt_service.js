import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/envIndex.js";

export const tokenCreation = ({ id, email, username="" }) => {
  try {
    const token = jwt.sign(
      { id, email, username }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );
    return token;
  } catch (err) {
    throw err; 
  }
};
