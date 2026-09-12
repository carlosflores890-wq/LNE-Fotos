const W=1080,H=1920,canvas=document.getElementById('poster'),ctx=canvas.getContext('2d',{alpha:false});
ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
const $=id=>document.getElementById(id);
const els={category:$('category'),stage:$('stage'),winner:$('winner'),leftName:$('leftName'),rightName:$('rightName'),score:$('score'),zoom:$('zoom')};
const state={template:'caballeros',photo:null,zoom:1,panX:0,panY:0,drag:false,lastX:0,lastY:0};
const themes={
  caballeros:{a:'#15bfff',b:'#43ff66',label:'CABALLEROS',winner:'GANADORES'},
  damas:{a:'#ff2fca',b:'#9c42ff',label:'DAMAS',winner:'GANADORAS'},
  mixto:{a:'#15bfff',b:'#ff2fca',label:'MIXTO',winner:'GANADORES'}
};
const assets={};
function loadImage(src){return new Promise((ok,fail)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=fail;im.src=src})}
async function boot(){
  bind();
  for(const name of ['lne','surtech','todopadel','gorilas','caiman','kora','ppe']){
    try{assets[name]=await loadImage(window.LNE_ASSETS[name])}catch(e){console.error('asset',name,e)}
  }
  const brand=document.querySelector('.brand');if(window.LNE_ASSETS.lne) brand.src=window.LNE_ASSETS.lne;
  draw();
}
function bind(){
  document.querySelectorAll('#templateButtons button').forEach(b=>b.onclick=()=>{state.template=b.dataset.template;document.querySelectorAll('#templateButtons button').forEach(x=>x.classList.toggle('active',x===b));draw()});
  ['category','stage','winner','leftName','rightName','score'].forEach(id=>$(id).addEventListener('input',draw));
  els.zoom.oninput=()=>{state.zoom=+els.zoom.value;draw()};
  $('resetPhoto').onclick=()=>{state.zoom=1;state.panX=state.panY=0;els.zoom.value=1;draw()};
  ['cameraInput','galleryInput'].forEach(id=>$(id).onchange=e=>openFile(e.target.files?.[0]));
  $('saveBtn').onclick=saveImage;$('shareBtn').onclick=shareImage;
  canvas.onpointerdown=e=>{state.drag=true;state.lastX=e.clientX;state.lastY=e.clientY;canvas.setPointerCapture(e.pointerId)};
  canvas.onpointermove=e=>{if(!state.drag)return;const r=canvas.getBoundingClientRect();state.panX+=(e.clientX-state.lastX)*(W/r.width);state.panY+=(e.clientY-state.lastY)*(H/r.height);state.lastX=e.clientX;state.lastY=e.clientY;draw()};
  canvas.onpointerup=canvas.onpointercancel=()=>state.drag=false;
}
function openFile(file){if(!file)return;const url=URL.createObjectURL(file),im=new Image();im.onload=()=>{state.photo=im;state.zoom=1;state.panX=state.panY=0;els.zoom.value=1;draw();URL.revokeObjectURL(url)};im.src=url}
function cover(im,x,y,w,h,z=1,px=0,py=0){
  if(!im){ctx.fillStyle='#07141d';ctx.fillRect(x,y,w,h);ctx.fillStyle='#60798b';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='800 38px sans-serif';ctx.fillText('SACÁ O ELEGÍ UNA FOTO',x+w/2,y+h/2);return}
  const s=Math.max(w/im.width,h/im.height)*z,dw=im.width*s,dh=im.height*s;ctx.drawImage(im,x+(w-dw)/2+px,y+(h-dh)/2+py,dw,dh)
}
function contain(im,x,y,w,h){if(!im)return;const s=Math.min(w/im.width,h/im.height),dw=im.width*s,dh=im.height*s;ctx.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh)}
function rr(x,y,w,h,r,fill,stroke,lw=2){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
function glowLine(x1,y1,x2,y2,c,w=3,blur=12){ctx.save();ctx.strokeStyle=c;ctx.lineWidth=w;ctx.shadowColor=c;ctx.shadowBlur=blur;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore()}
function fitText(text,x,y,maxW,size,color='#fff',align='center',family='sans-serif',weight=900,italic=false){let s=size;ctx.textAlign=align;ctx.textBaseline='middle';do{ctx.font=`${italic?'italic ':''}${weight} ${s}px ${family}`;if(ctx.measureText(text).width<=maxW)break;s--}while(s>18);ctx.fillStyle=color;ctx.fillText(text,x,y);return s}
function angledBox(x,y,w,h,stroke,fill='rgba(3,10,16,.94)'){ctx.beginPath();ctx.moveTo(x+22,y);ctx.lineTo(x+w-12,y);ctx.lineTo(x+w,y+h/2);ctx.lineTo(x+w-22,y+h);ctx.lineTo(x+12,y+h);ctx.lineTo(x,y+h/2);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=4;ctx.stroke()}
function draw(){
  const t=themes[state.template];ctx.clearRect(0,0,W,H);ctx.fillStyle='#02080d';ctx.fillRect(0,0,W,H);
  let bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#06131d');bg.addColorStop(.56,'#02090f');bg.addColorStop(1,'#02070c');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  let g=ctx.createRadialGradient(65,90,0,65,90,420);g.addColorStop(0,t.a+'38');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,500,500);
  g=ctx.createRadialGradient(1020,140,0,1020,140,360);g.addColorStop(0,t.b+'2e');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(620,0,460,440);

  const px=18,py=195,pw=1044,ph=1130;
  ctx.save();ctx.beginPath();ctx.roundRect(px,py,pw,ph,22);ctx.clip();cover(state.photo,px,py,pw,ph,state.zoom,state.panX,state.panY);
  let shade=ctx.createLinearGradient(0,1000,0,1325);shade.addColorStop(0,'rgba(0,0,0,0)');shade.addColorStop(1,'rgba(1,7,12,.63)');ctx.fillStyle=shade;ctx.fillRect(px,990,pw,335);ctx.restore();
  ctx.save();ctx.shadowBlur=10;ctx.shadowColor=t.a;ctx.strokeStyle=t.a;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(px,py,pw,ph,22);ctx.stroke();ctx.restore();
  glowLine(20,245,20,1265,t.a,4,10);glowLine(1060,245,1060,1265,t.b,4,10);

  let top=ctx.createLinearGradient(0,0,0,245);top.addColorStop(0,'rgba(1,7,12,.97)');top.addColorStop(.72,'rgba(1,7,12,.76)');top.addColorStop(1,'rgba(1,7,12,0)');ctx.fillStyle=top;ctx.fillRect(0,0,W,245);
  ctx.save();ctx.shadowColor='#08aef0';ctx.shadowBlur=18;contain(assets.lne,66,18,655,205);ctx.restore();

  const bx=748,by=52,bw=296,bh=122;ctx.save();ctx.shadowColor=t.b;ctx.shadowBlur=12;rr(bx,by,bw,bh,22,'rgba(2,9,15,.88)',t.b,3);ctx.restore();
  ctx.fillStyle=t.b;ctx.beginPath();ctx.moveTo(bx-8,by+25);ctx.lineTo(bx+10,by+7);ctx.lineTo(bx+25,by+7);ctx.lineTo(bx+5,by+36);ctx.closePath();ctx.fill();
  fitText(els.category.value,bx+38,by+43,118,52,'#fff','left','sans-serif',900,true);
  fitText(t.label,bx+150,by+82,252,34,t.b,'center','sans-serif',900,false);glowLine(bx+26,by+105,bx+bw-24,by+105,t.a,3,7);

  let bot=ctx.createLinearGradient(0,1170,0,1880);bot.addColorStop(0,'rgba(2,8,13,0)');bot.addColorStop(.18,'rgba(2,8,13,.85)');bot.addColorStop(.40,'rgba(2,8,13,.985)');bot.addColorStop(1,'#02080d');ctx.fillStyle=bot;ctx.fillRect(0,1150,W,770);
  const left=els.winner.value==='left',wx=left?48:646;ctx.save();ctx.shadowColor='#ffcc3c';ctx.shadowBlur=10;rr(wx,1233,384,68,17,'rgba(4,10,15,.92)','#ffc846',3);ctx.restore();
  fitText('✓',wx+24,1268,34,34,'#ffd76a','left','sans-serif',900);fitText(t.winner,wx+67,1268,290,31,'#fff','left','sans-serif',900);
  angledBox(38,1310,442,88,t.a);angledBox(600,1310,442,88,t.b);
  fitText(els.leftName.value.toUpperCase(),259,1355,375,35,'#fff','center','sans-serif',900);fitText(els.rightName.value.toUpperCase(),821,1355,375,35,'#fff','center','sans-serif',900);
  fitText('VS',540,1355,110,61,'#fff','center','sans-serif',900,true);glowLine(513,1390,540,1364,t.a,5,8);glowLine(540,1364,568,1390,t.b,5,8);

  const stage=els.stage.value.toUpperCase(),score=els.score.value.toUpperCase();const stageSize=fitText(stage,60,1466,285,52,'#fff','left','sans-serif',900,false);fitText(score,685,1466,680,stageSize,'#fff','center','sans-serif',900,false);fitText('RESULTADO FINAL',690,1521,360,23,t.b,'center','sans-serif',800,false);

  const sponsor=[['surtech',14,1552,165,128],['todopadel',180,1538,178,152],['gorilas',360,1538,165,152],['caiman',535,1560,170,95],['kora',715,1564,160,86],['ppe',888,1538,172,152]];
  for(const [n,x,y,w,h] of sponsor){ctx.save();ctx.shadowColor='rgba(0,0,0,.95)';ctx.shadowBlur=13;contain(assets[n],x,y,w,h);ctx.restore()}

  glowLine(68,1758,306,1758,t.a,3,9);glowLine(774,1758,1012,1758,t.b,3,9);fitText('El punto de encuentro',540,1748,455,48,'#fff','center','serif',600,true);fitText('LA NUEVA ESTACIÓN · COMPLEJO DE PÁDEL',540,1828,630,20,'#91a9bb','center','sans-serif',500,false);
}
function dataURL(){draw();return canvas.toDataURL('image/jpeg',.97)}
async function blob(){draw();return await new Promise(r=>canvas.toBlob(r,'image/jpeg',.97))}
function saveImage(){const url=dataURL();if(window.AndroidBridge?.saveImage){AndroidBridge.saveImage(url);return}const a=document.createElement('a');a.href=url;a.download=`LNE_${state.template}_${els.category.value}_${Date.now()}.jpg`;a.click()}
async function shareImage(){const url=dataURL();if(window.AndroidBridge?.shareImage){AndroidBridge.shareImage(url);return}const b=await blob(),f=new File([b],`LNE_${state.template}_${els.category.value}.jpg`,{type:'image/jpeg'});if(navigator.canShare?.({files:[f]})){navigator.share({files:[f],title:'LNE Fotos'}).catch(()=>{})}else saveImage()}
boot();