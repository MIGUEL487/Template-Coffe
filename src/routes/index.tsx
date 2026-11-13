import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

// V2 Transparent High-Resolution Assets
import heroSplashGraos from "@/assets/v2/hero-cafe-splash-graos.png";
import prodCappuccino from "@/assets/v2/produto-cappuccino.png";
import prodMocha from "@/assets/v2/produto-mocha-gelado.png";
import prodMatcha from "@/assets/v2/produto-matcha-gelado.png";
import breakfastComposition from "@/assets/v2/food-cafe-da-manha-composicao.png";
import decorSpoonGraos from "@/assets/v2/decor-graos-colher.png";

// Brand Logo & Existing Visual Assets
import logo from "@/assets/lolo-logo-transparent.png";
import featureSplash from "@/assets/generated/feature-single-splash.png";

// Real Café Photography (Originals)
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

export interface CartItem {
  id: string;
  name: string;
  category: string;
  desc: string;
  img: string;
  quantity: number;
}

export interface ConfirmedOrder {
  orderId: string;
  customerName: string;
  pickupTime: string;
  createdAt: string;
  items: CartItem[];
}

const featuredFavorites = [
  {
    id: "classic-cappuccino",
    name: "Classic Cappuccino",
    category: "Coffee Classics",
    desc: "Rich double espresso poured over velvety textured microfoam with traditional Italian latte art.",
    img: prodCappuccino,
    imgAlt: "Classic Cappuccino with latte art in paper cup",
  },
  {
    id: "iced-mocha-glass",
    name: "Iced Mocha Glass",
    category: "Iced Favorites",
    desc: "Chilled espresso swirled with dark artisan cocoa, cold whole milk and crystal ice cubes.",
    img: prodMocha,
    imgAlt: "Iced mocha with chocolate drizzle in glass can",
  },
  {
    id: "iced-matcha-latte",
    name: "Iced Matcha Latte",
    category: "Matcha Moments",
    desc: "Vibrant ceremonial grade Japanese matcha layered with fresh cold milk and ice.",
    img: prodMatcha,
    imgAlt: "Vibrant iced matcha latte in clear cup",
  },
];

const pillars = [
  {
    num: "1",
    title: "Little Italy Character",
    desc: "A warm, vintage-inspired setting with authentic European soul in the heart of the neighborhood.",
  },
  {
    num: "2",
    title: "A Cozy Escape",
    desc: "Soft lighting, classic brick details, and inviting tables — a tranquil pause away from the city rush.",
  },
  {
    num: "3",
    title: "Coffee & Conversation",
    desc: "A good cup tastes even better when you can slow down, sit back, and share genuine moments.",
  },
  {
    num: "4",
    title: "Sweet Moments",
    desc: "Flaky morning croissants, delicate cannoli, and artisan pastries made with love and craft.",
  },
];

const atmosphereGallery = [
  {
    img: photo10,
    title: "Little Italy Storefront",
    desc: "Our classic brick facade and vintage gold emblem on Mulberry Street",
  },
  {
    img: photo1,
    title: "Warm Interior Tables",
    desc: "Soft morning light, artisanal soup and quiet corners to read or catch up",
  },
  {
    img: photo2,
    title: "The Espresso Bar",
    desc: "Traditional espresso machine pulls and handcrafted morning prep",
  },
  {
    img: photo3,
    title: "Fresh Oven Croissants",
    desc: "Golden, flaky layers baked fresh every morning the artisan way",
  },
  {
    img: photo5,
    title: "Artisanal Confectionery",
    desc: "Handcrafted cakes and delicate Italian pastries in our display case",
  },
  {
    img: photo7,
    title: "Intimate Dining Nook",
    desc: "Warm brick walls, vintage wooden chairs, and welcoming conversation tables",
  },
];

const marqueePhrases = [
  "LOLO CAFÉ",
  "LITTLE ITALY NYC",
  "SPECIALTY ROASTS",
  "FRESH CROISSANTS",
  "ARTISAN ESPRESSO",
  "TRADITIONAL LATTE ART",
  "COZY CORNER",
  "A LITTLE TASTE OF ITALY",
];

const NAV_LINKS = [
  { id: "home", label: "Home", href: "#" },
  { id: "favorites", label: "Favorites", href: "#favorites" },
  { id: "breakfast", label: "Morning Rituals", href: "#breakfast" },
  { id: "about", label: "Our Café", href: "#about" },
  { id: "atmosphere", label: "Atmosphere", href: "#atmosphere" },
  { id: "visit", label: "Visit Us", href: "#visit" },
];

function Index() {
  const root = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // In-Store Pickup Cart State (persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [pickupTime, setPickupTime] = useState("In 15 minutes");
  const [activeOrder, setActiveOrder] = useState<ConfirmedOrder | null>(null);

  // Initialize cart and active order from localStorage on client
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("lolo_pickup_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedOrder = localStorage.getItem("lolo_active_pickup_order");
      if (savedOrder) {
        setActiveOrder(JSON.parse(savedOrder));
      }
    } catch {
      // safe fallback if storage unavailable
    }
  }, []);

  // Save cart changes to localStorage
  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem("lolo_pickup_cart", JSON.stringify(newCart));
    } catch {
      // storage quota or disabled
    }
  };

  const addToCart = (product: (typeof featuredFavorites)[0]) => {
    const existing = cart.find((i) => i.id === product.id);
    let updated: CartItem[];
    if (existing) {
      updated = cart.map((i) =>
        i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updated = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          desc: product.desc,
          img: product.img,
          quantity: 1,
        },
      ];
    }
    updateCart(updated);
    setIsCartOpen(true);
  };

  const changeQuantity = (id: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);
    updateCart(updated);
  };

  const handlePlacePickupOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const order: ConfirmedOrder = {
      orderId: `LOLO-NYC-${randomSuffix}`,
      customerName: customerName.trim() || "Guest",
      pickupTime,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      items: [...cart],
    };

    setActiveOrder(order);
    try {
      localStorage.setItem("lolo_active_pickup_order", JSON.stringify(order));
      localStorage.removeItem("lolo_pickup_cart");
    } catch {
      // ignore storage error
    }
    setCart([]);
  };

  const handleClearOrder = () => {
    setActiveOrder(null);
    try {
      localStorage.removeItem("lolo_active_pickup_order");
    } catch {
      // ignore
    }
  };

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  // Active section observer
  useEffect(() => {
    const sectionIds = ["home", "favorites", "breakfast", "about", "atmosphere", "visit"];
    const handleScroll = () => {
      const scrollY = window.scrollY;
      for (const id of [...sectionIds].reverse()) {
        const el = id === "home" ? document.body : document.getElementById(id);
        if (el) {
          const top = id === "home" ? 0 : el.offsetTop - 140;
          if (scrollY >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Animations with prefers-reduced-motion fallback
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

        // Hero splash cups gentle float
        gsap.to(".hero-cups-floating", {
          y: -12,
          rotate: 0.8,
          duration: 3.8,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });

        // Hero cups scroll parallax
        gsap.to(".hero-cups-img", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
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

        // Breakfast composition gentle entrance
        gsap.fromTo(
          ".breakfast-img",
          { y: 30, scale: 0.97 },
          {
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".breakfast-section",
              start: "top 90%",
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
    <div
      ref={root}
      className="min-h-screen bg-[#241814] text-[#F5E8D7] selection:bg-[#D8B984] selection:text-[#241814] overflow-x-hidden"
    >
      {/* 1. HEADER */}
      <header className="site-header sticky top-0 z-50 w-full backdrop-blur-md bg-[#241814]/85 border-b border-[#D8B984]/15 transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
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

          {/* Desktop Capsule Navigation with Active Indicator */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-[#382620]/70 p-1.5 shadow-pill backdrop-blur-lg"
          >
            {NAV_LINKS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "bg-[#D8B984] text-[#241814] shadow-sm font-bold"
                      : "text-[#BFAB95] hover:text-[#F5E8D7] hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Right CTA: Pickup Cart & Instagram */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-full border border-[#D8B984]/30 bg-[#382620]/60 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F5E8D7] hover:border-[#D8B984] hover:bg-[#382620] transition-all"
              aria-label={`View in-store pickup bag with ${totalCartCount} items`}
            >
              <span>Pickup Order</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D8B984] text-[11px] font-bold text-[#241814]">
                {totalCartCount}
              </span>
            </button>

            <a
              href="https://www.instagram.com/lolo.cafe_/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#D8B984] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#241814] shadow-pill hover:bg-[#E4C898] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Instagram
            </a>
          </div>

          {/* Mobile Right Controls: Cart Badge & Hamburger */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-10 items-center gap-1.5 rounded-full border border-[#D8B984]/30 bg-[#382620]/70 px-3.5 text-xs font-bold text-[#F5E8D7]"
              aria-label={`In-store pickup cart: ${totalCartCount} items`}
            >
              <span>Pickup</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D8B984] text-[11px] font-black text-[#241814]">
                {totalCartCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#382620]/70 text-[#F5E8D7]"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-[#D8B984]/15 bg-[#2E1F1A]/95 px-6 py-5 backdrop-blur-xl flex flex-col gap-3">
            {NAV_LINKS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-semibold tracking-wide py-2 px-3 rounded-lg transition-colors ${
                    isActive ? "bg-[#D8B984] text-[#241814]" : "text-[#BFAB95] hover:text-[#F5E8D7]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <a
              href="https://www.instagram.com/lolo.cafe_/"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center rounded-full bg-[#D8B984] py-3 text-xs font-bold uppercase tracking-wider text-[#241814]"
            >
              Visit Instagram @lolo.cafe_
            </a>
          </nav>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="hero-section relative z-10 mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[1.05fr_1fr] items-center gap-8 px-5 pt-10 pb-14 sm:px-8 sm:pt-14 sm:pb-20">
        {/* Left Column Text */}
        <div className="z-10 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B984]/30 bg-[#382620]/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#D8B984] mb-6">
            <span>Little Italy · New York</span>
          </div>

          <h1 className="hero-text-elem font-display text-4xl sm:text-5xl lg:text-[4.4rem] font-extrabold leading-[1.06] text-[#F5E8D7] tracking-tight">
            A little taste <br />
            of Italy, in <br />
            every cup.
          </h1>

          <p className="hero-text-elem mt-6 max-w-lg text-base sm:text-lg text-[#BFAB95] font-light leading-relaxed">
            Find your favorite pause on Mulberry Street — exceptional Italian coffee roasts, warm handcrafted pastries, and a cozy corner worth coming back to.
          </p>

          <div className="hero-text-elem mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-[#D8B984] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#241814] shadow-card hover:bg-[#E4C898] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Order for Pickup
            </button>
            <a
              href="#atmosphere"
              className="inline-flex items-center justify-center rounded-full border border-[#D8B984]/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#F5E8D7] hover:bg-white/5 transition-colors"
            >
              See Atmosphere
            </a>
          </div>
        </div>

        {/* Right Column: Hero Splash with Roasted Coffee Beans (V2) */}
        <div className="hero-cups-wrap relative flex justify-center md:justify-end -mr-2 md:-mr-8">
          <div className="hero-cups-floating relative w-full max-w-[580px]">
            <img
              src={heroSplashGraos}
              alt="Lolo Café artisan coffee duo with dynamic splash and flying roasted beans"
              width={1117}
              height={1408}
              fetchPriority="high"
              className="hero-cups-img w-full h-auto object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.75)]"
            />
          </div>
        </div>
      </section>

      {/* CONTINUOUS MARQUEE TICKER */}
      <div className="border-y border-[#D8B984]/20 bg-[#1C120F]/90 py-3.5 marquee-container">
        <div className="marquee-track flex items-center gap-10 font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#D8B984]">
          {[...marqueePhrases, ...marqueePhrases, ...marqueePhrases].map((phrase, idx) => (
            <span key={idx} className="flex items-center gap-10">
              <span>{phrase}</span>
              <span className="text-[#BFAB95]/40 select-none">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3. THREE FEATURED CARDS SECTION (V2 PRODUCTS) */}
      <section id="favorites" className="cards-section relative z-20 mx-auto max-w-7xl px-5 pt-16 pb-24 sm:px-8">
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
              key={item.id}
              className="product-card group relative rounded-[2rem] border border-[#D8B984]/20 bg-[#382620]/80 px-6 pb-8 pt-32 text-center shadow-card backdrop-blur-md transition-transform hover:-translate-y-2 flex flex-col justify-between"
            >
              {/* Product cup sticking out of card top - Consistent 1086x1448px transparent assets */}
              <div className="absolute inset-x-0 -top-24 sm:-top-28 flex justify-center pointer-events-none">
                <img
                  src={item.img}
                  alt={item.imgAlt}
                  loading="lazy"
                  className="h-52 sm:h-60 w-auto object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.65)] transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div>
                <span className="inline-block rounded-full bg-[#241814]/85 border border-[#D8B984]/25 px-3 py-1 text-xs font-semibold text-[#D8B984] mb-3">
                  {item.category}
                </span>
                <h3 className="font-display text-2xl font-bold text-[#F5E8D7] mb-2 tracking-tight">
                  {item.name}
                </h3>
                <p className="text-sm text-[#BFAB95] font-light leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#D8B984]/15 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => addToCart(item)}
                  className="w-full rounded-full bg-[#D8B984] py-2.5 text-xs font-bold uppercase tracking-wider text-[#241814] hover:bg-[#E4C898] transition-all hover:scale-[1.01]"
                >
                  + Add to Pickup Bag
                </button>
                <a
                  href="https://www.instagram.com/lolo.cafe_/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#BFAB95] hover:text-[#D8B984] transition-colors"
                >
                  Discover on Instagram <span>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Central Instagram note */}
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

      {/* 4. EDITORIAL BREAKFAST SECTION (V2 ASSET) */}
      <section
        id="breakfast"
        className="breakfast-section relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 border-t border-[#D8B984]/15"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          {/* Editorial Text */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B984]/30 bg-[#382620]/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#D8B984] mb-4">
              <span>Morning Rituals</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#F5E8D7] tracking-tight leading-tight">
              The gentle rhythm <br />
              of a Little Italy morning.
            </h2>
            <p className="mt-6 text-base sm:text-lg text-[#BFAB95] font-light leading-relaxed">
              Before the neighborhood awakens, the warm aroma of freshly pulled espresso and golden flaky croissants fills our room. Take a quiet seat, breathe in the roasted notes, and savor the start of your day with timeless European grace.
            </p>
            <p className="mt-4 text-xs text-[#8C7A68] italic">
              *Illustrative morning pairing celebrating our bakery traditions. Fresh artisanal pastries and specialty roasts are served daily à la carte in-store.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="https://www.instagram.com/lolo.cafe_/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#D8B984] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#241814] shadow-pill hover:bg-[#E4C898] transition-all"
              >
                Find Today's Fresh Bakes <span>→</span>
              </a>
            </div>
          </div>

          {/* Visual: Breakfast Composition (V2 Transparent) */}
          <div className="relative flex justify-center">
            <img
              src={breakfastComposition}
              alt="Illustrative artisanal breakfast pairing with croissant, berries, and cappuccino"
              loading="lazy"
              className="breakfast-img w-full max-w-[560px] h-auto object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.65)]"
            />
          </div>
        </div>
      </section>

      {/* 5. "LOLO CAFÉ IS..." (4 PILLARS AROUND CENTER CUP) */}
      <section id="about" className="feature-section relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8 border-t border-[#D8B984]/15">
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
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#D8B984] px-8 py-3 text-xs font-bold uppercase tracking-wider text-[#241814] shadow-pill hover:bg-[#E4C898] transition-all hover:scale-[1.02]"
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

      {/* 6. ATMOSPHERE GALLERY (REAL CAFÉ PHOTOGRAPHS) */}
      <section id="atmosphere" className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 border-t border-[#D8B984]/15">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#D8B984] block mb-2">
            Authentic Atmosphere
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F5E8D7] tracking-tight">
            Moments from Little Italy
          </h2>
          <p className="mt-3 text-sm text-[#BFAB95] font-light">
            Real scenes, handcrafted coffees, and vintage warmth captured at our Mulberry Street location.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {atmosphereGallery.map((item) => (
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#241814]/95 via-[#241814]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h4 className="font-display text-sm sm:text-base font-bold text-[#F5E8D7]">{item.title}</h4>
                <p className="text-[11px] sm:text-xs text-[#BFAB95] font-light mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CLOSING BANNER CARD (DECORATED WITH V2 COFFEE BEANS SPOON) */}
      <section id="visit" className="closing-section relative z-10 mx-auto max-w-7xl px-5 pt-8 pb-24 sm:px-8">
        <div className="closing-card relative overflow-visible rounded-[2.5rem] border border-[#D8B984]/20 bg-[#382620]/85 p-8 sm:p-14 shadow-card backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] items-center gap-8">
            {/* Banner Left Copy */}
            <div className="relative z-10">
              <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#D8B984] block mb-2">
                Visit Us in Little Italy
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5E8D7] leading-tight tracking-tight">
                Your next favorite coffee moment starts here.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#BFAB95] font-light leading-relaxed max-w-lg">
                Discover a welcoming corner in the heart of Little Italy. Come for the espresso, stay for the warmth, conversations, and freshly baked pastries.
              </p>
              <div className="mt-3 text-xs text-[#D8B984]/80">
                <span>Mon closed · Tue–Sun from 8:30am · In-Store Pickup Available</span>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#D8B984] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#241814] shadow-pill hover:bg-[#E4C898] transition-all hover:scale-[1.02]"
                >
                  Order for Pickup <span>→</span>
                </button>
                <a
                  href="https://www.instagram.com/lolo.cafe_/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#D8B984]/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#F5E8D7] hover:bg-white/5 transition-colors"
                >
                  Instagram @lolo.cafe_
                </a>
              </div>
            </div>

            {/* Banner Right: Overflowing Coffee Spoon (V2) */}
            <div className="relative flex justify-center md:justify-end -mr-4 md:-mr-16 -mb-6 md:-mb-12 pointer-events-none">
              <img
                src={decorSpoonGraos}
                alt="Artisan roasted coffee beans in wooden spoon"
                loading="lazy"
                className="spoon-img w-64 sm:w-80 md:w-[27rem] h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-[#D8B984]/15 bg-[#1C120F] text-[#BFAB95] py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
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
            <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold uppercase tracking-wider">
              {NAV_LINKS.map((link) => (
                <a key={link.id} href={link.href} className="hover:text-[#F5E8D7] transition-colors">
                  {link.label}
                </a>
              ))}
              <a
                href="https://www.instagram.com/lolo.cafe_/"
                target="_blank"
                rel="noreferrer"
                className="text-[#D8B984] hover:underline"
              >
                Instagram
              </a>
            </nav>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C7A68]">
            <p>© {new Date().getFullYear()} Lolo Café. All rights reserved.</p>
            <p>Crafted with love for Little Italy.</p>
          </div>
        </div>
      </footer>

      {/* IN-STORE PICKUP DRAWER / MODAL */}
      {isCartOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pickup-drawer-title"
          className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in"
        >
          <div
            className="relative flex h-full w-full max-w-md flex-col justify-between border-l border-[#D8B984]/20 bg-[#2E1F1A] p-6 shadow-2xl sm:p-8 overflow-y-auto"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-[#D8B984]/15 pb-4">
                <div>
                  <h3 id="pickup-drawer-title" className="font-display text-xl font-bold text-[#F5E8D7]">
                    In-Store Pickup Bag
                  </h3>
                  <p className="text-xs text-[#D8B984]">Pay in Person at the Counter</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full border border-white/10 p-2 text-[#BFAB95] hover:text-[#F5E8D7]"
                  aria-label="Close Pickup Drawer"
                >
                  ✕
                </button>
              </div>

              {/* Active Confirmed Order View */}
              {activeOrder ? (
                <div className="mt-6 rounded-2xl border border-[#D8B984]/30 bg-[#241814] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase font-bold text-[#D8B984]">Order Confirmed</span>
                    <span className="text-xs text-[#BFAB95]">{activeOrder.createdAt}</span>
                  </div>
                  <h4 className="font-display text-2xl font-extrabold text-[#F5E8D7] tracking-tight">
                    {activeOrder.orderId}
                  </h4>
                  <p className="mt-1 text-xs text-[#BFAB95]">
                    Customer: <strong className="text-[#F5E8D7]">{activeOrder.customerName}</strong> · Pickup: {activeOrder.pickupTime}
                  </p>

                  <div className="my-4 border-t border-[#D8B984]/10 pt-3 space-y-2">
                    {activeOrder.items.map((i) => (
                      <div key={i.id} className="flex justify-between text-xs text-[#F5E8D7]">
                        <span>{i.quantity}x {i.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg bg-[#382620] p-3 text-[11px] text-[#BFAB95] leading-relaxed">
                    ☕ <strong>Payment is collected at the counter.</strong> Show this screen to your barista when you arrive at Lolo Café.
                  </div>

                  <button
                    type="button"
                    onClick={handleClearOrder}
                    className="mt-4 w-full rounded-full border border-[#D8B984]/40 py-2.5 text-xs font-bold uppercase text-[#D8B984] hover:bg-[#D8B984]/10 transition-colors"
                  >
                    Start New Order
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-16 text-center text-[#BFAB95]">
                  <p className="text-sm">Your pickup bag is empty.</p>
                  <p className="mt-1 text-xs text-[#8C7A68]">
                    Choose from our coffee classics and iced favorites.
                  </p>
                </div>
              ) : (
                /* Cart Items List */
                <div className="mt-6 divide-y divide-[#D8B984]/10">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-14 w-14 object-contain rounded-lg bg-[#241814] p-1 border border-[#D8B984]/10"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-[#F5E8D7]">{item.name}</h4>
                        <span className="text-[11px] text-[#D8B984]">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-xs hover:bg-white/10"
                          aria-label={`Decrease ${item.name}`}
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-[#F5E8D7]">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-xs hover:bg-white/10"
                          aria-label={`Increase ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* In-Store Pickup Submission Form */}
            {!activeOrder && cart.length > 0 && (
              <form onSubmit={handlePlacePickupOrder} className="border-t border-[#D8B984]/15 pt-5 space-y-4">
                <div className="rounded-xl bg-[#241814] p-3 text-xs text-[#BFAB95] border border-[#D8B984]/15">
                  <p className="font-semibold text-[#D8B984]">Pay in Person</p>
                  <p className="text-[11px] mt-0.5">
                    No credit card is billed online. Payment is settled at the counter upon arrival via Cash, Card, or Apple Pay.
                  </p>
                </div>

                <div>
                  <label htmlFor="customer-name" className="block text-xs font-semibold text-[#F5E8D7] mb-1">
                    Your Name
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    placeholder="e.g. Maria"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-[#D8B984]/30 bg-[#241814] px-4 py-2.5 text-xs text-[#F5E8D7] placeholder-[#8C7A68] focus:border-[#D8B984] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="pickup-time" className="block text-xs font-semibold text-[#F5E8D7] mb-1">
                    Estimated Pickup Time
                  </label>
                  <select
                    id="pickup-time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full rounded-xl border border-[#D8B984]/30 bg-[#241814] px-4 py-2.5 text-xs text-[#F5E8D7] focus:border-[#D8B984] focus:outline-none"
                  >
                    <option value="In 10 minutes">In 10 minutes</option>
                    <option value="In 15 minutes">In 15 minutes</option>
                    <option value="In 30 minutes">In 30 minutes</option>
                    <option value="In 45 minutes">In 45 minutes</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#D8B984] py-3 text-xs font-bold uppercase tracking-wider text-[#241814] shadow-card hover:bg-[#E4C898] transition-all"
                >
                  Confirm In-Store Pickup ({totalCartCount} items)
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
