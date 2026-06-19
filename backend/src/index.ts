import express, { Request, Response } from 'express';
import authRouter from './routes/auth.routes';
import blogRouter from './routes/blog.routes';
import start from './server';
import { authMiddleware } from './middlewares/auth.middleware';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import cors from 'cors'
import cookieParser from 'cookie-parser'
import limiter from 'express-rate-limit'
import { getUserById } from './database/repositories/user.repo';

declare global {
    namespace Express {
        interface Request {
            user_id?: number;
        }
    }
}


const app = express();
app.set('trust proxy', 1)
app.use(express.json());
app.use(
    cors({
        // change it later
        origin: "https://bloggingplatform-production-421c.up.railway.app",
        credentials: true,
    }),
);

app.use(
    limiter({
        max: 200,
    }),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cookieParser());


app.get('/healthz', (_: Request, res: Response) => {
    res.send('We Are Fine');
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/blogs", authMiddleware, blogRouter);
app.get("/api/v1/me", async (req: Request, res: Response) => {
    try {
        if (!req.user_id) {
            return res.status(401).json({ message: "Unauthorized, no token provided", ok: false });
        }
        const user = await getUserById(req.user_id!);
        return res.status(200).json({ user, ok: true });
    } catch (err) {
        res.status(500).json({ message: "Server Error", ok: false });
    }
})


start(app);