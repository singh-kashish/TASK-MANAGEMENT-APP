import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background flex-1 overflow-x-hidden pb-6">
      <Navbar />

      <main className="mx-auto max-w-7xl p-y-2 lg:p-x-4 lg:p-0">
        <Outlet />
      </main>
    </div>
  );
}