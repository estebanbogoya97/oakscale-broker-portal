"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Profile specific states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [network, setNetwork] = useState("");

  const brokerNetworks = [
    "FBA", "FCC", "FranServe", "FRANZY", "IFPG", 
    "Sidekick", "TES", "TPF", "TheYouNetwork", "Independent / Other"
  ];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            broker_network: network,
          },
        },
      });

      if (error) {
        alert(error.message);
      } else {
        alert("Account created! You can now sign in.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
      } else {
        router.push("/submit-lead");
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#004236]">Oakscale Portal</h1>
          <p className="text-slate-500 mt-2 font-medium">
            {isSignUp ? "Create your broker account" : "Welcome back, Broker"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 ml-1">First Name</label>
                  <input 
                    type="text" 
                    placeholder="John" 
                    onChange={(e) => setFirstName(e.target.value)} 
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#006d5b] transition-all" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 ml-1">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Doe" 
                    onChange={(e) => setLastName(e.target.value)} 
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#006d5b] transition-all" 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 ml-1">Broker Network</label>
                <select 
                  onChange={(e) => setNetwork(e.target.value)} 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#006d5b] transition-all" 
                  required
                >
                  <option value="">Select Network</option>
                  {brokerNetworks.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="broker@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#006d5b] transition-all" 
              required 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#006d5b] transition-all" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#004236] text-white py-4 rounded-xl font-bold hover:bg-[#003028] transition-all shadow-lg disabled:opacity-50 mt-4"
          >
            {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm font-bold text-[#006d5b] hover:underline"
          >
            {isSignUp ? "Already have an account? Sign In" : "New to Oakscale? Create an Account"}
          </button>
        </div>
      </div>
    </div>
  );
}