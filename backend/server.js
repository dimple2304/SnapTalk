import express from 'express';
import path, { win32 } from 'path';
import { fileURLToPath } from 'url';
import { PORT } from './config/envIndex.js';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import frontendRoutes from './routes/frontend.routes.js';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cookieParser());

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "../frontend")));
app.set("views", path.resolve("./views"));

connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/', frontendRoutes);


app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log(`Server started at https://localhost:${PORT}`);
})
