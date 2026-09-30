/* start-project page scripts */
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- CONFIG: paste your form endpoint here (e.g. https://formspree.io/f/xxxx).
   Leave it empty and the form will open the visitor's email app with the answers filled in. ---- */
const ENDPOINT = '';
const TO_EMAIL = 'hello@kodeon.com';

const h = document.getElementById('headline');
h.innerHTML = h.textContent.trim().split(' ').map(w => `<span class="w"><span>${w}</span></span>`).join(' ');
h.querySelectorAll('.w')[3].querySelector('span').classList.add('grad');

// ---------- multi-step form ----------
const steps = [...document.querySelectorAll('.step')];
const bars = [...document.querySelectorAll('.prog b')];
const form = document.getElementById('pf');
const err = document.getElementById('err');
const next = document.getElementById('next'), back = document.getElementById('back');
let cur = 0;

function paint(){
  steps.forEach((s,i)=>s.classList.toggle('on',i===cur));
  document.getElementById('plab').textContent = `Step ${cur+1} of 3`;
  bars.forEach((b,i)=>gsap.to(b,{scaleX:i<=cur?1:0,duration:reduce?0:.5,ease:'power3.out'}));
  back.style.visibility = cur ? 'visible' : 'hidden';
  next.textContent = cur === 2 ? 'Send my project' : 'Continue';
  err.textContent = '';
}
function go(to){
  const from = steps[cur], dir = to > cur ? 1 : -1;
  if(reduce){ cur = to; paint(); return; }
  gsap.to(from,{opacity:0,x:-30*dir,duration:.25,onComplete:()=>{
    cur = to; paint();
    gsap.fromTo(steps[cur],{opacity:0,x:30*dir},{opacity:1,x:0,duration:.4,ease:'power3.out'});
    steps[cur].querySelector('input,textarea')?.focus({preventScroll:true});
  }});
}
const val = n => form.querySelector(`[name="${n}"]:checked`)?.value;
function check(){
  if(cur===0 && !form.querySelector('[name="service"]:checked')) return 'Choose at least one service to continue.';
  if(cur===1 && !(val('budget') && val('timeline'))) return 'Choose a budget range and a start time.';
  if(cur===2){
    const f = form.elements;
    if(!f.name.value.trim()) return 'Please enter your name.';
    if(!/^\S+@\S+\.\S+$/.test(f.email.value.trim())) return 'Please enter a valid email address.';
    if(f.message.value.trim().length < 10) return 'Tell us a little about your project (at least 10 characters).';
    if(!f.consent.checked) return 'Please tick the box so we can contact you.';
  }
  return '';
}
function shake(){ if(!reduce) gsap.fromTo('#fcard',{x:-8},{x:0,duration:.5,ease:'elastic.out(1,.3)'}); }

next.addEventListener('click', async ()=>{
  const msg = check();
  if(msg){ err.textContent = msg; shake(); return; }
  if(cur < 2) return go(cur+1);

  // final step: send
  const f = form.elements;
  const data = {
    services: [...form.querySelectorAll('[name="service"]:checked')].map(i=>i.value).join(', '),
    stage: val('stage') || 'Not given', budget: val('budget'), timeline: val('timeline'),
    name: f.name.value.trim(), email: f.email.value.trim(), company: f.company.value.trim(),
    phone: f.phone.value.trim(), message: f.message.value.trim()
  };
  next.disabled = true; next.textContent = 'Sending...';
  let ok = true, viaMail = false;
  if(ENDPOINT){
    try{
      const r = await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)});
      ok = r.ok;
    }catch(e){ ok = false; }
  } else {
    viaMail = true;
    const body = Object.entries(data).map(([k,v])=>`${k}: ${v}`).join('\n');
    location.href = `mailto:${TO_EMAIL}?subject=${encodeURIComponent('New project enquiry from '+data.name)}&body=${encodeURIComponent(body)}`;
  }
  next.disabled = false; next.textContent = 'Send my project';
  if(!ok){ err.textContent = `Something went wrong. Please try again or email ${TO_EMAIL}.`; return; }

  document.getElementById('donetxt').textContent = viaMail
    ? `Your email app should now be open with your answers filled in. Press send there and we will reply within one business day.`
    : `We will reply to ${data.email} within one business day.`;
  form.style.display = 'none';
  const d = document.getElementById('done'); d.style.display = 'block'; d.focus({preventScroll:true});
  if(!reduce){
    gsap.from(d.children,{y:30,opacity:0,stagger:.12,duration:.7,ease:'power3.out'});
    d.querySelectorAll('circle,path').forEach(el=>{const l=el.getTotalLength();gsap.fromTo(el,{strokeDasharray:l,strokeDashoffset:l},{strokeDashoffset:0,duration:.9,ease:'power2.out',delay:.2});});
  }
});
back.addEventListener('click',()=>cur && go(cur-1));
form.addEventListener('change',()=>err.textContent='');
form.addEventListener('keydown',e=>{ if(e.key==='Enter' && e.target.tagName!=='TEXTAREA'){ e.preventDefault(); next.click(); }});
paint();

// ---------- page motion ----------
if (reduce) {
  gsap.set('#headline .w span',{y:0});
} else {
  gsap.timeline({defaults:{ease:'power4.out'}})
    .from('.navbar',{y:-80,opacity:0,duration:.8})
    .to('#headline .w span',{y:0,duration:1.1,stagger:.07},'-=.4')
    .from('.fade-in',{y:24,opacity:0,duration:.8,stagger:.12},'-=.7')
    .from('#fcard',{y:60,opacity:0,duration:1},'-=1');
  gsap.to('#o1',{x:-100,y:80,duration:9,yoyo:true,repeat:-1,ease:'sine.inOut'});
  gsap.to('#o2',{x:120,y:-40,duration:11,yoyo:true,repeat:-1,ease:'sine.inOut'});

  const g=document.querySelector('.glow-cursor');
  const gx=gsap.quickTo(g,'x',{duration:.6}),gy=gsap.quickTo(g,'y',{duration:.6});
  addEventListener('mousemove',e=>{gx(e.clientX);gy(e.clientY);});
  document.querySelectorAll('.btn-glow').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.2,y:(e.clientY-r.top-r.height/2)*.3,duration:.3});});
    b.addEventListener('mouseleave',()=>gsap.to(b,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}));
  });
}
gsap.to('.progress',{scaleX:1,ease:'none',scrollTrigger:{scrub:.3,start:0,end:'max'}});
ScrollTrigger.create({start:80,onUpdate:s=>document.querySelector('.navbar').classList.toggle('solid',s.scroll()>80)});
