import { create } from "zustand";

interface FileContextMenuState {
    x: number | null;
    y: number | null;
    isOpen: boolean;
    path: string | null;
    isFolder: boolean;
    setX: (incomingX: number | null) => void;
    setY: (incomingY: number | null) => void;
    setIsOpen: (incomingIsOpen: boolean) => void;
    setPath: (incomingPath: string | null) => void;
    setIsFolder: (incomingIsFolder: boolean) => void;
    closeMenu: () => void;
}

export const useFileContextMenuStore = create<FileContextMenuState>((set) => ({
    x: null,
    y: null,
    isOpen: false,
    path: null,
    isFolder: false,
    setX: (incomingX) => set({ x: incomingX }),
    setY: (incomingY) => set({ y: incomingY }),
    setIsOpen: (incomingIsOpen) => set({ isOpen: incomingIsOpen }),
    setPath: (incomingPath) => set({ path: incomingPath }),
    setIsFolder: (incomingIsFolder) => set({ isFolder: incomingIsFolder }),
    closeMenu: () => set({ isOpen: false, x: null, y: null, path: null, isFolder: false }),
}));
