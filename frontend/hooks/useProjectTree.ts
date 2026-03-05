import { useQuery } from "@tanstack/react-query";
import { getProjectTree } from "@/lib/api/projects.api";

export const useProjectTree = (projectId: string) => {
    const { isLoading, isError, data: projectTreeData, error } = useQuery({
        queryKey: ['projecttree', projectId],
        queryFn: () => getProjectTree(projectId),
        enabled: !!projectId,
    });

    return {
        isLoading,
        isError,
        projectTree: projectTreeData?.data?.data,
        error,
    };
};
