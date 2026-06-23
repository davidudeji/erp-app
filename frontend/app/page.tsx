"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  BrainCircuit,
  CreditCard,
  Moon,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Workflow,
} from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [dark, setDark] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-zinc-900 transition-colors duration-300 dark:bg-[#061018] dark:text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* LOGO */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-cyan-400 blur-md opacity-60 group-hover:opacity-100 transition" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-[#0b1622]">
                <Boxes className="h-5 w-5 text-cyan-300" />
              </div>
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                ERP Suite
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Enterprise Operating System
              </p>
            </div>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden items-center gap-10 md:flex">
            {["Features", "Solutions", "Pricing", "Contact"].map((item) => (
              <Link
                key={item}
                href="/"
                className="relative text-sm font-medium text-zinc-600 transition hover:text-cyan-400 dark:text-zinc-300"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl transition hover:border-cyan-400/40 cursor-pointer "
            >
              {dark ? (
                <SunMedium className="h-5 w-5 text-cyan-300" />
              ) : (
                <Moon className="h-5 w-5 text-zinc-700" />
              )}
            </button>

            <button  onClick={() => router.push("/login")} className="hidden rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.03] md:block cursor-pointer ">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 pb-24 pt-24 lg:grid-cols-2 lg:items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 backdrop-blur-xl">
              <Sparkles className="h-4 w-4" />
              Enterprise-grade ERP for modern businesses
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              Control your
              <span className="relative mx-3 inline-block">
                entire business
                <div className="absolute bottom-2 left-0 h-4 w-full bg-cyan-400/20 blur-xl" />
              </span>
              from one dashboard.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              ERP Suite unifies inventory, POS, finance, operations,
              analytics, and enterprise workflows into one intelligent
              operating system built for scale.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="group flex w-full max-w-sm items-center justify-center gap-2 rounded-full bg-cyan-400 px-7 py-4 text-sm font-bold text-black transition hover:scale-[1.03] cursor-pointer sm:w-auto"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>

              <button className="w-full max-w-sm rounded-full border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold backdrop-blur-xl transition hover:border-cyan-400/30 cursor-pointer sm:w-auto">
                Start 7-day trial
              </button>
            </div>

            {/* TRUST */}
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {[
                ["99.9%", "Uptime"],
                ["120+", "Enterprise Clients"],
                ["24/7", "Automation"],
              ].map(([value, label]) => (
                <div key={label}>
                  <h3 className="text-3xl font-black">{value}</h3>
                  <p className="mt-2 text-sm text-zinc-500">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT MOCKUP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-[40px] bg-cyan-400/20 blur-3xl" />

            {/* Dashboard */}
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#08131f]/90 shadow-2xl backdrop-blur-2xl">
              {/* top bar */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>

                <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-xs text-cyan-300">
                  Live Enterprise Dashboard
                </div>
              </div>

              {/* content */}
              <div className="grid gap-5 p-6">
                {/* analytics */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Card
                    icon={<BarChart3 />}
                    title="Revenue"
                    value="$1.8M"
                  />
                  <Card
                    icon={<Workflow />}
                    title="Operations"
                    value="Automated"
                  />
                </div>

                {/* chart */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Business Performance
                      </h3>
                      <p className="text-sm text-zinc-500">
                        Real-time operational analytics
                      </p>
                    </div>

                    <div className="rounded-full bg-cyan-400/10 px-4 py-2 text-xs text-cyan-300">
                      +28%
                    </div>
                  </div>

                  <div className="flex h-48 items-end gap-4">
                    {[40, 80, 60, 120, 90, 150, 180].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}px` }}
                        className="flex-1 rounded-t-3xl bg-gradient-to-t from-cyan-500/20 to-cyan-300"
                      />
                    ))}
                  </div>
                </div>

                {/* bottom cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <MiniCard
                    icon={<Boxes />}
                    title="Inventory"
                    desc="AI stock prediction"
                  />
                  <MiniCard
                    icon={<CreditCard />}
                    title="POS"
                    desc="Multi-store payments"
                  />
                  <MiniCard
                    icon={<BrainCircuit />}
                    title="AI Insights"
                    desc="Business forecasting"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Why ERP Suite
            </p>

            <h2 className="text-4xl font-black md:text-5xl">
              Built for modern enterprise velocity.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <FeatureCard
              icon={<Workflow />}
              title="Unified Operations"
              desc="Manage finance, inventory, POS, and enterprise workflows from one intelligent platform."
            />

            <FeatureCard
              icon={<ShieldCheck />}
              title="Enterprise Security"
              desc="Bank-level architecture, secure access control, and scalable infrastructure."
            />

            <FeatureCard
              icon={<BrainCircuit />}
              title="AI Automation"
              desc="Reduce manual work with predictive inventory, automation, and AI reporting."
            />

            <FeatureCard
              icon={<BarChart3 />}
              title="Realtime Analytics"
              desc="Track performance instantly with dynamic dashboards and operational insights."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 p-12 backdrop-blur-2xl">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300">
              Start Scaling
            </p>

            <h2 className="text-4xl font-black leading-tight md:text-6xl">
              Your business deserves more than spreadsheets.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Replace disconnected tools with a unified enterprise operating
              system designed to help businesses move faster, smarter, and
              globally.
            </p>

            <button className="mt-10 rounded-full bg-cyan-400 px-8 py-4 text-sm font-black text-black transition hover:scale-[1.03] cursor-pointer ">
              Start Building
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-10 md:flex-row">
          <div>
            <h3 className="text-lg font-bold">ERP Suite</h3>
            <p className="mt-2 text-sm text-zinc-500">
              Enterprise Operating System for modern companies.
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm text-zinc-500">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Support</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* FEATURE CARD */
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-2xl transition hover:-translate-y-2 hover:border-cyan-400/30">
      <div className="absolute right-0 top-0 h-32 w-32 bg-cyan-400/10 blur-3xl transition group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
          {icon}
        </div>

        <h3 className="text-xl font-bold">{title}</h3>

        <p className="mt-4 leading-7 text-zinc-500 dark:text-zinc-400">
          {desc}
        </p>
      </div>
    </div>
  );
}

/* MINI CARD */
function MiniCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
        {icon}
      </div>

      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-500">{desc}</p>
    </div>
  );
}

/* TOP CARD */
function Card({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
        {icon}
      </div>

      <p className="text-sm text-zinc-500">{title}</p>
      <h3 className="mt-2 text-3xl font-black">{value}</h3>
    </div>
  );
}
