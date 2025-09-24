import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envIndex.js"
import { UnauthorizedError } from "../utils/customErrorHandler/customError.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies["token"];

    if (!token) {
        return res.render("403")
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (!decoded) {
            throw new UnauthorizedError("Unauthorized access!");
        }

        req.user = decoded;

        if (!decoded.username && (req.url != "/feed" && req.url != "/api/auth/setting-username")) {
            return res.redirect("feed");
        }
        next();
    } catch (err) {
        next(err);
    }
}