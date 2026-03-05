import { create } from "zustand";
import { Socket } from "socket.io-client";
import { queryClient } from "@/lib/queryClient";


interface EditorSocketState {
    editorSocket: Socket | null;
    setEditorSocket: (incomingSocket: Socket | null) => void;
}

export const useEditorSocketStore = create<EditorSocketState>((set) => ({
    editorSocket: null,
    setEditorSocket: (incomingSocket) => {
        if (incomingSocket) {
            incomingSocket.on("deleteFileSuccess", () => {
                queryClient.invalidateQueries({ queryKey: ['projecttree'] });
            });
            incomingSocket.on("deleteFolderSuccess", () => {
                queryClient.invalidateQueries({ queryKey: ['projecttree'] });
            });
        }
        set({
            editorSocket: incomingSocket
        });
    }
}));

