gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- Navbar background on scroll (plain JS, runs first so nothing can break it) ---- */
const nav = document.querySelector(".navbar");
const onScroll = () => nav.classList.toggle("solid", window.scrollY > 80);
onScroll();
addEventListener("scroll", onScroll, { passive: true });

/* ---- Headline: split into words, last word gets the gradient ---- */
const h = document.getElementById("headline");
const words = h.textContent.trim().split(" ");
h.innerHTML = words
  .map(
    (w, i) =>
      `<span class="w"><span${i === words.length - 1 ? ' class="grad"' : ""}>${w}</span></span>`,
  )
  .join(" ");

/* ---- Page motion ---- */
if (reduce) {
  gsap.set("#headline .w span", { y: 0 });
} else {
  gsap
    .timeline({ defaults: { ease: "power4.out" } })
    .from(".navbar", { y: -80, opacity: 0, duration: 0.8 })
    .to("#headline .w span", { y: 0, duration: 1.1, stagger: 0.07 }, "-=.4")
    .from(
      ".fade-in",
      { y: 24, opacity: 0, duration: 0.8, stagger: 0.12 },
      "-=.7",
    )
    .from("#fcard", { y: 60, opacity: 0, duration: 1 }, "-=1");

  gsap.to("#o1", {
    x: -100,
    y: 80,
    duration: 9,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
  gsap.to("#o2", {
    x: 120,
    y: -40,
    duration: 11,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });

  const g = document.querySelector(".glow-cursor");
  const gx = gsap.quickTo(g, "x", { duration: 0.6 }),
    gy = gsap.quickTo(g, "y", { duration: 0.6 });
  addEventListener("mousemove", (e) => {
    gx(e.clientX);
    gy(e.clientY);
  });

  document.querySelectorAll(".btn-glow").forEach((b) => {
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      gsap.to(b, {
        x: (e.clientX - r.left - r.width / 2) * 0.2,
        y: (e.clientY - r.top - r.height / 2) * 0.3,
        duration: 0.3,
      });
    });
    b.addEventListener("mouseleave", () =>
      gsap.to(b, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,.4)" }),
    );
  });
}

gsap.to(".progress", {
  scaleX: 1,
  ease: "none",
  scrollTrigger: { scrub: 0.3, start: 0, end: "max" },
});
