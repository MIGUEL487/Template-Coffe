import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  ShoppingBag,
  X,
  Menu,
  Coffee,
} from "lucide-react";
import { CART_KEY, restoreCart, adjustQuantity, type CartItem } from "@/lib/pickup";
import hero from "@/assets/v2/hero-cafe-splash-solo.png";
import cappuccino from "@/assets/v2/produto-cappuccino.png";
import mocha from "@/assets/v2/produto-mocha-gelado.png";
import matcha from "@/assets/v2/produto-matcha-gelado.png";
import spoon from "@/assets/v2/decor-graos-colher.png";
import croissant from "@/assets/cut-croissant.png";
import officialLogo from "@/assets/lolo-logo-transparent.png";
import chocolateDessert from "@/assets/cut-brownie.png";
import fruitDrink from "@/assets/cut-berry.png";
import milkDrink from "@/assets/cut-mocha.png";
import photo3 from "@/assets/optimized/cafe-photo-03.webp";
import facade from "@/assets/optimized/cafe-photo-10.webp";

const CafeMotion = lazy(() => import("@/components/cafe-motion"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lolo Café | A little taste of Little Italy" },
      {
        name: "description",
        content:
          "Coffee, something sweet, and a moment to stay. Explore Lolo Café in Little Italy.",
      },
    ],
  }),
  component: Index,
});

export type { CartItem } from "@/lib/pickup";
// Legacy type retained for consumers; no client-generated order is treated as confirmed.
export interface ConfirmedOrder {
  orderId: string;
  customerName: string;
  pickupTime: string;
  createdAt: string;
  items: CartItem[];
}

const favorites = [
  {
    id: "classic-cappuccino",
    name: "Classic Cappuccino",
    category: "Coffee classics",
    desc: "Espresso meets a soft layer of textured milk.",
    img: cappuccino,
  },
  {
    id: "iced-mocha-glass",
    name: "Iced Mocha Glass",
    category: "Iced favorites",
    desc: "Coffee, cocoa, and milk. A cooler kind of coffee break.",
    img: mocha,
  },
  {
    id: "iced-matcha-latte",
    name: "Iced Matcha Latte",
    category: "Matcha moments",
    desc: "Green matcha and cold milk, layered over ice.",
    img: matcha,
  },
  {
    id: "butter-croissants",
    name: "Golden Croissants",
    category: "Something flaky",
    desc: "Golden layers. A little something to enjoy alongside your coffee.",
    img: croissant,
  },
  {
    id: "chocolate-dessert",
    name: "Chocolate Dessert",
    category: "Something sweet",
    desc: "A chocolate-topped treat for your next sweet moment.",
    img: chocolateDessert,
  },
  {
    id: "fruit-drink",
    name: "Fruit Drink",
    category: "A colorful pause",
    desc: "A bright, fruit-filled serving inspiration from our café photographs.",
    img: fruitDrink,
  },
];
const links = [
  { id: "home", label: "Home" },
  { id: "favorites", label: "The counter" },
  { id: "ritual", label: "Our ritual" },
  { id: "atmosphere", label: "Our café" },
  { id: "visit", label: "Visit us" },
];
const beats = [
  {
    title: "It starts with a bean.",
    text: "A familiar aroma. A reason to pause before the day begins.",
    img: spoon,
    alt: "Coffee beans spilling from a wooden spoon",
    cutout: true,
  },
  {
    title: "Make room for coffee.",
    text: "Warm cup or something iced? Find your own kind of coffee moment.",
    img: cappuccino,
    alt: "Cappuccino with a latte art rosetta",
    cutout: true,
  },
  {
    title: "A little something on the side.",
    text: "Coffee and a pastry. Some things simply belong together.",
    img: croissant,
    alt: "A golden croissant, shown as a serving suggestion",
    cutout: true,
  },
  {
    title: "And a moment for yourself.",
    text: "Pull up a chair. Leave a little space in your day for Lolo.",
    img: milkDrink,
    alt: "An isolated iced milk coffee, shown as a serving suggestion",
    cutout: true,
  },
];

function Index() {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const selection = useRef<HTMLDivElement>(null);
  const lenis = useRef<Lenis | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [selected, setSelected] = useState(0);
  const [scene, setScene] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [storageError, setStorageError] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const product = favorites[selected]!;
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    try {
      setCart(restoreCart(localStorage.getItem(CART_KEY), favorites));
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      setStorageError(true);
    }
  }, [cart, ready]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const current = links
          .filter(
            (link) =>
              (document.getElementById(link.id)?.getBoundingClientRect().top ?? Infinity) <= 150,
          )
          .at(-1);
        const atEnd =
          window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3;
        setActive(atEnd ? "visit" : (current?.id ?? "home"));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const scroller = lenis.current;
    if (cartOpen) {
      if (!el.open) el.showModal();
      scroller?.stop();
    } else if (el.open) el.close();
    const previous = document.body.style.overflow;
    if (cartOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      scroller?.start();
    };
  }, [cartOpen, motionReady]);

  const add = (item: typeof product) => {
    setCart((current) =>
      current.some((p) => p.id === item.id)
        ? adjustQuantity(current, item.id, 1)
        : [...current, { ...item, quantity: 1 }],
    );
    setCartOpen(true);
  };

  return (
    <div ref={root} className="lolo-site" data-ready={ready} data-motion-ready={motionReady}>
      <ClientOnly>
        <Suspense fallback={null}>
          <CafeMotion
            root={root}
            selection={selection}
            lenis={lenis}
            selected={selected}
            beatCount={beats.length}
            setScene={setScene}
            onReady={setMotionReady}
          />
        </Suspense>
      </ClientOnly>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Lolo Café home">
          <img
            src={officialLogo}
            alt="Lolo Café official logo"
            width="1027"
            height="1027"
            decoding="async"
          />
        </a>
        <nav aria-label="Main navigation" className={mobileOpen ? "main-nav is-open" : "main-nav"}>
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={active === link.id ? "location" : undefined}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="bag-button"
            onClick={() => setCartOpen(true)}
            aria-label={`Open pickup bag, ${total} items`}
          >
            <ShoppingBag size={18} />
            <span>Pickup bag</span>
            <b>{total}</b>
          </button>
          <button
            className="mobile-toggle icon-button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">
        <section id="home" className="hero section-shell">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="tiny-flower">✳︎</span> A little corner of Little Italy
            </p>
            <h1>
              A little taste
              <br />
              of the <span className="script-line">good life.</span>
            </h1>
            <p className="hero-description">
              Good coffee. Something sweet.
              <br />
              And a place to stay a little longer.
            </p>
            <div className="hero-buttons">
              <button className="button primary" onClick={() => setCartOpen(true)}>
                Order for Pickup <ArrowUpRight size={17} />
              </button>
              <a className="button secondary" href="#favorites">
                Explore Our Menu
              </a>
            </div>
            <p className="hero-note">Your daily pause, with a little Italian soul.</p>
          </div>
          <div className="hero-art">
            <div className="hero-orbit" aria-hidden="true" />
            <div className="hero-orbit inner" aria-hidden="true" />
            <span className="art-caption">A little coffee. A little joy.</span>
            <img
              className="hero-image"
              src={hero}
              alt="An individual coffee cup beneath a splash of coffee"
              width="1024"
              height="1024"
              fetchPriority="high"
            />
            <img
              className="hero-milk-cup"
              src={milkDrink}
              alt="An individual iced coffee with milk"
              width="704"
              height="944"
            />
            <div className="hero-stamp" aria-hidden="true">
              A little
              <br />
              <strong>Lolo</strong>
              <br />
              goes a long way
            </div>
            <img
              className="hero-beans"
              src={spoon}
              alt=""
              width="1024"
              height="1024"
              aria-hidden="true"
            />
            <span className="art-flower" aria-hidden="true">
              ✳︎
            </span>
          </div>
          <a className="scroll-note" href="#favorites">
            Take a look around <span>↓</span>
          </a>
        </section>
        <div
          className="marquee"
          aria-label="Handcrafted coffee. Fresh pastries. Little Italy. Made with care."
        >
          <div className="marquee-track" aria-hidden="true">
            {[0, 1].map((n) => (
              <div className="marquee-group" key={n}>
                {["Handcrafted coffee", "Fresh pastries", "Little Italy", "Made with care"].map(
                  (t) => (
                    <span key={t}>
                      {t}
                      <i>✳︎</i>
                    </span>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>

        <section id="favorites" className="counter section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Find your kind of favorite</p>
              <h2>The Lolo Counter</h2>
            </div>
            <p>
              A warm classic. An iced pick-me-up.
              <br />A little something for every mood.
            </p>
          </div>
          <div className="counter-stage" ref={selection}>
            <button
              className="counter-side"
              onClick={() => setSelected((selected + favorites.length - 1) % favorites.length)}
              aria-label={`Feature ${favorites[(selected + favorites.length - 1) % favorites.length]!.name}`}
            >
              <img
                src={favorites[(selected + favorites.length - 1) % favorites.length]!.img}
                alt=""
                width="1024"
                height="1024"
                loading="lazy"
              />
              <span>{favorites[(selected + favorites.length - 1) % favorites.length]!.name}</span>
              <ArrowLeft size={19} />
            </button>
            <div className="counter-feature">
              <div className="product-plinth">
                <span className="plinth-orbit" aria-hidden="true" />
                <span className="counter-bean bean-one" aria-hidden="true" />
                <span className="counter-bean bean-two" aria-hidden="true" />
                <div className="counter-feature-float">
                  <img
                    className="counter-feature-image"
                    key={product.id}
                    src={product.img}
                    alt={product.name + " isolated transparent serving illustration"}
                    width="1024"
                    height="1024"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="counter-details" aria-live="polite">
                <p className="eyebrow">{product.category}</p>
                <h3>{product.name}</h3>
                <p>{product.desc}</p>
                <button className="button primary" onClick={() => add(product)}>
                  Add to Order <Plus size={16} />
                </button>
              </div>
            </div>
            <button
              className="counter-side"
              onClick={() => setSelected((selected + 1) % favorites.length)}
              aria-label={`Feature ${favorites[(selected + 1) % favorites.length]!.name}`}
            >
              <img
                src={favorites[(selected + 1) % favorites.length]!.img}
                alt=""
                width="1024"
                height="1024"
                loading="lazy"
              />
              <span>{favorites[(selected + 1) % favorites.length]!.name}</span>
              <ArrowRight size={19} />
            </button>
          </div>
          <div className="counter-controls">
            <button
              className="icon-button"
              aria-label="Previous favorite"
              onClick={() => setSelected((selected + favorites.length - 1) % favorites.length)}
            >
              <ArrowLeft />
            </button>
            <span>
              {selected + 1} / {favorites.length}
            </span>
            <button
              className="icon-button"
              aria-label="Next favorite"
              onClick={() => setSelected((selected + 1) % favorites.length)}
            >
              <ArrowRight />
            </button>
          </div>
          <div className="counter-picker" role="group" aria-label="Choose a favorite">
            {favorites.map((item, index) => (
              <button
                key={item.id}
                className="counter-pick"
                aria-label={`Choose ${item.name}`}
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
              >
                <img src={item.img} alt="" width="160" height="180" loading="lazy" />
                <span>{item.name}</span>
                <small>{item.category}</small>
              </button>
            ))}
          </div>
          <p className="menu-disclaimer">
            A preview of our drinks and sweet favorites. Images are serving illustrations. Pickup
            ordering is currently in demo mode; prices and availability are not confirmed.
          </p>
        </section>

        <section className="food-section section-shell" aria-labelledby="food-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A little something on the side</p>
              <h2 id="food-title">
                Something sweet.
                <br />
                Something to savor.
              </h2>
            </div>
            <p>
              A few little pairings to inspire you.
              <br />
              Serving inspiration. Availability varies.
            </p>
          </div>
          <div className="food-gallery">
            {[
              {
                img: croissant,
                title: "A flaky kind of morning",
                alt: "Golden croissants, isolated on a transparent background",
              },
              {
                img: milkDrink,
                title: "Coffee, with a little softness",
                alt: "An isolated iced coffee with milk",
              },
              {
                img: chocolateDessert,
                title: "Save room for something sweet",
                alt: "An isolated chocolate-topped dessert",
              },
            ].map((p) => (
              <figure className="photo-reveal" key={p.title}>
                <div className="photo-frame cutout-frame">
                  <img src={p.img} alt={p.alt} width="768" height="1024" loading="lazy" />
                </div>
                <figcaption>{p.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="ritual" className="ritual section-shell">
          <div className="ritual-title">
            <p className="eyebrow">No rush. Just a little ritual.</p>
            <h2>
              A cup. A bite.
              <br />A moment.
            </h2>
          </div>
          <div className="ritual-layout">
            <div className="ritual-visual" aria-hidden="true">
              <span className="ritual-circle" />
              {beats.map((beat, i) => (
                <img
                  key={beat.title}
                  src={beat.img}
                  alt=""
                  width="1024"
                  height="1024"
                  loading="lazy"
                  className={`${scene === i ? "is-active" : ""} ${beat.cutout ? "cutout" : "ritual-photo"}`}
                />
              ))}
              <span className="ritual-scene-count">A little ritual / {scene + 1}</span>
            </div>
            <div className="ritual-story">
              {beats.map((beat, i) => (
                <article className={`ritual-beat ritual-beat-${i}`} key={beat.title}>
                  <span className="beat-number">0{i + 1}</span>
                  <img
                    className="mobile-ritual-img"
                    src={beat.img}
                    alt={beat.alt}
                    width="1024"
                    height="1024"
                    loading="lazy"
                  />
                  <h3>{beat.title}</h3>
                  <p>{beat.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="atmosphere" className="atmosphere section-shell">
          <div className="atmosphere-photo photo-reveal">
            <img
              src={photo3}
              alt="Wooden café table with a croissant and coffee, with chairs in the background"
              width="768"
              height="1024"
              loading="lazy"
            />
            <span className="photo-tag">A seat. A sip. A slower moment.</span>
          </div>
          <div className="atmosphere-copy">
            <p className="eyebrow">Our café / atmosphere</p>
            <h2>
              A little Italy.
              <br />A lot of heart.
            </h2>
            <p>
              Wooden tables, familiar corners, and coffee worth sitting down for. Lolo is a place to
              take a breath and enjoy the moment you’re in.
            </p>
            <a className="text-link" href="#visit">
              Come spend a little time <ArrowUpRight size={18} />
            </a>
            <div className="detail-photo">
              <img
                src={croissant}
                alt="Golden croissants, shown as a serving suggestion"
                width="768"
                height="1024"
                loading="lazy"
              />
              <p>
                Small details.
                <br />
                Simple pleasures.
                <br />A place to call your corner.
              </p>
            </div>
          </div>
        </section>

        <section id="visit" className="visit section-shell">
          <div className="visit-copy">
            <p className="eyebrow">See you at Lolo</p>
            <h2>
              Your next
              <br />
              little escape.
            </h2>
            <p>
              Find us in Little Italy. For current hours, directions, and menu availability, check
              with the café before your visit.
            </p>
            <a
              className="button primary"
              href="https://www.instagram.com/lolo.cafe_/"
              target="_blank"
              rel="noreferrer"
            >
              Visit our Instagram <ArrowUpRight size={17} />
            </a>
            <span className="visit-signature">With love, Lolo.</span>
          </div>
          <figure className="storefront photo-reveal">
            <img
              src={facade}
              alt="The real Lolo Café brick storefront, with its script sign above the entrance"
              width="768"
              height="1024"
              loading="lazy"
            />
            <figcaption>Our little corner, from the outside.</figcaption>
          </figure>
        </section>
      </main>
      <footer className="site-footer">
        <a className="wordmark" href="#home">
          <img
            src={officialLogo}
            alt="Lolo Café official logo"
            width="1027"
            height="1027"
            decoding="async"
          />
        </a>
        <p>
          A little taste of the good life.
          <br />
          Little Italy
        </p>
        <a href="https://www.instagram.com/lolo.cafe_/" target="_blank" rel="noreferrer">
          Instagram <ArrowUpRight size={16} />
        </a>
        <small>© {new Date().getFullYear()} Lolo Café</small>
      </footer>

      <dialog
        ref={dialog}
        className="pickup-dialog"
        aria-labelledby="pickup-title"
        onCancel={() => setCartOpen(false)}
        onClose={() => setCartOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setCartOpen(false);
        }}
      >
        <div className="pickup-panel" data-lenis-prevent>
          <div className="pickup-header">
            <div>
              <p className="eyebrow">Pay in person at pickup</p>
              <h2 id="pickup-title">Your pickup bag</h2>
            </div>
            <button
              className="icon-button"
              aria-label="Close pickup bag"
              onClick={() => setCartOpen(false)}
            >
              <X />
            </button>
          </div>
          <div className="demo-notice">
            <strong>Demo only — no order will be sent.</strong>
            <p>
              Online pickup is not connected yet. Prices, availability, and pickup times must be
              confirmed with the café.
            </p>
          </div>
          {storageError && (
            <p role="status">Your browser cannot save this bag. It will be lost when you leave.</p>
          )}
          {cart.length === 0 ? (
            <div className="empty-bag">
              <Coffee size={40} />
              <h3>A little something?</h3>
              <p>Your bag is empty. Explore the counter to find a favorite.</p>
              <a href="#favorites" className="button primary" onClick={() => setCartOpen(false)}>
                Explore Our Menu
              </a>
            </div>
          ) : (
            <>
              <div className="pickup-items">
                {cart.map((item) => (
                  <div className="pickup-item" key={item.id}>
                    <img src={item.img} alt="" width="70" height="70" />
                    <div>
                      <h3>{item.name}</h3>
                      <span>{item.category}</span>
                      <div className="quantity">
                        <button
                          className="icon-button"
                          aria-label={`Decrease ${item.name}`}
                          onClick={() => setCart((c) => adjustQuantity(c, item.id, -1))}
                        >
                          <Minus size={16} />
                        </button>
                        <output aria-label={`${item.name} quantity`}>{item.quantity}</output>
                        <button
                          className="icon-button"
                          aria-label={`Increase ${item.name}`}
                          disabled={item.quantity >= 20}
                          onClick={() => setCart((c) => adjustQuantity(c, item.id, 1))}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bag-summary">
                <span>Items in your bag</span>
                <strong aria-live="polite">{total}</strong>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <fieldset disabled>
                  <legend>Pickup details · available when ordering opens</legend>
                  <label htmlFor="pickup-name">Your name</label>
                  <input id="pickup-name" autoComplete="given-name" placeholder="Name for pickup" />
                  <label htmlFor="pickup-contact">Email</label>
                  <input
                    id="pickup-contact"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                  <label htmlFor="pickup-time">Pickup time</label>
                  <select id="pickup-time">
                    <option>Confirmed by the café when ordering opens</option>
                  </select>
                </fieldset>
                <button className="button primary" type="submit" disabled>
                  Pickup ordering unavailable
                </button>
                <p className="form-note">
                  No payment is collected online. This demo does not reserve items or a pickup time.
                </p>
              </form>
              <button className="text-link" onClick={() => setCart([])}>
                Clear bag
              </button>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
