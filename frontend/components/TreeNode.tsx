import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { FileIcon } from "./FileIcon";
import { useEditorStore } from "@/store/editorStore";

interface TreeNodeProps {
    fileFolderData: any;
}

export const TreeNode = ({ fileFolderData }: TreeNodeProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { addFile } = useEditorStore();

    if (!fileFolderData) return null;

    const computeExtension = (filename: string | undefined) => {
        if (!filename) return "";
        const parts = filename.split(".");
        return parts.length > 1 ? parts[parts.length - 1] : "";
    };
    const isFolder = !!fileFolderData.children;

    const handleFileClick = () => {
        // Use directory-tree's exact path property
        addFile(fileFolderData.path);
    };

    return (
        <div className="pl-3 text-zinc-300">
            {isFolder ? (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center w-full gap-1 py-1 px-1 bg-transparent hover:bg-white/5 transition-colors rounded text-[14px] cursor-pointer outline-none"
                >
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span className="truncate">{fileFolderData.name}</span>
                </button>
            ) : (
                <div
                    className="flex items-center gap-2 py-1 px-2 hover:bg-white/5 transition-colors rounded cursor-pointer group"
                    onClick={handleFileClick}
                >
                    <FileIcon extension={computeExtension(fileFolderData.name)} />
                    <span className="text-[13px] truncate group-hover:text-white transition-colors">
                        {fileFolderData.name}
                    </span>
                </div>
            )}
            {isOpen && fileFolderData.children && (
                <div>
                    {fileFolderData.children.map((child: any) => (
                        <TreeNode fileFolderData={child} key={child.path} />
                    ))}
                </div>
            )}
        </div>
    );
};
