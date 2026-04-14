import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { generateSEO, seoConfigs } from "@/lib/seo";
import { Users, Mic2, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

// Placeholder assets since @assets folder is not available
const swcHeroVideo = "https://static.wixstatic.com/media/9a1d63_ab519186f938416c8846e0010be6186d~mv2_d_2001_2457_s_2.png"; // Using image as fallback for missing video
const swc1Image = "https://picsum.photos/seed/swc1/800/600";
const swc2Image = "https://picsum.photos/seed/swc2/800/600";
const swc3Image = "https://picsum.photos/seed/swc3/800/600";
const swc4Image = "https://picsum.photos/seed/swc4/800/600";
const sponsorsImage = "https://picsum.photos/seed/sponsors/1200/400";
const swccedatImage = "https://picsum.photos/seed/cedat/400/200";
const handshakeIcon = "https://picsum.photos/seed/handshake/100/100";

// SWC logo: colored logo so it's visible on white background
const SWC_LOGO_SRC = "https://static.wixstatic.com/media/9a1d63_ab519186f938416c8846e0010be6186d~mv2_d_2001_2457_s_2.png";

export default function StartupWorldCup() {
  return (
    <>
      {generateSEO(seoConfigs.startupWorldCup)}
      <div className="min-h-screen bg-white text-foreground font-sans selection:bg-cyan-500/20">
        <Navbar />

        {/* Hero Section - video placeholder */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 bg-zinc-900">
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

        {/* Logo & partnership section */}
        <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-slate-100 to-cyan-50/80 border-b border-slate-200/60">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center text-center space-y-8 sm:space-y-10"
            >
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-gray-900 max-w-3xl">
                <span className="block">World&apos;s Largest startup competition —</span>
                <span className="block">$1 Million cash prize</span>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-6 sm:gap-8 md:gap-12 w-full max-w-4xl mx-auto rounded-2xl bg-white/90 backdrop-blur-sm px-8 sm:px-12 py-10 sm:py-14 shadow-lg shadow-slate-200/50 border border-slate-200/80">
                <div className="rounded-xl bg-[#0284c7] aspect-square w-28 sm:w-36 md:w-44 lg:w-52 flex items-center justify-center shrink-0 shadow-inner p-2 sm:p-3">
                  <img
                    src={SWC_LOGO_SRC}
                    alt="Startup World Cup"
                    className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
                  />
                </div>
                <div className="hidden sm:flex flex-1 flex items-center min-w-0 shrink" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-full" />
                </div>
                <div className="flex flex-col items-center justify-center text-center shrink-0 px-2 sm:px-0 gap-2 sm:gap-2.5">
                  <span className="text-base sm:text-lg md:text-xl font-semibold font-display tracking-wide text-cyan-700">
                    In Partnership With
                  </span>
                  <div className="h-0.5 w-full min-w-[4rem] sm:min-w-[6rem] bg-cyan-500 rounded-full shrink-0" aria-hidden="true" />
                  <img src={handshakeIcon} alt="" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shrink-0 object-contain" role="img" aria-hidden="true" />
                </div>
                <div className="hidden sm:flex flex-1 flex items-center min-w-0 shrink" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gradient-to-l from-cyan-600 to-cyan-500 rounded-full" />
                </div>
                <img
                  src={swccedatImage}
                  alt="CEDAT"
                  className="h-28 sm:h-32 md:h-40 lg:h-48 w-auto object-contain shrink-0"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-12 sm:py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center text-center space-y-6 sm:space-y-8"
            >
              <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 border border-gray-200 shadow-lg w-full max-w-3xl">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mb-10 sm:mb-12 pb-8 sm:pb-10 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <MapPin className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 text-cyan-600 flex-shrink-0" />
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Bangalore, India</span>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
                  <div className="flex items-center gap-4">
                    <img src={swccedatImage} alt="CEDAT" className="h-14 sm:h-16 md:h-20 w-auto object-contain" />
                    <span className="text-base sm:text-lg md:text-xl text-gray-700 font-semibold">Host</span>
                  </div>
                </div>
                
                <div className="mt-8 sm:mt-10 relative">
                  <div className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-px bg-gradient-to-b from-cyan-600 via-cyan-400 to-cyan-500/80 rounded-full" aria-hidden="true" />
                  <div className="space-y-0">
                    {[
                      { label: "Applications Open", date: "3rd March 2026" },
                      { label: "Applications Close", date: "10th July 2026" },
                      { label: "Top 10 Announced", date: "20th July 2026" },
                      { label: "Regional Final", date: "8th August 2026" },
                      { label: "Grand Final", date: "4th-6th Nov 2026" },
                    ].map((item, idx) => (
                      <div key={idx} className="relative flex items-center gap-6 sm:gap-8 py-7 sm:py-9">
                        <div className="w-[calc(50%-28px)] sm:w-[calc(50%-40px)] text-right pr-6 sm:pr-10">
                          <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{item.label}</div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-[3px] border-white bg-cyan-600 shadow-[0_0_0_6px_rgba(34,211,238,0.4)] flex items-center justify-center z-10">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="w-[calc(50%-28px)] sm:w-[calc(50%-40px)] text-left pl-10 sm:pl-10">
                          <div className="text-lg sm:text-xl font-bold text-cyan-700">{item.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
