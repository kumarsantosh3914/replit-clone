/**
 * Generic API response envelope used by all API modules.
 * T is the shape of the `data` payload on success.
 */
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
}
