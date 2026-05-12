export function initializeSocket(io) {
    io.on("connection", (socket) => {
        console.log(`[socket] connected: ${socket.id}`);

        socket.on("join:poll", (pollId) => {
            if (!pollId) return;
            socket.join(`poll:${pollId}`);
        });

        socket.on("disconnect", () => {
            console.log(`[socket] disconnected: ${socket.id}`);
        });
    });
}
