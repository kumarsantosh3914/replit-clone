import { ApiResponse } from "@/types/api.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

async function request<T>(
    path: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${BASE_URL}${path}`, {
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            ...options,
        });

        const json = await response.json();

        if (!response.ok) {
            return {
                data: null,
                error: json?.message ?? `Request failed with status ${response.status}`,
                status: response.status,
            };
        }

        return { data: json as T, error: null, status: response.status };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Network error";
        return { data: null, error: message, status: 0 };
    }
}

const apiClient = {
    get<T>(path: string, options?: Omit<RequestInit, "method" | "body">) {
        return request<T>(path, { ...options, method: "GET" });
    },
    post<T>(path: string, body: unknown, options?: Omit<RequestInit, "method">) {
        return request<T>(path, {
            ...options,
            method: "POST",
            body: JSON.stringify(body),
        });
    },
    put<T>(path: string, body: unknown, options?: Omit<RequestInit, "method">) {
        return request<T>(path, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
        });
    },
    delete<T>(path: string, options?: Omit<RequestInit, "method" | "body">) {
        return request<T>(path, { ...options, method: "DELETE" });
    },
};

export default apiClient;
