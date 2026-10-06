/* Services page scripts */
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- headline: word-by-word reveal, "we do" in gradient ----------
const h = document.getElementById("headline");
h.innerHTML = h.textContent
  .trim()
  .split(" ")
  .map(
    (w, i) =>
      `<span class="w"><span${i >= 1 ? ' class="grad"' : ""}>${w}</span></span>`,
  )
  .join(" ");

// ---------- cards: pinned sideways scroll on desktop ----------
const pin = document.getElementById("pin");
const rail = document.getElementById("rail");
const mm = gsap.matchMedia();
mm.add("(min-width: 992px)", () => {
  if (reduce) {
    pin.style.overflowX = "auto";
    return;
  }
  gsap.to(rail, {
    x: () => -(rail.scrollWidth - innerWidth + 40),
    ease: "none",
    scrollTrigger: {
      trigger: pin,
      start: "top 20%",
      end: () => "+=" + (rail.scrollWidth - innerWidth),
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
});

// ---------- page motion ----------
if (reduce) {
  gsap.set("#headline .w span", { y: 0 });
} else {
  gsap
    .timeline({ defaults: { ease: "power4.out" } })
    .from(".navbar", { y: -80, opacity: 0, duration: 0.8 })
    .to("#headline .w span", { y: 0, duration: 1.1, stagger: 0.06 }, "-=.4")
    .from(".fade-in", { y: 24, opacity: 0, duration: 0.8, stagger: 0.12 }, "-=.7");
  gsap.to("#o1", { x: -100, y: 80, duration: 9, yoyo: true, repeat: -1, ease: "sine.inOut" });
  gsap.to("#o2", { x: 120, y: -40, duration: 11, yoyo: true, repeat: -1, ease: "sine.inOut" });

  gsap.utils.toArray(".reveal").forEach((el) =>
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    }),
  );
  gsap.from(".eng", {
    y: 70,
    opacity: 0,
    scale: 0.95,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: { trigger: ".eng", start: "top 88%" },
  });
  gsap.from("#cta", {
    scale: 0.9,
    borderRadius: "120px",
    opacity: 0,
    duration: 1.1,
    ease: "power3.out",
    scrollTrigger: { trigger: "#cta", start: "top 85%" },
  });

  // cursor glow + magnetic buttons
  const g = document.querySelector(".glow-cursor");
  const gx = gsap.quickTo(g, "x", { duration: 0.6 }),
    gy = gsap.quickTo(g, "y", { duration: 0.6 });
  addEventListener("mousemove", (e) => {
    gx(e.clientX);
    gy(e.clientY);
  });
  document.querySelectorAll(".btn-glow,.btn-w").forEach((b) => {
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      gsap.to(b, {
        x: (e.clientX - r.left - r.width / 2) * 0.25,
        y: (e.clientY - r.top - r.height / 2) * 0.4,
        duration: 0.3,
      });
    });
    b.addEventListener("mouseleave", () =>
      gsap.to(b, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,.4)" }),
    );
  });
}

// ---------- progress bar, sticky navbar, card spotlight ----------
gsap.to(".progress", {
  scaleX: 1,
  ease: "none",
  scrollTrigger: { scrub: 0.3, start: 0, end: "max" },
});
ScrollTrigger.create({
  start: 80,
  onUpdate: (s) =>
    document.querySelector(".navbar").classList.toggle("solid", s.scroll() > 80),
});
document.querySelectorAll(".eng").forEach((c) =>
  c.addEventListener("mousemove", (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--x", e.clientX - r.left + "px");
    c.style.setProperty("--y", e.clientY - r.top + "px");
  }),
);

addEventListener("load", () => ScrollTrigger.refresh());

