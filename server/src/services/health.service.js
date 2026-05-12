export function getHealthStatus() {
    return {
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    };
}
