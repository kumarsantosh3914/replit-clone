import React from 'react';
import { Play } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { EditorTab } from '@/components/EditorTab';

export const EditorTopBar = () => {
    const { openFiles, activeFilePath, setActiveFile, closeFile, addFile } = useEditorStore();

    const handleRun = () => {
        console.log(`Running file: ${activeFilePath}`);
    };

    return (
        <div className="flex items-center justify-between bg-[#242424] border-b border-[#1e1e1e] select-none pl-2">
            {/* Scrollable Tabs Container */}
            <div className="flex items-center overflow-x-auto flex-1 no-scrollbar h-[38px]">
                {openFiles.map((filepath) => {
                    // Extract just the filename for the tab display
                    const filename = filepath.split('/').pop() || filepath;

                    return (
                        <EditorTab
                            key={filepath}
                            filename={filename}
                            isActive={activeFilePath === filepath}
                            onClick={() => setActiveFile(filepath)}
                            onClose={() => closeFile(filepath)}
                        />
                    );
                })}

                {/* Temporary buttons for testing the store without a FileTree */}
                {openFiles.length === 0 && (
                    <div className="flex gap-2 px-4 py-1.5">
                        <button onClick={() => addFile('src/App.tsx')} className="text-xs text-zinc-400 hover:text-white border border-zinc-700 px-2 py-1 rounded">Open App.tsx</button>
                        <button onClick={() => addFile('src/index.css')} className="text-xs text-zinc-400 hover:text-white border border-zinc-700 px-2 py-1 rounded">Open index.css</button>
                    </div>
                )}
            </div>

            {/* Global Actions */}
            <div className="px-3 shrink-0 border-l border-[#363636] h-[38px] flex items-center">
                <button
                    onClick={handleRun}
                    disabled={!activeFilePath}
                    className="flex items-center gap-1.5 px-3 py-1 bg-green-600/10 text-green-400 hover:bg-green-600/20 active:bg-green-600/30 transition-colors rounded-md text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Play size={14} className="fill-current" />
                    Run
                </button>
            </div>
        </div>
    );
};
