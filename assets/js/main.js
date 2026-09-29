const IMG={"attendance":"assets/img/attendance.webp","burger_main":"assets/img/burger_main.webp","burger_slide2":"assets/img/burger_slide2.webp","burger_slide3":"assets/img/burger_slide3.webp","deck_closing":"assets/img/deck_closing.webp","deck_context":"assets/img/deck_context.webp","deck_cover":"assets/img/deck_cover.webp","deck_heritage":"assets/img/deck_heritage.webp","deck_literal":"assets/img/deck_literal.webp","deck_meanings":"assets/img/deck_meanings.webp","deck_origin":"assets/img/deck_origin.webp","deck_proverb":"assets/img/deck_proverb.webp","reel_poster":"assets/img/reel_poster.webp","sahn_dash":"assets/img/sahn_dash.webp","sahn_home":"assets/img/sahn_home.webp","sahn_mobile":"assets/img/sahn_mobile.webp","sahn_wizard":"assets/img/sahn_wizard.webp","storyboard":"assets/img/storyboard.webp","water_main":"assets/img/water_main.webp","water_offer":"assets/img/water_offer.webp","water_segments":"assets/img/water_segments.webp","water_steps":"assets/img/water_steps.webp"};
const VID={reel:"assets/video/reel.mp4",reelWebm:"assets/video/reel.webm"};

/* ============ عدّل روابط التواصل هنا ============ */
const CONTACT = {
  telegram:  "https://t.me/PhoenixAid",
  whatsappNumber: "",               // مثال: "9647XXXXXXXXX" بدون + أو أصفار بالبداية
  instagram: "https://instagram.com/", // ضع رابط حسابك
  tiktok:    "https://tiktok.com/"     // ضع رابط حسابك
};
/* ================================================= */

(function(){
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Links
  const wa=CONTACT.whatsappNumber?`https://wa.me/${CONTACT.whatsappNumber}`:CONTACT.telegram;
  const links={telegram:CONTACT.telegram,whatsapp:wa,instagram:CONTACT.instagram,tiktok:CONTACT.tiktok};
  $$('[data-link]').forEach(a=>a.href=links[a.dataset.link]||'#');
  if(CONTACT.whatsappNumber){const l=$('[data-text="whatsappLabel"]');if(l)l.textContent='+'+CONTACT.whatsappNumber;}

  // Header + progress + process line
  const header=$('#header'),bar=$('#progress'),proc=$('#proc'),fill=$('#procFill'),steps=$$('.step');
  function onScroll(){
    const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
    header.classList.toggle('scrolled',y>20);
    bar.style.transform=`scaleX(${h>0?y/h:0})`;
    const r=proc.getBoundingClientRect(),vh=innerHeight;
    let p=(vh*.75-r.top)/(r.height);p=Math.max(0,Math.min(1,p));
    fill.style.setProperty('--p',p);
    steps.forEach((s,i)=>s.classList.toggle('lit',p>=i/(steps.length-1)-.02&&p>0));
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  // Mobile menu
  const mb=$('#menuBtn');
  mb.addEventListener('click',()=>{const o=document.body.classList.toggle('menu-open');mb.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''});
  $$('#mnav a').forEach(a=>a.addEventListener('click',()=>{document.body.classList.remove('menu-open');mb.setAttribute('aria-expanded',false);document.body.style.overflow=''}));

  // Reveal + counters
  function count(el){
    const t=+el.dataset.count,dec=+(el.dataset.dec||0),fmt=n=>n.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});if(reduce){el.textContent=fmt(t);return}
    const d=1800,s=performance.now();
    (function f(now){const k=Math.min(1,(now-s)/d),e=1-Math.pow(1-k,4);el.textContent=fmt(t*e);if(k<1)requestAnimationFrame(f)})(s);
  }
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;e.target.classList.add('in');
    $$('[data-count]',e.target).forEach(count);io.unobserve(e.target);
  }),{threshold:.18,rootMargin:'0px 0px -40px 0px'});
  $$('.rv').forEach(el=>io.observe(el));

  // Tile glow follows pointer
  $$('.tile').forEach(t=>t.addEventListener('pointermove',e=>{const r=t.getBoundingClientRect();t.style.setProperty('--mx',e.clientX-r.left+'px');t.style.setProperty('--my',e.clientY-r.top+'px')}));

  // Service buttons preselect form
  const sel=$('#serviceSel');
  $$('[data-service]').forEach(b=>b.dataset.bound=1||0);$$('[data-service]').forEach(b=>b.addEventListener('click',()=>{const v=b.dataset.service;const o=[...sel.options].find(o=>o.text===v);if(o)sel.value=o.text}));

  // Reel controls
  const rw=$('#reelWrap'),rb=$('#reelBtn'),ri=$('#reelIco'),rt=$('#reelTime');
  let playing=!reduce,t0=performance.now(),acc=0;
  if(reduce)rw.classList.add('paused');
  function setIco(){ri.innerHTML=playing?'<path d="M7 5h3v14H7zM14 5h3v14h-3z"/>':'<path d="M7 4.5v15l12-7.5z"/>';rb.setAttribute('aria-label',playing?'إيقاف مؤقت':'تشغيل')}
  setIco();
  rb.addEventListener('click',()=>{if(playing){acc+=performance.now()-t0}else{t0=performance.now()}playing=!playing;rw.classList.toggle('paused',!playing);setIco()});
  (function tick(){const ms=(acc+(playing?performance.now()-t0:0))%9000;rt.textContent=`00:0${Math.floor(ms/1000)} / 00:09`;requestAnimationFrame(tick)})();

  // FAB
  const fab=$('#fab'),fb=$('#fabBtn');
  fb.addEventListener('click',()=>{const o=fab.classList.toggle('open');fb.setAttribute('aria-expanded',o)});
  document.addEventListener('click',e=>{if(!fab.contains(e.target)){fab.classList.remove('open');fb.setAttribute('aria-expanded',false)}});

  // Form → Telegram / WhatsApp
  const form=$('#form'),toast=$('#toast');let via='telegram';
  $$('button[data-via]',form).forEach(b=>b.addEventListener('click',()=>via=b.dataset.via));
  function say(m){toast.textContent=m;toast.classList.add('show');clearTimeout(say.t);say.t=setTimeout(()=>toast.classList.remove('show'),4200)}
  form.addEventListener('submit',async e=>{
    e.preventDefault();const f=new FormData(form);
    if(!f.get('name').trim()){say('اكتب اسمك حتى نعرف منو يراسلنا');form.name.focus();return}
    const txt=`مرحبا Phoenix 👋\nالاسم: ${f.get('name')}\nالهاتف: ${f.get('phone')||'-'}\nالخدمة: ${f.get('service')}\nالتفاصيل: ${f.get('msg')||'-'}`;
    if(via==='whatsapp'&&CONTACT.whatsappNumber){open(`https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(txt)}`,'_blank','noopener');say('فتحنا واتساب ورسالتك جاهزة');return}
    try{await navigator.clipboard.writeText(txt);say('نسخنا رسالتك، الصقها في محادثة تلكرام وأرسلها')}catch(_){say('افتح المحادثة واكتب لنا تفاصيل طلبك')}
    open(CONTACT.telegram,'_blank','noopener');
  });


  /* ============ Pages, router, galleries ============ */
  // Images & video
  $$('img[data-img]').forEach(i=>{if(IMG[i.dataset.img]){i.src=IMG[i.dataset.img];i.loading='lazy';i.decoding='async'}});
  let vidURL=null;
  {const t=document.createElement('video');vidURL=t.canPlayType('video/mp4; codecs="avc1.4D401F"')?VID.reel:VID.reelWebm;}
  const vids=$$('video[data-vid]');
  vids.forEach(v=>{if(v.dataset.poster)v.poster=IMG[v.dataset.poster];0});
  const vio=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){if(!v.src)v.src=vidURL;if(!reduce){const p=v.play();if(p&&p.catch)p.catch(()=>{})}}else if(!v.paused)v.pause()}),{threshold:.35});
  vids.forEach(v=>vio.observe(v));

  // Clones of live visuals into page heroes
  $$('[data-clone]').forEach((slot,n)=>{const src=$(slot.dataset.clone);if(!src)return;const c=src.cloneNode(true);
    $$('[id]',c).forEach(el=>{const o=el.id;el.id=o+'-c'+n;$$(`[href="#${o}"]`,c).forEach(m=>m.setAttribute('href','#'+el.id))});
    slot.replaceWith(c);$$('[data-count]',c).forEach(el=>el.textContent='0')});

  // "Other services" blocks
  const SV=[['systems','أنظمة المحاسبة والإدارة','i-sys'],['motion','موشن كرافك','i-motion'],['design','التصميم الترويجي','i-design'],['consulting','الاستشارات','i-consult'],['courses','الكورسات','i-course'],['dropshipping','الدروبشوبنك','i-drop']];
  $$('[data-others]').forEach(s=>{const me=s.dataset.others;s.outerHTML=`<section class="others"><div class="wrap"><h2>خدمات أخرى من Phoenix</h2><div class="oth-grid">${SV.filter(x=>x[0]!==me).map(x=>`<a class="oth" href="#/${x[0]}"><svg class="ic"><use href="#${x[2]}"/></svg><b>${x[1]}</b></a>`).join('')}</div></div></section>`});

  // Sparks
  $$('.sparks').forEach(s=>{let h='';for(let k=0;k<22;k++){h+=`<i style="--x:${(Math.random()*100).toFixed(1)}%;--s:${(Math.random()*3+2).toFixed(1)}px;--t:${(Math.random()*6+7).toFixed(1)}s;--dl:${(-Math.random()*12).toFixed(1)}s;--dx:${Math.round(Math.random()*80-40)}px"></i>`}s.innerHTML=h});

  // Posters fans (all)
  $$('.posters').forEach(box=>{const ps=[...box.querySelectorAll('.poster')];let order=ps.map((_,k)=>k);
    const place=()=>order.forEach((pi,pos)=>{ps[pi].classList.remove('p0','p1','p2');ps[pi].classList.add('p'+pos)});
    const next=()=>{order.push(order.shift());place()};place();
    let t=reduce?null:setInterval(next,2800);
    box.addEventListener('click',()=>{next();if(t){clearInterval(t);t=setInterval(next,2800)}})});

  // Re-observe reveals + service preselect for injected content
  $$('.rv').forEach(el=>{if(!el.classList.contains('in'))io.observe(el)});
  $$('[data-service]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound=1;b.addEventListener('click',()=>{const o=[...sel.options].find(o=>o.text===b.dataset.service);if(o)sel.value=o.text})});
  $$('[data-link]').forEach(a=>a.href=links[a.dataset.link]||'#');

  // Lightbox
  const lb=$('#lb'),lbImg=$('#lbImg'),lbCap=$('#lbCap'),lbCount=$('#lbCount');let lbList=[],lbI=0,lastFocus=null;
  function lbShow(){const t=lbList[lbI],im=t.querySelector('img');lbImg.classList.remove('in');void lbImg.offsetWidth;lbImg.src=im.src;lbImg.alt=im.alt;lbImg.classList.add('in');lbCap.textContent=t.dataset.cap||'';lbCount.textContent=`${lbI+1} / ${lbList.length}`}
  function lbOpen(t){const r=t.closest('.route');lbList=$$(`[data-lb="${t.dataset.lb}"]`).filter(x=>x.closest('.route')===r);lbI=lbList.indexOf(t);lastFocus=t;lbShow();lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('#lbClose').focus()}
  function lbClose(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.style.overflow='';if(lastFocus)lastFocus.focus({preventScroll:true})}
  const lbStep=d=>{lbI=(lbI+d+lbList.length)%lbList.length;lbShow()};
  $$('[data-lb]').forEach(t=>t.addEventListener('click',()=>lbOpen(t)));
  $('#lbClose').addEventListener('click',lbClose);
  $('#lbPrev').addEventListener('click',()=>lbStep(-1));$('#lbNext').addEventListener('click',()=>lbStep(1));
  lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('lb-stage'))lbClose()});
  document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')lbClose();if(e.key==='ArrowLeft')lbStep(1);if(e.key==='ArrowRight')lbStep(-1)});
  let sx=null;$('.lb-stage').addEventListener('pointerdown',e=>sx=e.clientX);$('.lb-stage').addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>50)lbStep(dx<0?1:-1)});

  // Router
  const ROUTES={};$$('.route').forEach(r=>ROUTES[r.dataset.route]=r);
  const BASE_TITLE=document.title,wipe=$('#wipe');let cur=null;
  function resolve(){const h=decodeURIComponent(location.hash||'');
    if(h.startsWith('#/')){const r=h.slice(2).split(/[/?]/)[0];return{route:ROUTES[r]?r:'home',anchor:null}}
    if(h.length>1){const el=document.getElementById(h.slice(1));if(el){const r=el.closest('.route');return{route:r?r.dataset.route:(cur||'home'),anchor:el}}}
    return{route:'home',anchor:null}}
  function activate(r){Object.keys(ROUTES).forEach(k=>ROUTES[k].hidden=k!==r);const el=ROUTES[r];el.classList.remove('enter');void el.offsetWidth;el.classList.add('enter');document.title=el.dataset.title||BASE_TITLE;cur=r;
    $$('.nav-links a,.mnav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#/'+r));onScroll()}
  function jump(anchor){const top=anchor?anchor.getBoundingClientRect().top+scrollY-84:0;window.scrollTo({top,behavior:'instant'})}
  function sweep(inn){return new Promise(res=>{if(!wipe.animate){res();return}const a=wipe.animate(inn?[{clipPath:'inset(0 0 0 100%)'},{clipPath:'inset(0 0 0 0%)'}]:[{clipPath:'inset(0 0 0 0%)'},{clipPath:'inset(0 100% 0 0)'}],{duration:inn?460:560,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'});a.onfinish=res})}
  let busy=false;
  async function go(first){const {route,anchor}=resolve();
    if(route===cur){if(anchor){const top=anchor.getBoundingClientRect().top+scrollY-84;window.scrollTo({top,behavior:reduce?'instant':'smooth'})}else if(location.hash.startsWith('#/'))window.scrollTo({top:0,behavior:'smooth'});return}
    if(first||reduce){activate(route);requestAnimationFrame(()=>jump(anchor));return}
    if(busy)return;busy=true;await sweep(true);activate(route);jump(anchor);await new Promise(r=>setTimeout(r,60));await sweep(false);busy=false;
    if(resolve().route!==cur)go(false)}
  addEventListener('hashchange',()=>go(false));
  go(true);

  // Ember particles
  const cv=$('#embers'),cx=cv.getContext('2d');let W=0,H=0,P=[],vis=true,mouse={x:-999,y:-999};
  const dpr=Math.min(devicePixelRatio||1,2);
  const dark=()=>{const t=document.documentElement.dataset.theme;return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches};
  function size(){W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);const n=Math.round(Math.min(150,W/7));while(P.length<n)P.push(mk(true));P.length=n}
  function mk(init){return{x:Math.random()*W,y:init?Math.random()*H:H+10,r:Math.random()*2.2+.5,vy:-(Math.random()*.9+.3),vx:(Math.random()-.5)*.3,ph:Math.random()*6.28,hue:Math.random()*32+12,life:0,max:Math.random()*500+250}}
  function frame(){
    cx.clearRect(0,0,W,H);const d=dark();cx.globalCompositeOperation=d?'lighter':'source-over';
    for(const p of P){
      p.life++;p.ph+=.03;p.x+=p.vx+Math.sin(p.ph)*.35;p.y+=p.vy;
      const dx=p.x-mouse.x,dy=p.y-mouse.y,dist=Math.hypot(dx,dy);
      if(dist<90){p.x+=dx/dist*1.6;p.y+=dy/dist*1.6}
      const a=Math.max(0,Math.min(1,p.life/40))*Math.max(0,1-p.life/p.max)*(.6+.4*Math.sin(p.ph*3));
      const L=d?60:48;
      cx.fillStyle=`hsla(${p.hue},100%,${L}%,${a*.18})`;cx.beginPath();cx.arc(p.x,p.y,p.r*4,0,6.283);cx.fill();
      cx.fillStyle=`hsla(${p.hue+10},100%,${L+10}%,${a})`;cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill();
      if(p.life>p.max||p.y<-20)Object.assign(p,mk(false));
    }
    if(vis&&!reduce)requestAnimationFrame(frame);
  }
  size();addEventListener('resize',size);
  cv.parentElement.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});
  cv.parentElement.addEventListener('pointerleave',()=>{mouse.x=mouse.y=-999});
  new IntersectionObserver(([e])=>{const was=vis;vis=e.isIntersecting;if(vis&&!was&&!reduce)frame()}).observe(cv);
  frame();
})();
