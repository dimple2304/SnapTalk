import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PORT } from './config/envIndex.js';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import frontendRoutes from './routes/frontend.routes.js';
import postRoutes from './routes/posts.routes.js';
import exploreRoutes from './routes/explore.routes.js';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';

import http from 'http';
import { setupSocket } from './socket/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cookieParser());

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "../frontend")));
app.set("views", path.resolve("./views"));

connectDB();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


app.use('/api/auth', authRoutes);
app.use('/', frontendRoutes);
app.use('/api/account', profileRoutes);
app.use('/api/create', postRoutes);
app.use('/api/explore', exploreRoutes);


app.use(globalErrorHandler)

const server = http.createServer(app)
setupSocket(server)

const port = process.env.PORT || PORT || 3000;

server.listen(port, () => {
    console.log(`Server started at ${port}`);
})
// app.listen(PORT, () => {
//     console.log(`Server started at https://localhost:${PORT}`);
// })
