let socketIO = null;

export function setSocketIO(io) {
    socketIO = io;
}

export function getSocketIO() {
    return socketIO;
}

export function emitPollResponseNew(pollId, payload) {
    if (!socketIO) return;
    socketIO.to(`poll:${pollId}`).emit("poll:response:new", payload);
}

export function emitPollAnalyticsUpdate(userId, payload) {
    if (!socketIO || !userId) return;
    socketIO.to(`creator:${userId}`).emit("poll:analytics:update", payload);
}

export function initializeSocket(io) {
    setSocketIO(io);

    io.on("connection", (socket) => {
        console.log(`[socket] connected: ${socket.id}`);

        socket.on("join:poll", (pollId) => {
            if (!pollId) return;
            socket.join(`poll:${pollId}`);
        });

        socket.on("join:creator", (userId) => {
            if (!userId) return;
            socket.join(`creator:${userId}`);
        });

        socket.on("disconnect", () => {
            console.log(`[socket] disconnected: ${socket.id}`);
        });
    });
}
