/* services page scripts */
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const h = document.getElementById('headline');
h.innerHTML = h.textContent.trim().split(' ').map(w => `<span class="w"><span>${w}</span></span>`).join(' ');
h.querySelectorAll('.w')[3].querySelector('span').classList.add('grad');

if (reduce) {
  gsap.set('#headline .w span',{y:0});
} else {
  gsap.timeline({defaults:{ease:'power4.out'}})
    .from('.navbar',{y:-80,opacity:0,duration:.8})
    .to('#headline .w span',{y:0,duration:1.1,stagger:.06},'-=.4')
    .from('.fade-in',{y:24,opacity:0,duration:.8,stagger:.12},'-=.7');
  gsap.to('#o1',{x:-100,y:80,duration:9,yoyo:true,repeat:-1,ease:'sine.inOut'});
  gsap.to('#o2',{x:120,y:-40,duration:11,yoyo:true,repeat:-1,ease:'sine.inOut'});

  // service cards stack: each card shrinks slightly as the next one slides over it
  const mm = gsap.matchMedia();
  mm.add('(min-width: 992px)',()=>{
    const cards = gsap.utils.toArray('.stack');
    cards.forEach((c,i)=>{
      if(i === cards.length-1) return;
      gsap.to(c,{scale:.93,opacity:.55,ease:'none',
        scrollTrigger:{trigger:cards[i+1],start:'top 85%',end:'top 110px',scrub:true}});
    });
  });

  gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
  gsap.from('.eng',{y:70,opacity:0,scale:.95,duration:.9,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.eng',start:'top 88%'}});
  document.querySelectorAll('.tech').forEach(t=>gsap.from(t.children,{y:30,opacity:0,stagger:.06,duration:.6,ease:'power3.out',scrollTrigger:{trigger:t,start:'top 90%'}}));
  gsap.from('.accordion-item',{y:30,opacity:0,stagger:.1,duration:.7,scrollTrigger:{trigger:'.accordion',start:'top 88%'}});
  gsap.from('#cta',{scale:.9,borderRadius:'120px',opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'#cta',start:'top 85%'}});

  const g=document.querySelector('.glow-cursor');
  const gx=gsap.quickTo(g,'x',{duration:.6}),gy=gsap.quickTo(g,'y',{duration:.6});
  addEventListener('mousemove',e=>{gx(e.clientX);gy(e.clientY);});
  document.querySelectorAll('.btn-glow,.btn-w').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.25,y:(e.clientY-r.top-r.height/2)*.4,duration:.3});});
    b.addEventListener('mouseleave',()=>gsap.to(b,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}));
  });
}

gsap.to('.progress',{scaleX:1,ease:'none',scrollTrigger:{scrub:.3,start:0,end:'max'}});
ScrollTrigger.create({start:80,onUpdate:s=>document.querySelector('.navbar').classList.toggle('solid',s.scroll()>80)});
document.querySelectorAll('.eng').forEach(c=>c.addEventListener('mousemove',e=>{
  const r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px');}));
// accordion height changes move the page, so refresh triggers
document.getElementById('faq').addEventListener('shown.bs.collapse',()=>ScrollTrigger.refresh());
