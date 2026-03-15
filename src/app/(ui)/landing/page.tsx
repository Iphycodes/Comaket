'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShoppingBag,
  Shield,
  Truck,
  Star,
  Users,
  Package,
  Store,
  ChevronRight,
  Sparkles,
  Heart,
  Zap,
  Globe,
  CreditCard,
  MessageCircle,
  CheckCircle,
  Menu,
  X,
  Sun,
  Moon,
  Percent,
  Clock,
  Wallet,
  Smartphone,
  Building2,
  BadgeCheck,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useGetCategoryTreeQuery, Category } from '@grc/services/categories';
import AuthModal from '@grc/components/apps/auth-modal';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY IMAGES (Unsplash — reliable, free)
// ═══════════════════════════════════════════════════════════════════════════

const CATEGORY_IMAGES: Record<string, string> = {
  fashion: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600&h=400&fit=crop&q=80',
  clothing:
    'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600&h=400&fit=crop&q=80',
  textiles:
    'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=600&h=400&fit=crop&q=80',
  woodwork:
    'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=600&h=400&fit=crop&q=80',
  wood: 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=600&h=400&fit=crop&q=80',
  metalwork:
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop&q=80',
  metal: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop&q=80',
  pottery: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=400&fit=crop&q=80',
  ceramic: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=400&fit=crop&q=80',
  leather: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=400&fit=crop&q=80',
  technology:
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&q=80',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&q=80',
  electronics:
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&q=80',
  skincare: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop&q=80',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&q=80',
  jewelry: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=400&fit=crop&q=80',
  jewellery:
    'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=400&fit=crop&q=80',
  food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80',
  art: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop&q=80',
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop&q=80',
  home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&q=80',
  accessories:
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=400&fit=crop&q=80',
  health: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&h=400&fit=crop&q=80',
  crafts: 'https://images.unsplash.com/photo-1452860606245-08f24bcddcb5?w=600&h=400&fit=crop&q=80',
  bags: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=400&fit=crop&q=80',
  shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop&q=80',
  footwear: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=400&fit=crop&q=80',
};

function getCategoryImage(slug: string): string {
  const lower = slug.toLowerCase();
  for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
    if (key !== 'default' && lower.includes(key)) return url;
  }
  return CATEGORY_IMAGES.default;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED SECTION WRAPPER
// ═══════════════════════════════════════════════════════════════════════════

function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════════════════

function Navbar({ onSignIn, onSignUp }: { onSignIn: () => void; onSignUp: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { label: 'Categories', href: '#categories' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'For Creators', href: '#for-creators' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/landing" className="flex items-center group">
            <Image
              src={
                scrolled
                  ? theme === 'dark'
                    ? '/assets/imgs/logos/kraft-logo-dark.png'
                    : '/assets/imgs/logos/kraft-logo-light.png'
                  : '/assets/imgs/logos/kraft-logo-dark.png'
              }
              alt="Kraft"
              width={90}
              height={36}
              style={{ width: '90px', height: 'auto' }}
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:font-semibold ${
                  scrolled
                    ? 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg transition-all ${
                scrolled
                  ? 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={onSignIn}
              className={`hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                scrolled
                  ? 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Sign In
            </button>

            <button
              onClick={onSignUp}
              className="hidden sm:inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold bg-white dark:!bg-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-100 shadow-lg shadow-black/10 transition-all hover:shadow-xl"
            >
              Get Started
            </button>

            <button
              onClick={() => router.push('/market')}
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue to-indigo-600 text-white hover:shadow-lg hover:shadow-blue/25 transition-all"
            >
              <ShoppingBag size={15} />
              Market
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all ${
                scrolled ? 'text-neutral-700 dark:text-neutral-200' : 'text-white'
              }`}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 shadow-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-neutral-100 dark:border-neutral-800 my-2" />
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignIn();
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignUp();
                }}
                className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue to-indigo-600 text-white text-center"
              >
                Get Started
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/market');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
              >
                <ShoppingBag size={15} />
                Browse Market
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════

function HeroSection({
  onGetStarted,
  onBrowseMarket,
}: {
  onGetStarted: () => void;
  onBrowseMarket: () => void;
}) {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue/30 to-indigo-600/20 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0], scale: [1, 0.95, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-600/10 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 20, -10, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-600/10 blur-[80px]"
        />
      </div>

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40"
      >
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/90 text-sm font-medium mb-8"
          >
            <Sparkles size={14} className="text-amber-400" />
            Nigeria&apos;s Premier Creator Marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight"
          >
            Discover{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Authentic
            </span>
            <br />
            Nigerian Craftsmanship
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 sm:mt-8 text-lg sm:text-xl text-white/60 max-w-2xl leading-relaxed"
          >
            The marketplace for Nigerian brands, clothing labels, tailors, shoe makers, and skilled
            artisans. From hand-woven Aso-Oke to custom leather goods, discover authentic products
            made with passion and purpose.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <button
              onClick={onBrowseMarket}
              className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-base font-bold bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-2xl shadow-black/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag size={18} />
              Browse Market
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-blue to-indigo-600 text-white hover:shadow-lg hover:shadow-blue/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Selling
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-12 sm:mt-16 flex flex-wrap items-center gap-6 sm:gap-8 text-white/40 text-sm"
          >
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald-400/70" />
              Secure Payments
            </div>
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-blue/70" />
              Nationwide Delivery
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-amber-400/70" />
              Verified Creators
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STATS STRIP
// ═══════════════════════════════════════════════════════════════════════════

function StatsStrip() {
  const stats = [
    { value: '1,000+', label: 'Creators', icon: Users },
    { value: '10,000+', label: 'Products', icon: Package },
    { value: '500+', label: 'Stores', icon: Store },
    { value: '4.8', label: 'Avg Rating', icon: Star },
  ];

  return (
    <section className="relative z-10 -mt-16 sm:-mt-20 px-4 sm:px-6 lg:px-8">
      <AnimatedSection className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/30 border border-neutral-100 dark:border-neutral-700/50 p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue/10 dark:bg-blue/20 mb-3">
                  <stat.icon size={20} className="text-blue" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROMOTIONS / DEALS SECTION
// ═══════════════════════════════════════════════════════════════════════════

function PromotionsSection() {
  const router = useRouter();

  const promos = [
    {
      tag: 'Limited Time',
      title: 'Fashion Week Sale',
      subtitle: 'Up to 35% off on all fashion & clothing items',
      cta: 'Shop Fashion',
      category: 'fashion',
      gradient: 'from-rose-600 via-pink-600 to-fuchsia-600',
      image:
        'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&h=500&fit=crop&q=80',
      badge: '35% OFF',
      badgeColor: 'bg-rose-500',
    },
    {
      tag: 'New Collection',
      title: 'Handmade Leather Goods',
      subtitle: 'Premium Nigerian leather craftsmanship, made to last',
      cta: 'Explore Leather',
      category: 'leather',
      gradient: 'from-amber-700 via-amber-600 to-yellow-600',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=500&fit=crop&q=80',
      badge: 'NEW',
      badgeColor: 'bg-amber-500',
    },
    {
      tag: 'Trending',
      title: 'Artisan Skincare',
      subtitle: 'Natural, organic skincare products from local creators',
      cta: 'Shop Skincare',
      category: 'skincare',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=500&fit=crop&q=80',
      badge: '20% OFF',
      badgeColor: 'bg-emerald-500',
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Percent size={12} />
            Hot Deals
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white">
            Don&apos;t Miss Out
          </h2>
          <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            Exclusive promotions and curated collections from top Nigerian creators
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
          {promos.map((promo, i) => (
            <AnimatedSection key={promo.title} delay={i * 0.12}>
              <button
                onClick={() => router.push(`/market?category=${promo.category}`)}
                className="group relative w-full h-[340px] sm:h-[380px] rounded-3xl overflow-hidden text-left"
              >
                {/* Background image */}
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${promo.gradient} opacity-70 mix-blend-multiply`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Badge */}
                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full ${promo.badgeColor} text-white text-xs font-bold uppercase tracking-wide shadow-lg`}
                  >
                    {promo.badge}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                    {promo.tag}
                  </span>
                </div>

                {/* Timer-style decoration */}
                <div className="absolute top-5 right-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white/80 text-xs font-medium">
                    <Clock size={12} />
                    Ends Soon
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {promo.title}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-white/70 leading-relaxed">
                    {promo.subtitle}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-bold group-hover:bg-white/30 transition-all">
                    {promo.cta}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </button>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORIES SECTION (Spacious with images)
// ═══════════════════════════════════════════════════════════════════════════

function CategoriesSection({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const displayCategories = categories.filter((c) => c.isActive).slice(0, 8);

  if (displayCategories.length === 0) return null;

  // First 2 categories get large cards, rest get standard
  const featured = displayCategories.slice(0, 2);
  const rest = displayCategories.slice(2);

  return (
    <section
      id="categories"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue/10 dark:bg-blue/20 text-blue text-xs font-bold uppercase tracking-wider mb-4">
            Explore
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white">
            Shop by Category
          </h2>
          <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            Explore curated collections of authentic Nigerian craftsmanship
          </p>
        </AnimatedSection>

        {/* Featured categories — large cards */}
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mb-5 sm:mb-6">
          {featured.map((cat, i) => (
            <AnimatedSection key={cat._id} delay={i * 0.1}>
              <button
                onClick={() => router.push(`/market?category=${cat.slug}`)}
                className="group relative w-full h-[240px] sm:h-[300px] rounded-3xl overflow-hidden text-left"
              >
                <img
                  src={cat.image || getCategoryImage(cat.slug)}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/5" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{cat.name}</h3>
                  {cat.listingCount > 0 && (
                    <p className="text-sm text-white/60 mt-1">
                      {cat.listingCount.toLocaleString()} products
                    </p>
                  )}
                  <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                    Shop Now
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </button>
            </AnimatedSection>
          ))}
        </div>

        {/* Rest of categories — standard grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5"
        >
          {rest.map((cat, i) => (
            <motion.button
              key={cat._id}
              variants={scaleIn}
              custom={i}
              onClick={() => router.push(`/market?category=${cat.slug}`)}
              className="group relative h-[180px] sm:h-[200px] rounded-2xl overflow-hidden text-left"
            >
              <img
                src={cat.image || getCategoryImage(cat.slug)}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-sm sm:text-base font-bold text-white">{cat.name}</h3>
                {cat.listingCount > 0 && (
                  <p className="text-[11px] text-white/50 mt-0.5">
                    {cat.listingCount.toLocaleString()} items
                  </p>
                )}
              </div>
            </motion.button>
          ))}
        </motion.div>

        <AnimatedSection delay={0.2} className="text-center mt-10">
          <button
            onClick={() => router.push('/market')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-blue hover:bg-blue/5 dark:hover:bg-blue/10 transition-all"
          >
            View All Categories
            <ArrowRight size={16} />
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HOW IT WORKS
// ═══════════════════════════════════════════════════════════════════════════

function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Discover',
      description:
        'Browse thousands of handcrafted products from verified Nigerian creators. Filter by category, price, or location.',
      icon: Globe,
      color: 'from-blue to-indigo-600',
    },
    {
      number: '02',
      title: 'Connect',
      description:
        'Chat directly with creators, ask questions about products, or request custom orders tailored to your needs.',
      icon: MessageCircle,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      number: '03',
      title: 'Purchase',
      description:
        'Pay securely via Paystack, OPay, bank transfer, or USSD. Your payment is protected until delivery.',
      icon: CreditCard,
      color: 'from-amber-500 to-orange-600',
    },
    {
      number: '04',
      title: 'Receive',
      description:
        'Track your order from creator to doorstep. Rate your experience and support Nigerian craftsmanship.',
      icon: Package,
      color: 'from-violet-500 to-purple-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white">
            How Kraft Works
          </h2>
          <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            From discovery to delivery, we make buying authentic crafts simple
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <AnimatedSection key={step.number} delay={i * 0.1}>
              <div className="relative group h-full">
                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 sm:p-7 h-full border border-neutral-100 dark:border-neutral-700/50 hover:border-blue/20 dark:hover:border-blue/30 transition-all hover:shadow-xl">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-lg`}
                  >
                    <step.icon size={22} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-neutral-300 dark:text-neutral-600 uppercase tracking-widest">
                    Step {step.number}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-neutral-200 dark:border-neutral-700" />
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAYMENT METHODS SECTION
// ═══════════════════════════════════════════════════════════════════════════

function PaymentMethodsSection() {
  const methods = [
    {
      name: 'Paystack',
      desc: 'Cards, bank transfers & more',
      icon: Shield,
      color: 'text-blue',
      bg: 'bg-blue/10 dark:bg-blue/20',
    },
    {
      name: 'OPay',
      desc: 'Fast mobile payments',
      icon: Smartphone,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    },
    {
      name: 'Bank Transfer',
      desc: 'Direct bank-to-bank',
      icon: Building2,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10 dark:bg-violet-500/20',
    },
    {
      name: 'USSD',
      desc: 'Pay without internet',
      icon: Wallet,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    },
    {
      name: 'Debit / Credit Cards',
      desc: 'Visa, Mastercard, Verve',
      icon: CreditCard,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    },
    {
      name: 'Mobile Money',
      desc: 'MTN, Airtel & more',
      icon: Smartphone,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue via-indigo-600 to-violet-700">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/3 -right-1/4 w-[500px] h-[500px] rounded-full bg-white/10 blur-[80px]" />
            <div className="absolute -bottom-1/3 -left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-300/10 blur-[60px]" />
            {/* Floating card decorations */}
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-12 right-12 hidden lg:block w-20 h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl"
            >
              <div className="p-3">
                <div className="w-6 h-4 rounded bg-amber-400/60" />
                <div className="mt-2 w-10 h-1.5 rounded bg-white/30" />
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 12, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-16 right-32 hidden lg:block w-16 h-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <div className="p-2.5">
                <div className="w-5 h-3.5 rounded bg-emerald-400/60" />
                <div className="mt-1.5 w-8 h-1 rounded bg-white/30" />
              </div>
            </motion.div>
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <AnimatedSection className="text-center mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6">
                <BadgeCheck size={14} />
                Secure & Trusted
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Pay Your Way
              </h2>
              <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
                Choose from multiple secure payment options. Every transaction is encrypted and
                protected with industry-leading security.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {methods.map((method, i) => (
                <motion.div
                  key={method.name}
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all text-center group"
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${method.bg} flex items-center justify-center mx-auto mb-3`}
                  >
                    <method.icon size={20} className={method.color} />
                  </div>
                  <h4 className="text-sm font-bold text-white">{method.name}</h4>
                  <p className="text-[11px] text-white/40 mt-1 leading-snug">{method.desc}</p>
                </motion.div>
              ))}
            </div>

            <AnimatedSection delay={0.3} className="text-center mt-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
                <Shield size={16} className="text-emerald-400" />
                <span className="text-sm text-white/80 font-medium">
                  256-bit SSL encryption on every transaction
                </span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WHY KRAFT / FEATURES
// ═══════════════════════════════════════════════════════════════════════════

function FeaturesSection() {
  const features = [
    {
      icon: Heart,
      title: 'Authentic Craftsmanship',
      description:
        'Every product tells a story. We celebrate the rich tradition of Nigerian artisanship — from Aso-Oke weavers to leather craftsmen.',
      gradient: 'from-rose-500/10 to-pink-500/10 dark:from-rose-500/20 dark:to-pink-500/20',
      iconColor: 'text-rose-500',
    },
    {
      icon: Users,
      title: 'Direct Creator Connection',
      description:
        'No middlemen. Buy directly from the hands that made it. Chat with creators, request customs, and build lasting relationships.',
      gradient: 'from-blue/10 to-indigo-500/10 dark:from-blue/20 dark:to-indigo-500/20',
      iconColor: 'text-blue',
    },
    {
      icon: Shield,
      title: 'Buyer Protection',
      description:
        'Secure payments via Paystack & OPay. Your money is protected with our escrow system until you confirm delivery.',
      gradient: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
      iconColor: 'text-emerald-500',
    },
    {
      icon: Zap,
      title: 'Creator Tools',
      description:
        'Powerful storefront management, order tracking, analytics, and payout systems built for Nigerian creators.',
      gradient: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
      iconColor: 'text-amber-500',
    },
    {
      icon: Truck,
      title: 'Seamless Shipping',
      description:
        'Integrated shipping coordination with tracking from creator workshop to your doorstep across Nigeria.',
      gradient: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20',
      iconColor: 'text-violet-500',
    },
    {
      icon: Globe,
      title: 'Community-Driven',
      description:
        'Join a thriving community of creators and buyers who believe in the power of Nigerian craftsmanship.',
      gradient: 'from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20',
      iconColor: 'text-cyan-500',
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white">
            Built for Nigerian Creators
          </h2>
          <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            Purpose-built tools and protections for the creator economy
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 0.08}>
              <div
                className={`group h-full rounded-2xl p-6 sm:p-7 bg-gradient-to-br ${feature.gradient} border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all hover:shadow-lg`}
              >
                <div className="mb-4">
                  <feature.icon size={28} className={feature.iconColor} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOR CREATORS CTA
// ═══════════════════════════════════════════════════════════════════════════

function ForCreatorsSection({ onGetStarted }: { onGetStarted: () => void }) {
  const benefits = [
    'Set up your store in minutes',
    'List unlimited products with rich media',
    'Receive payments directly to your bank',
    'Access analytics and sales insights',
    'Connect with buyers via built-in chat',
    'Flexible plans starting from free',
  ];

  return (
    <section id="for-creators" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue/20 to-indigo-600/10 blur-[100px]" />
            <div className="absolute -bottom-1/2 -left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-amber-500/15 to-orange-600/10 blur-[80px]" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-16 p-8 sm:p-12 lg:p-16">
            <AnimatedSection>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles size={12} />
                For Creators
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Turn Your Craft Into a{' '}
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Business
                </span>
              </h2>
              <p className="mt-5 text-lg text-white/60 leading-relaxed">
                Whether you weave Aso-Oke, craft leather bags, or make skincare products, Kraft
                gives you the tools to reach customers across Nigeria and beyond.
              </p>

              <div className="mt-8 space-y-3">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={14} className="text-emerald-400" />
                    </div>
                    <span className="text-sm text-white/80">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10">
                <button
                  onClick={onGetStarted}
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Selling Today
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="space-y-4">
                {[
                  {
                    name: 'Starter',
                    price: 'Free',
                    desc: 'Perfect for getting started',
                    features: ['1 Store', '5% commission', 'Basic analytics'],
                    popular: false,
                  },
                  {
                    name: 'Pro',
                    price: '₦3,000/mo',
                    desc: 'For growing creators',
                    features: ['3 Stores', '3% commission', 'Advanced analytics'],
                    popular: true,
                  },
                  {
                    name: 'Business',
                    price: '₦8,000/mo',
                    desc: 'For established brands',
                    features: ['Unlimited Stores', '2% commission', 'Priority support'],
                    popular: false,
                  },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`rounded-2xl p-5 sm:p-6 border transition-all ${
                      plan.popular
                        ? 'bg-white/10 backdrop-blur-sm border-amber-500/30 shadow-lg shadow-amber-500/10'
                        : 'bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                          {plan.popular && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/40 mt-0.5">{plan.desc}</p>
                      </div>
                      <p className="text-xl font-extrabold text-white">{plan.price}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {plan.features.map((f) => (
                        <span
                          key={f}
                          className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-white/60 font-medium"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Adesola Ogunleye',
      role: 'Leather Craftsman, Lagos',
      text: 'Kraft changed everything for me. I went from selling at local markets to shipping custom bags across Nigeria. My income has tripled in six months.',
      avatar: 'A',
      color: 'bg-amber-500',
    },
    {
      name: 'Ngozi Eze',
      role: 'Textile Artist, Enugu',
      text: 'The platform understands what Nigerian creators need. The payment system is seamless, and my customers love being able to chat with me directly.',
      avatar: 'N',
      color: 'bg-emerald-500',
    },
    {
      name: 'Fatima Ibrahim',
      role: 'Skincare Maker, Kano',
      text: 'I started with the free plan and now I run three stores on Kraft. The analytics help me understand what my customers want.',
      avatar: 'F',
      color: 'bg-violet-500',
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            Creator Stories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white">
            Loved by Creators
          </h2>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 0.1}>
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 sm:p-7 border border-neutral-100 dark:border-neutral-700/50 hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-neutral-100 dark:border-neutral-700/50">
                  <div
                    className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.role}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FINAL CTA
// ═══════════════════════════════════════════════════════════════════════════

function FinalCTA({
  onGetStarted,
  onBrowseMarket,
}: {
  onGetStarted: () => void;
  onBrowseMarket: () => void;
}) {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
      <AnimatedSection className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white leading-tight">
          Ready to Experience{' '}
          <span className="bg-gradient-to-r from-blue to-indigo-600 bg-clip-text text-transparent">
            Nigerian Craftsmanship
          </span>
          ?
        </h2>
        <p className="mt-5 text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
          Join thousands of buyers and creators on Nigeria&apos;s most trusted marketplace for
          handcrafted goods.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onBrowseMarket}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-blue to-indigo-600 text-white hover:shadow-xl hover:shadow-blue/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag size={18} />
            Start Shopping
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={onGetStarted}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Become a Creator
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </AnimatedSection>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Marketplace: [
      { label: 'Browse Market', href: '/' },
      { label: 'Find Creators', href: '/creators' },
      { label: 'Categories', href: '/#categories' },
    ],
    Creators: [
      { label: 'Start Selling', href: '/creator-account/setup' },
      { label: 'Subscription Plans', href: '/creator-account/subscription' },
      { label: 'Creator Dashboard', href: '/my-store' },
    ],
    Company: [
      { label: 'About Kraft', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
    ],
  };

  return (
    <footer className="bg-neutral-900 dark:bg-black border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue to-indigo-600 flex items-center justify-center">
                <Image
                  src="/assets/imgs/kraft-logo-icon.png"
                  alt="Kraft"
                  width={24}
                  height={24}
                  className="brightness-0 invert"
                />
              </div>
              <span className="text-xl font-extrabold text-white">Kraft</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
              Empowering Nigerian artisans and creators with a world-class digital marketplace.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-white hover:font-semibold transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">
            &copy; {currentYear} Kraft. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span>Made with</span>
            <Heart size={14} className="text-red-500 fill-red-500" />
            <span>in Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════

const LandingPage = () => {
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('signup');

  const { data: categoryTreeResponse } = useGetCategoryTreeQuery();
  const categoryTree: Category[] = useMemo(
    () => categoryTreeResponse?.data || [],
    [categoryTreeResponse]
  );

  const handleSignIn = useCallback(() => {
    setAuthModalView('login');
    setAuthModalOpen(true);
  }, []);

  const handleSignUp = useCallback(() => {
    setAuthModalView('signup');
    setAuthModalOpen(true);
  }, []);

  const handleBrowseMarket = useCallback(() => {
    router.push('/market');
  }, [router]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Navbar onSignIn={handleSignIn} onSignUp={handleSignUp} />

      <HeroSection onGetStarted={handleSignUp} onBrowseMarket={handleBrowseMarket} />

      <StatsStrip />

      <PromotionsSection />

      <CategoriesSection categories={categoryTree} />

      <HowItWorksSection />

      <PaymentMethodsSection />

      <FeaturesSection />

      <ForCreatorsSection onGetStarted={handleSignUp} />

      <TestimonialsSection />

      <FinalCTA onGetStarted={handleSignUp} onBrowseMarket={handleBrowseMarket} />

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialView={authModalView}
      />
    </div>
  );
};

export default LandingPage;
