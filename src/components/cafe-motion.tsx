import { useEffect, type RefObject, type Dispatch, type SetStateAction } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface MotionProps {
  root: RefObject<HTMLDivElement | null>;
  selection: RefObject<HTMLDivElement | null>;
  lenis: RefObject<Lenis | null>;
  selected: number;
  beatCount: number;
  setScene: Dispatch<SetStateAction<number>>;
  onReady: Dispatch<SetStateAction<boolean>>;
}
// Imported lazily inside ClientOnly: GSAP must never initialize in a Worker module scope.
export default function CafeMotion({
  root,
  selection,
  lenis,
  selected,
  beatCount,
  setScene,
  onReady,
}: MotionProps) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      cleanup = () => {};
      if (media.matches) return;
      const instance = new Lenis({
        anchors: true,
        duration: 0.9,
        smoothWheel: true,
        syncTouch: false,
      });
      lenis.current = instance;
      instance.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      cleanup = () => {
        gsap.ticker.remove(tick);
        instance.destroy();
        lenis.current = null;
      };
    };
    setup();
    media.addEventListener("change", setup);
    return () => {
      cleanup();
      media.removeEventListener("change", setup);
    };
  }, [lenis]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".site-header", { y: -12, opacity: 0, duration: 0.6, ease: "power2.out" });
        gsap.from(".counter-pick", {
          y: 22,
          opacity: 0,
          stagger: 0.06,
          duration: 0.55,
          scrollTrigger: {
            trigger: ".counter-picker",
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from(".counter-side", {
          y: 18,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          scrollTrigger: { trigger: ".counter-stage", start: "top 85%" },
        });

        gsap.from(".hero-copy > *", {
          y: 28,
          opacity: 0,
          stagger: 0.1,
          duration: 0.85,
          ease: "power2.out",
        });
        gsap.from(".hero-art", { scale: 0.92, opacity: 0, duration: 1.1, ease: "power2.out" });
        gsap.to(".hero-image", {
          y: 55,
          rotation: 3,
          ease: "none",
          scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: 0.7 },
        });
        gsap.to(".hero-beans", {
          y: -70,
          rotation: -12,
          ease: "none",
          scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: 1 },
        });
        gsap.utils.toArray<HTMLElement>(".photo-reveal").forEach((el) => {
          gsap.from(el, {
            y: 35,
            duration: 0.8,
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          });
        });
      });
      const triggers = Array.from({ length: beatCount }, (_, i) =>
        ScrollTrigger.create({
          trigger: `.ritual-beat-${i}`,
          start: "top 60%",
          end: "bottom 60%",
          onEnter: () => setScene(i),
          onEnterBack: () => setScene(i),
        }),
      );
      let alive = true;
      const refresh = () => {
        if (alive) ScrollTrigger.refresh();
      };
      document.fonts.ready.then(refresh);
      const imgs = Array.from(root.current?.querySelectorAll("img") ?? []);
      imgs.forEach((img) => img.addEventListener("load", refresh));
      return () => {
        alive = false;
        mm.revert();
        triggers.forEach((t) => t.kill());
        imgs.forEach((img) => img.removeEventListener("load", refresh));
      };
    },
    { scope: root },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const float = gsap.to(".counter-feature-float", {
          y: -9,
          duration: 2.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        });
        ScrollTrigger.create({
          trigger: ".counter-stage",
          start: "top bottom",
          end: "bottom top",
          onEnter: () => float.play(),
          onEnterBack: () => float.play(),
          onLeave: () => float.pause(),
          onLeaveBack: () => float.pause(),
        });
        gsap.from(".counter-feature-image", {
          y: 20,
          rotation: -5,
          opacity: 0,
          duration: 0.45,
          ease: "power2.out",
        });
        gsap.from(".counter-bean", {
          x: -18,
          y: 16,
          rotation: -35,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
        });
        gsap.from(".counter-details > *", { y: 8, opacity: 0, stagger: 0.04, duration: 0.35 });
      });
      return () => mm.revert();
    },
    { scope: selection, dependencies: [selected], revertOnUpdate: true },
  );

  useEffect(() => {
    onReady(true);
    return () => onReady(false);
  }, [onReady]);
  return null;
}
