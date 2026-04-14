import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { generateSEO, seoConfigs } from "@/lib/seo";
import { Users, Mic2, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

import swcHeroVideo from "@assets/SWC hero video.mp4";
import swc1Image from "@assets/SWC1.png";
import swc2Image from "@assets/SWC2.png";
import swc3Image from "@assets/SWC3.png";
import swc4Image from "@assets/SWC4.png";
import sponsorsImage from "@assets/Sponser.png";
import swccedatImage from "@assets/swccedat.png";
import handshakeIcon from "@assets/handshake.png";

// SWC logo: colored logo so it's visible on white background (local file can replace when added to public/)
const SWC_LOGO_SRC = "https://static.wixstatic.com/media/9a1d63_ab519186f938416c8846e0010be6186d~mv2_d_2001_2457_s_2.png";

export default function StartupWorldCup() {
  return (
    <>
      {generateSEO(seoConfigs.startupWorldCup)}
      <div className="min-h-screen bg-white text-foreground font-sans selection:bg-cyan-500/20">
        <Navbar />

        {/* Hero Section - video only */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24">
          <video
            src={swcHeroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)] z-[1]" aria-hidden="true" />
        </section>

        {/* Logo & partnership section - tagline, two logos with partnership text */}
        <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-slate-100 to-cyan-50/80 border-b border-slate-200/60">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center text-center space-y-8 sm:space-y-10"
            >
              {/* Tagline */}
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-gray-900 max-w-3xl">
                <span className="block">World&apos;s Largest startup competition —</span>
                <span className="block">$1 Million cash prize</span>
              </p>
              {/* Two logos with partnership text in center - card for contrast */}
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-6 sm:gap-8 md:gap-12 w-full max-w-4xl mx-auto rounded-2xl bg-white/90 backdrop-blur-sm px-8 sm:px-12 py-10 sm:py-14 shadow-lg shadow-slate-200/50 border border-slate-200/80">
                {/* SWC logo */}
                <div className="rounded-xl bg-[#0284c7] aspect-square w-28 sm:w-36 md:w-44 lg:w-52 flex items-center justify-center shrink-0 shadow-inner p-2 sm:p-3">
                  <img
                    src={SWC_LOGO_SRC}
                    alt="Startup World Cup"
                    className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
                  />
                </div>
                {/* Line segment: only between left logo and center (sm+) */}
                <div className="hidden sm:flex flex-1 flex items-center min-w-0 shrink" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-full" />
                </div>
                {/* Center: text and icon aligned on the connecting line */}
                <div className="flex flex-col items-center justify-center text-center shrink-0 px-2 sm:px-0 gap-2 sm:gap-2.5">
                  <span className="text-base sm:text-lg md:text-xl font-semibold font-display tracking-wide text-cyan-700">
                    In Partnership With
                  </span>
                  <div className="h-0.5 w-full min-w-[4rem] sm:min-w-[6rem] bg-cyan-500 rounded-full shrink-0" aria-hidden="true" />
                  <img src={handshakeIcon} alt="" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shrink-0 object-contain" role="img" aria-hidden="true" />
                </div>
                {/* Line segment: only between center and right logo (sm+) */}
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

        {/* Intro section - title, tagline, quote, CTAs */}
        <section className="py-12 sm:py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center text-center space-y-6 sm:space-y-8"
            >
              <div className="space-y-3 sm:space-y-4">
                <p className="text-cyan-600 text-sm sm:text-base font-medium uppercase tracking-[0.2em]">
                  Regional Competition
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight tracking-tight text-gray-900">
                  Bangalore Regional
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-600 max-w-2xl mx-auto">
                  Hosted by CEDAT
                </p>
              </div>
              <img
                src={swc1Image}
                alt="Startup World Cup Bangalore Regional"
                className="w-full max-w-3xl mx-auto rounded-lg object-contain shadow-md"
              />
              <p className="text-base sm:text-lg text-gray-600 max-w-xl italic">
                &ldquo;This platform is for startups and startup ecosystems of the world.&rdquo;
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <a
                  href="https://www.startupworldcup.io/bangalore-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-full px-8 py-6 text-base"
                  >
                    Register to Pitch
                  </Button>
                </a>
                <a
                  href="https://luma.com/dhftdjzm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-gray-300 text-gray-900 hover:bg-gray-50 rounded-full px-8 py-6 text-base"
                  >
                    Register to attend
                  </Button>
                </a>
              </div>

              {/* Bangalore Regional Event Info */}
              <div className="w-full max-w-3xl mx-auto mt-12 sm:mt-16">
                <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 border border-gray-200 shadow-lg">
                  {/* Location and Host - larger for prominence */}
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
                  
                  {/* Event Timeline - center line, titles left, dates right */}
                  <div className="mt-8 sm:mt-10 relative">
                    {/* Center vertical line - thicker */}
                    <div
                      className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-px bg-gradient-to-b from-cyan-600 via-cyan-400 to-cyan-500/80 rounded-full"
                      aria-hidden="true"
                    />

                    <div className="space-y-0">
                      {/* Applications Open */}
                      <div className="relative flex items-center gap-6 sm:gap-8 py-7 sm:py-9">
                        <div className="w-[calc(50%-28px)] sm:w-[calc(50%-40px)] text-right pr-6 sm:pr-10">
                          <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Applications Open</div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-[3px] border-white bg-cyan-600 shadow-[0_0_0_6px_rgba(34,211,238,0.4)] flex items-center justify-center z-10">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="w-[calc(50%-28px)] sm:w-[calc(50%-40px)] text-left pl-10 sm:pl-10">
                          <div className="text-lg sm:text-xl font-bold text-cyan-700">3rd March 2026</div>
                        </div>
                      </div>

                      {/* Applications Close */}
                      <div className="relative flex items-center gap-6 sm:gap-8 py-7 sm:py-9">
                        <div className="w-[calc(50%-28px)] sm:w-[calc(50%-40px)] text-right pr-6 sm:pr-10">
                          <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Applications Close</div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-[3px] border-white bg-cyan-600 shadow-[0_0_0_6px_rgba(34,211,238,0.4)] flex items-center justify-center z-10">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="w-[calc(50%-28px)] sm:w-[calc(50%-40px)] text-left pl-10 sm:pl-10">
                          <div className="text-lg sm:text-xl font-bold text-cyan-700">10th July 2026</div>
                        </div>
                      </div>

                      {/* Top 10 Startups Announced */}
                      <div className="relative flex items-center gap-6 sm:gap-8 py-7 sm:py-9">
                        <div className="w-[calc(50%-28px)] sm:w-[calc(50%-40px)] text-right pr-6 sm:pr-10">
                          <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Top 10 Startups Announced</div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-[3px] border-white bg-cyan-600 shadow-[0_0_0_6px_rgba(34,211,238,0.4)] flex items-center justify-center z-10">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="w-[calc(50%-28px)] sm:w-[calc(50%-40px)] text-left pl-10 sm:pl-10">
                          <div className="text-lg sm:text-xl font-bold text-cyan-700">20th July 2026</div>
                        </div>
                      </div>

                      {/* Regional Final */}
                      <div className="relative flex items-center gap-6 sm:gap-8 py-7 sm:py-9">
                        <div className="w-[calc(50%-28px)] sm:w-[calc(50%-40px)] text-right pr-6 sm:pr-10">
                          <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Regional Final</div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-[3px] border-white bg-cyan-600 shadow-[0_0_0_6px_rgba(34,211,238,0.4)] flex items-center justify-center z-10">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="w-[calc(50%-28px)] sm:w-[calc(50%-40px)] text-left pl-10 sm:pl-10">
                          <div className="text-lg sm:text-xl font-bold text-cyan-700">8th August 2026</div>
                        </div>
                      </div>

                      {/* Grand Final */}
                      <div className="relative flex items-center gap-6 sm:gap-8 py-7 sm:py-9">
                        <div className="w-[calc(50%-28px)] sm:w-[calc(50%-40px)] text-right pr-6 sm:pr-10">
                          <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Grand Final</div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-[3px] border-white bg-cyan-600 shadow-[0_0_0_6px_rgba(34,211,238,0.4)] flex items-center justify-center z-10">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="w-[calc(50%-28px)] sm:w-[calc(50%-40px)] text-left pl-10 sm:pl-10">
                          <div className="text-lg sm:text-xl font-bold text-cyan-700">4th - 6th November 2026</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section - SWC style */}
        <section className="py-12 sm:py-16 md:py-24 bg-gray-50 border-y border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center">
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-cyan-600 mb-2">$1M</div>
                <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider font-medium">Investment Prize</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-cyan-600 mb-2">50,000+</div>
                <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider font-medium">Attendees</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-cyan-600 mb-2">2,500+</div>
                <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider font-medium">Investors</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-cyan-600 mb-2">100+</div>
                <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider font-medium">Regionals</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Attend - 3x2 grid: row1 image|content, row2 content|image, row3 image|content */}
        <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-center mb-10 sm:mb-14 text-gray-900">Why Attend?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {/* Row 1: For Startups - Content first on mobile, then image */}
              <div className="order-1 md:order-2 rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-cyan-50 to-sky-100/80 border border-cyan-100/50 flex flex-col justify-center">
                <h3 className="text-lg sm:text-xl font-display font-bold text-cyan-700 mb-3 uppercase tracking-wide">Why Attend? For Startups</h3>
                <ul className="space-y-2 text-gray-800 text-sm sm:text-base">
                  <li>• Network with top tier investors.</li>
                  <li>• Develop corporate partnerships and hear from top industry experts.</li>
                </ul>
              </div>
              <div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-md aspect-[4/3] min-h-[200px]">
                <img src={swc2Image} alt="Startup World Cup celebration" className="w-full h-full object-cover" />
              </div>
              
              {/* Row 2: For Corporations - Content first on mobile, then image */}
              <div className="order-3 md:order-3 rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-cyan-50 to-sky-100/80 border border-cyan-100/50 flex flex-col justify-center">
                <h3 className="text-lg sm:text-xl font-display font-bold text-cyan-700 mb-3 uppercase tracking-wide">Why Attend? For Corporations</h3>
                <ul className="space-y-2 text-gray-800 text-sm sm:text-base">
                  <li>• Meet innovative startups from around the world.</li>
                  <li>• Originate business development opportunities.</li>
                  <li>• Network with other corporate representatives and investors.</li>
                </ul>
              </div>
              <div className="order-4 md:order-4 rounded-2xl overflow-hidden shadow-md aspect-[4/3] min-h-[200px]">
                <img src={swc3Image} alt="Startup World Cup conference" className="w-full h-full object-cover" />
              </div>
              
              {/* Row 3: For Investors - Content first on mobile, then image */}
              <div className="order-5 md:order-6 rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-cyan-50 to-sky-100/80 border border-cyan-100/50 flex flex-col justify-center">
                <h3 className="text-lg sm:text-xl font-display font-bold text-cyan-700 mb-3 uppercase tracking-wide">Why Attend? For Investors</h3>
                <ul className="space-y-2 text-gray-800 text-sm sm:text-base">
                  <li>• Meet top global startup founders.</li>
                  <li>• Expand your deal pipeline and explore new markets.</li>
                  <li>• Network with other investors and corporate representatives.</li>
                </ul>
              </div>
              <div className="order-6 md:order-5 rounded-2xl overflow-hidden shadow-md aspect-[4/3] min-h-[200px]">
                <img src={swc4Image} alt="Startup World Cup panel discussion" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>


        {/* Speakers - Coming Soon (hidden) */}
        <section className="hidden py-12 sm:py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-center mb-8 sm:mb-12 flex items-center justify-center gap-3 text-gray-900">
              <Mic2 className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-600" />
              Speakers
            </h2>
            <div className="max-w-xl mx-auto bg-gray-50 rounded-2xl p-12 sm:p-16 border border-gray-200 border-dashed text-center">
              <p className="text-2xl sm:text-3xl font-display font-semibold text-gray-600 mb-2">Coming Soon</p>
              <p className="text-gray-500 text-sm sm:text-base">Our lineup of world-class speakers will be announced shortly. Stay tuned!</p>
            </div>
          </div>
        </section>

        {/* Judges - Coming Soon (hidden) */}
        <section className="hidden py-12 sm:py-16 md:py-24 bg-gray-50 border-y border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-center mb-8 sm:mb-12 flex items-center justify-center gap-3 text-gray-900">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-600" />
              Judges
            </h2>
            <div className="max-w-xl mx-auto bg-white rounded-2xl p-12 sm:p-16 border border-gray-200 border-dashed text-center">
              <p className="text-2xl sm:text-3xl font-display font-semibold text-gray-600 mb-2">Coming Soon</p>
              <p className="text-gray-500 text-sm sm:text-base">Our panel of esteemed judges will be revealed soon. Follow us for updates!</p>
            </div>
          </div>
        </section>

        {/* Our Global Sponsors & Partners - full-width image */}
        <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-sky-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-center mb-8 sm:mb-12 text-gray-900 uppercase tracking-wide">
              Our Global Sponsors & Partners
            </h2>
            <div className="w-full max-w-6xl mx-auto">
              <img
                src={sponsorsImage}
                alt="Our Global Sponsors & Partners"
                className="w-full h-auto rounded-xl shadow-lg object-contain bg-white p-4 sm:p-6"
              />
            </div>
          </div>
        </section>

        {/* About CEDAT x SWC */}
        <section className="py-12 sm:py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-center mb-8 sm:mb-12 text-gray-900">About Us</h2>
            <div className="max-w-3xl mx-auto text-center space-y-4 text-gray-700">
              <p>
                <span className="text-cyan-600 font-semibold">Startup World Cup</span> is a global conference and competition that brings together the top startups, VCs, entrepreneurs and world-class tech CEOs.
              </p>
              <p>
                <span className="text-cyan-600 font-semibold">CEDAT</span> is proud to host the Bangalore Regional, connecting India&apos;s thriving startup ecosystem with the world&apos;s largest startup competition.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
