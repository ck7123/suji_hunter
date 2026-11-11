(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const DEF={min:1,max:5,choices:5,hearts:5,voice:true,sfx:true};
let S=Object.assign({},DEF);try{Object.assign(S,JSON.parse(localStorage.getItem('suji')||'{}'))}catch(e){}
let hearts=0,found=[],stream=null,timer=0,cool=0,gen=0,answered=false,ac;
const v=$('#video'),cv=$('#cv');
function tone(f,d,t=0){if(!S.sfx)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime+t;o.frequency.value=f;o.connect(g);g.connect(ac.destination);g.gain.setValueAtTime(.18,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.start(n);o.stop(n+d)}catch(e){}}
function say(t){if(!S.voice||!window.speechSynthesis)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='ja-JP';u.rate=.85;u.pitch=1.3;speechSynthesis.speak(u)}catch(e){}}
function show(id){$$('.screen').forEach(e=>e.classList.toggle('active',e.id===id));if(id!=='scan')stopCam()}
function drawHearts(){const h='❤️'.repeat(hearts)+'🤍'.repeat(Math.max(0,S.hearts-hearts));$$('.hearts').forEach(e=>e.textContent=h)}
function drawFound(){let h='';for(let n=S.min;n<=S.max;n++)h+=`<b class="${found.includes(n)?'on':''}">${n}</b>`;$('#found').innerHTML=h}
async function startCam(){$('#camerr').hidden=true;
try{if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw 0;
stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
v.srcObject=stream;await v.play();clearInterval(timer);timer=setInterval(tick,250)}catch(e){$('#camerr').hidden=false}}
function stopCam(){clearInterval(timer);timer=0;if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}v.srcObject=null}
function tick(){if(!v.videoWidth||Date.now()<cool)return;
const w=Math.min(800,v.videoWidth),h=Math.round(w*v.videoHeight/v.videoWidth);cv.width=w;cv.height=h;
const c=cv.getContext('2d',{willReadFrequently:true});c.drawImage(v,0,0,w,h);
const r=jsQR(c.getImageData(0,0,w,h).data,w,h,{inversionAttempts:'dontInvert'});if(r)onCode(r.data)}
function onCode(t){const m=/^NUM:(\d+)$/.exec((t||'').trim());if(!m)return;const n=+m[1];
if(n<S.min||n>S.max){cool=Date.now()+1500;return}
if(found.includes(n)){cool=Date.now()+1200;return}   // 重複登録しない
found.push(n);cool=Date.now()+2000;drawFound();
const g=$('#got');g.textContent=n;g.classList.remove('pop');void g.offsetWidth;g.classList.add('pop');tone(660,.2);say(String(n));
if(found.length===1)$('#msg').textContent='もう1つ見つけよう！';
else{$('#msg').textContent='よーし！';stopCam();setTimeout(startCalc,1400)}}
function newRound(){found=[];gen++;$('#got').textContent='?';$('#msg').textContent='数字をさがそう！';drawFound();drawHearts();show('scan');startCam();say('数字をさがそう')}
const g=n=>'<div class="grp">'+'<i>🐰</i>'.repeat(n)+'</div>';
function countUp(total,my){$('#bun').innerHTML='<div class="grp all">'+Array.from({length:total},(_,i)=>`<i data-n="${i+1}">🐰</i>`).join('')+'</div>';
$$('#bun i').forEach((el,i)=>setTimeout(()=>{if(my===gen){el.classList.add('num');tone(500+i*50,.15)}},i*450))}
function startCalc(){const a=found[0],b=found[1],ans=a+b;gen++;const my=gen;answered=false;show('calc');drawHearts();
$('#q').textContent=`${a}＋${b}＝？`;$('#bun').innerHTML=g(a)+'<em>＋</em>'+g(b);$('#hint').hidden=true;$('#hint').className='';
const pool=[];for(let i=1;i<=Math.max(10,S.max*2);i++)if(i!==ans)pool.push([Math.abs(i-ans)+Math.random()*2.5,i]);
const opts=pool.sort((x,y)=>x[0]-y[0]).slice(0,S.choices-1).map(x=>x[1]).concat(ans).sort(()=>Math.random()-.5);
$('#choices').innerHTML=opts.map((n,i)=>`<button class="c c${i%5}" data-n="${n}">${n}</button>`).join('');
$$('.c').forEach(b=>b.onclick=()=>pick(+b.dataset.n,b,ans));
say(`${a}たす${b}は、いくつかな？`);setTimeout(()=>{if(my===gen&&!answered)countUp(ans,my)},2600)}
function pick(n,b,ans){if(answered)return;const h=$('#hint');h.hidden=false;
if(n===ans){answered=true;hearts++;drawHearts();h.className='ok';h.textContent='🎉 せいかい！';b.classList.add('pop');
[523,659,784,1046].forEach((f,i)=>tone(f,.25,i*.12));say('せいかい！');
const f=document.createElement('div');f.className='fly';f.textContent='❤️';document.body.appendChild(f);setTimeout(()=>f.remove(),1700);
const my=++gen;countUp(ans,my);setTimeout(()=>{hearts>=S.hearts?clear():newRound()},2600)}
else{const t=['もう一度かんがえてみよう！','うさぎさんを数えてみよう！'][Math.random()*2|0];h.className='';h.textContent='🐰 '+t;
b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),600);tone(280,.3);say(t);countUp(ans,++gen)}}
function clear(){gen++;show('clear');drawHearts();const bx=$('#box');bx.textContent='🎁';bx.className='';
setTimeout(()=>{bx.textContent='🎉';bx.className='open';tone(392,.2);tone(523,.2,.15);tone(659,.2,.3);tone(784,.5,.45)},900);say('やったね！すごい！');
const fx=$('#fx');fx.innerHTML='';for(let i=0;i<30;i++){const s=document.createElement('span');s.textContent=['⭐','🌟','✨','🎊'][i%4];s.style.left=Math.random()*95+'vw';s.style.animationDelay=Math.random()*3+'s';fx.appendChild(s)}}
$('#startBtn').onclick=()=>{hearts=0;tone(1,.01);newRound()};
$('#again').onclick=()=>{hearts=0;$('#fx').innerHTML='';newRound()};
$('#retry').onclick=startCam;
// 保護者設定（右上を2秒長押し）
const opt=(el,a,b,val)=>{el.innerHTML='';for(let i=a;i<=b;i++)el.add(new Option(i,i));el.value=val};
let hold;const gear=$('#gear');
gear.addEventListener('pointerdown',()=>{hold=setTimeout(()=>{opt($('#sMin'),1,9,S.min);opt($('#sMax'),2,10,S.max);$('#sCh').value=S.choices;opt($('#sHe'),1,10,S.hearts);$('#sVo').checked=S.voice;$('#sSf').checked=S.sfx;$('#set').hidden=false},2000)});
['pointerup','pointerleave','pointercancel'].forEach(e=>gear.addEventListener(e,()=>clearTimeout(hold)));
$('#sClose').onclick=()=>$('#set').hidden=true;
$('#sSave').onclick=()=>{let mn=+$('#sMin').value,mx=+$('#sMax').value;if(mx<=mn)mx=mn+1;
S={min:mn,max:mx,choices:+$('#sCh').value,hearts:+$('#sHe').value,voice:$('#sVo').checked,sfx:$('#sSf').checked};
try{localStorage.setItem('suji',JSON.stringify(S))}catch(e){}$('#set').hidden=true};
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
