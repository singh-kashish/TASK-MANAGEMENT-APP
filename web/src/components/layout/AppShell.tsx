import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background flex-1 overflow-x-hidden">
      <Navbar />

      <main className="mx-auto max-w-7xl p-y-4 lg:p-x-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
}