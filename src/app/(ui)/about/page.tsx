'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Heart,
  Globe2,
  Compass,
  Users,
  Hammer,
  ShoppingBag,
  Sun,
  Moon,
  Linkedin,
  Github,
  Twitter,
  Mail,
  Quote,
  Lightbulb,
  Target,
  Award,
} from 'lucide-react';
import { useTheme } from 'next-themes';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Kraft';

// ─────────────────────────────────────────────────────────────────────
// Reusable animated section
// ─────────────────────────────────────────────────────────────────────

function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Navbar (matches landing page)
// ─────────────────────────────────────────────────────────────────────

function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200/60 dark:border-neutral-800/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center group">
            <Image
              src="/assets/imgs/logos/kraft-logo-splash.png"
              alt={APP_NAME}
              width={100}
              height={40}
              priority
              className="w-[80px] sm:w-[100px] h-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
            >
              About
            </Link>
            <Link
              href="/market"
              className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            >
              Market
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => router.push('/market')}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-700 text-white hover:shadow-lg hover:shadow-emerald-600/25 transition-all"
            >
              <ShoppingBag size={15} />
              <span className="hidden sm:inline">Browse Market</span>
              <span className="sm:hidden">Market</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = [
    {
      icon: Heart,
      title: 'Authenticity',
      desc: 'Every product on Kraft is made by real Nigerian creators — proudly handcrafted, ethically sourced, and authentically ours.',
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: Hammer,
      title: 'Craftsmanship',
      desc: 'We celebrate the skill, patience, and pride that go into every handmade piece — from Aso Oke to leather brogues.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: Globe2,
      title: 'Heritage',
      desc: "Preserving Nigeria's cultural identity by giving traditional crafts a modern home — and a global audience.",
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Users,
      title: 'Community',
      desc: 'Built by Nigerians, for Nigerians. Every sale empowers a local artisan, strengthens a small business, and grows our community.',
      color: 'from-indigo-500 to-purple-600',
    },
  ];

  const stats = [
    { value: '500+', label: 'Active Creators' },
    { value: '12', label: 'Categories' },
    { value: '36', label: 'States Reached' },
    { value: '100%', label: 'Made in Nigeria' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white overflow-x-hidden">
      <Navbar />

      {/* ──────────────────────────────────────────────── HERO */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/8 dark:bg-emerald-500/12 rounded-full blur-3xl" />
          <div className="absolute top-32 right-1/4 w-[500px] h-[500px] bg-orange-500/10 dark:bg-orange-500/15 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mb-6">
              <Sparkles size={13} />
              Our Story
            </span>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
              Built for Nigerian
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                creators, dreamers,
              </span>
              <br />
              and craftsmen.
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-base sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              {APP_NAME} is more than a marketplace. It's a home for the makers behind Nigeria's
              most beautiful products — the seamstresses, leatherworkers, jewelers, woodworkers, and
              skincare artisans whose work deserves the world's attention.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ──────────────────────────────────────────────── THE STORY */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-transparent via-neutral-50/50 dark:via-neutral-900/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <AnimatedSection>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3 block">
                Meet Our Creators
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                A market that <br />
                <span className="text-emerald-600">finally fits us.</span>
              </h2>
              <div className="space-y-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                <p>
                  Walk through any Nigerian market — Balogun in Lagos, Kantin Kwari in Kano, Onitsha
                  Main Market — and you'll see craftsmanship that rivals anything in the world. Yet
                  for too long, the world online didn't reflect what was happening on our streets.
                </p>
                <p>
                  Nigerian creators were hidden behind clunky group chats, endless Instagram DMs,
                  and a maze of WhatsApp orders. Buyers struggled to discover them. Sellers
                  struggled to be paid. And the world, in turn, kept missing what we make best.
                </p>
                <p className="font-semibold text-neutral-900 dark:text-white">
                  We built {APP_NAME} to fix that.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-purple-500/10 to-orange-500/20 blur-3xl -z-10" />
                <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src="/assets/imgs/sample-creators/creator-1.jpeg"
                        alt="Nigerian creator"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src="/assets/imgs/sample-creators/creator-2.jpeg"
                        alt="Nigerian creator"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4 pt-8 sm:pt-12">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src="/assets/imgs/sample-creators/creator-3.jpeg"
                        alt="Nigerian creator"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src="/assets/imgs/sample-creators/creator-4.jpeg"
                        alt="Nigerian creator"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────── MISSION & VISION */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <AnimatedSection>
              <div className="relative h-full p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-emerald-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-900 overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                <Target className="text-white/90 mb-5" size={36} />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2">
                  Our Mission
                </h3>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight">
                  Empower every Nigerian creator.
                </h4>
                <p className="text-white/90 leading-relaxed">
                  Give every Nigerian artisan the tools, the audience, and the dignity their craft
                  deserves — a place where great work is found, fairly priced, and proudly bought.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="relative h-full p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600 overflow-hidden">
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                <Lightbulb className="text-white/90 mb-5" size={36} />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2">
                  Our Vision
                </h3>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight">
                  The home of African craft online.
                </h4>
                <p className="text-white/90 leading-relaxed">
                  A future where "Made in Nigeria" is a global symbol of quality — where buyers
                  anywhere can discover, support, and treasure African craftsmanship in one trusted
                  place.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────── VALUES */}
      <section className="py-16 sm:py-24 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3 block">
              What We Stand For
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              The values behind every line of code.
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
              {APP_NAME} isn't just a product — it's a promise to every creator who trusts us with
              their work.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {values.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.08}>
                <div className="group h-full p-6 sm:p-7 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <v.icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────── PROBLEM WE SOLVE */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3 block">
              The Problem
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Great makers, scattered everywhere.
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
              Before {APP_NAME}, finding and supporting Nigerian creators looked like this:
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
            {[
              {
                title: 'Hidden in DMs',
                desc: 'Creators selling through Instagram comments and WhatsApp groups, with no real storefront or discoverability.',
              },
              {
                title: 'Lost in transit',
                desc: 'No protection for buyers or sellers — endless transfer disputes, fake products, and broken trust.',
              },
              {
                title: 'Stuck in one city',
                desc: 'Brilliant artisans in Aba, Kano, Iseyin — making world-class work but locked out of national reach.',
              },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <div className="p-6 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 h-full">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4 font-bold">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/10 to-purple-500/10 dark:from-emerald-500/20 dark:via-emerald-500/20 dark:to-purple-500/20 border border-emerald-500/20">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <Compass size={26} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 block">
                    Our Solution
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight">
                    One marketplace. Real creators. Real trust.
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {APP_NAME} brings every artisan, every store, and every buyer into one
                    beautifully designed home. With verified profiles, secure payments, in-app chat,
                    and shipping built for Nigeria — we removed the friction so the craft can speak
                    for itself.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ──────────────────────────────────────────────── FOUNDER */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-transparent via-neutral-50 dark:via-neutral-900/60 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3 block">
              Meet the Founder
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              The person behind {APP_NAME}.
            </h2>
          </AnimatedSection>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Founder image */}
            <AnimatedSection className="lg:col-span-2">
              <div className="relative max-w-md mx-auto lg:mx-0">
                {/* Decorative blob */}
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/20 via-purple-500/15 to-orange-500/25 rounded-3xl blur-2xl -z-10" />

                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40 shadow-2xl shadow-emerald-600/10">
                  <img
                    src="/assets/imgs/team/founder-2.jpeg"
                    alt="Ifeanyi Ogbonna — Founder of Kraft"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating quote tag */}
                <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 p-4 max-w-[240px] border border-neutral-200/60 dark:border-neutral-700/60">
                  <Quote size={20} className="text-emerald-600 mb-2" />
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 italic leading-relaxed">
                    Every line of code was written for one of them.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Founder bio */}
            <AnimatedSection delay={0.15} className="lg:col-span-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-1">Ifeanyi Ogbonna</h3>
              <p className="text-sm font-semibold text-emerald-600 mb-6">Founder & Builder</p>

              <div className="space-y-4 text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                <p>
                  Ifeanyi is a Nigerian software engineer who has spent years building products used
                  by tens of thousands of people. But long before the code, there was a market — the
                  kind his mother shopped at, where everything was made by hand and a story came
                  with every product.
                </p>
                <p>
                  After watching countless friends and family struggle to find a digital home for
                  their craft — selling through DMs, losing customers to bad checkout flows,
                  battling distrust — he decided to build the platform he wished existed.
                </p>
                <p>
                  {APP_NAME} is the result: a product engineered with the same care a master
                  craftsman puts into a single piece. Every page, every interaction, every line of
                  code is built to do one thing — let Nigerian creators be seen, trusted, and paid.
                </p>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-3 mt-8">
                <a
                  href="mailto:hello@kraft.ng"
                  className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all"
                  aria-label="Email"
                >
                  <Mail size={16} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all"
                  aria-label="Twitter"
                >
                  <Twitter size={16} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all"
                  aria-label="GitHub"
                >
                  <Github size={16} />
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────── STATS */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 0.08}>
                <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 text-center">
                  <div className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-neutral-900 to-emerald-700 dark:from-white dark:to-emerald-400 bg-clip-text text-transparent mb-2">
                    {s.value}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────── CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-emerald-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950 p-10 sm:p-16 text-center">
              {/* Decorative circles */}
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />

              <div className="relative">
                <Award size={40} className="text-white/80 mx-auto mb-6" />
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                  Be part of the story.
                </h2>
                <p className="text-base sm:text-xl text-white/80 max-w-2xl mx-auto mb-8">
                  Whether you make it, buy it, or just love it — there's a place for you on{' '}
                  {APP_NAME}.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => router.push('/market')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold bg-white text-neutral-900 hover:bg-neutral-100 transition-all shadow-xl"
                  >
                    <ShoppingBag size={16} />
                    Browse the Market
                  </button>
                  <button
                    onClick={() => router.push('/creator-account/setup')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all"
                  >
                    Become a Creator
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ──────────────────────────────────────────────── FOOTER */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/imgs/logos/kraft-logo-splash.png"
              alt={APP_NAME}
              width={70}
              height={28}
              className="w-[70px] h-auto"
            />
          </div>
          <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <Link href="/market" className="hover:text-emerald-600 transition-colors">
              Market
            </Link>
            <Link href="/about" className="hover:text-emerald-600 transition-colors">
              About
            </Link>
          </div>
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} {APP_NAME}. Made in Nigeria.
          </p>
        </div>
      </footer>
    </div>
  );
}
