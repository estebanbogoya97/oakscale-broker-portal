"use client";

import Link from "next/link";

export default function ResourceLandingPage() {
  const franchises = [
    {
      name: "Sea Love",
      slug: "sea-love",
      tagline: "Celebrate Love, Designed By You",
      description: "A unique, experiential retail franchise offering custom scent blending and boutique shopping.",
      color: "bg-[#8A8377]", 
      textColor: "text-[#8A8377]"
    },
    {
      name: "Payroll Vault",
      slug: "payroll-vault",
      tagline: "Payroll Re-Defined",
      description: "B2B franchise providing essential payroll and HR services to small and medium-sized businesses.",
      color: "bg-[#5C8A2C]", 
      textColor: "text-[#5C8A2C]"
    },
    {
      name: "Break Coffee Co.",
      slug: "break-coffee",
      tagline: "Revolutionizing the office coffee business",
      description: "Premium office coffee service franchise with operating freedom and corporate-level support.",
      color: "bg-[#1A2B3C]", 
      textColor: "text-[#1A2B3C]"
    },
    {
      name: "GreenLight Mobility",
      slug: "greenlight-mobility",
      tagline: "Safe & Accessible Homes Start Here",
      description: "Providing home accessibility solutions and safe living environments for seniors and individuals with disabilities.",
      color: "bg-[#006DB0]", 
      textColor: "text-[#006DB0]"
    }
  ];

  const scrollToFranchises = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const element = document.getElementById('franchises');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar Publica */}
      <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
         {/* AQUÍ ESTÁ EL NUEVO LOGO DE OAKSCALE (Ahora con filtro oscuro) */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="https://cdn.prod.website-files.com/660d9a96b1da0ada623afb20/66144f82475359ec582bdd30_logo.svg" 
              alt="Oakscale Logo" 
              className="h-7 md:h-8 object-contain brightness-0" 
            />
          </Link>
          
          <div className="flex items-center gap-6">
            <a 
              href="#franchises" 
              onClick={scrollToFranchises}
              className="text-sm font-semibold text-slate-600 hover:text-[#004236] transition-colors cursor-pointer"
            >
              Our Brands
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="w-full bg-[#004236] text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Discover Premium <span className="text-emerald-400">Franchise Opportunities</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Oakscale partners with emerging, high-growth franchise brands. Explore our portfolio, access brand resources, and submit candidate referrals seamlessly.
          </p>
          
          <a 
            href="#franchises"
            onClick={scrollToFranchises}
            className="inline-block px-8 py-4 bg-white text-[#004236] font-bold rounded-full hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
          >
            Explore the Portfolio ↓
          </a>
        </div>
      </header>

      {/* Franchise Grid */}
      <section id="franchises" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Our Franchise Brands</h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">Click on any brand to access videos, one-pagers, FAQs, and everything you need to present these opportunities to your candidates.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {franchises.map((brand) => (
            <Link 
              href={`/franchises/${brand.slug}`} 
              key={brand.slug}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-2"
            >
              <div className={`h-32 w-full ${brand.color} relative overflow-hidden flex items-center justify-center`}>
                 <h3 className="text-3xl font-black text-white/90 tracking-wider uppercase z-10">{brand.name}</h3>
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <p className={`text-sm font-bold uppercase tracking-widest mb-3 ${brand.textColor}`}>
                  {brand.name}
                </p>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{brand.tagline}</h4>
                <p className="text-slate-600 mb-8 leading-relaxed flex-1">
                  {brand.description}
                </p>
                
                <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                  Access Resources 
                  <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center">
        <p className="font-medium">© 2026 Oakscale, LLC. All rights reserved.</p>
        <p className="font-medium">447 Broadway, 2nd Floor, #541, New York, New York 10013</p>
        <p>
          <a
            href="https://www.oakscale.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.oakscale.com
          </a>
        </p>

        <div className="mt-6 flex items-center justify-center gap-4">
          <a
            href="https://www.linkedin.com/company/oakscale/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Oakscale on LinkedIn"
            className="h-12 w-12 rounded-full bg-slate-700/60 hover:bg-slate-600 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05C21.1 8.65 22 10.7 22 13.8V21h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.27V21h-4V9Z" />
            </svg>
          </a>

          <a
            href="https://www.instagram.com/oakscale"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Oakscale on Instagram"
            className="h-12 w-12 rounded-full bg-slate-700/60 hover:bg-slate-600 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
} 