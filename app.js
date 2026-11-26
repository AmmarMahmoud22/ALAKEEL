(function(){
const C=window.CONFIG,M=window.MENU,cart={};
const $=s=>document.querySelector(s);
const price=n=>C.prices&&C.prices[n]!=null?C.prices[n]:null;
const fmt=v=>v+" "+C.currency;
$("#tabs").innerHTML=M.map(s=>`<a href="#${s.id}">${s.icon} ${s.title.replace("قسم ","")}</a>`).join("");
$("#menu").innerHTML=M.map(s=>`<section id="${s.id}"><div class="sh"><img src="${s.img}" alt="" loading="lazy"><h2>${s.icon} ${s.title}</h2></div>`+s.items.map(n=>{
 const p=price(n);return `<div class="item"><div class="n">${n}${p!=null?`<span class="p">${fmt(p)}</span>`:""}</div>
 <div class="qty"><button class="m" data-n="${n}" data-d="-1" aria-label="إنقاص">−</button><span data-q="${n}">0</span><button data-n="${n}" data-d="1" aria-label="زيادة">+</button></div></div>`}).join("")+`</section>`).join("");
function render(){
 const names=Object.keys(cart).filter(n=>cart[n]>0);
 document.querySelectorAll("[data-q]").forEach(e=>e.textContent=cart[e.dataset.q]||0);
 const cnt=names.reduce((a,n)=>a+cart[n],0);
 $("#bar").classList.toggle("hidden",!cnt);$("#count").textContent=cnt;
 let sum=0,allPriced=true;
 names.forEach(n=>{const p=price(n);if(p==null)allPriced=false;else sum+=p*cart[n]});
 const showSum=names.length&&allPriced&&sum>0;
 $("#sum").textContent=showSum?" · "+fmt(sum):"";
 $("#lines").innerHTML=names.map(n=>`<div class="line"><span>${cart[n]} × ${n}</span><span>${price(n)!=null?fmt(price(n)*cart[n]):""}</span></div>`).join("");
 $("#total").textContent=showSum?"الإجمالي: "+fmt(sum):"";
 if(!cnt)$("#sheet").classList.add("hidden");
}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-n]");if(!b)return;
 const n=b.dataset.n,d=Number(b.dataset.d);cart[n]=Math.max(0,(cart[n]||0)+d);render();
 const q=document.querySelector(`[data-q="${CSS.escape(n)}"]`);q.classList.remove("bump");void q.offsetWidth;q.classList.add("bump");
 if(d>0){const bar=$("#bar");bar.classList.remove("jump");void bar.offsetWidth;bar.classList.add("jump")}
});
$("#open").onclick=()=>$("#sheet").classList.remove("hidden");
$("#close").onclick=()=>$("#sheet").classList.add("hidden");
$("#clear").onclick=()=>{for(const k in cart)delete cart[k];render()};
$("#send").onclick=()=>{
 const names=Object.keys(cart).filter(n=>cart[n]>0);if(!names.length)return;
 let t="مرحباً الأكيلة 👋\nأريد طلب:\n\n";
 names.forEach(n=>{t+=`• ${cart[n]} × ${n}`+(price(n)!=null?` (${fmt(price(n)*cart[n])})`:"")+"\n"});
 const tot=$("#total").textContent;if(tot)t+="\n"+tot+"\n";
 if($("#name").value.trim())t+="\nالاسم: "+$("#name").value.trim();
 if($("#addr").value.trim())t+="\nالعنوان: "+$("#addr").value.trim();
 if($("#note").value.trim())t+="\nملاحظات: "+$("#note").value.trim();
 confetti();setTimeout(()=>location.href="https://wa.me/"+C.whatsapp+"?text="+encodeURIComponent(t),900);
};
render();
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.08});
document.querySelectorAll("section").forEach(x=>io.observe(x));if(location.hash==="#shot")document.querySelectorAll("section").forEach(x=>x.classList.add("in"));
const links=[...document.querySelectorAll(".tabs a")];
const so=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){links.forEach(l=>l.classList.toggle("on",l.hash==="#"+x.target.id));const a=links.find(l=>l.classList.contains("on"));a&&a.scrollIntoView({inline:"center",block:"nearest"})}}),{rootMargin:"-30% 0px -60% 0px"});
document.querySelectorAll("section").forEach(x=>so.observe(x));
function confetti(){const c=$("#fx"),g=c.getContext("2d");c.width=innerWidth;c.height=innerHeight;
 const cols=["#e11d2e","#ffc21a","#fff","#25d366","#ff7a1a"];
 const ps=Array.from({length:120},()=>({x:innerWidth/2,y:innerHeight*.7,vx:(Math.random()-.5)*14,vy:-Math.random()*16-4,s:Math.random()*8+4,c:cols[Math.random()*5|0],r:Math.random()*6}));
 let f=0;(function t(){g.clearRect(0,0,c.width,c.height);ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.45;p.r+=.2;g.save();g.translate(p.x,p.y);g.rotate(p.r);g.fillStyle=p.c;g.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);g.restore()});
 if(++f<70)requestAnimationFrame(t);else g.clearRect(0,0,c.width,c.height)})()}
})();
