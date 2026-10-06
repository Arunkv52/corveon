/* service pages: animations only. All text lives in the HTML files. */
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// headline: split into words for the masked reveal; words inside .grad keep the gradient
(function(){
  const h = document.getElementById('headline'), out = [];
  h.childNodes.forEach(n=>{
    const grad = n.nodeType === 1 && n.classList.contains('grad');
    n.textContent.trim().split(/\s+/).filter(Boolean).forEach(w=>out.push(`<span class="w"><span${grad?' class="grad"':''}>${w}</span></span>`));
  });
  h.innerHTML = out.join(' ');
})();

const cnts = document.querySelectorAll('.cnt');

if (reduce){
  gsap.set('#headline .w span',{y:0});
  cnts.forEach(el=>el.textContent = el.dataset.n);
  document.querySelectorAll('.stp').forEach(s=>s.classList.add('on'));
  gsap.set('#rail',{scaleX:1});
} else {
  // page load
  gsap.timeline({defaults:{ease:'power4.out'}})
    .from('.navbar',{y:-80,opacity:0,duration:.8})
    .to('#headline .w span',{y:0,duration:1.1,stagger:.06},'-=.4')
    .from('.fade-in',{y:24,opacity:0,duration:.8,stagger:.12},'-=.7')
    .from('#panel',{y:60,opacity:0,rotate:3,duration:1.1},'-=1')
    .from('#panel .fact',{x:30,opacity:0,stagger:.12,duration:.6},'-=.5');
  gsap.to('#panel',{y:-12,duration:3,yoyo:true,repeat:-1,ease:'sine.inOut',delay:2});
  gsap.to('#o1',{x:-100,y:80,duration:9,yoyo:true,repeat:-1,ease:'sine.inOut'});
  gsap.to('#o2',{x:120,y:-40,duration:11,yoyo:true,repeat:-1,ease:'sine.inOut'});

  // scroll reveals
  gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'}}));
  ['.cap','.ind','.sc','.oc'].forEach(c=>{
    const els = gsap.utils.toArray(c); if(!els.length) return;
    gsap.from(els,{y:70,opacity:0,scale:.95,duration:.9,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:els[0],start:'top 88%'}});
  });
  cnts.forEach(el=>{const o={v:0};gsap.to(o,{v:+el.dataset.n,duration:2,ease:'power2.out',onUpdate:()=>el.textContent=Math.round(o.v),scrollTrigger:{trigger:el,start:'top 92%',once:true}});});

  // approach: line fills, steps light up in order
  gsap.to('#rail',{scaleX:1,ease:'none',scrollTrigger:{trigger:'.ap',start:'top 70%',end:'bottom 75%',scrub:true}});
  document.querySelectorAll('.stp').forEach(s=>ScrollTrigger.create({trigger:s,start:'top 75%',
    onEnter:()=>s.classList.add('on'),onLeaveBack:()=>s.classList.remove('on')}));
  gsap.from('.stp > *',{y:30,opacity:0,stagger:.05,duration:.7,ease:'power3.out',scrollTrigger:{trigger:'.ap',start:'top 80%'}});
  gsap.from('#cta',{scale:.9,borderRadius:'120px',opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'#cta',start:'top 85%'}});

  // cursor glow + magnetic buttons
  const g = document.querySelector('.glow-cursor');
  const gx = gsap.quickTo(g,'x',{duration:.6}), gy = gsap.quickTo(g,'y',{duration:.6});
  addEventListener('mousemove',e=>{gx(e.clientX);gy(e.clientY);});
  document.querySelectorAll('.btn-glow,.btn-w').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.25,y:(e.clientY-r.top-r.height/2)*.4,duration:.3});});
    b.addEventListener('mouseleave',()=>gsap.to(b,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}));
  });
}

// card spotlight follows the mouse
document.querySelectorAll('.card-x').forEach(c=>c.addEventListener('mousemove',e=>{
  const r = c.getBoundingClientRect();
  c.style.setProperty('--x',e.clientX-r.left+'px'); c.style.setProperty('--y',e.clientY-r.top+'px');
}));

// scroll progress bar + sticky navbar
gsap.to('.progress',{scaleX:1,ease:'none',scrollTrigger:{scrub:.3,start:0,end:'max'}});
ScrollTrigger.create({start:80,onUpdate:s=>document.querySelector('.navbar').classList.toggle('solid',s.scroll()>80)});
addEventListener('load',()=>ScrollTrigger.refresh());
