"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SubmitLead() {
  // These names MUST match the BRAND_EMAILS keys in your Edge Function exactly
  const franchises = ["Sea Love", "Payroll Vault", "Greenlight Mobility", "Break Coffee Co."];
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [brokerId, setBrokerId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const getBroker = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setBrokerId(user.id);
    };
    getBroker();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!brokerId) return alert("Session expired. Please log in again.");
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const attachmentUrls: string[] = [];

    try {
      // 1. Upload files to Supabase Storage
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${brokerId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('lead-attachments')
          .upload(filePath, file);

        if (uploadError) throw new Error(`Upload failed: ${file.name}`);

        const { data: urlData } = supabase.storage.from('lead-attachments').getPublicUrl(filePath);
        attachmentUrls.push(urlData.publicUrl);
      }

      // 2. Insert Lead into Database
      const leadData = {
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        brand_interest: formData.get("brand_interest"), // This value triggers the routing
        state: formData.get("state"), 
        city: formData.get("city"),
        broker_notes: formData.get("broker_notes"),
        broker_id: brokerId,
        attachment_url: attachmentUrls,
      };

      const { error: dbError } = await supabase.from("leads").insert([leadData]);
      if (dbError) throw new Error(dbError.message);

      setSubmitted(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl bg-white p-12 rounded-3xl border border-slate-200 text-center shadow-sm mx-auto">
        <h2 className="text-2xl font-bold text-[#004236]">✅ Referral Logged</h2>
        <p className="mt-2 text-slate-600 font-medium">Your candidate has been successfully added to your dashboard.</p>
        <button onClick={() => { setSubmitted(false); setSelectedFiles([]); }} className="mt-8 px-8 py-3 bg-[#004236] text-white rounded-xl font-bold hover:bg-[#003028] transition-all">Submit Another</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl bg-white p-10 rounded-3xl border border-slate-200 shadow-sm mx-auto">
      <h1 className="text-2xl font-bold text-[#004236] mb-8">Submit Candidate Referral</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">First Name</label>
          <input name="first_name" type="text" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#006d5b]" required />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Last Name</label>
          <input name="last_name" type="text" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#006d5b]" required />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email</label>
          <input name="email" type="email" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#006d5b]" required />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Phone</label>
          <input name="phone" type="tel" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#006d5b]" required />
        </div>

        <div className="md:col-span-2 border-t border-slate-100 pt-4">
          <h3 className="text-xs font-bold text-[#006d5b] uppercase tracking-widest mb-4">Brand & Territory</h3>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Brand Interest</label>
          <select name="brand_interest" className="w-full p-3 border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#006d5b]" required>
            <option value="">Select Brand</option>
            {franchises.map(brand => <option key={brand} value={brand}>{brand}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">State of Interest</label>
          <input name="state" type="text" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#006d5b]" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">City</label>
          <input name="city" type="text" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#006d5b]" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Broker Notes (Optional)</label>
          <textarea name="broker_notes" rows={3} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#006d5b]" placeholder="Context about the candidate or territory..." />
        </div>

        <div className="md:col-span-2 mt-4">
          <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Upload Questionnaires / Documents</label>
          <div className="relative">
            <input type="file" id="multi-upload" className="hidden" multiple onChange={handleFileChange} />
            <label htmlFor="multi-upload" className="flex items-center justify-center w-full p-6 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-[#006d5b] hover:bg-slate-50 transition-all">
              <span className="text-sm font-bold text-[#006d5b]">+ Add Files</span>
            </label>
          </div>

          <div className="mt-4 space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm text-slate-600 font-medium truncate max-w-[80%]">📄 {file.name}</span>
                <button type="button" onClick={() => removeFile(index)} className="text-red-400 hover:text-red-600 text-xs font-bold">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 pt-6">
          <button type="submit" disabled={loading} className="w-full bg-[#004236] text-white py-4 rounded-xl font-bold hover:bg-[#003028] transition-all shadow-lg disabled:opacity-50">
            {loading ? "Processing..." : "Confirm & Save Referral"}
          </button>
        </div>
      </form>
    </div>
  );
}