
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Rocket, Shield, Users } from "lucide-react";
import Image from "next/image";

export default function StartupWorldCupPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-cyan-900/40 via-black to-black" />
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
            className="text-xl text-zinc-400 max-w-2xl mx-auto font-medium"
          >
            Hosted by CEDAT. Win a chance to represent India at the global finals in San Francisco for a $1 Million investment prize.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Button size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-white font-black px-10 h-16 text-lg">
              Apply to Pitch
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white/10 px-10 h-16 text-lg">
              Register to Attend
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Info */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mx-auto text-accent">
              <Rocket className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black">For Startups</h3>
            <p className="text-muted-foreground">Network with top-tier investors and develop corporate partnerships.</p>
          </div>
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mx-auto text-accent">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black">For Corps</h3>
            <p className="text-muted-foreground">Meet innovative startups and originate business development opportunities.</p>
          </div>
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mx-auto text-accent">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black">For Investors</h3>
            <p className="text-muted-foreground">Expand your deal pipeline and meet top global startup founders.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
