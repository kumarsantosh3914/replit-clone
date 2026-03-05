import React, { useEffect, useRef } from 'react';
import { Trash2, Edit3, FilePlus, FolderPlus, X } from 'lucide-react';
import { useFileContextMenuStore } from '@/store/fileContextMenuStore';
import { useEditorSocketStore } from '@/store/editorSocketStore';

interface FileContextMenuProps {
    x: number;
    y: number;
    path: string;
    isFolder: boolean;
}

export const FileContextMenu = ({ x, y, path, isFolder }: FileContextMenuProps) => {
    const { closeMenu } = useFileContextMenuStore();
    const { editorSocket } = useEditorSocketStore();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeMenu]);

    const handleDelete = () => {
        if (!editorSocket) return;

        const eventName = isFolder ? "deleteFolder" : "deleteFile";
        editorSocket.emit(eventName, { pathToFileOrFolder: path });
        closeMenu();
    };

    const menuItems = [
        { label: 'Delete', icon: <Trash2 size={14} />, onClick: handleDelete, variant: 'danger' },
        { label: 'Rename', icon: <Edit3 size={14} />, onClick: () => { console.log('Rename', path); closeMenu(); } },
    ];

    if (isFolder) {
        menuItems.unshift(
            { label: 'New File', icon: <FilePlus size={14} />, onClick: () => { console.log('New File', path); closeMenu(); } },
            { label: 'New Folder', icon: <FolderPlus size={14} />, onClick: () => { console.log('New Folder', path); closeMenu(); } },
        );
    }

    return (
        <div
            ref={menuRef}
            className="fixed z-50 min-w-[160px] bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden py-1 animate-in fade-in zoom-in duration-100"
            style={{ top: y, left: x }}
        >
            <div className="px-3 py-1.5 border-b border-white/5 bg-white/5">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter truncate max-w-[140px]">
                    {path.split('/').pop()}
                </p>
            </div>
            {menuItems.map((item, index) => (
                <button
                    key={index}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors text-left outline-none
                        ${item.variant === 'danger'
                            ? 'text-red-400 hover:bg-red-500/10'
                            : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <span className={item.variant === 'danger' ? 'text-red-400' : 'text-zinc-500'}>
                        {item.icon}
                    </span>
                    {item.label}
                </button>
            ))}
        </div>
    );
};
