import React from 'react';
import { useProjectTree } from '@/hooks/useProjectTree';
import { TreeNode } from './TreeNode';

export const TreeStructure = ({ projectId }: { projectId: string }) => {
    const { projectTree, isLoading, isError } = useProjectTree(projectId);

    if (isLoading) return <div className="text-zinc-400 p-4 text-sm font-mono animate-pulse">Scanning container files...</div>;
    if (isError) return <div className="text-red-400 p-4 text-sm">Failed to retrieve file tree.</div>;
    if (!projectTree) return null;

    return (
        <div className="pt-2 font-mono">
            <TreeNode fileFolderData={projectTree} />
        </div>
    );
};
