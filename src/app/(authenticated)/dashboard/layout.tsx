"use client";

import Sidebar from "@/components/Sidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 ml-64 p-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}