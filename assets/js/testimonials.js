/* testimonials page scripts */
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// headline: word-by-word reveal, last words in gradient
const h = document.getElementById('headline');
h.innerHTML = h.textContent.trim().split(' ').map((w,i)=>`<span class="w"><span${i>=6?' class="grad"':''}>${w}</span></span>`).join(' ');

// ---------- featured slider ----------
const slides = [...document.querySelectorAll('.slide')];
const dotsBox = document.querySelector('.dots');
let idx = 0, timer = null, busy = false;
slides.forEach((_,i)=>{
  const b = document.createElement('button');
  b.setAttribute('aria-label',`Show testimonial ${i+1}`);
  b.addEventListener('click',()=>{ show(i); restart(); });
  dotsBox.appendChild(b);
});
const dots = [...dotsBox.children];
const paintDots = () => dots.forEach((d,i)=>d.classList.toggle('on',i===idx));
paintDots();

function show(to){
  if(to === idx || busy) return;
  const from = slides[idx], next = slides[to], dir = (to > idx || (idx === slides.length-1 && to === 0)) ? 1 : -1;
  idx = to; paintDots();
  if(reduce){ from.classList.remove('on'); next.classList.add('on'); return; }
  busy = true;
  next.classList.add('on');
  gsap.set(next,{opacity:0});
  gsap.timeline({onComplete:()=>{ from.classList.remove('on'); gsap.set(from,{clearProps:'all'}); busy = false; }})
    .to(from,{opacity:0,x:-40*dir,duration:.35,ease:'power2.in'})
    .fromTo(next,{opacity:0,x:40*dir},{opacity:1,x:0,duration:.6,ease:'power3.out'})
    .from(next.querySelector('figcaption'),{y:20,opacity:0,duration:.5,ease:'power3.out'},'-=.3');
}
const step = d => show((idx + d + slides.length) % slides.length);
document.getElementById('nxt').addEventListener('click',()=>{ step(1); restart(); });
document.getElementById('prev').addEventListener('click',()=>{ step(-1); restart(); });
function restart(){ clearInterval(timer); if(!reduce) timer = setInterval(()=>step(1),6500); }
const feat = document.getElementById('feat');
feat.addEventListener('mouseenter',()=>clearInterval(timer));
feat.addEventListener('mouseleave',restart);
feat.addEventListener('focusin',()=>clearInterval(timer));
feat.addEventListener('focusout',restart);
feat.addEventListener('keydown',e=>{ if(e.key==='ArrowRight'){step(1);restart();} if(e.key==='ArrowLeft'){step(-1);restart();} });
restart();

// ---------- wall filter ----------
const cards = [...document.querySelectorAll('.tcard')];
document.getElementById('filters').addEventListener('click',e=>{
  const b = e.target.closest('button'); if(!b) return;
  document.querySelectorAll('#filters button').forEach(x=>x.classList.toggle('on',x===b));
  const f = b.dataset.f;
  cards.forEach(c=>{
    const ok = f === 'all' || c.dataset.cat.split(' ').includes(f);
    c.style.display = ok ? '' : 'none';
    if(ok && !reduce) gsap.fromTo(c,{opacity:0,y:30,scale:.96},{opacity:1,y:0,scale:1,duration:.5,ease:'power3.out'});
  });
  ScrollTrigger.refresh();
});

// ---------- counters and bars ----------
const score = document.getElementById('score');
const cnts = document.querySelectorAll('.cnt');
if (reduce){
  gsap.set('#headline .w span',{y:0});
  score.textContent = '4.9';
  cnts.forEach(el=>el.textContent = el.dataset.n);
} else {
  gsap.timeline({defaults:{ease:'power4.out'}})
    .from('.navbar',{y:-80,opacity:0,duration:.8})
    .to('#headline .w span',{y:0,duration:1.1,stagger:.05},'-=.4')
    .from('.fade-in',{y:24,opacity:0,duration:.8,stagger:.12},'-=.7')
    .from('#panel',{y:60,opacity:0,rotate:3,duration:1.1},'-=1');
  const s = {v:0};
  gsap.to(s,{v:4.9,duration:2,delay:.6,ease:'power2.out',onUpdate:()=>score.textContent = s.v.toFixed(1)});
  gsap.from('.brow i',{scaleX:0,duration:1.2,stagger:.15,delay:.8,ease:'power3.out'});
  gsap.from('#panel .stars',{opacity:0,letterSpacing:'.6em',duration:1,delay:.9,ease:'power3.out'});

  gsap.to('#panel',{y:-12,duration:3,yoyo:true,repeat:-1,ease:'sine.inOut',delay:2});
  gsap.to('#o1',{x:-100,y:80,duration:9,yoyo:true,repeat:-1,ease:'sine.inOut'});
  gsap.to('#o2',{x:120,y:-40,duration:11,yoyo:true,repeat:-1,ease:'sine.inOut'});

  gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'}}));
  gsap.from('.stat',{y:40,opacity:0,stagger:.12,duration:.8,scrollTrigger:{trigger:'.stat',start:'top 92%'}});
  cnts.forEach(el=>{const o={v:0};gsap.to(o,{v:+el.dataset.n,duration:2,ease:'power2.out',onUpdate:()=>el.textContent=Math.round(o.v),scrollTrigger:{trigger:el,start:'top 92%',once:true}});});
  ScrollTrigger.batch('.tcard',{start:'top 92%',once:true,
    onEnter:b=>gsap.fromTo(b,{y:70,opacity:0},{y:0,opacity:1,stagger:.1,duration:.8,ease:'power3.out',overwrite:true})});
  gsap.from('#cta',{scale:.9,borderRadius:'120px',opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'#cta',start:'top 85%'}});

  // client strip
  const mq = gsap.to('#track',{xPercent:-50,duration:30,ease:'none',repeat:-1});
  const mqEl = document.querySelector('.marq');
  mqEl.addEventListener('mouseenter',()=>gsap.to(mq,{timeScale:.2}));
  mqEl.addEventListener('mouseleave',()=>gsap.to(mq,{timeScale:1}));

  // cursor glow + magnetic buttons
  const g = document.querySelector('.glow-cursor');
  const gx = gsap.quickTo(g,'x',{duration:.6}), gy = gsap.quickTo(g,'y',{duration:.6});
  addEventListener('mousemove',e=>{gx(e.clientX);gy(e.clientY);});
  document.querySelectorAll('.btn-glow,.btn-w').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.25,y:(e.clientY-r.top-r.height/2)*.4,duration:.3});});
    b.addEventListener('mouseleave',()=>gsap.to(b,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}));
  });
}

// card spotlight
document.querySelectorAll('.card-x').forEach(c=>c.addEventListener('mousemove',e=>{
  const r = c.getBoundingClientRect();
  c.style.setProperty('--x',e.clientX-r.left+'px'); c.style.setProperty('--y',e.clientY-r.top+'px');
}));

// progress bar + sticky navbar
gsap.to('.progress',{scaleX:1,ease:'none',scrollTrigger:{scrub:.3,start:0,end:'max'}});
ScrollTrigger.create({start:80,onUpdate:s=>document.querySelector('.navbar').classList.toggle('solid',s.scroll()>80)});
