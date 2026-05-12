import http from "http";
import { Server as SocketIOServer } from "socket.io";

import app from "./app.js";
import env from "./config/env.js";
import { initializeSocket } from "./socket/index.js";
import { connectDB } from "./db/connection.js";

const startServer = async () => {
    try {
        await connectDB();

        const httpServer = http.createServer(app);

        const io = new SocketIOServer(httpServer, {
            cors: {
                origin: env.CLIENT_URL,
                credentials: true,
            },
        });

        initializeSocket(io);

        httpServer.listen(env.PORT, () => {
            console.log(`✅ Server listening on http://localhost:${env.PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
