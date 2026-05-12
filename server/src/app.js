import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import env from "./config/env.js";
import passport from "./config/passport.js";
import apiRoutes from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        secret: env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            httpOnly: true,
            secure: env.NODE_ENV === "production",
        },
    }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
    morgan(env.NODE_ENV === "production" ? "combined" : "dev"),
);

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Pollman backend is running 🚀",
    });
});

app.use(notFound);
app.use(errorHandler);

export default app;
