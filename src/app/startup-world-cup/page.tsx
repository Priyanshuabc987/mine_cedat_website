"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Rocket, Shield, Users, Trophy, Globe, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const SWC_LOGO_SRC = "https://static.wixstatic.com/media/9a1d63_ab519186f938416c8846e0010be6186d~mv2_d_2001_2457_s_2.png";
const swccedatImage = "https://picsum.photos/seed/cedat/400/200";
const handshakeIcon = "https://picsum.photos/seed/handshake/100/100";

export default function StartupWorldCupPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-900 pt-24">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-cyan-900/40 via-black to-black" />
          <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/swcbg/1920/1080')] bg-cover bg-center" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-accent/20 backdrop-blur-md border border-accent/30 text-accent px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest"
          >
            World's Largest Startup Competition
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-tight tracking-tighter"
          >
            Bangalore <span className="text-accent italic">Regional</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Hosted by <span className="text-white font-bold">CEDAT</span>. Win a chance to represent India at the global finals in San Francisco for a <span className="text-accent font-bold">$1 Million investment prize</span>.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Button size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-white font-black px-10 h-16 text-lg group">
              Apply to Pitch <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white/10 px-10 h-16 text-lg">
              Register to Attend
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-24 bg-gradient-to-b from-slate-100 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900">
                World's Largest Startup Competition
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="h-1 w-12 bg-accent rounded-full" />
                <span className="text-2xl font-bold text-accent">$1 Million Cash Prize</span>
                <div className="h-1 w-12 bg-accent rounded-full" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full max-w-5xl mx-auto rounded-[3rem] bg-white border border-slate-200 shadow-2xl p-12">
              <div className="rounded-2xl bg-zinc-900 aspect-square w-48 flex items-center justify-center p-6 shadow-xl">
                <img src={SWC_LOGO_SRC} alt="Startup World Cup" className="max-h-full max-w-full object-contain" />
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <span className="text-lg font-black uppercase tracking-widest text-zinc-400">In Partnership With</span>
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              </div>

              <div className="space-y-4 text-center">
                <img src={swccedatImage} alt="CEDAT" className="h-32 w-auto object-contain mx-auto" />
                <p className="text-xl font-black italic text-zinc-900 tracking-tighter">THE HOST</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 container mx-auto px-4 bg-zinc-50 rounded-[4rem] my-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16 pb-8 border-b">
            <div className="flex items-center gap-4">
              <MapPin className="w-10 h-10 text-accent" />
              <span className="text-2xl font-black text-zinc-900">Bangalore, India</span>
            </div>
            <div className="hidden sm:block w-px h-12 bg-zinc-200" />
            <div className="flex items-center gap-4">
              <Calendar className="w-10 h-10 text-accent" />
              <span className="text-2xl font-black text-zinc-900">Regional Host</span>
            </div>
          </div>

          <div className="relative space-y-12">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-zinc-200 -translate-x-1/2" aria-hidden="true" />
            
            {[
              { label: "Applications Open", date: "3rd March 2026", active: true },
              { label: "Applications Close", date: "10th July 2026", active: false },
              { label: "Top 10 Announced", date: "20th July 2026", active: false },
              { label: "Regional Final", date: "8th August 2026", active: false },
              { label: "Grand Final", date: "4th-6th Nov 2026", active: false },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative flex items-center gap-12 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="w-1/2 text-right">
                  <div className={`text-2xl font-black ${idx % 2 === 0 ? 'text-right' : 'text-left'} ${item.active ? 'text-accent' : 'text-zinc-900'}`}>
                    {item.label}
                  </div>
                </div>
                
                <div className={`z-10 w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${item.active ? 'bg-accent text-white' : 'bg-zinc-300 text-white'}`}>
                  <Zap className="w-6 h-6" />
                </div>

                <div className="w-1/2">
                  <div className={`text-xl font-bold ${idx % 2 === 0 ? 'text-left' : 'text-right'} text-zinc-500`}>
                    {item.date}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6 text-center group hover:-translate-y-2 transition-transform">
            <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto text-accent group-hover:bg-accent group-hover:text-white transition-colors">
              <Rocket className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black">For Startups</h3>
            <p className="text-zinc-500 leading-relaxed">Network with top-tier global investors, refine your pitch, and secure development partnerships.</p>
          </div>
          <div className="space-y-6 text-center group hover:-translate-y-2 transition-transform">
            <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto text-accent group-hover:bg-accent group-hover:text-white transition-colors">
              <Shield className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black">For Corporates</h3>
            <p className="text-zinc-500 leading-relaxed">Discover innovative tech solutions and explore M&A opportunities with vetted startup founders.</p>
          </div>
          <div className="space-y-6 text-center group hover:-translate-y-2 transition-transform">
            <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto text-accent group-hover:bg-accent group-hover:text-white transition-colors">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black">For Investors</h3>
            <p className="text-zinc-500 leading-relaxed">Expand your deal pipeline with high-potential startups across various industry tracks.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
