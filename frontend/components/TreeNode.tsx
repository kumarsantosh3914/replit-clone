import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { FileIcon } from "./FileIcon";
import { useEditorStore } from "@/store/editorStore";
import { useEditorSocketStore } from "@/store/editorSocketStore";
import { useFileContextMenuStore } from "@/store/fileContextMenuStore";

interface TreeNodeProps {
    fileFolderData: any;
}

export const TreeNode = ({ fileFolderData }: TreeNodeProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { addFile, activeFilePath } = useEditorStore();
    const { editorSocket } = useEditorSocketStore();
    const { setX, setY, setIsFolder, setPath, setIsOpen: setContextMenuIsOpen } = useFileContextMenuStore();

    if (!fileFolderData) return null;

    const computeExtension = (filename: string | undefined) => {
        if (!filename) return "";
        const parts = filename.split(".");
        return parts.length > 1 ? parts[parts.length - 1] : "";
    };
    const isFolder = !!fileFolderData.children;
    const isActive = activeFilePath === fileFolderData.path;

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setX(e.clientX);
        setY(e.clientY);
        setPath(fileFolderData.path);
        setIsFolder(isFolder);
        setContextMenuIsOpen(true);
    };

    const handleDoubleClick = () => {
        if (!isFolder && editorSocket) {
            editorSocket.emit("readFile", {
                pathToFileOrFolder: fileFolderData.path
            });
            addFile(fileFolderData.path);
        }
    };

    return (
        <div className="relative">
            {isFolder ? (
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    onContextMenu={handleContextMenu}
                    className="flex items-center w-full gap-1.5 py-1 px-2 hover:bg-white/5 transition-colors rounded cursor-pointer group select-none"
                >
                    <div className="flex-shrink-0 text-zinc-500 group-hover:text-zinc-300">
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                    <FileIcon isFolder={true} isOpen={isOpen} />
                    <span className="truncate text-sm text-zinc-300 font-medium group-hover:text-white transition-colors">
                        {fileFolderData.name}
                    </span>
                </div>
            ) : (
                <div
                    className={`flex items-center gap-2 py-1 px-3 ml-1 transition-all rounded cursor-pointer group select-none ${isActive
                        ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10"
                        : "hover:bg-white/5 text-zinc-400"
                        }`}
                    onDoubleClick={handleDoubleClick}
                    onContextMenu={handleContextMenu}
                >
                    <div className="flex-shrink-0 grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100">
                        <FileIcon extension={computeExtension(fileFolderData.name)} name={fileFolderData.name} />
                    </div>
                    <span className={`text-[13px] truncate transition-colors ${isActive ? "text-white font-semibold" : "group-hover:text-zinc-200"}`}>
                        {fileFolderData.name}
                    </span>
                </div>
            )}

            {isOpen && fileFolderData.children && (
                <div className="relative mt-0.5 ml-3 pb-0.5 border-l border-white/5 hover:border-white/10 transition-colors pl-1">
                    {fileFolderData.children.map((child: any) => (
                        <TreeNode fileFolderData={child} key={child.path} />
                    ))}
                </div>
            )}
        </div>
    );
};


