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

export default function ProjectPlayground({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const { setEditorSocket, editorSocket } = useEditorSocketStore();
    const { setActiveFileTab } = useActiveFileTabStore();

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

            {/* ── Right Pane (Editor) ──────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] relative">
                <EditorTopBar />
                <CustomEditor />
            </div>
        </div>
    );
}
