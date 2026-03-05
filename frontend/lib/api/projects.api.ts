import apiClient from "@/lib/apiClient";

export interface CreateProjectResponse {
    message: string;
    data: string; // projectId (uuid)
}

/**
 * Calls POST /api/v1/projects
 * Scaffolds a new Vite React sandbox and returns its projectId.
 */
export const createProject = () =>
    apiClient.post<CreateProjectResponse>("/api/v1/projects", {});
