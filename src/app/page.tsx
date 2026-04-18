"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CountUp } from "@/components/count-up";
import { HoverIllustration } from "@/components/hover-illustration";

const spring = { type: "spring" as const, stiffness: 120, damping: 18 };

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden" id="main-content">
      {/* ═══ NAVBAR ═══ */}
      <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-xl font-black text-teal-800">
            Drive<span className="text-orange-500">Ready</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-teal-800 transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link href="/register" className="text-sm font-semibold text-white bg-teal-800 hover:bg-teal-700 px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════
          HERO — product-focused, not illustration-focused
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-amber-50 min-h-[100vh] flex items-center relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24 pb-16 lg:py-0">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 }}
              className="text-sm font-bold text-orange-500 uppercase tracking-[0.2em] mb-4"
            >
              The 30-minute dealership visit
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black text-teal-800 leading-[0.95] tracking-tight"
            >
              Your next car
              <br />
              shouldn&apos;t cost
              <br />
              <span className="text-orange-500">a whole day.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.35 }}
              className="text-gray-500 text-lg mt-6 max-w-md leading-relaxed"
            >
              Do the paperwork from your couch. Get pre-approved. Pick a time.
              Show up, test drive, sign, leave.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 mt-8"
            >
              <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.97 }} transition={spring}>
                <Link href="/register" className="group px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 text-lg inline-flex items-center gap-2">
                  Get started free
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
              <span className="text-sm text-gray-400">No credit card needed.</span>
            </motion.div>
          </div>

          {/* Right side: app preview mockup */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.4 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl shadow-teal-800/10 p-6 max-w-sm ml-auto">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">S</div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Sarah&apos;s visit prep</p>
                  <p className="text-xs text-gray-400">3 of 4 steps done</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Browse & pick a car", done: true },
                  { label: "Upload documents", done: true },
                  { label: "Get pre-approved", done: true },
                  { label: "Book test drive", done: false, next: true },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.6 + i * 0.1 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                      item.next ? "bg-orange-50 border-2 border-orange-200" : "bg-gray-50"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      item.done ? "bg-emerald-500 text-white" : "bg-orange-500 text-white"
                    }`}>
                      {item.done ? "✓" : "→"}
                    </span>
                    <span className={item.done ? "text-gray-400 line-through" : "font-medium text-gray-800"}>
                      {item.label}
                    </span>
                    {item.next && <span className="ml-auto text-xs text-orange-500 font-medium">Next</span>}
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "75%" }}
                transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
                className="h-1.5 bg-orange-500 rounded-full mt-5"
              />
              <p className="text-xs text-gray-400 mt-2">Ready for a 30-min visit</p>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <motion.div className="w-px h-8 bg-gray-300" animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PAIN — why this matters
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-teal-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left">
            <h2 className="text-4xl md:text-5xl font-black leading-[0.95]">
              3 hours at the dealership is not&nbsp;normal.
            </h2>
            <p className="text-teal-200 text-lg mt-4 leading-relaxed max-w-md">
              You wouldn&apos;t wait 3 hours to check out at a store. Why do it for the biggest purchase you&apos;ll make this year?
            </p>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={150}>
            <div className="space-y-2">
              {[
                { time: "0:00", label: "Arrive. Sit in waiting room.", icon: "🪑" },
                { time: "0:45", label: "Finance manager finally appears.", icon: "👔" },
                { time: "1:30", label: "\"Let me check with my manager.\"", icon: "🏃" },
                { time: "2:15", label: "Scramble for documents you forgot.", icon: "📄" },
                { time: "3:00", label: "Sign 47 pages. Drive away exhausted.", icon: "😵" },
              ].map((step, i) => (
                <ScrollReveal key={i} delay={250 + i * 80}>
                  <div className="flex items-center gap-4 py-2.5 border-b border-white/10 last:border-0">
                    <motion.span className="text-xl w-8" whileHover={{ scale: 1.3, rotate: 10 }} transition={spring}>{step.icon}</motion.span>
                    <span className="text-cyan-300 font-mono text-sm font-bold w-12 shrink-0">{step.time}</span>
                    <span className="text-teal-100 text-sm">{step.label}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURE 1 — Browse
          Image left, text right. No label, no badge.
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <ScrollReveal direction="left">
            <div className="flex justify-center lg:justify-start">
              <HoverIllustration
                defaultSrc="/illustrations/car1.png"
                hoverSrc="/illustrations/car2.png"
                alt="Browse vehicles"
                width={340}
                height={260}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={100}>
            <h2 className="text-3xl md:text-4xl font-black text-teal-800 leading-[1]">
              Browse real inventory with real&nbsp;prices.
            </h2>
            <p className="text-gray-500 mt-4 leading-relaxed max-w-md">
              Filter by type, fuel, price. Calculate your actual monthly lease payment before you ever walk in.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURE 2 — Documents
          Text left, image right. Flipped.
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-amber-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <ScrollReveal direction="left">
            <h2 className="text-3xl md:text-4xl font-black text-teal-800 leading-[1]">
              Upload docs from your&nbsp;couch.
            </h2>
            <p className="text-gray-500 mt-4 leading-relaxed max-w-md">
              License, insurance, proof of income — drag and drop from your phone. No more scrambling at the dealership for paperwork you forgot.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={100}>
            <div className="flex justify-center lg:justify-end">
              <HoverIllustration
                defaultSrc="/illustrations/folder1.png"
                hoverSrc="/illustrations/folder2.png"
                alt="Upload documents"
                width={300}
                height={260}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURE 3 — Credit
          Image left, text right.
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <ScrollReveal direction="left">
            <div className="flex justify-center lg:justify-start">
              <HoverIllustration
                defaultSrc="/illustrations/bank1.png"
                hoverSrc="/illustrations/bank2.png"
                alt="Get pre-approved"
                width={320}
                height={280}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={100}>
            <h2 className="text-3xl md:text-4xl font-black text-teal-800 leading-[1]">
              Know your budget before you walk&nbsp;in.
            </h2>
            <p className="text-gray-500 mt-4 leading-relaxed max-w-md">
              Quick credit pre-approval with no impact on your score. Zero surprises, zero pressure.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURE 4 — Appointments
          Text left, image right. Flipped.
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-cyan-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <ScrollReveal direction="left">
            <h2 className="text-3xl md:text-4xl font-black text-teal-800 leading-[1]">
              Pick your time. We&apos;ll be&nbsp;ready.
            </h2>
            <p className="text-gray-500 mt-4 leading-relaxed max-w-md">
              Choose your dealership, pick a date and time. Show up, test drive, sign, drive away. Done in&nbsp;30&nbsp;minutes.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={100}>
            <div className="flex justify-center lg:justify-end">
              <HoverIllustration
                defaultSrc="/illustrations/calendar1.png"
                hoverSrc="/illustrations/calendar2.png"
                alt="Book appointment"
                width={300}
                height={260}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS — compact proof bar
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-teal-800 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { n: 30, unit: "min", label: "average visit" },
                { n: 4, unit: "steps", label: "start to finish" },
                { n: 0, unit: "surprises", label: "guaranteed" },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-3xl md:text-4xl font-black text-white">
                    <CountUp target={s.n} />
                    <span className="text-base md:text-lg text-cyan-300 ml-1.5">{s.unit}</span>
                  </p>
                  <p className="text-xs text-teal-300 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PORTALS — who is this for
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
            <ScrollReveal direction="left">
              <h2 className="text-3xl md:text-4xl font-black text-teal-800 leading-[1]">
                Built for buyers <span className="text-orange-500">&</span>&nbsp;dealers.
              </h2>
              <p className="text-gray-500 mt-3 leading-relaxed">
                Everyone saves time.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={80}>
              <motion.div className="bg-white rounded-2xl p-6 border-2 border-gray-100 h-full" whileHover={{ scale: 1.02, y: -3, borderColor: "rgb(253 186 116)" }} transition={spring}>
                <div className="mb-4">
                  <HoverIllustration
                    defaultSrc="/illustrations/car1.png"
                    hoverSrc="/illustrations/car2.png"
                    alt="For buyers"
                    width={64}
                    height={48}
                  />
                </div>
                <h3 className="text-lg font-bold text-teal-800">For Buyers</h3>
                <ul className="mt-3 space-y-2 text-gray-500">
                  {["Browse with lease calculator", "Upload docs from your phone", "Get pre-approved instantly", "Book your exact time slot"].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <span className="text-orange-500 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={180}>
              <motion.div className="bg-white rounded-2xl p-6 border-2 border-gray-100 h-full" whileHover={{ scale: 1.02, y: -3, borderColor: "rgb(94 234 212)" }} transition={spring}>
                <div className="mb-4">
                  <HoverIllustration
                    defaultSrc="/illustrations/calendar1.png"
                    hoverSrc="/illustrations/calendar2.png"
                    alt="For dealers"
                    width={64}
                    height={48}
                  />
                </div>
                <h3 className="text-lg font-bold text-teal-800">For Dealers</h3>
                <ul className="mt-3 space-y-2 text-gray-500">
                  {["Review credit apps at a glance", "Approve documents in one click", "Manage your calendar", "Customers arrive ready to sign"].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <span className="text-teal-500 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA — close the deal
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-orange-500 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.95]">
              Ready to skip
              <br />
              the wait?
            </h2>
            <p className="text-orange-100 text-lg mt-4 max-w-lg">
              Create a free account, prep everything, and book your time. Your next dealership visit will be your fastest&nbsp;ever.
            </p>
            <div className="flex flex-wrap items-center gap-6 mt-8">
              <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.97 }} transition={spring}>
                <Link href="/register" className="group px-8 py-4 bg-white text-orange-600 font-bold rounded-2xl shadow-lg text-lg inline-flex items-center gap-2">
                  Create your free account
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
              <Link href="/login" className="text-white/80 hover:text-white font-semibold transition-colors">
                Already have an account?
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer aria-label="Site footer" className="bg-teal-900 px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="font-black text-white text-lg">Drive<span className="text-orange-500">Ready</span></p>
            <p className="text-teal-400 text-sm mt-1">30-minute dealership visits. Finally.</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-teal-400">
            <span aria-label="Bank-level encryption">🔒 Bank-level encryption</span>
            <span aria-label="No credit score impact">🙅 No credit score impact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
