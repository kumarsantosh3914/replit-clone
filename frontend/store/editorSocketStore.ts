import { create } from "zustand";
import { Socket } from "socket.io-client";

interface EditorSocketState {
    editorSocket: Socket | null;
    setEditorSocket: (incomingSocket: Socket | null) => void;
}

export const useEditorSocketStore = create<EditorSocketState>((set) => ({
    editorSocket: null,
    setEditorSocket: (incomingSocket) => {
        set({
            editorSocket: incomingSocket
        });
    }
}));
