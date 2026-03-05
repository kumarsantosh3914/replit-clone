import React from 'react';
import {
    FileIcon as GenericFile,
    FileCode2,
    Code2,
    Rss,
    FileJson,
    Folder,
    FolderOpen,
    Globe,
    FileText,
    Settings,
    Shield
} from 'lucide-react';

interface FileIconProps {
    extension?: string;
    isFolder?: boolean;
    isOpen?: boolean;
    name?: string;
}

export const FileIcon = ({ extension, isFolder, isOpen, name }: FileIconProps) => {
    const size = 16;

    if (isFolder) {
        return isOpen ?
            <FolderOpen color="#94a3b8" size={size} strokeWidth={1.5} /> :
            <Folder color="#94a3b8" size={size} strokeWidth={1.5} />;
    }

    // Special case for config files
    if (name?.includes('eslint')) return <Settings color="#4b32c3" size={size} strokeWidth={1.5} />;
    if (name?.includes('gitignore')) return <Shield color="#f54d27" size={size} strokeWidth={1.5} />;
    if (name?.includes('package.json')) return <FileJson color="#e34c26" size={size} strokeWidth={1.5} />;

    const IconMapper: Record<string, React.ReactNode> = {
        js: <Code2 color="#f1e05a" size={size} strokeWidth={1.5} />,
        jsx: <FileCode2 color="#61dbfa" size={size} strokeWidth={1.5} />,
        ts: <Code2 color="#3178c6" size={size} strokeWidth={1.5} />,
        tsx: <FileCode2 color="#3178c6" size={size} strokeWidth={1.5} />,
        css: <Rss color="#563d7c" size={size} strokeWidth={1.5} />,
        html: <Globe color="#e34c26" size={size} strokeWidth={1.5} />,
        json: <FileJson color="#f1e05a" size={size} strokeWidth={1.5} />,
        md: <FileText color="#94a3b8" size={size} strokeWidth={1.5} />
    };

    const ext = extension?.toLowerCase();

    return (
        <>
            {ext && IconMapper[ext] ? IconMapper[ext] : <GenericFile color="#94a3b8" size={size} strokeWidth={1.5} />}
        </>
    );
};

