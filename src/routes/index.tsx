import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useRef } from "react";
import hero from "@/assets/hero-cups.png";
import croissant from "@/assets/cut-croissant.png";
import mocha from "@/assets/cut-mocha.png";
import berry from "@/assets/cut-berry.png";
import brownie from "@/assets/cut-brownie.png";
import { getTenantData, type TenantData } from "@/lib/db";

export const getTenantInfoFn = createServerFn({ method: "GET" })
  .validator((tenantId?: string) => tenantId)
  .handler(async ({ data }): Promise<TenantData> => {
    return await getTenantData(data);
  });

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    tenant: typeof search.tenant === "string" ? search.tenant : undefined,
  }),
  loaderDeps: ({ search: { tenant } }) => ({ tenant }),
  loader: async ({ deps: { tenant } }) => {
    return await getTenantInfoFn({ data: tenant });
  },
  head: ({ loaderData }) => {
    const tradeName = loaderData?.tenant?.trade_name || "Lolo Café";
    const tagline = loaderData?.tenant?.tagline || "Vintage café in Little Italy";
    return {
      meta: [
        { title: `${tradeName} — ${tagline}` },
        { name: "description", content: `${tagline} - Fresh croissants, specialty coffee and sweet treats.` },
        { property: "og:title", content: `${tradeName} — ${tagline}` },
        { property: "og:description", content: tagline },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Index,
});

const defaultMenu = [
  { name: "Croissant", desc: "Butter, flaky layers, baked fresh every morning.", price: "$4.50", rate: "4.9", img: croissant },
  { name: "Iced Mocha", desc: "Espresso, cocoa and cold milk over ice.", price: "$6.00", rate: "5.0", img: mocha },
  { name: "Berry Cup", desc: "Mango, berries, cream and pistachio.", price: "$8.50", rate: "4.8", img: berry },
];

const fallbackImages = [croissant, mocha, berry, brownie];

const values: [string, string][] = [
  ["Freshly baked", "Croissants and pastries come out of our oven every morning, the old-fashioned way."],
  ["Vintage charm", "Brick walls, soft light and flowers — a cozy corner to slow down and enjoy."],
  ["Italian soul", "Rooted in Little Italy, inspired by the little cafés of Rome and Milan."],
  ["Made with love", "Every cup and every plate is prepared with care by our team."],
];

function Index() {
  const root = useRef<HTMLDivElement>(null);
  const data = Route.useLoaderData();
  const tenant = data?.tenant;
  const dbProducts = data?.products || [];

  const displayMenu =
    dbProducts.length > 0
      ? dbProducts.map((p, idx) => ({
          name: p.name,
          desc: p.description || "Delicioso item preparado com ingredientes selecionados.",
          price:
            tenant?.currency === "BRL" || !tenant?.currency
              ? `R$ ${(p.price_cents / 100).toFixed(2).replace(".", ",")}`
              : `$${(p.price_cents / 100).toFixed(2)}`,
          rate: "5.0",
          img: p.image_url || fallbackImages[idx % fallbackImages.length],
        }))
      : defaultMenu;

  const brandName = tenant?.trade_name || "Lolo Café";
  const brandTagline = tenant?.tagline || "Discover the perfect taste in every sip!";

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".nav-pill", { y: -40, opacity: 0, duration: 0.8 })
          .from(".hero-line", { y: 60, opacity: 0, stagger: 0.12, duration: 1 }, "-=0.4")
          .from(".hero-cups", { x: 120, rotate: 12, opacity: 0, scale: 0.8, duration: 1.4 }, "-=1");
        gsap.to(".hero-cups img", { y: -14, rotate: 2, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(".hero-cups", { yPercent: -25, rotate: -6, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".bg-word", { xPercent: -30, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true } });
        gsap.from(".card", { y: 120, opacity: 0, stagger: 0.15, duration: 1, ease: "back.out(1.4)", scrollTrigger: { trigger: ".cards", start: "top 80%" } });
        gsap.utils.toArray<HTMLElement>(".card-img").forEach((el) =>
          gsap.fromTo(el, { y: 40, rotate: -8 }, { y: -30, rotate: 6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }));
        gsap.from(".about-title", { y: 50, opacity: 0, duration: 1, scrollTrigger: { trigger: ".about", start: "top 75%" } });
        gsap.from(".about-cup", { scale: 0.6, rotate: -20, opacity: 0, duration: 1.4, ease: "elastic.out(1,0.6)", scrollTrigger: { trigger: ".about", start: "top 65%" } });
        gsap.from(".val-l", { x: -80, opacity: 0, stagger: 0.2, duration: 1, scrollTrigger: { trigger: ".about", start: "top 60%" } });
        gsap.from(".val-r", { x: 80, opacity: 0, stagger: 0.2, duration: 1, scrollTrigger: { trigger: ".about", start: "top 60%" } });
        gsap.from(".quiz", { y: 80, opacity: 0, duration: 1, scrollTrigger: { trigger: ".quiz", start: "top 85%" } });
        gsap.fromTo(".quiz-img", { x: 150, rotate: 25 }, { x: 0, rotate: -6, ease: "none", scrollTrigger: { trigger: ".quiz", start: "top bottom", end: "center center", scrub: true } });
      }, root);
    })();
    return () => ctx?.revert();
  }, []);

  return (
    <div ref={root} className="relative overflow-x-hidden bg-background text-foreground">
      <div aria-hidden className="bg-word pointer-events-none absolute left-0 top-[28rem] select-none whitespace-nowrap font-script text-[22rem] leading-[1.3] text-primary/10">
        {brandName.split(" ")[0]}
      </div>

      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-6">
        <a href="#" className="flex items-center gap-2 font-script text-4xl leading-[1.3] text-primary">
          <span className="pr-1">{brandName.split(" ")[0]}</span>
          <span className="font-display text-base tracking-[0.3em] text-foreground">
            {brandName.split(" ").slice(1).join(" ") || "CAFÉ"}
          </span>
        </a>
        <nav className="nav-pill hidden rounded-full border bg-card/70 px-6 py-2 text-sm text-muted-foreground backdrop-blur md:flex md:gap-7">
          {["Home", "Menu", "About", "Reviews", "Specials"].map((l, i) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className={i === 0 ? "text-foreground underline underline-offset-8 decoration-primary" : "hover:text-foreground"}
            >
              {l}
            </a>
          ))}
        </nav>
        <a href="#menu" className="rounded-full bg-accent px-5 py-2 text-sm text-accent-foreground shadow-sm hover:opacity-90 transition-opacity">
          Order now
        </a>
      </header>

      <section className="hero relative z-10 mx-auto grid max-w-6xl grid-cols-[1.15fr_1fr] items-center gap-2 px-5 pb-10 pt-4">
        <div>
          <h1 className="hero-line font-display text-4xl font-bold leading-[1.15] text-primary sm:text-6xl">
            {brandTagline}
          </h1>
          <p className="hero-line mt-5 max-w-md text-sm font-light text-muted-foreground sm:text-lg">
            At {brandName}, coffee isn't just a drink — it's an art. A vintage corner where every sip feels like a little trip to Rome.
          </p>
          <a href="#menu" className="hero-line mt-7 inline-block rounded-full bg-accent px-8 py-3 text-accent-foreground shadow-soft hover:opacity-90 transition-opacity">
            Choose your coffee
          </a>
        </div>
        <div className="hero-cups relative -mr-10">
          <img src={hero} alt={`${brandName} coffee cups`} width={1024} height={1024} className="w-[130%] max-w-none drop-shadow-2xl" />
        </div>
      </section>

      <section id="menu" className="relative z-10 mx-auto max-w-5xl px-4 pb-20">
        <div className="cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-24">
          {displayMenu.map((m) => (
            <article key={m.name} className="card relative rounded-3xl border bg-card/80 px-4 pb-6 pt-24 text-center shadow-soft backdrop-blur sm:pt-36">
              <div className="absolute inset-x-0 -top-20 flex justify-center sm:-top-24">
                <img src={m.img} alt={m.name} loading="lazy" className="card-img h-40 w-auto object-contain drop-shadow-xl sm:h-56" />
              </div>
              <span className="absolute right-3 top-3 rounded-md bg-background/90 px-2 py-0.5 text-xs font-medium">{m.rate} ★</span>
              <h3 className="font-display text-xl font-bold sm:text-2xl">{m.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm line-clamp-2">{m.desc}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-display text-lg font-bold sm:text-2xl">{m.price}</span>
                <button
                  aria-label={`Add ${m.name}`}
                  className="grid h-9 w-9 place-items-center rounded-full bg-accent text-lg text-accent-foreground sm:h-10 sm:w-10 hover:opacity-90 transition-opacity"
                >
                  +
                </button>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground underline underline-offset-4">See full menu</p>
      </section>

      <section id="about" className="about relative z-10 mx-auto max-w-6xl px-5 py-16">
        <h2 className="about-title text-center font-display text-4xl font-bold text-primary">
          <span className="font-script text-gold text-5xl font-normal">{brandName.split(" ")[0]}</span> is
        </h2>
        <div className="mt-12 grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
          <div className="space-y-12">{values.slice(0, 2).map(([t, d], i) => <Value key={t} side="val-l" n={i + 1} t={t} d={d} />)}</div>
          <div className="flex flex-col items-center">
            <img src={hero} alt={`${brandName} cup`} loading="lazy" className="about-cup w-36 drop-shadow-2xl sm:w-72" />
            <a href="#visit" className="mt-6 rounded-full bg-accent px-8 py-3 text-accent-foreground shadow-soft hover:opacity-90 transition-opacity">
              Order
            </a>
          </div>
          <div className="space-y-12">{values.slice(2).map(([t, d], i) => <Value key={t} side="val-r" n={i + 3} t={t} d={d} />)}</div>
        </div>
      </section>

      <section id="visit" className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-10">
        <div className="quiz relative overflow-visible rounded-[2rem] border bg-secondary/80 p-8 shadow-soft backdrop-blur sm:p-14">
          <div className="relative z-10 max-w-[60%]">
            <h2 className="font-display text-3xl font-bold leading-tight text-secondary-foreground sm:text-5xl">Find the treat that suits you best</h2>
            <p className="mt-3 text-sm text-muted-foreground">Mon closed · Tue–Thu from 10:30am · Free parking</p>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-full bg-gold px-7 py-3 text-primary-foreground hover:opacity-90 transition-opacity">
              Visit Instagram
            </a>
          </div>
          <img src={brownie} alt="Treat with ice cream" loading="lazy" className="quiz-img absolute -right-6 -top-10 w-56 drop-shadow-2xl sm:w-[26rem]" />
        </div>
        <p className="mt-6 text-sm text-muted-foreground underline underline-offset-4">News · Instagram</p>
      </section>
    </div>
  );
}

function Value({ n, t, d, side }: { n: number; t: string; d: string; side: string }) {
  return (
    <div className={`${side} relative`}>
      <span className="absolute -left-2 -top-6 font-display text-7xl font-bold leading-none text-primary/20 sm:text-9xl">{n}</span>
      <div className="relative pl-6 sm:pl-12">
        <h3 className="font-display text-lg font-bold leading-snug sm:text-2xl">{t}</h3>
        <p className="mt-2 text-[11px] text-muted-foreground sm:text-sm">{d}</p>
      </div>
    </div>
  );
}
