import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import env from "./config/env.js";
import passport from "./config/passport.js";
import apiRoutes from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
    }),
);

// Serve static files from the React app build directory
if (env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../../dist")));
}

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

// Catch all handler: send back React's index.html file for client-side routing
if (env.NODE_ENV === "production") {
    app.use((req, res) => {
        res.sendFile(path.join(__dirname, "../../dist/index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.status(200).json({
            success: true,
            message: "Pollman backend is running 🚀",
        });
    });
}

app.use(notFound);
app.use(errorHandler);


export default app;
