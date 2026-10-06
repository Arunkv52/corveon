/* work page scripts */
gsap.registerPlugin(ScrollTrigger, Flip);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const h = document.getElementById('headline');
h.innerHTML = h.textContent.trim().split(' ').map(w => `<span class="w"><span>${w}</span></span>`).join(' ');
h.querySelectorAll('.w')[2].querySelector('span').classList.add('grad');

// filter: projects glide to their new positions
const projs = gsap.utils.toArray('.proj');
document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('button'); if(!btn) return;
  document.querySelectorAll('#filters button').forEach(b => b.classList.toggle('on', b === btn));
  const f = btn.dataset.f;
  const show = projs.filter(p => f === 'all' || p.dataset.cat.split(' ').includes(f));
  if (reduce) { projs.forEach(p => p.style.display = show.includes(p) ? '' : 'none'); return; }
  const state = Flip.getState(projs);
  projs.forEach(p => p.style.display = show.includes(p) ? '' : 'none');
  Flip.from(state,{duration:.7,ease:'power3.inOut',absolute:true,scale:true,
    onEnter:els=>gsap.fromTo(els,{opacity:0,scale:.8},{opacity:1,scale:1,duration:.6,delay:.15}),
    onLeave:els=>gsap.to(els,{opacity:0,scale:.8,duration:.4})});
  ScrollTrigger.refresh();
});

if (reduce) {
  gsap.set('#headline .w span',{y:0});
} else {
  gsap.timeline({defaults:{ease:'power4.out'}})
    .from('.navbar',{y:-80,opacity:0,duration:.8})
    .to('#headline .w span',{y:0,duration:1.1,stagger:.06},'-=.4')
    .from('.fade-in',{y:24,opacity:0,duration:.8,stagger:.12},'-=.7')
    .from('.filters button',{y:20,opacity:0,stagger:.06,duration:.5},'-=.5');
  gsap.to('#o1',{x:-100,y:80,duration:9,yoyo:true,repeat:-1,ease:'sine.inOut'});
  gsap.to('#o2',{x:120,y:-40,duration:11,yoyo:true,repeat:-1,ease:'sine.inOut'});

  ScrollTrigger.batch('.proj',{start:'top 90%',once:true,
    onEnter:b=>gsap.fromTo(b,{y:80,opacity:0},{y:0,opacity:1,stagger:.12,duration:.9,ease:'power3.out',overwrite:true})});
  gsap.from('.stat',{y:40,opacity:0,stagger:.12,duration:.8,scrollTrigger:{trigger:'.stat',start:'top 92%'}});
  gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
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
document.querySelectorAll('.cnt').forEach(el=>{
  const o={v:0};
  gsap.to(o,{v:+el.dataset.n,duration:reduce?0:2,ease:'power2.out',onUpdate:()=>el.textContent=Math.round(o.v),scrollTrigger:{trigger:el,start:'top 92%',once:true}});
});
projs.forEach(c=>c.addEventListener('mousemove',e=>{
  const r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px');}));
