import React from 'react';
import { FileIcon as GenericFile, FileCode2, Code2, Rss, FileJson } from 'lucide-react';

interface FileIconProps {
    extension: string;
}

export const FileIcon = ({ extension }: FileIconProps) => {
    const size = 16;

    const IconMapper: Record<string, React.ReactNode> = {
        js: <Code2 color="yellow" size={size} />,
        jsx: <FileCode2 color="#61dbfa" size={size} />,
        ts: <Code2 color="#3178c6" size={size} />,
        tsx: <FileCode2 color="#3178c6" size={size} />,
        css: <Rss color="#3c99dc" size={size} />, // Using Rss or similar as a proxy for CSS, or just generic
        html: <FileCode2 color="#e34c26" size={size} />,
        json: <FileJson color="#cbd5e1" size={size} />
    };

    return (
        <>
            {IconMapper[extension] || <GenericFile color="#94a3b8" size={size} />}
        </>
    );
};
