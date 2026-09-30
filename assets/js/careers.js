/* careers page scripts */
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const h = document.getElementById('headline');
h.innerHTML = h.textContent.trim().split(' ').map(w => `<span class="w"><span>${w}</span></span>`).join(' ');
h.querySelectorAll('.w')[2].querySelector('span').classList.add('grad');

// role filter
const roles = gsap.utils.toArray('.role');
document.getElementById('fl').addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b) return;
  document.querySelectorAll('#fl button').forEach(x=>x.classList.toggle('on',x===b));
  const f=b.dataset.f;
  roles.forEach(r=>{
    const ok=f==='all'||r.dataset.dept===f;
    if(ok){r.style.display=''; if(!reduce) gsap.fromTo(r,{opacity:0,y:20},{opacity:1,y:0,duration:.5});}
    else r.style.display='none';
  });
  ScrollTrigger.refresh();
});
// opening a role changes page height
document.getElementById('rolelist').addEventListener('shown.bs.collapse',()=>ScrollTrigger.refresh());
document.getElementById('rolelist').addEventListener('hidden.bs.collapse',()=>ScrollTrigger.refresh());

if (reduce) {
  gsap.set('#headline .w span',{y:0});
} else {
  gsap.timeline({defaults:{ease:'power4.out'}})
    .from('.navbar',{y:-80,opacity:0,duration:.8})
    .to('#headline .w span',{y:0,duration:1.1,stagger:.06},'-=.4')
    .from('.fade-in',{y:24,opacity:0,duration:.8,stagger:.12},'-=.7');
  gsap.to('#o1',{x:-100,y:80,duration:9,yoyo:true,repeat:-1,ease:'sine.inOut'});
  gsap.to('#o2',{x:120,y:-40,duration:11,yoyo:true,repeat:-1,ease:'sine.inOut'});

  gsap.from('.stat',{y:40,opacity:0,stagger:.12,duration:.8,scrollTrigger:{trigger:'.stat',start:'top 92%'}});
  gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
  gsap.from('.card-x',{y:70,opacity:0,scale:.95,duration:.9,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:'.card-x',start:'top 88%'}});
  gsap.from('.role',{x:-50,opacity:0,stagger:.1,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'#rolelist',start:'top 85%'}});
  gsap.from('.hs',{x:60,opacity:0,stagger:.15,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.hs',start:'top 85%'}});
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
document.querySelectorAll('.card-x').forEach(c=>c.addEventListener('mousemove',e=>{
  const r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px');}));
