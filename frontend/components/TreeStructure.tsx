import React from 'react';
import { useProjectTree } from '@/hooks/useProjectTree';
import { TreeNode } from './TreeNode';
import { useFileContextMenuStore } from '@/store/fileContextMenuStore';
import { FileContextMenu } from './FileContextMenu';

export const TreeStructure = ({ projectId }: { projectId: string }) => {
    const { projectTree, isLoading, isError } = useProjectTree(projectId);
    const { isOpen, x, y, path, isFolder } = useFileContextMenuStore();

    if (isLoading) return <div className="text-zinc-400 p-4 text-sm font-mono animate-pulse uppercase tracking-widest text-center">Scanning...</div>;
    if (isError) return <div className="text-red-400 p-4 text-sm text-center">Connection Failed.</div>;
    if (!projectTree) return null;

    return (
        <div className="pt-2 font-mono relative">
            {isOpen && x !== null && y !== null && path && (
                <FileContextMenu x={x} y={y} path={path} isFolder={isFolder} />
            )}
            <TreeNode fileFolderData={projectTree} />
        </div>
    );
};

