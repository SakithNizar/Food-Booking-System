import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <section className="flex min-h-screen bg-white">
      {/* Sidebar */}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </section>
  );
};

export default AdminLayout;
