const music=document.getElementById("music");
document.getElementById("musicBtn").addEventListener("click",async()=>{
  try{await music.play();document.getElementById("musicBtn").textContent="🎵 Música activada";}
  catch(e){alert("Agregá assets/cancion.mp3 para que suene la música.");}
});

function goToGame(){document.getElementById("game").scrollIntoView({behavior:"smooth"});}

let score=0,timeLeft=35,running=false,timer=null,fall=null,speed=4;
const scoreEl=document.getElementById("score"),timeEl=document.getElementById("time");
const ice=document.getElementById("icecream"),basket=document.getElementById("basket"),area=document.getElementById("gameArea");
const voucher=document.getElementById("voucher");

function startGame(){
  score=0;timeLeft=35;speed=4;running=true;
  scoreEl.textContent=score;timeEl.textContent=timeLeft;voucher.classList.add("hidden");
  document.getElementById("startBtn").textContent="Reiniciar juego";
  resetIce();
  clearInterval(timer);clearInterval(fall);
  timer=setInterval(()=>{timeLeft--;timeEl.textContent=timeLeft;if(timeLeft<=0)endGame(false)},1000);
  fall=setInterval(moveIce,18);
}
function resetIce(){
  ice.style.top="-60px";
  ice.style.left=Math.floor(Math.random()*(area.clientWidth-70))+"px";
}
function moveIce(){
  if(!running)return;
  const top=parseInt(ice.style.top||"-60",10)+speed;
  ice.style.top=top+"px";
  const i=ice.getBoundingClientRect(),b=basket.getBoundingClientRect(),a=area.getBoundingClientRect();
  const hit=i.bottom>=b.top&&i.left<b.right&&i.right>b.left;
  if(hit){
    score++;scoreEl.textContent=score;speed=Math.min(8,4+score*.22);resetIce();
    popConfetti(35);
    if(score>=12)endGame(true);
  }
  if(i.top>a.bottom)resetIce();
}
function endGame(won){
  running=false;clearInterval(timer);clearInterval(fall);
  if(won){voucher.classList.remove("hidden");bigCelebration();}
  else alert("Casi Laura 😄 Volvé a intentarlo para ganar el kilo de helado.");
}
function moveBasket(clientX){
  const a=area.getBoundingClientRect();
  let x=clientX-a.left-basket.clientWidth/2;
  x=Math.max(0,Math.min(x,area.clientWidth-basket.clientWidth));
  basket.style.left=x+"px";
}
area.addEventListener("mousemove",e=>moveBasket(e.clientX));
area.addEventListener("touchmove",e=>{e.preventDefault();moveBasket(e.touches[0].clientX)},{passive:false});

const confettiCanvas=document.getElementById("confettiCanvas"),cctx=confettiCanvas.getContext("2d");
const fireworksCanvas=document.getElementById("fireworksCanvas"),fctx=fireworksCanvas.getContext("2d");
let conf=[],fw=[];
function resize(){confettiCanvas.width=fireworksCanvas.width=innerWidth;confettiCanvas.height=fireworksCanvas.height=innerHeight}
addEventListener("resize",resize);resize();

function popConfetti(n=120){
  for(let i=0;i<n;i++)conf.push({x:Math.random()*innerWidth,y:-20,s:Math.random()*7+4,v:Math.random()*5+2,a:Math.random()*6.28});
}
function confettiLoop(){
  cctx.clearRect(0,0,innerWidth,innerHeight);
  conf.forEach(p=>{p.y+=p.v;p.x+=Math.sin(p.a)*2;p.a+=.04;cctx.fillRect(p.x,p.y,p.s,p.s)});
  conf=conf.filter(p=>p.y<innerHeight+30);
  requestAnimationFrame(confettiLoop);
}
confettiLoop();

function firework(){
  const x=Math.random()*innerWidth,y=Math.random()*innerHeight*.45+60;
  for(let i=0;i<60;i++){
    const ang=(Math.PI*2*i)/60;
    fw.push({x,y,vx:Math.cos(ang)*(Math.random()*4+2),vy:Math.sin(ang)*(Math.random()*4+2),life:70});
  }
}
function fwLoop(){
  fctx.clearRect(0,0,innerWidth,innerHeight);
  fw.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.03;p.life--;fctx.globalAlpha=Math.max(p.life/70,0);fctx.beginPath();fctx.arc(p.x,p.y,3,0,Math.PI*2);fctx.fill();});
  fctx.globalAlpha=1;fw=fw.filter(p=>p.life>0);
  requestAnimationFrame(fwLoop);
}
fwLoop();

function bigCelebration(){
  popConfetti(260);
  for(let i=0;i<6;i++)setTimeout(firework,i*450);
}
window.addEventListener("load",()=>{
  popConfetti(220);
  for(let i=0;i<5;i++)setTimeout(firework,i*520);
});
