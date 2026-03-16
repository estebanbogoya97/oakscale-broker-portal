"use client";

import { useState } from "react";
import Link from "next/link";

export default function FranchiseClient({ franchise }: { franchise: any }) {
  const [activeTab, setActiveTab] = useState("about");

  const data = franchise;
  const colors = {
    primary: data.primary_color || "#004236",
    secondary: data.secondary_color || "#006d5b",
    accent: data.accent_color || "#1da857"
  };
  
  const twoMinuteDrill = data.two_minute_drill;
  const faqs = data.faqs || [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold tracking-tight hover:opacity-70 transition-opacity" style={{ color: colors.primary }}>
            ← Back to Brands
          </Link>
          <div className="flex items-center gap-6">
            {/* Ocultando temporalmente el botón de Broker Portal */}
          </div>
        </div>
      </nav>

      {/* Hero Section con Logo y Fondo Dinámico */}
      <header 
        className="w-full text-white py-32 px-6 relative overflow-hidden transition-colors duration-500 bg-cover bg-center"
        style={{ 
          backgroundColor: colors.primary,
          backgroundImage: data.hero_image_url ? `url('${data.hero_image_url}')` : 'none'
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="absolute inset-0 z-0" style={{ background: `linear-gradient(to top, ${colors.primary} 0%, transparent 100%)`, opacity: 0.9 }}></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center drop-shadow-md">
          {data.logo_url ? (
            <img 
              src={data.logo_url} 
              alt={`${data.name} Logo`} 
              className="h-28 md:h-36 object-contain mb-6 drop-shadow-2xl brightness-0 invert" 
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
            />
          ) : (
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
              {data.name}
            </h1>
          )}

          <p className="text-xl md:text-2xl font-medium opacity-90 mb-8 max-w-2xl">
            {data.tagline}
          </p>
          
          <div className="inline-block px-6 py-3 rounded-full font-bold text-sm shadow-xl" style={{ backgroundColor: colors.secondary, color: '#fff' }}>
            Estimated Investment: {data.investment}
          </div>
        </div>
      </header>

      {/* Tabs Menu */}
      <div className="max-w-4xl mx-auto mt-8 px-6">
        <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto">
          {["about", "drill", "resources", "contacts", "faqs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab 
                  ? "border-current text-slate-900" 
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
              style={{ 
                borderColor: activeTab === tab ? colors.primary : 'transparent', 
                color: activeTab === tab ? colors.primary : undefined 
              }}
            >
              {tab === "drill" ? "2-Minute Drill" : tab}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto py-12 px-6">
        
        {/* ABOUT */}
        {activeTab === "about" && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>About the Opportunity</h2>
            <p className="text-xl text-slate-700 leading-relaxed mb-8 font-medium bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">{data.about}</p>
          </div>
        )}

        {/* 2-MINUTE DRILL */}
        {activeTab === "drill" && twoMinuteDrill && (
          <div className="animate-in fade-in duration-500 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <div>
                <h2 className="text-3xl font-bold" style={{ color: colors.primary }}>The 2-Minute Drill</h2>
                <p className="text-slate-500 mt-1">Everything you need to pitch this brand, at a glance.</p>
              </div>
              {twoMinuteDrill.pdfUrl && (
                <a 
                  href={twoMinuteDrill.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-md hover:opacity-90 transition-all"
                  style={{ backgroundColor: colors.primary }}
                >
                  📄 Download Original PDF
                </a>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Ideal Candidate Profile */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 text-xl" style={{ color: colors.primary }}>👤</div>
                  <h3 className="text-xl font-bold text-slate-900">Ideal Candidate Profile</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">{twoMinuteDrill.idealCandidate}</p>
              </div>

              {/* 2. Financials & Fees */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-slate-50 text-xl" style={{ color: colors.primary }}>💰</div>
                  <h3 className="text-xl font-bold text-slate-900">Financials & Fees</h3>
                </div>
                {twoMinuteDrill.financials && (
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Franchise Fee</span>
                      <span className="font-bold text-slate-900 text-right">{twoMinuteDrill.financials.franchiseFee}</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Required Liquidity</span>
                      <span className="font-bold text-slate-900 text-right">{twoMinuteDrill.financials.liquidity}</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Net Worth</span>
                      <span className="font-bold text-slate-900 text-right">{twoMinuteDrill.financials.netWorth}</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Royalty</span>
                      <span className="font-bold text-slate-900 text-right">{twoMinuteDrill.financials.royalty}</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Brand Fund</span>
                      <span className="font-bold text-slate-900 text-right">{twoMinuteDrill.financials.brandFund}</span>
                    </li>
                  </ul>
                )}
              </div>

              {/* 3. Fast Facts */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-slate-50 text-xl" style={{ color: colors.primary }}>⚡</div>
                  <h3 className="text-xl font-bold text-slate-900">Fast Facts</h3>
                </div>
                <ul className="space-y-4">
                  {twoMinuteDrill.fastFacts?.map((fact: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1" style={{ color: colors.secondary }}>✔</span>
                      <span className="text-slate-700 font-medium">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Talking Points */}
              {twoMinuteDrill.talkingPoints && (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm md:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-slate-50 text-xl" style={{ color: colors.primary }}>🗣️</div>
                    <h3 className="text-xl font-bold text-slate-900">Key Talking Points</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {twoMinuteDrill.talkingPoints.map((point: any, i: number) => (
                      <div key={i}>
                        <h4 className="font-bold text-slate-900 mb-1">{point.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{point.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Handling Objections */}
              {twoMinuteDrill.objections && (
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-md md:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-white/10 text-xl">🛡️</div>
                    <h3 className="text-xl font-bold text-white">Handling Common Objections</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {twoMinuteDrill.objections.map((obj: any, i: number) => (
                      <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/10">
                        <h4 className="font-bold text-emerald-400 mb-2">"{obj.objection}"</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">{obj.response}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Revenue Streams */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-slate-50 text-xl" style={{ color: colors.primary }}>📈</div>
                  <h3 className="text-xl font-bold text-slate-900">Revenue Streams</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {twoMinuteDrill.revenueStreams?.map((stream: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700">
                      {stream}
                    </span>
                  ))}
                </div>
              </div>

              {/* 7. Digital Footprint */}
              {twoMinuteDrill.socialMedia && twoMinuteDrill.socialMedia.length > 0 && (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-slate-50 text-xl" style={{ color: colors.primary }}>🌐</div>
                    <h3 className="text-xl font-bold text-slate-900">Digital Footprint</h3>
                  </div>
                  <ul className="space-y-4">
                    {twoMinuteDrill.socialMedia.map((social: any, i: number) => (
                      <li key={i} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 pb-2 last:border-0">
                        <span className="text-slate-500 font-medium">{social.platform}</span>
                        <a href={social.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline text-right break-words max-w-full" style={{ color: colors.primary }}>
                          {social.handle}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        )}

        {/* RESOURCES */}
        {activeTab === "resources" && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>Useful Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.resources?.map((res: any, i: number) => (
                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="p-6 bg-white border border-slate-200 rounded-3xl hover:shadow-lg transition-all flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{res.type === 'video' ? '▶️' : '📄'}</span>
                    <span className="font-bold text-slate-700 group-hover:text-slate-900">{res.title}</span>
                  </div>
                  <span className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.primary }}>Open →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CONTACTS */}
        {activeTab === "contacts" && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>Key Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.contacts?.map((contact: any, i: number) => (
                <div key={i} className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900">{contact.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest mt-1 mb-4" style={{ color: colors.secondary }}>{contact.title}</p>
                  <a href={`mailto:${contact.email}`} className="block text-sm font-medium text-slate-600 hover:text-slate-900">✉️ {contact.email}</a>
                  {contact.phone && <a href={`tel:${contact.phone}`} className="block text-sm font-medium text-slate-600 hover:text-slate-900 mt-2">📞 {contact.phone}</a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQS */}
        {activeTab === "faqs" && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq: any, i: number) => (
                <div key={i} className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600">
                    {faq.a} 
                    {faq.link && (
                      <a href={faq.link} target="_blank" rel="noopener noreferrer" className="ml-1 font-bold hover:underline" style={{ color: colors.primary }}>
                         [Real-time Status]
                      </a>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
