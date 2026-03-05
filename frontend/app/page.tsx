"use client";

import { useEffect, useState } from "react";
import { pingServer } from "@/lib/api/ping.api";

type PingStatus = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [status, setStatus] = useState<PingStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const ping = async () => {
    setStatus("loading");
    setMessage("");
    setError("");

    const result = await pingServer();

    if (result.error) {
      setError(result.error);
      setStatus("error");
    } else {
      setMessage(result.data?.message ?? "");
      setStatus("success");
    }
  };

  useEffect(() => {
    ping();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 font-sans">
      <main className="flex flex-col items-center gap-8 text-center px-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Replit Clone – IDE
          </h1>
          <p className="text-zinc-400 text-sm">
            Backend health check via{" "}
            <code className="text-zinc-300 bg-zinc-800 rounded px-1.5 py-0.5 text-xs">
              GET /api/v1/ping
            </code>
          </p>
        </div>

        {/* Status card */}
        <div className="w-72 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl flex flex-col items-center gap-4">
          {status === "idle" && (
            <span className="text-zinc-500 text-sm">Waiting…</span>
          )}

          {status === "loading" && (
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 rounded-full border-2 border-zinc-600 border-t-indigo-500 animate-spin" />
              <span className="text-zinc-400 text-sm">Pinging server…</span>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-semibold text-lg capitalize">
                  {message}
                </span>
              </div>
              <span className="text-zinc-500 text-xs">Server is reachable</span>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="text-red-400 font-semibold text-lg">
                  Unreachable
                </span>
              </div>
              <span className="text-zinc-500 text-xs break-all">{error}</span>
            </div>
          )}

          {/* Retry button */}
          {status !== "loading" && (
            <button
              onClick={ping}
              className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 active:bg-indigo-700"
            >
              {status === "idle" ? "Ping" : "Retry"}
            </button>
          )}
        </div>

        {/* Endpoint label */}
        <p className="text-zinc-600 text-xs">
          Backend URL:{" "}
          <span className="text-zinc-400">
            {process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"}
          </span>
        </p>
      </main>
    </div>
  );
}
