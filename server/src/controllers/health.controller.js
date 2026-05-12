import { getHealthStatus } from "../services/health.service.js";

export function healthCheck(req, res) {
    return res.status(200).json({
        success: true,
        data: getHealthStatus(),
    });
}
