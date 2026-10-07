const nav = document.querySelector(".navbar");
const toggleNav = () => nav.classList.toggle("solid", window.scrollY > 80);
toggleNav();                                   // handles page reload mid-scroll
addEventListener("scroll", toggleNav, { passive: true });