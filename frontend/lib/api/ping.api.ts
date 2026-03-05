import apiClient from "@/lib/apiClient";

export interface PingResponse {
    message: string;
}

/**
 * Calls GET /api/v1/ping
 * Returns { message: "pong" } on success.
 */
export const pingServer = () =>
    apiClient.get<PingResponse>("/api/v1/ping/health");
