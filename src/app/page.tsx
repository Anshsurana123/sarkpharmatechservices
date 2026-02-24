'use client';

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, ShieldCheck, Sparkles, FlaskConical, Microscope, ClipboardCheck, BookOpen, Star, Quote, Building2, Beaker, GraduationCap } from "lucide-react";
import { ArticleCard } from "@/components/shared/ArticleCard";
import Link from "next/link";
import Image from "next/image";
import { usePharmaStore } from "@/data/store";

/* ── Decorative molecular SVG pattern ───────────────── */
function MolecularPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.07]"
      xmlns="http://www.w3.org/2000/svg"
      style={{ zIndex: 1 }}
    >
      <defs>
        <pattern id="hexa" x="0" y="0" width="80" height="92" patternUnits="userSpaceOnUse">
          <polygon
            points="40,2 78,22 78,70 40,90 2,70 2,22"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <circle cx="40" cy="46" r="3" fill="white" />
          <circle cx="2" cy="22" r="2" fill="white" />
          <circle cx="78" cy="22" r="2" fill="white" />
          <circle cx="2" cy="70" r="2" fill="white" />
          <circle cx="78" cy="70" r="2" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexa)" />
    </svg>
  );
}

export default function Home() {
  const insights = usePharmaStore(state => state.insights);
  const initialize = usePharmaStore(state => state.initialize);

  useEffect(() => { initialize(); }, [initialize]);

  return (
    <div className="flex flex-col gap-12 pb-10">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden min-h-[460px] flex flex-col items-center justify-center text-center p-8 md:p-16 shadow-xl">
        {/* Real pharma lab photo — Unsplash (free, no attribution required for web use) */}
        <Image
          src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600&q=80"
          alt="Pharmaceutical laboratory"
          fill
          className="object-cover z-0"
          priority
        />
        {/* Gradient overlay — keeps text readable, adds brand colour */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 via-[#0f2744]/85 to-[#0d6e66]/70 z-[1]" />
        {/* Molecular hex pattern on top */}
        <MolecularPattern />
        {/* Animated softlight blobs */}
        <div className="absolute top-[-40px] right-[-30px] w-72 h-72 bg-teal-400/10 rounded-full blur-3xl animate-pulse z-[2]" />
        <div className="absolute bottom-[-40px] left-[-30px] w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse z-[2]" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-3xl space-y-6 text-white">
          <div className="flex justify-center">
            <Badge className="bg-teal-400/20 text-teal-200 border border-teal-400/30 backdrop-blur-sm px-4 py-1.5 text-sm flex items-center gap-1.5 hover:bg-teal-400/30">
              <FlaskConical className="h-3.5 w-3.5" />
              GMP · GDP · GLP Compliant Platform
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Pharmaceutical SOPs &<br className="hidden md:block" />
            <span className="text-teal-300"> Regulatory Intelligence</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 font-medium max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Expert-authored, MS Word-editable Standard Operating Procedures for pharma manufacturers, QA/QC labs, and regulatory teams — structured to GMP, FDA &amp; ICH guidelines.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button size="lg" className="bg-teal-400 text-[#0a1628] hover:bg-teal-300 text-base px-8 rounded-full shadow-lg font-bold" asChild>
              <Link href="/sops" className="flex items-center gap-2">
                Browse SOP Database <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm text-base px-8 font-semibold" asChild>
              <Link href="/library">Free SOP Library</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Trust Stats Bar ──────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: '500+', label: 'SOP Documents', icon: FileText },
          { value: '20+', label: 'Departments Covered', icon: ClipboardCheck },
          { value: '100%', label: 'GMP Aligned', icon: ShieldCheck },
          { value: 'FDA / ICH', label: 'Guidelines Compliant', icon: Microscope },
        ].map(({ value, label, icon: Icon }) => (
          <div key={label} className="bg-card border rounded-2xl p-5 flex flex-col items-center text-center gap-2 hover:border-primary/30 hover:shadow-md transition-all">
            <Icon className="h-6 w-6 text-primary" />
            <p className="text-2xl font-extrabold tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
          </div>
        ))}
      </section>

      {/* ── Compliance Standards ─────────────────────────── */}
      <section className="rounded-2xl border bg-card px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4 text-center">
          Documentation Structured for Global Regulatory Standards
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {['FDA 21 CFR', 'ICH Q7 / Q10', 'WHO GMP', 'EMA Guidelines', 'USP Standards', 'EU GMP Annex 1', 'cGMP', 'ISO 9001'].map((std) => (
            <Badge key={std} variant="secondary" className="px-3 py-1.5 text-sm bg-muted/60 text-foreground font-medium border border-border/50 hover:bg-muted transition-colors">
              {std}
            </Badge>
          ))}
        </div>
      </section>

      {/* ── Popular Departments ─────────────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Browse by Department</h2>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Find specific documents tailored to your operational area.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Quality Assurance", icon: ShieldCheck, query: "qa" },
            { name: "Quality Control", icon: Beaker, query: "qc" },
            { name: "Microbiology", icon: Microscope, query: "micro" },
            { name: "Manufacturing", icon: Building2, query: "" },
          ].map((dept, i) => (
            <Link key={i} href={`/sops${dept.query ? `?dept=${dept.query}` : ''}`} className="group block">
              <div className="bg-card border rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:border-primary/40 hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <dept.icon className="h-6 w-6" />
                </div>
                <p className="font-semibold text-sm">{dept.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ───────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group bg-card text-card-foreground rounded-2xl p-6 border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
          <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Editable SOP Database</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">Access 500+ professionally authored SOPs for Quality Assurance, QC, Production, and more — delivered as MS Word files.</p>
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
            <Link href="/sops">Browse SOPs</Link>
          </Button>
        </div>

        <div className="group bg-card text-card-foreground rounded-2xl p-6 border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
          <div className="h-12 w-12 rounded-xl bg-secondary/10 dark:bg-primary/20 flex items-center justify-center mb-4 text-secondary dark:text-primary group-hover:scale-110 transition-transform duration-300">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">GMP Compliance</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">Every document is structured in alignment with FDA 21 CFR, ICH Q7/Q10, WHO GMP, and EU GMP requirements.</p>
          <Button variant="outline" className="w-full group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors" asChild>
            <Link href="/bundles">View QMS Bundles</Link>
          </Button>
        </div>

        <div className="group bg-card text-card-foreground rounded-2xl p-6 border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 md:col-span-3 lg:col-span-1">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition-transform duration-300">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Expert Training Courses</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">Master complex GMP requirements with our upcoming online certification programs for QA and Regulatory teams.</p>
          <Button variant="outline" className="w-full group-hover:border-blue-500 group-hover:text-blue-600 transition-colors" asChild>
            <Link href="/courses">Explore Courses</Link>
          </Button>
        </div>

        <div className="group bg-card text-card-foreground rounded-2xl p-6 border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
          <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Free SOP Library</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Browse and read the full written content of our SOPs before purchasing. Understand the procedure, scope, and regulatory reference without any paywall.</p>
        </div>

        <div className="group bg-card text-card-foreground rounded-2xl p-6 border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
          <div className="h-12 w-12 rounded-xl bg-secondary/10 dark:bg-primary/20 flex items-center justify-center mb-4 text-secondary dark:text-primary group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Regulatory Insights</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Stay ahead of regulatory changes with expert commentary on FDA guidance documents, EMA updates, ICH harmonisation, and WHO technical reports.</p>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-4">
          <Badge variant="secondary" className="mb-3 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Voices of Trust
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Trusted by Pharma Professionals Worldwide</h2>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            See how our ready-to-use SOPs and templates are helping quality and regulatory teams maintain compliance without the headache.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "The QA SOP templates saved us months of drafting work. The formatting is spot on and completely aligned with FDA 21 CFR.", name: "Dr. Alistair M.", role: "QA Director, Pharma Manufacturer" },
            { quote: "We used their Process Validation documents for our recent facility upgrade. Passed the GMP audit flawlessly. Highly recommended!", name: "Sarah K.", role: "Validation Engineer, Biotech Firm" },
            { quote: "Affordable, comprehensive, and very easy to customize. The Microbiology lab manuals are exactly what our startup needed.", name: "James T.", role: "QC Manager, Clinical Lab" },
          ].map((test, index) => (
            <div key={index} className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
              <Quote className="h-8 w-8 text-primary/10 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="text-sm italic text-muted-foreground leading-relaxed mb-6">"{test.quote}"</p>
              <div>
                <p className="font-semibold text-sm">{test.name}</p>
                <p className="text-xs text-muted-foreground">{test.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recent Insights ─────────────────────────────── */}
      {insights.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Recent Insights</h2>
            <Button variant="ghost" className="text-primary hover:text-primary/90" asChild>
              <Link href="/insights">View all</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((insight) => (
              <ArticleCard
                key={insight.id}
                id={insight.id}
                title={insight.title}
                excerpt={insight.excerpt}
                date={insight.date}
                category={insight.category}
                readTime={insight.read_time}
                file_url={insight.file_url}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
