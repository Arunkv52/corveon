/* index page scripts */
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// split headline into words for a masked reveal
const h = document.getElementById('headline');
h.innerHTML = h.textContent.trim().split(' ').map(w => `<span class="w"><span>${w}</span></span>`).join(' ');
h.querySelectorAll('.w')[5].querySelector('span').classList.add('grad');

if (reduce) {
  gsap.set('#headline .w span', {y: 0});
} else {
  // page-load sequence
  gsap.timeline({defaults:{ease:'power4.out'}})
    .from('.navbar',{y:-80,opacity:0,duration:.8})
    .to('#headline .w span',{y:0,duration:1.1,stagger:.07},'-=.4')
    .from('.fade-in',{y:24,opacity:0,duration:.8,stagger:.12},'-=.7')
    .from('#visual .code',{y:60,opacity:0,rotate:4,duration:1.1},'-=1')
    .from('.chip',{scale:0,opacity:0,duration:.6,stagger:.15,ease:'back.out(2)'},'-=.4');

  // floating loops
  gsap.to('#visual .code',{y:-14,duration:3,yoyo:true,repeat:-1,ease:'sine.inOut'});
  gsap.to('.chip',{y:10,duration:2.2,yoyo:true,repeat:-1,ease:'sine.inOut',stagger:.6});
  gsap.to('.o1',{x:120,y:60,duration:9,yoyo:true,repeat:-1,ease:'sine.inOut'});
  gsap.to('.o2',{x:-100,y:-50,duration:11,yoyo:true,repeat:-1,ease:'sine.inOut'});
  gsap.to('.o3',{y:120,duration:8,yoyo:true,repeat:-1,ease:'sine.inOut'});

  // tech marquee (slows on hover)
  const mq = gsap.to('#track',{xPercent:-50,duration:30,ease:'none',repeat:-1});
  const mqEl = document.querySelector('.marq');
  mqEl.addEventListener('mouseenter',()=>gsap.to(mq,{timeScale:.2}));
  mqEl.addEventListener('mouseleave',()=>gsap.to(mq,{timeScale:1}));

  // scroll reveals
  gsap.from('.stat',{y:40,opacity:0,stagger:.12,duration:.8,scrollTrigger:{trigger:'.stat',start:'top 90%'}});
  gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
  gsap.from('.svc',{y:70,opacity:0,scale:.95,duration:.9,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.svc',start:'top 88%'}});
  gsap.from('.step',{x:60,opacity:0,stagger:.2,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.step',start:'top 85%'}});
  gsap.from('#cta',{scale:.9,borderRadius:'120px',opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'#cta',start:'top 85%'}});

  // cursor glow + magnetic buttons
  const g=document.querySelector('.glow-cursor');
  const gx=gsap.quickTo(g,'x',{duration:.6}),gy=gsap.quickTo(g,'y',{duration:.6});
  addEventListener('mousemove',e=>{gx(e.clientX);gy(e.clientY);});
  document.querySelectorAll('.btn-glow,.btn-w').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.25,y:(e.clientY-r.top-r.height/2)*.4,duration:.3});});
    b.addEventListener('mouseleave',()=>gsap.to(b,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}));
  });
}

// scroll progress + sticky nav
gsap.to('.progress',{scaleX:1,ease:'none',scrollTrigger:{scrub:.3,start:0,end:'max'}});
ScrollTrigger.create({start:80,onUpdate:s=>document.querySelector('.navbar').classList.toggle('solid',s.scroll()>80)});

// counters
document.querySelectorAll('.cnt').forEach(el=>{
  const o={v:0};
  gsap.to(o,{v:+el.dataset.n,duration:reduce?0:2,ease:'power2.out',onUpdate:()=>el.textContent=Math.round(o.v),
    scrollTrigger:{trigger:el,start:'top 92%',once:true}});
});

// service card spotlight
document.querySelectorAll('.svc').forEach(c=>c.addEventListener('mousemove',e=>{
  const r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px');}));

// process line fills as you scroll
gsap.to('#bar',{height:'100%',ease:'none',scrollTrigger:{trigger:'#process .col-lg-7',start:'top 60%',end:'bottom 70%',scrub:true}});

// pinned horizontal work showcase (desktop) / native swipe (mobile)
const mm = gsap.matchMedia();
mm.add('(min-width: 992px)',()=>{
  const rail=document.getElementById('rail');
  gsap.to(rail,{x:()=>-(rail.scrollWidth-innerWidth+40),ease:'none',
    scrollTrigger:{trigger:'#pin',start:'top 20%',end:()=>'+='+(rail.scrollWidth-innerWidth),pin:true,scrub:1,invalidateOnRefresh:true}});
});
mm.add('(max-width: 991px)',()=>{document.getElementById('pin').style.overflowX='auto';});



