import { create } from 'zustand';

interface EditorState {
    openFiles: string[];
    activeFilePath: string | null;
    setActiveFile: (path: string | null) => void;
    addFile: (path: string) => void;
    closeFile: (path: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    openFiles: [],
    activeFilePath: null,

    setActiveFile: (path) => set({ activeFilePath: path }),

    addFile: (path) => set((state) => {
        if (!path) return state;
        // If the file isn't open yet, add it to the array
        if (!state.openFiles.includes(path)) {
            return {
                openFiles: [...state.openFiles, path],
                activeFilePath: path
            };
        }
        // If it is open, just make it active
        return { activeFilePath: path };
    }),

    closeFile: (path) => set((state) => {
        const newOpenFiles = state.openFiles.filter(f => f !== path);
        // If we're closing the currently active file, pick the next available one
        let newActive = state.activeFilePath;
        if (state.activeFilePath === path) {
            newActive = newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null;
        }
        return {
            openFiles: newOpenFiles,
            activeFilePath: newActive
        };
    }),
}));
