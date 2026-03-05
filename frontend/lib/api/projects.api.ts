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

export interface GetProjectTreeResponse {
    message: string;
    success: boolean;
    data: any;
}

export const getProjectTree = (projectId: string) =>
    apiClient.get<GetProjectTreeResponse>(`/api/v1/projects/${projectId}/tree`);
