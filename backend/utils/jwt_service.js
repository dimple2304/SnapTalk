import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/envIndex.js';

export const tokenCreation = function ({ id, email }) {
    try {
        let options = {
            httpOnly:true,
            secure:true
        }
        const token = jwt.sign({ id: id, email: email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }, options);
        return token;
    } catch (err) {
        throw new err;
    }
}