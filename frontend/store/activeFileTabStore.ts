import { create } from "zustand";

interface ActiveFileTab {
    path: string | null;
    value: string;
}

interface ActiveFileTabState {
    activeFileTab: ActiveFileTab | null;
    setActiveFileTab: (path: string | null, value: string) => void;
}

export const useActiveFileTabStore = create<ActiveFileTabState>((set) => ({
    activeFileTab: null,
    setActiveFileTab: (path, value) => {
        set({
            activeFileTab: {
                path,
                value
            }
        });
    }
}));
