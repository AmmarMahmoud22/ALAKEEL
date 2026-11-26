(function(){
const C=window.CONFIG,M=window.MENU,cart={};
const $=s=>document.querySelector(s);
const price=n=>C.prices&&C.prices[n]!=null?C.prices[n]:null;
const fmt=v=>v+" "+C.currency;
$("#tabs").innerHTML=M.map(s=>`<a href="#${s.id}">${s.icon} ${s.title.replace("قسم ","")}</a>`).join("");
$("#menu").innerHTML=M.map(s=>`<section id="${s.id}"><h2>${s.icon} ${s.title}</h2>`+s.items.map(n=>{
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
 const n=b.dataset.n;cart[n]=Math.max(0,(cart[n]||0)+Number(b.dataset.d));render();
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
 location.href="https://wa.me/"+C.whatsapp+"?text="+encodeURIComponent(t);
};
render();
})();
