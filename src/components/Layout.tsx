
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <header className="border-b border-border py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-xl font-semibold">TCG Marketplace</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
