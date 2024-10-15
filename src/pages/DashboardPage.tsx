// src/pages/DashboardPage.tsx
import React from "react";
import HeaderBar from "../components/reusable/HeaderBar";
import NavigationMenu from "../components/reusable/NavigationMenu";
import WidgetPanel from "../components/reusable/WidgetPanel";
import DashboardGrid from "../components/reusable/DashboardGrid";

const DashboardPage: React.FC = () => (
  <div className="h-screen flex flex-col">
    <HeaderBar />
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 bg-gray-100 p-4 overflow-y-auto">
        <NavigationMenu />
        <div className="mt-4">
          <WidgetPanel />
        </div>
      </aside>
      <main className="flex-1 p-4 overflow-y-auto">
        <DashboardGrid />
      </main>
    </div>
  </div>
);

export default DashboardPage;
