"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type InvestmentRow = {
  item: string;
  low: string;
  high: string;
};

const investmentBreakdowns: Record<string, InvestmentRow[]> = {
  "payroll-vault": [
    { item: "Initial Franchise Fees (1)", low: "$68,500", high: "$88,500" },
    { item: "Rent (2)", low: "$0", high: "$800" },
    { item: "Rental Improvements (2)", low: "$0", high: "$400" },
    { item: "Deposits (2)", low: "$0", high: "$1,000" },
    { item: "American Payroll Association Training Fee (3)", low: "$0", high: "$1,810" },
    { item: "Training Expenses (3)", low: "$0", high: "$0" },
    { item: "Computer System (4)", low: "$225", high: "$1,225" },
    { item: "Furniture, Fixtures", low: "$150", high: "$650" },
    { item: "Equipment, and Phone Lines (4)", low: "$0", high: "$0" },
    { item: "Technology Startup Fee (5)", low: "$1,500", high: "$1,500" },
    { item: "Insurance and Professional Services (6)", low: "$4,000", high: "$6,000" },
    { item: "Additional Funds - 3 months (7)", low: "$3,000", high: "$10,000" },
    { item: "TOTALS", low: "$77,375", high: "$111,885" },
  ],
  "greenlight-mobility": [
    { item: "Initial Franchise Fee", low: "$59,500", high: "$59,500" },
    { item: "Training Fee", low: "$4,500", high: "$4,500" },
    { item: "Training Expenses", low: "$4,500", high: "$9,810" },
    { item: "Marketing Materials and Supplies and Initial Marketing", low: "$7,500", high: "$15,000" },
    { item: "Office Equipment, Furniture, Supplies, Office Computer and Tablet", low: "$500", high: "$4,000" },
    { item: "Software and Technology", low: "$800", high: "$1,750" },
    { item: "Vehicles Down Payment", low: "$6,600", high: "$9,500" },
    { item: "Licenses and Permits", low: "$500", high: "$4,000" },
    { item: "Office/Warehouse Rent, Lease, Security and Utility Deposits", low: "$5,000", high: "$20,000" },
    { item: "Leasehold Improvement Office or Warehouse", low: "$0", high: "$5,000" },
    { item: "Signage", low: "$0", high: "$1,500" },
    { item: "Tools, Equipment, Racking", low: "$5,000", high: "$9,500" },
    { item: "Initial Inventory", low: "$40,000", high: "$60,000" },
    { item: "Insurance Costs", low: "$5,000", high: "$10,000" },
    { item: "Legal Services", low: "$1,500", high: "$5,000" },
    { item: "Additional Funds - 3 months", low: "$20,000", high: "$68,000" },
    { item: "Total Estimate", low: "$160,900", high: "$287,060" },
  ],
  "sea-love": [
    { item: "Initial Franchise Fee", low: "$49,500", high: "$49,500" },
    { item: "Construction and Leasehold Improvements", low: "$10,000", high: "$80,000" },
    { item: "Lease Deposits - Three Months", low: "$2,500", high: "$15,000" },
    { item: "Furniture, Fixtures, Equipment, and Office Expenses", low: "$10,000", high: "$65,000" },
    { item: "Signage", low: "$1,000", high: "$10,250" },
    { item: "Computer, Software, and Point of Sale System", low: "$2,500", high: "$2,500" },
    { item: "Grand Opening Marketing/Market Introduction Program", low: "$5,000", high: "$6,000" },
    { item: "Initial Inventory", low: "$15,000", high: "$35,000" },
    { item: "Utility Deposits", low: "$500", high: "$1,000" },
    { item: "Insurance Deposits - Three Months", low: "$500", high: "$1,000" },
    { item: "Travel for Initial Training", low: "$1,000", high: "$2,000" },
    { item: "Professional Fees", low: "$1,000", high: "$5,000" },
    { item: "Licenses and Permits", low: "$500", high: "$5,000" },
    { item: "Additional Funds - Three Months", low: "$10,000", high: "$15,000" },
    { item: "Total Estimate", low: "$109,000", high: "$292,250" },
  ],
  "break-coffee": [
    { item: "Initial Franchise Fee", low: "$59,500", high: "$59,500" },
    { item: "Break Coffee Beverage Machines", low: "$25,000", high: "$30,000" },
    { item: "Initial Training Expenses", low: "$1,000", high: "$3,000" },
    { item: "Professional Fees", low: "$1,000", high: "$3,000" },
    { item: "Business Licenses and Permits", low: "$25", high: "$500" },
    { item: "Computer Systems", low: "$0", high: "$1,000" },
    { item: "Vehicle", low: "$0", high: "$1,500" },
    { item: "Initial Inventory to Begin Operating", low: "$500", high: "$1,000" },
    { item: "Grand Opening Advertising", low: "$5,000", high: "$5,000" },
    { item: "Insurance", low: "$500", high: "$1,500" },
    { item: "Additional Funds - 3 months", low: "$10,000", high: "$40,000" },
    { item: "TOTALS", low: "$102,525", high: "$146,000" },
  ],
};

export default function FranchisePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [isInvestmentOpen, setIsInvestmentOpen] = useState(false);

  useEffect(() => {
    async function fetchFranchise() {
      const { data: franchise, error } = await supabase
        .from('franchises')
        .select(`
          *,
          resources:franchise_resources(*),
          contacts:franchise_contacts(*)
        `)
        .eq('slug', slug)
        .single();

      if (error) {
        console.error("Error fetching franchise:", error);
      } else {
        setData(franchise);
      }
      setLoading(false);
    }

    if (slug) fetchFranchise();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full border-4 border-[#004236] border-t-transparent animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading Brand Data...</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Franchise Not Found</h1>
      <Link href="/" className="text-[#004236] font-bold hover:underline">← Back to home</Link>
    </div>
  );

  const colors = {
    primary: data.primary_color || "#004236",
    secondary: data.secondary_color || "#006d5b",
    accent: data.accent_color || "#1da857"
  };
  
  const twoMinuteDrill = data.two_minute_drill;
  const faqs = data.faqs || [];
  const investmentRows = investmentBreakdowns[slug] || [];
  const hasInvestmentBreakdown = investmentRows.length > 0;
  const cardHoverClass = "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg";

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
          
          <div className="relative inline-flex flex-col items-center">
            <button
              type="button"
              onClick={() => hasInvestmentBreakdown && setIsInvestmentOpen(true)}
              aria-expanded={hasInvestmentBreakdown ? isInvestmentOpen : undefined}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-xl transition-all duration-200 ${hasInvestmentBreakdown ? "cursor-pointer hover:-translate-y-0.5 hover:brightness-110 hover:shadow-2xl hover:ring-2 hover:ring-white/20 active:translate-y-0" : "cursor-default"}`}
              style={{ backgroundColor: colors.secondary, color: "#fff" }}
            >
              <span>Estimated Investment: {data.investment}</span>
              {hasInvestmentBreakdown && (
                <span className="inline-flex items-center opacity-90">
                  <svg
                    viewBox="0 0 20 20"
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.12l3.71-3.89a.75.75 0 1 1 1.08 1.04l-4.25 4.46a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {hasInvestmentBreakdown && isInvestmentOpen && (
        <div
          className="fixed inset-0 z-[80] bg-slate-950/50 backdrop-blur-[2px] p-4 md:p-8"
          onClick={() => setIsInvestmentOpen(false)}
        >
          <div
            className="mx-auto mt-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 text-left md:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Estimated Investment Breakdown</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">Detailed low and high estimate for {data.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsInvestmentOpen(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="sticky top-0 bg-slate-900 text-white">
                  <tr>
                    <th className="px-4 py-3 font-bold">Type of Expenditure</th>
                    <th className="px-4 py-3 text-right font-bold">Low Estimate</th>
                    <th className="px-4 py-3 text-right font-bold">High Estimate</th>
                  </tr>
                </thead>
                <tbody>
                  {investmentRows.map((row, index) => {
                    const isTotal = index === investmentRows.length - 1;
                    return (
                      <tr
                        key={row.item}
                        className={`${isTotal ? "bg-slate-100" : "odd:bg-white even:bg-slate-50/70"} border-b border-slate-200`}
                      >
                        <td className={`px-4 py-3 ${isTotal ? "font-extrabold text-slate-900" : "font-medium"}`}>{row.item}</td>
                        <td className={`px-4 py-3 text-right ${isTotal ? "font-extrabold text-slate-900" : "font-semibold"}`}>{row.low}</td>
                        <td className={`px-4 py-3 text-right ${isTotal ? "font-extrabold text-slate-900" : "font-semibold"}`}>{row.high}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="max-w-4xl mx-auto mt-8 px-6">
        <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto">
          {["about", "drill", "resources", "contacts", "faqs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-all duration-300 hover:-translate-y-0.5 ${
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
            <p className={`text-xl text-slate-700 leading-relaxed mb-8 font-medium bg-white p-8 rounded-3xl border border-slate-200 shadow-sm ${cardHoverClass}`}>{data.about}</p>
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
              
              {/* 1. Ideal Candidate Profile (SIEMPRE ARRIBA Y OCUPA 2 COLUMNAS) */}
              <div className={`bg-white p-8 rounded-3xl border border-slate-200 shadow-sm md:col-span-2 ${cardHoverClass}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 text-xl" style={{ color: colors.primary }}>👤</div>
                  <h3 className="text-xl font-bold text-slate-900">Ideal Candidate Profile</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">{twoMinuteDrill.idealCandidate}</p>
              </div>

              {/* 2. Financials & Fees */}
              <div className={`bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full ${cardHoverClass}`}>
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
              <div className={`bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full ${cardHoverClass}`}>
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

              {/* 4. Talking Points (2 COLUMNAS) */}
              {twoMinuteDrill.talkingPoints && (
                <div className={`bg-white p-8 rounded-3xl border border-slate-200 shadow-sm md:col-span-2 ${cardHoverClass}`}>
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

              {/* 5. Handling Objections (2 COLUMNAS) */}
              {twoMinuteDrill.objections && (
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-md md:col-span-2 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl">
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
              <div className={`bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full ${cardHoverClass}`}>
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

              {/* 7. Digital Footprint (ESTA ES LA ÚNICA CAJA DE LINKS, EN LA ESQUINA) */}
              {twoMinuteDrill.socialMedia && twoMinuteDrill.socialMedia.length > 0 && (
                <div className={`bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full ${cardHoverClass}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-slate-50 text-xl" style={{ color: colors.primary }}>🌐</div>
                    <h3 className="text-xl font-bold text-slate-900">Digital Footprint</h3>
                  </div>
                  <ul className="space-y-4">
                    {twoMinuteDrill.socialMedia.map((social: any, i: number) => (
                      <li key={i} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 pb-2 last:border-0">
                        <span className="text-slate-500 font-medium">{social.platform}</span>
                        {/* break-words asegura que si el link es muy largo, pase a la siguiente línea sin dañar la caja */}
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
                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className={`p-6 bg-white border border-slate-200 rounded-3xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg flex items-center justify-between group cursor-pointer`}>
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
                <div key={i} className={`p-6 bg-white border border-slate-200 rounded-3xl shadow-sm ${cardHoverClass}`}>
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
                <div key={i} className={`p-6 bg-white border border-slate-200 rounded-3xl shadow-sm ${cardHoverClass}`}>
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