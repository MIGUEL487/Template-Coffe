import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import heroDuo from "@/assets/generated/hero-duo-splash.png";
import cardCappuccino from "@/assets/generated/card-hot-cappuccino.png";
import cardMocha from "@/assets/generated/card-iced-mocha-glass.png";
import cardMatcha from "@/assets/generated/card-iced-matcha.png";
import featureSplash from "@/assets/generated/feature-single-splash.png";
import decorSpoon from "@/assets/generated/decor-coffee-spoon.png";
import logo from "@/assets/lolo-logo-transparent.png";

// Real café atmosphere photos from originals kit
import photo1 from "@/assets/originals/cafe-photo-01.png";
import photo2 from "@/assets/originals/cafe-photo-02.png";
import photo3 from "@/assets/originals/cafe-photo-03.png";
import photo5 from "@/assets/originals/cafe-photo-05.png";
import photo7 from "@/assets/originals/cafe-photo-07.png";
import photo10 from "@/assets/originals/cafe-photo-10.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lolo Café — Vintage Café in Little Italy" },
      {
        name: "description",
        content:
          "A little taste of Italy, in every cup. Good coffee, beautiful pastries, and a cozy corner worth coming back to in Little Italy.",
      },
      { property: "og:title", content: "Lolo Café — Vintage Café in Little Italy" },
      {
        property: "og:description",
        content: "A little taste of Italy, in every cup. Fresh coffee and pastries in Little Italy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const featuredFavorites = [
  {
    name: "Classic Cappuccino",
    category: "Coffee Classics",
    desc: "Rich double espresso blended with velvety, textured steamed microfoam.",
    img: cardCappuccino,
    imgAlt: "Classic Cappuccino with latte art in paper cup",
  },
  {
    name: "Iced Mocha Glass",
    category: "Iced Favorites",
    desc: "Chilled espresso swirled with dark artisan cocoa and whole milk over crystal ice.",
    img: cardMocha,
    imgAlt: "Iced mocha with chocolate drizzle in glass can",
  },
  {
    name: "Iced Matcha Latte",
    category: "Matcha Moments",
    desc: "Ceremonial grade green tea layered with fresh milk and ice for a refreshing pause.",
    img: cardMatcha,
    imgAlt: "Vibrant iced matcha latte in clear cup",
  },
];

const pillars = [
  {
    num: "1",
    side: "left",
    title: "Little Italy Character",
    desc: "A warm, vintage-inspired setting with authentic European soul in the heart of the neighborhood.",
  },
  {
    num: "2",
    side: "left",
    title: "A Cozy Escape",
    desc: "Soft lighting, classic brick details, and inviting tables — a tranquil pause away from the rush.",
  },
  {
    num: "3",
    side: "right",
    title: "Coffee & Conversation",
    desc: "A good cup tastes even better when you can slow down, sit back, and share the moment.",
  },
  {
    num: "4",
    side: "right",
    title: "Sweet Moments",
    desc: "Flaky morning croissants, delicate cannoli, and artisan pastries made with love and care.",
  },
];

const atmosphereGallery = [
  { img: photo1, title: "Warm Interior", desc: "Classic woodwork and soft morning light" },
  { img: photo2, title: "Espresso Bar", desc: "Traditional pulls and crafted beverages" },
  { img: photo3, title: "Fresh Croissants", desc: "Golden, flaky layers baked every morning" },
  { img: photo5, title: "Artisan Pastries", desc: "Handcrafted cakes and sweet treats" },
  { img: photo7, title: "Cozy Tables", desc: "The perfect corner to pause and read" },
  { img: photo10, title: "Neighborhood Charm", desc: "Rooted in the timeless streets of Little Italy" },
];

function Index() {
  const root = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        if (prefersReducedMotion) return;

        // Hero duo splash cups scroll parallax & gentle float
        gsap.to(".hero-cups-img", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(".hero-cups-floating", {
          y: -10,
          rotate: 1,
          duration: 3.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });

        // Product Cards subtle entrance
        gsap.fromTo(
          ".product-card",
          { y: 35 },
          {
            y: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".cards-section",
              start: "top 95%",
              once: true,
            },
          }
        );

        // Feature center splash cup gentle float
        gsap.to(".center-splash-cup", {
          y: -8,
          duration: 3,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });

        // Pillars gentle motion
        gsap.fromTo(
          ".pillar-item-left",
          { x: -20 },
          {
            x: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".feature-section",
              start: "top 92%",
              once: true,
            },
          }
        );

        gsap.fromTo(
          ".pillar-item-right",
          { x: 20 },
          {
            x: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".feature-section",
              start: "top 92%",
              once: true,
            },
          }
        );

        // Closing spoon image gentle slide
        gsap.fromTo(
          ".spoon-img",
          { x: 40 },
          {
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".closing-section",
              start: "top 95%",
              once: true,
            },
          }
        );

        ScrollTrigger.refresh();
      }, root);
    })();

    return () => ctx?.revert();
  }, []);

  return (
    <div ref={root} className="min-h-screen bg-[#241814] text-[#F5E8D7] selection:bg-[#D8B984] selection:text-[#241814]">
      {/* 1. HEADER */}
      <header className="site-header sticky top-0 z-50 w-full backdrop-blur-md bg-[#241814]/80 border-b border-[#D8B984]/10 transition-colors">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          {/* Logo brand */}
          <a href="#" className="flex items-center gap-3.5 group" aria-label="Lolo Café Home">
            <img
              src={logo}
              alt="Lolo Café Logo"
              width={48}
              height={48}
              className="h-11 w-11 object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tight text-[#F5E8D7] leading-none">
                LOLO
              </span>
              <span className="font-sans text-[10px] tracking-[0.35em] text-[#D8B984] uppercase font-semibold leading-tight">
                CAFÉ
              </span>
            </div>
          </a>

          {/* Desktop Capsule Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-6 rounded-full border border-white/10 bg-[#382620]/60 px-7 py-2.5 shadow-pill backdrop-blur-lg"
          >
            {[
              { label: "Home", href: "#" },
              { label: "Our Café", href: "#about" },
              { label: "Favorites", href: "#favorites" },
              { label: "Atmosphere", href: "#atmosphere" },
              { label: "Visit Us", href: "#visit" },
            ].map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  idx === 0
                    ? "text-[#F5E8D7] underline underline-offset-8 decoration-[#D8B984] decoration-2"
                    : "text-[#BFAB95] hover:text-[#F5E8D7]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://www.instagram.com/lolo.cafe_/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#D8B984] px-6 py-2.5 text-sm font-semibold text-[#241814] shadow-pill hover:bg-[#E4C898] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Visit Instagram
            </a>
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#382620]/60 text-[#F5E8D7]"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-[#D8B984]/15 bg-[#2E1F1A]/95 px-6 py-5 backdrop-blur-xl flex flex-col gap-4">
            {[
              { label: "Home", href: "#" },
              { label: "Our Café", href: "#about" },
              { label: "Favorites", href: "#favorites" },
              { label: "Atmosphere", href: "#atmosphere" },
              { label: "Visit Us", href: "#visit" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#BFAB95] hover:text-[#F5E8D7] py-1"
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://www.instagram.com/lolo.cafe_/"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center rounded-full bg-[#D8B984] py-3 text-sm font-bold text-[#241814]"
            >
              Visit Instagram @lolo.cafe_
            </a>
          </nav>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="hero-section relative z-10 mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-[1.12fr_1fr] items-center gap-6 px-5 pt-10 pb-16 sm:px-8 sm:pt-16 sm:pb-24">
        {/* Left Column Text */}
        <div className="z-10 pt-2 sm:pt-4">
          <h1 className="hero-text-elem font-display text-4xl sm:text-5xl lg:text-[4.2rem] font-extrabold leading-[1.08] text-[#F5E8D7] tracking-tight">
            A little taste <br />
            of Italy, in <br />
            every cup.
          </h1>

          <p className="hero-text-elem mt-6 max-w-md text-base sm:text-lg text-[#BFAB95] font-light leading-relaxed">
            Find your favorite pause in Little Italy — exceptional coffee, handcrafted pastries, and a cozy corner worth coming back to.
          </p>

          <div className="hero-text-elem mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#favorites"
              className="inline-flex items-center justify-center rounded-full bg-[#D8B984] px-8 py-3.5 text-base font-semibold text-[#241814] shadow-card hover:bg-[#E4C898] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore the Café
            </a>
            <a
              href="#atmosphere"
              className="inline-flex items-center justify-center rounded-full border border-[#D8B984]/30 px-6 py-3.5 text-sm font-medium text-[#F5E8D7] hover:bg-white/5 transition-colors"
            >
              See Atmosphere
            </a>
          </div>
        </div>

        {/* Right Column: Hero Duo Splash Image */}
        <div className="hero-cups-wrap relative flex justify-center md:justify-end -mr-2 md:-mr-12">
          <div className="hero-cups-floating relative w-full max-w-[540px]">
            <img
              src={heroDuo}
              alt="Lolo Café Artisan Coffee Duo with Splash"
              width={1024}
              height={1024}
              fetchPriority="high"
              className="hero-cups-img w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.7)]"
            />
          </div>
        </div>
      </section>

      {/* 3. THREE FEATURED CARDS SECTION */}
      <section id="favorites" className="cards-section relative z-20 mx-auto max-w-6xl px-5 pt-12 pb-24 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-20 sm:mb-28">
          <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#D8B984] block mb-2">
            A Few Favorites
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F5E8D7] tracking-tight">
            Something delicious for every mood.
          </h2>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 pt-8">
          {featuredFavorites.map((item) => (
            <article
              key={item.name}
              className="product-card group relative rounded-[2rem] border border-[#D8B984]/15 bg-[#382620]/75 px-6 pb-8 pt-32 text-center shadow-card backdrop-blur-md transition-transform hover:-translate-y-2 flex flex-col justify-between"
            >
              {/* Product cup sticking out of card top */}
              <div className="absolute inset-x-0 -top-24 sm:-top-28 flex justify-center pointer-events-none">
                <img
                  src={item.img}
                  alt={item.imgAlt}
                  loading="lazy"
                  className="h-48 sm:h-56 w-auto object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.65)] transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div>
                <span className="inline-block rounded-full bg-[#241814]/80 border border-[#D8B984]/20 px-3 py-1 text-xs font-medium text-[#D8B984] mb-3">
                  {item.category}
                </span>
                <h3 className="font-display text-2xl font-bold text-[#F5E8D7] mb-2 tracking-tight">
                  {item.name}
                </h3>
                <p className="text-sm text-[#BFAB95] font-light leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-[#D8B984]/10">
                <a
                  href="https://www.instagram.com/lolo.cafe_/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D8B984] hover:text-[#F5E8D7] transition-colors"
                >
                  Discover on Instagram <span>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Mini Central Link */}
        <div className="mt-12 text-center">
          <a
            href="https://www.instagram.com/lolo.cafe_/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#BFAB95] hover:text-[#D8B984] underline underline-offset-8 transition-colors"
          >
            See more daily selections on Instagram @lolo.cafe_
          </a>
        </div>
      </section>

      {/* 4. "LOLO CAFÉ IS..." (4 PILLARS AROUND CENTER CUP) */}
      <section id="about" className="feature-section relative z-10 mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <h2 className="feature-heading text-center font-display text-3xl sm:text-5xl font-extrabold text-[#F5E8D7] tracking-tight mb-16 sm:mb-20">
          LOLO CAFÉ <span className="text-[#D8B984]">IS</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-10 lg:gap-8">
          {/* Left 2 Pillars (1 & 2) */}
          <div className="space-y-14 lg:space-y-20">
            {pillars.slice(0, 2).map((p) => (
              <div key={p.num} className="pillar-item-left relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-3 -top-10 select-none font-display text-8xl lg:text-9xl font-black text-[#D8B984]/10"
                >
                  {p.num}
                </span>
                <div className="relative pl-8 sm:pl-10">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F5E8D7] mb-2 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#BFAB95] font-light leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Center Single Splash Cup */}
          <div className="flex flex-col items-center justify-center my-4 lg:my-0">
            <div className="relative w-64 sm:w-80 flex justify-center">
              <img
                src={featureSplash}
                alt="Lolo Café Signature Splash Cup"
                loading="lazy"
                className="center-splash-cup w-full h-auto object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)]"
              />
            </div>
            <a
              href="https://www.instagram.com/lolo.cafe_/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#D8B984] px-8 py-3 text-sm font-semibold text-[#241814] shadow-pill hover:bg-[#E4C898] transition-all hover:scale-[1.02]"
            >
              Explore the Café
            </a>
          </div>

          {/* Right 2 Pillars (3 & 4) */}
          <div className="space-y-14 lg:space-y-20">
            {pillars.slice(2, 4).map((p) => (
              <div key={p.num} className="pillar-item-right relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-3 -top-10 select-none font-display text-8xl lg:text-9xl font-black text-[#D8B984]/10"
                >
                  {p.num}
                </span>
                <div className="relative pl-8 sm:pl-10">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F5E8D7] mb-2 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#BFAB95] font-light leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ATMOSPHERE GALLERY (REAL CAFÉ PHOTOS) */}
      <section id="atmosphere" className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#D8B984] block mb-2">
            Authentic Atmosphere
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F5E8D7] tracking-tight">
            Moments from Little Italy
          </h2>
          <p className="mt-3 text-sm text-[#BFAB95] font-light">
            Real scenes, handcrafted coffees, and vintage warmth captured at our café.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {atmosphereGallery.map((item, i) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-[#D8B984]/15 bg-[#382620]/60 shadow-soft"
            >
              <div className="aspect-square w-full overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#241814]/90 via-[#241814]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h4 className="font-display text-base sm:text-lg font-bold text-[#F5E8D7]">{item.title}</h4>
                <p className="text-xs text-[#BFAB95] font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CLOSING BANNER CARD (DECORATED WITH COFFEE SPOON) */}
      <section id="visit" className="closing-section relative z-10 mx-auto max-w-6xl px-5 pt-8 pb-24 sm:px-8">
        <div className="closing-card relative overflow-visible rounded-[2.5rem] border border-[#D8B984]/20 bg-[#382620]/80 p-8 sm:p-14 shadow-card backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] items-center gap-8">
            {/* Banner Left Copy */}
            <div className="relative z-10">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5E8D7] leading-tight tracking-tight">
                Your next favorite coffee moment starts here.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#BFAB95] font-light leading-relaxed max-w-lg">
                Discover a welcoming corner in the heart of Little Italy. Come for the coffee, stay for the warmth and conversation.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="https://www.instagram.com/lolo.cafe_/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#D8B984] px-8 py-3.5 text-sm font-semibold text-[#241814] shadow-pill hover:bg-[#E4C898] transition-all hover:scale-[1.02]"
                >
                  Find Us on Instagram <span>→</span>
                </a>
                <span className="text-xs text-[#BFAB95]">@lolo.cafe_</span>
              </div>
            </div>

            {/* Banner Right: Overflowing Coffee Spoon Image */}
            <div className="relative flex justify-center md:justify-end -mr-4 md:-mr-16 -mb-6 md:-mb-12">
              <img
                src={decorSpoon}
                alt="Artisan roasted coffee beans in wooden spoon"
                loading="lazy"
                className="spoon-img w-64 sm:w-80 md:w-[26rem] h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-[#D8B984]/15 bg-[#1C120F] text-[#BFAB95] py-14">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-[#D8B984]/10">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img src={logo} alt="Lolo Café" width={38} height={38} className="h-9 w-9 object-contain" />
              <span className="font-display text-lg font-bold text-[#F5E8D7] tracking-tight">
                LOLO CAFÉ
              </span>
              <span className="text-xs text-[#BFAB95] border-l border-[#D8B984]/20 pl-3">
                Little Italy · New York
              </span>
            </div>

            {/* Footer Navigation */}
            <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
              <a href="#" className="hover:text-[#F5E8D7] transition-colors">Home</a>
              <a href="#about" className="hover:text-[#F5E8D7] transition-colors">Our Café</a>
              <a href="#favorites" className="hover:text-[#F5E8D7] transition-colors">Favorites</a>
              <a href="#atmosphere" className="hover:text-[#F5E8D7] transition-colors">Atmosphere</a>
              <a href="https://www.instagram.com/lolo.cafe_/" target="_blank" rel="noreferrer" className="text-[#D8B984] hover:underline">
                Instagram @lolo.cafe_
              </a>
            </nav>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C7A68]">
            <p>© {new Date().getFullYear()} Lolo Café. All rights reserved.</p>
            <p>Crafted with love for Little Italy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
