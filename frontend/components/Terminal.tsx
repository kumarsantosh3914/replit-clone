"use client";

import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { useTerminalSocketStore } from "@/store/terminalSocketStore";
import { io } from "socket.io-client";

interface TerminalProps {
    projectId: string;
}

export const Terminal = ({ projectId }: TerminalProps) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const { setTerminalSocket, terminalSocket } = useTerminalSocketStore();

    useEffect(() => {
        if (!terminalRef.current) return;

        // Initialize xterm
        const term = new XTerm({
            cursorBlink: true,
            theme: {
                background: "#0d0d0d",
                foreground: "#d4d4d4",
                cursor: "#d4d4d4",
                selectionBackground: "#333333",
                black: "#000000",
                red: "#cd3131",
                green: "#0dbc79",
                yellow: "#e5e510",
                blue: "#2472c8",
                magenta: "#bc3fbc",
                cyan: "#11a8cd",
                white: "#e5e5e5",
                brightBlack: "#666666",
                brightRed: "#f14c4c",
                brightGreen: "#23d18b",
                brightYellow: "#f5f543",
                brightBlue: "#3b8eea",
                brightMagenta: "#d670d6",
                brightCyan: "#29b8db",
                brightWhite: "#e5e5e5",
            },
            fontSize: 14,
            fontFamily: "'Fira Code', 'Ubuntu Mono', monospace",
            convertEol: true,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Initialize Socket
        const socketUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
        const socket = io(`${socketUrl}/terminal`, {
            query: { projectId },
        });

        setTerminalSocket(socket);

        socket.on("shell-output", (data: string) => {
            term.write(data);
        });

        term.onData((data) => {
            socket.emit("shell-input", data);
        });

        // Handle resizing
        const resizeObserver = new ResizeObserver(() => {
            fitAddon.fit();
        });
        resizeObserver.observe(terminalRef.current);

        return () => {
            socket.disconnect();
            setTerminalSocket(null);
            term.dispose();
            resizeObserver.disconnect();
        };
    }, [projectId, setTerminalSocket]);

    return (
        <div className="flex-1 bg-[#0d0d0d] p-2 min-h-0 relative group">
            <div className="absolute top-0 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 py-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-tighter bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">Bash (Docker)</span>
            </div>
            <div ref={terminalRef} className="w-full h-full" />
        </div>
    );
};
