/* service template: reads ?s=KEY, fills every section from service-data.js, then animates */
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (id) => document.getElementById(id);
const list = (a) => a.map((x) => `<li>${x}</li>`).join("");

const key = new URLSearchParams(location.search).get("s") || "web-development";
const S = window.SERVICES[key];

function notFound() {
  $("app").innerHTML = `<div class="container nf">
    <h1 class="mb-3" style="font-weight:800">We could not find that service.</h1>
    <p class="mb-4">Choose one of our services below.</p>
    <div class="d-flex flex-wrap gap-2 justify-content-center">
      ${Object.entries(window.SERVICES)
        .map(
          ([k, v]) =>
            `<a class="btn btn-ghost" href="service.html?s=${k}">${v.name}</a>`,
        )
        .join("")}
    </div></div>`;
}

function render() {
  document.title = `${S.title} | Kodeon`;
  $("metaDesc").content = S.intro;
  const others = Object.keys(window.SERVICES).filter((k) => k !== key);

  // 1. HERO
  $("hero").innerHTML = `
    <div class="orb" style="width:440px;height:440px;background:var(--a);top:-120px;right:-100px" id="o1"></div>
    <div class="orb" style="width:320px;height:320px;background:var(--b);bottom:-120px;left:8%;opacity:.22" id="o2"></div>
    <div class="container position-relative"><div class="row align-items-center g-5">
      <div class="col-lg-7">
        <div class="crumb mb-4 fade-in"><a href="index.html">Home</a> / <a href="services.html">Services</a> / ${S.name}</div>
        <h1 id="headline" class="mb-4">${S.headline}</h1>
        <p class="fs-5 mb-4 fade-in">${S.intro}</p>
        <div class="d-flex flex-wrap gap-3 fade-in">
          <a href="start-project.html" class="btn btn-glow">Discuss your project</a>
          <a href="#approach" class="btn btn-ghost">How we work</a>
        </div>
      </div>
      <div class="col-lg-5"><div class="panel" id="panel">
        <div class="big-ico">${S.icon}</div>
        <h3>${S.name}</h3>
        ${S.facts.map((f) => `<div class="fact"><b>${f[0]}</b><span>${f[1]}</span></div>`).join("")}
      </div></div>
    </div></div>`;

  // 2. OVERVIEW
  $("overview").innerHTML = `<div class="container"><div class="row g-5">
    <div class="col-lg-5"><div style="position:sticky;top:120px">
      <span class="kick sh" style="display:block;margin:0 0 .8rem;color:var(--b);font-family:'Sora';font-weight:600;font-size:.9rem">Overview</span>
      <h2 class="big">${S.overview.title}</h2>
    </div></div>
    <div class="col-lg-7">
      ${S.overview.text.map((t) => `<p class="fs-5 reveal" style="max-width:none">${t}</p>`).join("")}
      <div class="mt-4">${S.overview.points.map((p) => `<div class="pt reveal"><i></i><div><h5>${p[0]}</h5><p>${p[1]}</p></div></div>`).join("")}</div>
    </div></div></div>`;

  // 3. CAPABILITIES: 3 grids with bullets
  $("capabilities").innerHTML = `<div class="container">
    <div class="sh reveal"><span class="kick">Capabilities</span><h2 class="big">What we deliver</h2></div>
    <div class="row g-4">${S.capabilities.map((c) => `<div class="col-lg-4"><div class="card-x cap"><div class="ico">${c.icon}</div><h4>${c.title}</h4><ul class="bl">${list(c.items)}</ul></div></div>`).join("")}</div></div>`;

  // 4. USE CASES: industries + real scenarios
  $("usecases").innerHTML = `<div class="container">
    <div class="sh reveal"><span class="kick">Use cases</span><h2 class="big">Where this works best</h2></div>
    <h3 class="sub reveal">By industry</h3>
    <div class="row g-4 mb-5">${S.industries.map((i) => `<div class="col-md-6 col-lg-3"><div class="card-x ind uc"><span class="em">${i[0]}</span><h4>${i[1]}</h4><p>${i[2]}</p></div></div>`).join("")}</div>
    <h3 class="sub reveal">Real scenarios</h3>
    <div class="row g-4">${S.scenarios
      .map(
        (
          s,
        ) => `<div class="col-lg-4"><div class="card-x sc uc"><h4 class="mb-3">${s.title}</h4>
      <div class="row-l"><b>Problem</b><span>${s.problem}</span></div>
      <div class="row-l"><b>Solution</b><span>${s.solution}</span></div>
      <div class="res">${s.result}</div></div></div>`,
      )
      .join("")}</div></div>`;

  // 5. APPROACH: Discover / Design / Build / Deploy
  const names = ["Discover", "Design", "Build", "Deploy"];
  $("approach").innerHTML = `<div class="container">
    <div class="sh reveal"><span class="kick">Approach</span><h2 class="big">How we work</h2></div>
    <div class="ap"><div class="rail"><i id="rail"></i></div>
      <div class="row g-4">${S.approach.map((a, i) => `<div class="col-md-6 col-lg-3"><div class="stp"><div class="n">0${i + 1}</div><h4>${names[i]}</h4><p>${a[0]}</p><ul class="bl">${list(a[1])}</ul></div></div>`).join("")}</div>
    </div></div>`;

  // 6. OUTCOMES: Efficiency / Cost reduction / Scalability
  $("outcomes").innerHTML = `<div class="container">
    <div class="sh reveal"><span class="kick">Outcomes</span><h2 class="big">What you can expect</h2></div>
    <div class="row g-4">${S.outcomes
      .map(
        (
          o,
        ) => `<div class="col-lg-4"><div class="card-x oc"><span class="lab">${o.label}</span>
      <div class="num grad">${o.prefix}<span class="cnt" data-n="${o.value}">0</span>${o.suffix}</div><p>${o.text}</p></div></div>`,
      )
      .join("")}</div></div>`;

  // related services
  $("related").innerHTML =
    `<div class="container"><h3 class="mb-4" style="font-weight:800">Explore other services</h3>
    <div class="row g-3">${others
      .slice(0, 3)
      .map(
        (k) =>
          `<div class="col-md-4"><a class="rel" href="service.html?s=${k}"><b>${window.SERVICES[k].icon} ${window.SERVICES[k].name}</b><small>${window.SERVICES[k].facts[0][0]} ${window.SERVICES[k].facts[0][1].toLowerCase()}</small></a></div>`,
      )
      .join("")}</div></div>`;
}

function headline() {
  // split into words; *starred words* get the gradient
  const h = $("headline");
  let on = false;
  h.innerHTML = h.textContent
    .trim()
    .split(" ")
    .map((w) => {
      if (w.startsWith("*")) on = true;
      const clean = w.replace(/\*/g, ""),
        cls = on ? ' class="grad"' : "";
      if (w.endsWith("*")) on = false;
      return `<span class="w"><span${cls}>${clean}</span></span>`;
    })
    .join(" ");
}

function motion() {
  const cnts = document.querySelectorAll(".cnt");
  if (reduce) {
    gsap.set("#headline .w span", { y: 0 });
    cnts.forEach((el) => (el.textContent = el.dataset.n));
    document.querySelectorAll(".stp").forEach((s) => s.classList.add("on"));
    gsap.set("#rail", { scaleX: 1 });
  } else {
    gsap
      .timeline({ defaults: { ease: "power4.out" } })
      .from(".navbar", { y: -80, opacity: 0, duration: 0.8 })
      .to("#headline .w span", { y: 0, duration: 1.1, stagger: 0.06 }, "-=.4")
      .from(
        ".fade-in",
        { y: 24, opacity: 0, duration: 0.8, stagger: 0.12 },
        "-=.7",
      )
      .from("#panel", { y: 60, opacity: 0, rotate: 3, duration: 1.1 }, "-=1")
      .from(
        "#panel .fact",
        { x: 30, opacity: 0, stagger: 0.12, duration: 0.6 },
        "-=.5",
      );
    gsap.to("#panel", {
      y: -12,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 2,
    });
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

    gsap.utils
      .toArray(".reveal")
      .forEach((el) =>
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        }),
      );
    [
      [".cap", "#capabilities"],
      [".ind", "#usecases"],
      [".sc", "#usecases .row:last-child"],
      [".oc", "#outcomes"],
    ].forEach(([c, t]) => {
      const els = gsap.utils.toArray(c);
      if (!els.length) return;
      gsap.from(els, {
        y: 70,
        opacity: 0,
        scale: 0.95,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: els[0], start: "top 88%" },
      });
    });
    cnts.forEach((el) => {
      const o = { v: 0 };
      gsap.to(o, {
        v: +el.dataset.n,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => (el.textContent = Math.round(o.v)),
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    });

    // approach: line fills, steps light up in order
    gsap.to("#rail", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".ap",
        start: "top 70%",
        end: "bottom 75%",
        scrub: true,
      },
    });
    document
      .querySelectorAll(".stp")
      .forEach((s) =>
        ScrollTrigger.create({
          trigger: s,
          start: "top 75%",
          onEnter: () => s.classList.add("on"),
          onLeaveBack: () => s.classList.remove("on"),
        }),
      );
    gsap.from(".stp > *", {
      y: 30,
      opacity: 0,
      stagger: 0.05,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: ".ap", start: "top 80%" },
    });
    gsap.from("#cta", {
      scale: 0.9,
      borderRadius: "120px",
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: "#cta", start: "top 85%" },
    });

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
  document.querySelectorAll(".card-x").forEach((c) =>
    c.addEventListener("mousemove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--x", e.clientX - r.left + "px");
      c.style.setProperty("--y", e.clientY - r.top + "px");
    }),
  );
}

if (!S) {
  notFound();
} else {
  render();
  headline();
  motion();
  addEventListener("load", () => ScrollTrigger.refresh());
}

gsap.to(".progress", {
  scaleX: 1,
  ease: "none",
  scrollTrigger: { scrub: 0.3, start: 0, end: "max" },
});
ScrollTrigger.create({
  start: 80,
  onUpdate: (s) =>
    document
      .querySelector(".navbar")
      .classList.toggle("solid", s.scroll() > 80),
});
