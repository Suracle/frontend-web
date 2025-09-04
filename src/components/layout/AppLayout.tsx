import * as React from "react";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
