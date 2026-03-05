import { create } from "zustand";
import { Socket } from "socket.io-client";

interface TerminalSocketState {
    terminalSocket: Socket | null;
    setTerminalSocket: (socket: Socket | null) => void;
}

export const useTerminalSocketStore = create<TerminalSocketState>((set) => ({
    terminalSocket: null,
    setTerminalSocket: (socket) => set({ terminalSocket: socket }),
}));
