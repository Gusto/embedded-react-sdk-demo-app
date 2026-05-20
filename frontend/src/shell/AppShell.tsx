import { Route, Routes } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { HomePage } from "../pages/HomePage";
import { Nav1Page } from "../pages/Nav1Page";
import { Nav2Page } from "../pages/Nav2Page";
import { Nav3Page } from "../pages/Nav3Page";

export function AppShell() {
  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-white p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/nav-1" element={<Nav1Page />} />
            <Route path="/nav-2" element={<Nav2Page />} />
            <Route path="/nav-3" element={<Nav3Page />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
