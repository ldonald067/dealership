"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CountUp } from "@/components/count-up";

const spring = { type: "spring" as const, stiffness: 120, damping: 18 };

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
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
          1. HERO — "What is this?"
          Left-heavy text, right visual. Immediate clarity.
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-amber-50 min-h-[100vh] flex items-center relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-center pt-24 pb-16 lg:py-0">
          <div className="lg:col-span-3">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 }}
              className="text-sm font-bold text-orange-500 uppercase tracking-[0.2em] mb-6"
            >
              The 30-minute dealership visit
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-teal-800 leading-[0.95] tracking-tight"
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
              className="text-gray-500 text-lg md:text-xl mt-8 max-w-lg leading-relaxed"
            >
              Do the paperwork from your couch. Get pre-approved. Pick a time.
              Show up, test drive, sign, leave. That&apos;s it.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 mt-10"
            >
              <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.97 }} transition={spring}>
                <Link href="/register" className="group px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 text-lg inline-flex items-center gap-2">
                  Get started free
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
              <span className="text-sm text-gray-400">No credit card. No commitment.</span>
            </motion.div>
          </div>

          <div className="lg:col-span-2 relative hidden lg:block">
            <div className="relative w-full aspect-square">
              <motion.div initial={{ opacity: 0, rotate: 12, scale: 0.8 }} animate={{ opacity: 0.2, rotate: 6, scale: 1 }} transition={{ ...spring, delay: 0.4 }} className="absolute inset-0 bg-orange-500 rounded-3xl" />
              <motion.div initial={{ opacity: 0, rotate: 8, scale: 0.85 }} animate={{ opacity: 0.4, rotate: 3, scale: 1 }} transition={{ ...spring, delay: 0.5 }} className="absolute inset-0 bg-orange-500 rounded-3xl" />
              <motion.div
                initial={{ opacity: 0, rotate: 4, scale: 0.9 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ ...spring, delay: 0.6 }}
                className="absolute inset-0 bg-orange-500 rounded-3xl flex flex-col items-center justify-center text-white p-8"
              >
                <motion.span className="text-8xl mb-4" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>🏎️</motion.span>
                <p className="text-2xl font-black">30 min</p>
                <p className="text-orange-100 mt-1">avg. dealership visit</p>
                <div className="mt-6 w-full bg-white/20 rounded-full h-2">
                  <motion.div className="bg-white rounded-full h-2" initial={{ width: "0%" }} animate={{ width: "85%" }} transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }} />
                </div>
                <div className="flex justify-between w-full mt-2 text-xs text-orange-100">
                  <span>Arrive</span>
                  <span>Drive away</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <motion.div className="w-px h-8 bg-gray-300" animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. PAIN — "Why should I care?"
          Emotional hit. Dark bg creates contrast/gravity.
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-teal-800 text-white py-24 md:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <p className="text-sm font-bold text-cyan-300 uppercase tracking-[0.2em] mb-4">The old way</p>
            <h2 className="text-4xl md:text-6xl font-black leading-[0.95]">
              3 hours at the dealership is not normal.
            </h2>
            <p className="text-teal-200 text-lg mt-6 leading-relaxed max-w-md">
              You wouldn&apos;t wait 3 hours to check out at a store. Why do it for the biggest purchase you&apos;ll make this year?
            </p>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={200}>
            <div className="space-y-3">
              {[
                { time: "0:00", label: "Arrive. Sit in waiting room.", icon: "🪑" },
                { time: "0:45", label: "Finance manager finally appears.", icon: "👔" },
                { time: "1:30", label: "\"Let me check with my manager.\"", icon: "🏃" },
                { time: "2:15", label: "Scramble for documents you forgot.", icon: "📄" },
                { time: "3:00", label: "Sign 47 pages. Drive away exhausted.", icon: "😵" },
              ].map((step, i) => (
                <ScrollReveal key={i} delay={300 + i * 100}>
                  <div className="flex items-center gap-4 py-3 border-b border-white/10 last:border-0">
                    <motion.span className="text-2xl w-10" whileHover={{ scale: 1.3, rotate: 10 }} transition={spring}>{step.icon}</motion.span>
                    <span className="text-cyan-300 font-mono text-sm font-bold w-12 shrink-0">{step.time}</span>
                    <span className="text-teal-100">{step.label}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. SOCIAL PROOF — "Does it actually work?"
          Right after pain. Emotional validation before solution.
          Big quotes feel personal, not like a marketing grid.
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-amber-50 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <p className="text-sm font-bold text-orange-500 uppercase tracking-[0.2em] mb-4">Don&apos;t take our word for it</p>
          </ScrollReveal>

          <div className="mt-8 space-y-12 md:space-y-16">
            {[
              { quote: "I was in and out in 25 minutes. My last lease took THREE HOURS.", name: "Sarah K.", car: "2025 Honda CR-V", align: "" },
              { quote: "Uploaded my docs from bed. Showed up, drove away. Actually wild.", name: "Marcus T.", car: "2024 Tesla Model 3", align: "md:ml-auto md:text-right" },
              { quote: "Zero surprises at the dealership. This is how it should always work.", name: "Priya R.", car: "2025 Hyundai Tucson", align: "" },
            ].map((t, i) => (
              <ScrollReveal key={i} delay={i * 80} direction={i === 1 ? "right" : "left"}>
                <div className={`max-w-2xl ${t.align}`}>
                  <p className="text-2xl md:text-3xl font-bold text-teal-800 leading-snug">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className={`mt-3 flex items-center gap-3 ${i === 1 ? "md:justify-end" : ""}`}>
                    <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold text-white">{t.name[0]}</div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.car}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. SOLUTION — "How does it work?"
          Visual left (interactive checklist) + text right.
          Stats integrated as inline callouts, not a separate section.
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-white py-24 md:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <div className="bg-cyan-50 rounded-3xl p-8 md:p-12">
              <div className="space-y-5">
                {[
                  { emoji: "🏎️", label: "Browse & calculate lease", status: "Done", statusColor: "text-emerald-600 bg-emerald-50" },
                  { emoji: "🗂️", label: "Upload license & insurance", status: "Done", statusColor: "text-emerald-600 bg-emerald-50" },
                  { emoji: "🪙", label: "Credit pre-approval", status: "Done", statusColor: "text-emerald-600 bg-emerald-50" },
                  { emoji: "🗓️", label: "Book test drive", status: "Tomorrow 2pm", statusColor: "text-orange-600 bg-orange-50" },
                ].map((item, i) => (
                  <ScrollReveal key={i} delay={i * 100}>
                    <motion.div className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm" whileHover={{ scale: 1.02, y: -2 }} transition={spring}>
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="flex-1 font-semibold text-gray-800">{item.label}</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.statusColor}`}>{item.status}</span>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Stats woven into the solution visual */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-cyan-100">
                {[
                  { n: 30, unit: "min", label: "visit" },
                  { n: 4, unit: "steps", label: "total" },
                  { n: 0, unit: "surprises", label: "guaranteed" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl md:text-3xl font-black text-teal-800">
                      <CountUp target={s.n} />
                      <span className="text-sm text-gray-400 ml-1">{s.unit}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={150}>
            <p className="text-sm font-bold text-orange-500 uppercase tracking-[0.2em] mb-4">How it works</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-teal-800 leading-[0.95]">
              Everything done
              <br />
              before you
              <br />
              even arrive.
            </h2>
            <p className="text-gray-500 text-lg mt-6 leading-relaxed max-w-md">
              Browse inventory, upload documents, get pre-approved, and book your slot. All from your phone. All at your pace.
            </p>
            <motion.div whileHover={{ x: 4 }} transition={spring} className="inline-block mt-8">
              <Link href="/register" className="group inline-flex items-center gap-2 text-orange-500 font-bold text-lg hover:text-orange-600 transition-colors">
                Try it yourself
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
              </Link>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. FOR WHO — "Is this for me?"
          Two portals, visual differentiation.
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-24 md:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            <ScrollReveal direction="left">
              <p className="text-sm font-bold text-orange-500 uppercase tracking-[0.2em] mb-4">Two portals</p>
              <h2 className="text-4xl md:text-5xl font-black text-teal-800 leading-[0.95]">
                Built for
                <br />
                buyers <span className="text-orange-500">&</span>
                <br />
                dealers.
              </h2>
              <p className="text-gray-500 text-lg mt-6 leading-relaxed">
                Everyone saves time.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={100}>
              <motion.div className="bg-white rounded-3xl p-8 border-2 border-gray-100 h-full" whileHover={{ scale: 1.03, y: -4, borderColor: "rgb(253 186 116)" }} transition={spring}>
                <motion.div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/20 mb-5" whileHover={{ rotate: 10 }} transition={spring}>🧑</motion.div>
                <h3 className="text-xl font-bold text-teal-800">For Buyers</h3>
                <ul className="mt-4 space-y-2.5 text-gray-500">
                  {["Browse with lease calculator", "Upload docs from your phone", "Get pre-approved instantly", "Book your exact time slot", "Track everything in one place"].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <span className="text-orange-500 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={250}>
              <motion.div className="bg-white rounded-3xl p-8 border-2 border-gray-100 h-full" whileHover={{ scale: 1.03, y: -4, borderColor: "rgb(94 234 212)" }} transition={spring}>
                <motion.div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center text-2xl shadow-lg shadow-teal-600/20 mb-5" whileHover={{ rotate: -10 }} transition={spring}>📡</motion.div>
                <h3 className="text-xl font-bold text-teal-800">For Dealers</h3>
                <ul className="mt-4 space-y-2.5 text-gray-500">
                  {["Review credit apps at a glance", "Approve documents in one click", "Manage your appointment calendar", "Customers arrive ready to sign", "Cut visit time by 80%"].map((item) => (
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
          6. CTA — "I'm in."
          Full-bleed orange. Massive text. One clear action.
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-orange-500 py-24 md:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95]">
              Ready to skip
              <br />
              the wait?
            </h2>
            <p className="text-orange-100 text-lg mt-6 max-w-lg">
              Create a free account, prep your paperwork, and book a time. Your next dealership visit will be your fastest ever.
            </p>
            <div className="flex flex-wrap items-center gap-6 mt-10">
              <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.97 }} transition={spring}>
                <Link href="/register" className="group px-8 py-4 bg-white text-orange-600 font-bold rounded-2xl shadow-lg text-lg inline-flex items-center gap-2">
                  Create your free account
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
              <Link href="/login" className="text-white/80 hover:text-white font-semibold transition-colors text-lg">
                Already have an account?
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-teal-900 px-6 md:px-12 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="font-black text-white text-lg">Drive<span className="text-orange-500">Ready</span></p>
            <p className="text-teal-400 text-sm mt-1">30-minute dealership visits. Finally.</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-teal-400">
            <span>🔒 Bank-level encryption</span>
            <span>🙅 No credit score impact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
