"use client";

import { useEffect } from "react";
import { use } from "react";
import { EditorTopBar } from "@/components/EditorTopBar";
import { CustomEditor } from "@/components/CustomEditor";
import { useEditorStore } from "@/store/editorStore";
import { TreeStructure } from "@/components/TreeStructure";

export default function ProjectPlayground({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);

    return (
        <div className="flex w-screen h-screen bg-zinc-950 font-sans overflow-hidden text-zinc-300">
            {/* ── Left Sidebar (Tree Structure) ───────────────────────── */}
            {projectId && (
                <div
                    className="flex-shrink-0"
                    style={{
                        backgroundColor: "#333254",
                        paddingRight: "10px",
                        paddingTop: "0.3vh",
                        minWidth: "250px",
                        maxWidth: "25%",
                        height: "100vh",
                        overflow: "auto"
                    }}
                >
                    <TreeStructure projectId={projectId} />
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
