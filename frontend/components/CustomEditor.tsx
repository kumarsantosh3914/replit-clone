import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '@/store/editorStore';

export const CustomEditor = () => {
    const { activeFilePath } = useEditorStore();
    const [content, setContent] = useState<string>('// Select a file to view its contents\n');

    // We load Dracula from public/Dracula.json if available
    const handleEditorWillMount = (monaco: any) => {
        fetch('/Dracula.json')
            .then(res => res.json())
            .then(theme => {
                monaco.editor.defineTheme('dracula', theme);
                monaco.editor.setTheme('dracula');
            })
            .catch(err => console.error("Could not load Dracula theme:", err));
    };

    // Mock content generation based on active path
    useEffect(() => {
        if (!activeFilePath) {
            setContent('// No file selected\n// Click a file in the sidebar to open it.');
            return;
        }

        // Temporary mock content until backend file getting is implemented
        if (activeFilePath.endsWith('.tsx') || activeFilePath.endsWith('.ts')) {
            setContent(`// Mock content for ${activeFilePath}\n\nexport const Example = () => {\n  return <div>Hello World</div>;\n};\n`);
        } else {
            setContent(`/* Mock content for ${activeFilePath} */\n`);
        }
    }, [activeFilePath]);

    return (
        <div className="flex-1 w-full h-[calc(100%-49px)] bg-[#1e1e1e]">
            {activeFilePath && (
                <Editor
                    height="100%"
                    defaultLanguage={activeFilePath.toLowerCase().endsWith('.tsx') || activeFilePath.toLowerCase().endsWith('.ts') ? 'typescript' : 'javascript'}
                    theme="vs-dark" // fallback if dracula fails to load
                    value={content}
                    options={{
                        minimap: { enabled: true },
                        fontSize: 14,
                        wordWrap: 'on',
                        lineNumbersMinChars: 4,
                        scrollBeyondLastLine: false,
                        padding: { top: 16 }
                    }}
                    beforeMount={handleEditorWillMount}
                />
            )}

            {!activeFilePath && (
                <div className="flex items-center justify-center h-full text-zinc-600 select-none">
                    <div className="flex flex-col items-center gap-3">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span>Select a file to start coding</span>
                    </div>
                </div>
            )}
        </div>
    );
};
