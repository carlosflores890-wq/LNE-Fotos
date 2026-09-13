const W=1080,H=1920;
const canvas=document.getElementById('poster');
const ctx=canvas.getContext('2d',{alpha:false});
ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
const $=id=>document.getElementById(id);
const els={category:$('category'),stage:$('stage'),winner:$('winner'),leftName:$('leftName'),rightName:$('rightName'),score:$('score'),zoom:$('zoom')};
const state={template:'caballeros',photo:null,zoom:1,panX:0,panY:0,drag:false,lastX:0,lastY:0};
const themes={
 caballeros:{a:'#16bfff',b:'#43ff67',label:'CABALLEROS',winner:'GANADORES'},
 damas:{a:'#ff31d0',b:'#9e44ff',label:'DAMAS',winner:'GANADORAS'},
 mixto:{a:'#17baff',b:'#ff31d0',label:'MIXTO',winner:'GANADORES'}
};
const assets={};
function loadImage(src){return new Promise((ok,fail)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=fail;im.src=src})}
async function boot(){bind();try{[assets.lne,assets.sponsors]=await Promise.all([loadImage(window.LNE_ASSETS.lne),loadImage(window.LNE_ASSETS.sponsors)]);const brand=document.querySelector('.brand');if(brand&&window.LNE_ASSETS.lne)brand.src=window.LNE_ASSETS.lne;}catch(e){console.error('Assets',e)}draw()}
function bind(){
 document.querySelectorAll('#templateButtons button').forEach(b=>b.onclick=()=>{state.template=b.dataset.template;document.querySelectorAll('#templateButtons button').forEach(x=>x.classList.toggle('active',x===b));draw()});
 ['category','stage','winner','leftName','rightName','score'].forEach(id=>$(id).addEventListener('input',draw));
 els.zoom.oninput=()=>{state.zoom=+els.zoom.value;draw()};
 $('resetPhoto').onclick=()=>{state.zoom=1;state.panX=state.panY=0;els.zoom.value=1;draw()};
 ['cameraInput','galleryInput'].forEach(id=>$(id).onchange=e=>openFile(e.target.files?.[0]));
 $('saveBtn').onclick=saveImage;$('shareBtn').onclick=shareImage;
 canvas.onpointerdown=e=>{state.drag=true;state.lastX=e.clientX;state.lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId)};
 canvas.onpointermove=e=>{if(!state.drag)return;const r=canvas.getBoundingClientRect();state.panX+=(e.clientX-state.lastX)*(W/r.width);state.panY+=(e.clientY-state.lastY)*(H/r.height);state.lastX=e.clientX;state.lastY=e.clientY;draw()};
 canvas.onpointerup=canvas.onpointercancel=()=>state.drag=false;
}
function openFile(file){if(!file)return;const url=URL.createObjectURL(file),im=new Image();im.onload=()=>{state.photo=im;state.zoom=1;state.panX=state.panY=0;els.zoom.value=1;draw();URL.revokeObjectURL(url)};im.onerror=()=>URL.revokeObjectURL(url);im.src=url}
function cover(im,x,y,w,h,z=1,px=0,py=0){if(!im){ctx.fillStyle='#0a1520';ctx.fillRect(x,y,w,h);ctx.fillStyle='#718797';ctx.textAlign='center';ctx.font='700 42px sans-serif';ctx.fillText('CARGÁ O SACÁ UNA FOTO',x+w/2,y+h/2);return}const s=Math.max(w/im.width,h/im.height)*z,dw=im.width*s,dh=im.height*s;ctx.drawImage(im,x+(w-dw)/2+px,y+(h-dh)/2+py,dw,dh)}
function contain(im,x,y,w,h){if(!im)return;const s=Math.min(w/im.width,h/im.height),dw=im.width*s,dh=im.height*s;ctx.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh)}
function rr(x,y,w,h,r,fill,stroke,lw=2){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
function glowLine(x1,y1,x2,y2,c,w=3,blur=12){ctx.save();ctx.strokeStyle=c;ctx.lineWidth=w;ctx.shadowColor=c;ctx.shadowBlur=blur;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore()}
function fitText(text,x,y,maxW,size,color='#fff',align='center',family='Arial, sans-serif',weight=900,italic=false){let s=size;ctx.textAlign=align;ctx.textBaseline='middle';do{ctx.font=`${italic?'italic ':''}${weight} ${s}px ${family}`;if(ctx.measureText(text).width<=maxW)break;s-=1}while(s>16);ctx.fillStyle=color;ctx.fillText(text,x,y);return s}
function angledBox(x,y,w,h,stroke,fill='rgba(2,9,15,.96)'){ctx.beginPath();ctx.moveTo(x+20,y);ctx.lineTo(x+w-12,y);ctx.lineTo(x+w,y+h/2);ctx.lineTo(x+w-20,y+h);ctx.lineTo(x+12,y+h);ctx.lineTo(x,y+h/2);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=4;ctx.stroke()}
function draw(){
 const t=themes[state.template];ctx.clearRect(0,0,W,H);ctx.fillStyle='#02080d';ctx.fillRect(0,0,W,H);
 let bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#07131c');bg.addColorStop(.56,'#02090f');bg.addColorStop(1,'#02070c');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 for(const [cx,cy,c] of [[90,110,t.a],[1000,120,t.b],[80,1700,t.a],[1000,1700,t.b]]){let g=ctx.createRadialGradient(cx,cy,0,cx,cy,360);g.addColorStop(0,c+'2b');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(Math.max(0,cx-400),Math.max(0,cy-400),800,800)}
 const px=14,py=220,pw=1052,ph=1120;ctx.save();ctx.beginPath();ctx.roundRect(px,py,pw,ph,22);ctx.clip();cover(state.photo,px,py,pw,ph,state.zoom,state.panX,state.panY);let sh=ctx.createLinearGradient(0,1020,0,1340);sh.addColorStop(0,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(1,7,12,.58)');ctx.fillStyle=sh;ctx.fillRect(px,1000,pw,340);ctx.restore();
 ctx.save();ctx.shadowBlur=11;ctx.shadowColor=t.a;ctx.strokeStyle=t.a;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(px,py,pw,ph,22);ctx.stroke();ctx.restore();glowLine(16,265,16,1285,t.a,4,11);glowLine(1064,265,1064,1285,t.b,4,11);
 let top=ctx.createLinearGradient(0,0,0,260);top.addColorStop(0,'rgba(1,7,12,.98)');top.addColorStop(.75,'rgba(1,7,12,.82)');top.addColorStop(1,'rgba(1,7,12,0)');ctx.fillStyle=top;ctx.fillRect(0,0,W,260);
 ctx.save();ctx.shadowColor='#0baeed';ctx.shadowBlur=17;contain(assets.lne,54,18,690,205);ctx.restore();
 const bx=754,by=54,bw=286,bh=122;ctx.save();ctx.shadowColor=t.b;ctx.shadowBlur=14;rr(bx,by,bw,bh,22,'rgba(2,9,15,.90)',t.b,3);ctx.restore();fitText(els.category.value,bx+30,by+44,115,48,'#fff','left','Arial, sans-serif',900,true);fitText(t.label,bx+154,by+82,245,31,t.b,'center','Arial, sans-serif',900,false);glowLine(bx+24,by+105,bx+bw-22,by+105,t.a,3,8);
 let bot=ctx.createLinearGradient(0,1150,0,1920);bot.addColorStop(0,'rgba(2,8,13,0)');bot.addColorStop(.17,'rgba(2,8,13,.86)');bot.addColorStop(.36,'rgba(2,8,13,.98)');bot.addColorStop(1,'#02080d');ctx.fillStyle=bot;ctx.fillRect(0,1140,W,780);
 const left=els.winner.value==='left',wx=left?48:648;ctx.save();ctx.shadowColor='#ffc93f';ctx.shadowBlur=10;rr(wx,1240,382,66,17,'rgba(4,10,15,.94)','#ffc93f',3);ctx.restore();fitText('✓',wx+22,1273,34,34,'#ffd76a','left','Arial, sans-serif',900);fitText(t.winner,wx+64,1273,285,30,'#fff','left','Arial, sans-serif',900);
 angledBox(38,1315,442,86,t.a);angledBox(600,1315,442,86,t.b);fitText(els.leftName.value.toUpperCase(),259,1358,378,35,'#fff','center','Arial, sans-serif',900);fitText(els.rightName.value.toUpperCase(),821,1358,378,35,'#fff','center','Arial, sans-serif',900);fitText('VS',540,1358,100,58,'#fff','center','Arial, sans-serif',900,true);glowLine(514,1391,540,1367,t.a,5,8);glowLine(540,1367,567,1391,t.b,5,8);
 const stage=els.stage.value.toUpperCase(),score=els.score.value.toUpperCase();const fs=fitText(stage,58,1470,280,50,'#fff','left','Arial, sans-serif',900,false);fitText(score,700,1470,690,fs,'#fff','center','Arial, sans-serif',900,false);fitText('RESULTADO FINAL',700,1517,350,22,t.b,'center','Arial, sans-serif',800,false);
 if(assets.sponsors){ctx.save();ctx.shadowColor='rgba(0,0,0,.9)';ctx.shadowBlur=12;contain(assets.sponsors,18,1540,1044,168);ctx.restore()}
 glowLine(68,1786,305,1786,t.a,3,9);glowLine(775,1786,1012,1786,t.b,3,9);fitText('El punto de encuentro',540,1778,470,45,'#fff','center','Georgia, serif',600,true);fitText('LA NUEVA ESTACIÓN · COMPLEJO DE PÁDEL',540,1860,640,20,'#91a9bb','center','Arial, sans-serif',500,false);
}
function dataURL(){draw();return canvas.toDataURL('image/jpeg',.97)}
async function blob(){draw();return await new Promise(r=>canvas.toBlob(r,'image/jpeg',.97))}
function saveImage(){const url=dataURL();if(window.AndroidBridge?.saveImage){AndroidBridge.saveImage(url);return}const a=document.createElement('a');a.href=url;a.download=`LNE_${state.template}_${els.category.value}_${Date.now()}.jpg`;a.click()}
async function shareImage(){const url=dataURL();if(window.AndroidBridge?.shareImage){AndroidBridge.shareImage(url);return}const b=await blob(),f=new File([b],`LNE_${state.template}_${els.category.value}.jpg`,{type:'image/jpeg'});if(navigator.canShare?.({files:[f]})){navigator.share({files:[f],title:'LNE Fotos'}).catch(()=>{})}else saveImage()}
boot();
