"use client";

import { useEffect, useState } from "react";
import { pingServer } from "@/lib/api/ping.api";
import { createProject } from "@/lib/api/projects.api";

type AsyncStatus = "idle" | "loading" | "success" | "error";

export default function Home() {
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
      setProjectId(result.data?.data ?? "");
      setProjectStatus("success");
    }
  };

  const copyProjectId = () => {
    navigator.clipboard.writeText(projectId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 font-sans px-6 py-16 gap-12">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Replit Clone – IDE
        </h1>
        <p className="text-zinc-500 text-sm">
          Backend running at{" "}
          <span className="text-zinc-300">
            {process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"}
          </span>
        </p>
      </div>

      {/* ── Cards grid ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
        {/* ── Ping card ──────────────────────────────────────────────── */}
        <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl flex flex-col gap-5">
          {/* card header */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              Health check
            </span>
            <code className="text-zinc-400 text-xs">GET /api/v1/ping/health</code>
          </div>

          {/* status */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-2">
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
                <span className="text-zinc-600 text-xs">Server is reachable</span>
              </>
            )}
            {pingStatus === "error" && (
              <>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="text-red-400 font-semibold text-lg">Unreachable</span>
                </div>
                <span className="text-zinc-600 text-xs break-all">{pingError}</span>
              </>
            )}
          </div>

          {/* action */}
          <button
            onClick={ping}
            disabled={pingStatus === "loading"}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {pingStatus === "loading" ? "Pinging…" : "Retry ping"}
          </button>
        </div>

        {/* ── Create project card ─────────────────────────────────────── */}
        <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl flex flex-col gap-5">
          {/* card header */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              New project
            </span>
            <code className="text-zinc-400 text-xs">POST /api/v1/projects</code>
          </div>

          {/* status */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-2">
            {projectStatus === "idle" && (
              <span className="text-zinc-600 text-sm text-center">
                Click the button below to scaffold a new Vite React sandbox.
              </span>
            )}
            {projectStatus === "loading" && (
              <>
                <div className="h-7 w-7 rounded-full border-2 border-zinc-700 border-t-violet-500 animate-spin" />
                <span className="text-zinc-500 text-sm">Creating project…</span>
              </>
            )}
            {projectStatus === "success" && (
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-semibold text-sm">
                    Project created!
                  </span>
                </div>
                <div className="w-full rounded-lg bg-zinc-800 px-3 py-2 flex items-center justify-between gap-2 mt-1">
                  <span className="text-zinc-300 text-xs font-mono truncate">
                    {projectId}
                  </span>
                  <button
                    onClick={copyProjectId}
                    className="text-xs text-zinc-400 hover:text-white transition-colors shrink-0"
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>
            )}
            {projectStatus === "error" && (
              <>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="text-red-400 font-semibold text-sm">Failed</span>
                </div>
                <span className="text-zinc-600 text-xs break-all">{projectError}</span>
              </>
            )}
          </div>

          {/* action */}
          <button
            onClick={handleCreateProject}
            disabled={projectStatus === "loading"}
            className="w-full rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500 active:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {projectStatus === "loading"
              ? "Creating…"
              : projectStatus === "success"
                ? "+ New project"
                : "Create project"}
          </button>
        </div>
      </div>
    </div>
  );
}
