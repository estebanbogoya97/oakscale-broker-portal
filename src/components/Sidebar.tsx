"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [brokerName, setBrokerName] = useState("");

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();
        
        if (data) setBrokerName(`${data.first_name} ${data.last_name}`);
      }
    }
    getProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const menuItems = [
    { name: "Submit Referral", path: "/submit-lead" },
    { name: "My Referrals", path: "/referrals" },
  ];

  return (
    <div className="w-64 h-screen bg-[#004236] text-white flex flex-col p-6 fixed left-0 top-0">
      <div className="mb-10">
        <h2 className="text-xl font-bold tracking-tight">OAKSCALE</h2>
        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Broker Portal</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`block p-3 rounded-xl font-bold transition-all ${
              pathname === item.path ? "bg-white/10 text-white" : "text-emerald-100/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/10">
        <div className="mb-4 px-2">
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Logged in as</p>
          <p className="text-sm font-bold truncate">{brokerName || "Loading..."}</p>
        </div>
        <button 
          onClick={handleSignOut}
          className="w-full text-left p-3 text-red-300 hover:text-red-100 font-bold text-sm transition-colors"
        >
          ← Sign Out
        </button>
      </div>
    </div>
  );
}
