/* process page scripts */
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const h = document.getElementById('headline');
h.innerHTML = h.textContent.trim().split(' ').map(w => `<span class="w"><span>${w}</span></span>`).join(' ');
h.querySelectorAll('.w')[2].querySelector('span').classList.add('grad');

// highlight the phase currently in view
gsap.utils.toArray('.ph').forEach(p=>ScrollTrigger.create({trigger:p,start:'top 55%',end:'bottom 55%',
  onToggle:s=>p.classList.toggle('on',s.isActive)}));
gsap.to('#pbar',{height:'100%',ease:'none',scrollTrigger:{trigger:'#phases',start:'top 55%',end:'bottom 55%',scrub:true}});

if (reduce) {
  gsap.set('#headline .w span',{y:0});
} else {
  gsap.timeline({defaults:{ease:'power4.out'}})
    .from('.navbar',{y:-80,opacity:0,duration:.8})
    .to('#headline .w span',{y:0,duration:1.1,stagger:.06},'-=.4')
    .from('.fade-in',{y:24,opacity:0,duration:.8,stagger:.12},'-=.7');
  gsap.to('#o1',{x:-100,y:80,duration:9,yoyo:true,repeat:-1,ease:'sine.inOut'});
  gsap.to('#o2',{x:120,y:-40,duration:11,yoyo:true,repeat:-1,ease:'sine.inOut'});

  gsap.utils.toArray('.ph').forEach(p=>gsap.from(p.children,{y:40,opacity:0,stagger:.08,duration:.8,ease:'power3.out',scrollTrigger:{trigger:p,start:'top 82%'}}));
  gsap.from('#gantt .track b',{scaleX:0,duration:1,stagger:.15,ease:'power3.out',scrollTrigger:{trigger:'#gantt',start:'top 80%'}});
  gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
  gsap.from('.card-x',{y:70,opacity:0,scale:.95,duration:.9,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.card-x',start:'top 88%'}});
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
document.querySelectorAll('.card-x').forEach(c=>c.addEventListener('mousemove',e=>{
  const r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px');}));
