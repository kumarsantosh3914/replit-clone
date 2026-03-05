"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pingServer } from "@/lib/api/ping.api";
import { createProject } from "@/lib/api/projects.api";
import { Copy, CheckCircle2, ServerCrash, Server, Code2, FolderPlus } from "lucide-react";

type AsyncStatus = "idle" | "loading" | "success" | "error";

export default function Home() {
  const router = useRouter();

  // ── Ping state ──────────────────────────────────────────────────────────
  const [pingStatus, setPingStatus] = useState<AsyncStatus>("idle");
  const [pingMessage, setPingMessage] = useState("");
  const [pingError, setPingError] = useState("");

  const ping = async () => {
    setPingStatus("loading");
    setPingMessage("");
    setPingError("");

    const result = await pingServer();

    if (result.error) {
      setPingError(result.error);
      setPingStatus("error");
    } else {
      setPingMessage(result.data?.message ?? "");
      setPingStatus("success");
    }
  };

  useEffect(() => {
    ping();
  }, []);

  // ── Create project state ────────────────────────────────────────────────
  const [projectStatus, setProjectStatus] = useState<AsyncStatus>("idle");
  const [projectId, setProjectId] = useState("");
  const [projectError, setProjectError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreateProject = async () => {
    setProjectStatus("loading");
    setProjectId("");
    setProjectError("");

    const result = await createProject();

    if (result.error) {
      setProjectError(result.error);
      setProjectStatus("error");
    } else {
      const newProjectId = result.data?.data ?? "";
      setProjectId(newProjectId);
      setProjectStatus("success");

      // Auto-navigate to the playground after a short delay to show success state
      setTimeout(() => {
        router.push(`/project/${newProjectId}`);
      }, 800);
    }
  };

  const copyProjectId = () => {
    navigator.clipboard.writeText(projectId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 font-sans px-6 py-16 gap-12 text-zinc-300">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
          <Code2 size={40} className="text-indigo-400" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Replit Clone
          </h1>
          <p className="text-zinc-500 text-sm">
            Backend running at{" "}
            <span className="text-zinc-400 font-mono text-xs bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
              {process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"}
            </span>
          </p>
        </div>
      </div>

      {/* ── Cards grid ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
        {/* ── Ping card ──────────────────────────────────────────────── */}
        <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl flex flex-col gap-6 backdrop-blur-sm">
          {/* card header */}
          <div className="flex flex-col gap-2 border-b border-zinc-800/50 pb-4">
            <div className="flex items-center gap-2 text-zinc-400">
              <Server size={18} />
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
                Health check
              </span>
            </div>
          </div>

          {/* status */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-4">
            {pingStatus === "loading" && (
              <>
                <div className="h-7 w-7 rounded-full border-2 border-zinc-700 border-t-indigo-500 animate-spin" />
                <span className="text-zinc-500 text-sm">Pinging…</span>
              </>
            )}
            {pingStatus === "success" && (
              <>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-semibold text-lg capitalize">
                    {pingMessage}
                  </span>
                </div>
                <span className="text-zinc-500 text-xs">Server is reachable</span>
              </>
            )}
            {pingStatus === "error" && (
              <>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="text-red-400 font-semibold text-lg">Unreachable</span>
                </div>
                <span className="text-zinc-600 text-xs break-all text-center">{pingError}</span>
              </>
            )}
          </div>

          {/* action */}
          <button
            onClick={ping}
            disabled={pingStatus === "loading"}
            className="w-full rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white active:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed border border-zinc-700"
          >
            {pingStatus === "loading" ? "Pinging…" : "Retry Health Check"}
          </button>
        </div>

        {/* ── Create project card ─────────────────────────────────────── */}
        <div className="flex-1 rounded-2xl border border-violet-900/30 bg-violet-950/10 p-6 shadow-xl flex flex-col gap-6 backdrop-blur-sm relative overflow-hidden">
          {/* decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          {/* card header */}
          <div className="flex flex-col gap-2 border-b border-zinc-800/50 pb-4 relative z-10">
            <div className="flex items-center gap-2 text-violet-400">
              <FolderPlus size={18} />
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-300">
                New project
              </span>
            </div>
          </div>

          {/* status */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-4 relative z-10">
            {projectStatus === "idle" && (
              <span className="text-zinc-500 text-sm text-center">
                Click below to scaffold a new Vite React workspace.
              </span>
            )}
            {projectStatus === "loading" && (
              <>
                <div className="h-7 w-7 rounded-full border-2 border-violet-900 border-t-violet-400 animate-spin" />
                <span className="text-violet-400/80 text-sm">Building container…</span>
              </>
            )}
            {projectStatus === "success" && (
              <div className="flex flex-col items-center gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-semibold text-sm">
                    Ready! Redirecting...
                  </span>
                </div>
                <div className="w-full rounded-lg bg-black/40 px-3 py-2 flex items-center justify-between gap-2 border border-zinc-800/50">
                  <span className="text-zinc-400 text-xs font-mono truncate">
                    {projectId}
                  </span>
                  <button
                    onClick={copyProjectId}
                    className="text-xs text-zinc-500 hover:text-white transition-colors shrink-0"
                  >
                    {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}
            {projectStatus === "error" && (
              <>
                <div className="flex items-center gap-2">
                  <ServerCrash size={18} className="text-red-500" />
                  <span className="text-red-400 font-semibold text-sm">Failed to create</span>
                </div>
                <span className="text-red-500/70 text-xs break-all text-center bg-red-500/10 p-2 rounded w-full border border-red-500/20">{projectError}</span>
              </>
            )}
          </div>

          {/* action */}
          <button
            onClick={handleCreateProject}
            disabled={projectStatus === "loading" || projectStatus === "success"}
            className="relative z-10 w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-violet-500 active:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(124,58,237,0.4)] hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.5)]"
          >
            {projectStatus === "loading"
              ? "Working…"
              : projectStatus === "success"
                ? "Entering Workspace…"
                : "Launch Workspace"}
          </button>
        </div>
      </div>
    </div>
  );
}
