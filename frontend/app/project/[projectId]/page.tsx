"use client";

import { useEffect } from "react";
import { use } from "react";
import { EditorTopBar } from "@/components/EditorTopBar";
import { CustomEditor } from "@/components/CustomEditor";
import { useEditorStore } from "@/store/editorStore";
import { TreeStructure } from "@/components/TreeStructure";
import { useEditorSocketStore } from "@/store/editorSocketStore";
import { useActiveFileTabStore } from "@/store/activeFileTabStore";
import { io } from "socket.io-client";
import { Terminal } from "@/components/Terminal";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";

export default function ProjectPlayground({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const { setEditorSocket, editorSocket } = useEditorSocketStore();
    const { setActiveFileTab } = useActiveFileTabStore();
    const [showTerminal, setShowTerminal] = useState(true);
    const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);

    useEffect(() => {
        if (projectId) {
            const socketUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
            const socketConn = io(`${socketUrl}/editor`, {
                query: { projectId }
            });

            setEditorSocket(socketConn);

            socketConn.on("readFileSuccess", (data) => {
                console.log("Read file success", data);
                setActiveFileTab(data.path, data.value);
            });

            return () => {
                socketConn.disconnect();
                setEditorSocket(null);
            };
        }
    }, [projectId, setEditorSocket, setActiveFileTab]);

    return (
        <div className="flex w-screen h-screen bg-zinc-950 font-sans overflow-hidden text-zinc-300">
            {/* ── Left Sidebar (Tree Structure) ───────────────────────── */}
            {projectId && (
                <div className="flex-shrink-0 w-[260px] max-w-[25%] h-full bg-[#0d0d0d] border-r border-white/5 flex flex-col overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            Explorer
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 px-1">
                        <TreeStructure projectId={projectId} />
                    </div>
                </div>
            )}

            {/* ── Right Pane (Editor & Terminal) ─────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] relative">
                <EditorTopBar />
                <div className="flex-1 relative overflow-hidden flex flex-col">
                    <div className={`flex-1 min-h-0 ${isTerminalMaximized ? 'hidden' : 'block'}`}>
                        <CustomEditor />
                    </div>

                    {/* Terminal Toggle Button (Floating) */}
                    {!showTerminal && (
                        <button
                            onClick={() => setShowTerminal(true)}
                            className="absolute bottom-4 right-4 p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full border border-white/10 shadow-xl transition-all z-20"
                            title="Open Terminal"
                        >
                            <TerminalIcon size={18} />
                        </button>
                    )}

                    {/* Bottom Terminal Component */}
                    {showTerminal && (
                        <div
                            className={`flex flex-col border-t border-white/5 bg-[#0d0d0d] transition-all duration-300 ease-in-out z-10 
                                ${isTerminalMaximized ? 'h-full' : 'h-[300px]'}`}
                        >
                            <div className="flex items-center justify-between px-4 py-1.5 border-b border-white/5 bg-zinc-900/50">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <TerminalIcon size={12} className="text-zinc-600" />
                                    Terminal
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setIsTerminalMaximized(!isTerminalMaximized)}
                                        className="p-1 hover:bg-white/5 rounded text-zinc-600 hover:text-zinc-400 transition-colors"
                                    >
                                        {isTerminalMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                                    </button>
                                    <button
                                        onClick={() => setShowTerminal(false)}
                                        className="p-1 hover:bg-white/5 rounded text-zinc-600 hover:text-zinc-400 transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                            <Terminal projectId={projectId} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
