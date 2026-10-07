/* index page scripts */
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const nav = document.querySelector(".navbar");

// ---------- navbar: transparent at the top, solid once you scroll ----------
// A plain scroll listener, so nothing else on the page can stop it working.
const onScroll = () => nav.classList.toggle("solid", window.scrollY > 40);
onScroll();
addEventListener("scroll", onScroll, { passive: true });

// ---------- headline: word-by-word reveal, text after the "/" in gradient ----------
const h = document.getElementById("headline");
const words = h.textContent.trim().split(" ");
const cut = words.indexOf("/");
h.innerHTML = words
  .map(
    (w, i) =>
      `<span class="w"><span${cut > -1 && i > cut ? ' class="grad"' : ""}>${w}</span></span>`,
  )
  .join(" ");

// ---------- page motion ----------
if (reduce) {
  gsap.set("#headline .w span", { y: 0 });
} else {
  // page-load sequence
  gsap
    .timeline({ defaults: { ease: "power4.out" } })
    .from(".navbar", { y: -80, opacity: 0, duration: 0.8 })
    .to("#headline .w span", { y: 0, duration: 1.1, stagger: 0.07 }, "-=.4")
    .from(
      ".fade-in",
      { y: 24, opacity: 0, duration: 0.8, stagger: 0.12 },
      "-=.7",
    )
    .from(
      "#visual .code",
      { y: 60, opacity: 0, rotate: 4, duration: 1.1 },
      "-=1",
    )
    .from(
      ".chip",
      {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(2)",
      },
      "-=.4",
    );

  // floating loops
  gsap.to("#visual .code", {
    y: -14,
    duration: 3,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
  gsap.to(".chip", {
    y: 10,
    duration: 2.2,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
    stagger: 0.6,
  });
  gsap.to(".o1", {
    x: 120,
    y: 60,
    duration: 9,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
  gsap.to(".o2", {
    x: -100,
    y: -50,
    duration: 11,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
  gsap.to(".o3", {
    y: 120,
    duration: 8,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });

  // tech strip (slows on hover)
  const mq = gsap.to("#track", {
    xPercent: -50,
    duration: 30,
    ease: "none",
    repeat: -1,
  });
  const mqEl = document.querySelector(".marq");
  mqEl.addEventListener("mouseenter", () => gsap.to(mq, { timeScale: 0.2 }));
  mqEl.addEventListener("mouseleave", () => gsap.to(mq, { timeScale: 1 }));

  // scroll reveals
  gsap.utils
    .toArray(".reveal")
    .forEach((el) =>
      gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      }),
    );
  gsap.from(".stoty-card-edit", {
    y: 60,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: { trigger: ".stoty-card-edit", start: "top 90%" },
  });
  gsap.from(".step-line", {
    x: 60,
    opacity: 0,
    stagger: 0.2,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: ".step-line", start: "top 85%" },
  });
  gsap.from(".reveal-item", {
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: { trigger: ".reveal-item", start: "top 88%" },
  });
  gsap.from(".card-items", {
    y: 60,
    opacity: 0,
    scale: 0.95,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: { trigger: ".card-items", start: "top 88%" },
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

  // services: cards stack on top of each other as you scroll (desktop)
  const stacks = gsap.utils.toArray("#stackwrap .stack");
  gsap.matchMedia().add("(min-width: 992px)", () => {
    stacks.forEach((c, i) => {
      if (i === stacks.length - 1) return;
      gsap.to(c, {
        scale: 0.93,
        opacity: 0.55,
        ease: "none",
        scrollTrigger: {
          trigger: stacks[i + 1],
          start: "top 85%",
          end: "top 110px",
          scrub: true,
        },
      });
    });
  });
}

// ---------- progress bar, process line, card spotlight ----------
gsap.to(".progress", {
  scaleX: 1,
  ease: "none",
  scrollTrigger: { scrub: 0.3, start: 0, end: "max" },
});
gsap.to("#bar", {
  height: "100%",
  ease: "none",
  scrollTrigger: {
    trigger: "#process .col-lg-7",
    start: "top 60%",
    end: "bottom 70%",
    scrub: true,
  },
});
document.querySelectorAll(".card-items").forEach((c) =>
  c.addEventListener("mousemove", (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--x", e.clientX - r.left + "px");
    c.style.setProperty("--y", e.clientY - r.top + "px");
  }),
);
addEventListener("load", () => ScrollTrigger.refresh());
