"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If no one is logged in, kick them back to the login page
      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) return <div className="p-10 text-slate-500">Loading Oakscale Portal...</div>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-[#004236] mb-2">Welcome to the Broker Portal</h1>
      <p className="text-slate-500 mb-8">
        This is your central hub for managing franchise referrals and accessing Oakscale brand resources.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-400 font-bold uppercase text-xs mb-1">Active Deals</h3>
          <p className="text-4xl font-bold text-[#004236]">0</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-400 font-bold uppercase text-xs mb-1">Recent Referrals</h3>
          <p className="text-4xl font-bold text-[#004236]">0</p>
        </div>
      </div>
    </div>
  );
}