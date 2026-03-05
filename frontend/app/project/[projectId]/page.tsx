"use client";

import { useEffect } from "react";
import { use } from "react";
import { EditorTopBar } from "@/components/EditorTopBar";
import { CustomEditor } from "@/components/CustomEditor";
import { useEditorStore } from "@/store/editorStore";
import { Code2, Server } from "lucide-react";

export default function ProjectPlayground({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const { setActiveFile } = useEditorStore();

    useEffect(() => {
        // Simulate loading the project tree and opening a default file
        setTimeout(() => {
            setActiveFile('src/App.tsx');
        }, 1000);
    }, [setActiveFile]);

    return (
        <div className="flex w-screen h-screen bg-zinc-950 font-sans overflow-hidden text-zinc-300">
            {/* ── Left Sidebar (Tools & Context) ───────────────────────── */}
            <div className="w-80 flex-shrink-0 border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
                    <div className="p-1.5 bg-indigo-500/20 rounded-md">
                        <Code2 size={20} className="text-indigo-400" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h1 className="font-semibold text-white tracking-tight truncate">
                            Project Playground
                        </h1>
                        <p className="text-xs text-zinc-500 font-mono truncate">
                            ID: {projectId}
                        </p>
                    </div>
                </div>

                {/* Scrollable contents (File Explorer placeholder etc) */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Server size={16} />
                            <h2 className="text-sm font-medium uppercase tracking-wider">File Explorer</h2>
                        </div>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm text-center">
                            <p className="text-xs text-zinc-500">File system fetching will be implemented here for project <br /><span className="font-mono text-[10px] text-zinc-400">{projectId}</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right Pane (Editor) ──────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] relative">
                <EditorTopBar />
                <CustomEditor />
            </div>
        </div>
    );
}
