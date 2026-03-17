"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MyReferrals() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .eq("broker_id", user.id)
          .order("created_at", { ascending: false });

        if (error) console.error("Error fetching leads:", error);
        else setLeads(data || []);
      }
      setLoading(false);
    }
    fetchLeads();
  }, []);

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#004236]">My Referrals</h1>
        <p className="text-slate-500 mt-1">Track your candidates and download their submitted documents.</p>
      </div>
      
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-5 font-bold text-xs uppercase text-slate-400">Date</th>
              <th className="p-5 font-bold text-xs uppercase text-slate-400">Candidate & Notes</th>
              <th className="p-5 font-bold text-xs uppercase text-slate-400">Brand</th>
              <th className="p-5 font-bold text-xs uppercase text-slate-400">Location</th>
              <th className="p-5 font-bold text-xs uppercase text-slate-400">Documents</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-12 text-center text-slate-400 animate-pulse">Syncing referrals...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={5} className="p-12 text-center text-slate-500">No referrals found yet.</td></tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors align-top">
                  <td className="p-5 text-sm text-slate-500 font-medium">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-5 max-w-xs">
                    <div className="font-bold text-[#004236] text-base">{lead.first_name} {lead.last_name}</div>
                    <div className="text-slate-400 text-xs mb-3">{lead.email}</div>
                    
                    {/* Added Broker Notes Section */}
                    {lead.broker_notes && (
                      <div className="bg-slate-100/50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Broker Notes:</p>
                        <p className="text-xs text-slate-600 leading-relaxed italic">"{lead.broker_notes}"</p>
                      </div>
                    )}
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-[#006d5b]/10 text-[#006d5b] rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {lead.brand_interest}
                    </span>
                  </td>
                  <td className="p-5 text-sm">
                    <div className="font-semibold text-slate-900">{lead.state}</div>
                    <div className="text-slate-400 text-xs italic">{lead.city || "N/A"}</div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(lead.attachment_url) && lead.attachment_url.length > 0 ? (
                        lead.attachment_url.map((url: string, i: number) => (
                          <a 
                            key={i}
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-white border border-slate-200 text-[#004236] rounded-lg font-bold text-[10px] uppercase hover:bg-[#004236] hover:text-white transition-all shadow-sm"
                          >
                            Doc {i + 1}
                          </a>
                        ))
                      ) : (
                        <span className="text-slate-300 italic text-xs">None</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 px-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex justify-between">
        <span>Showing {leads.length} active referrals</span>
        <span>Verified Broker Access</span>
      </div>
    </div>
  );
}