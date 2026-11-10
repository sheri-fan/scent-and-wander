export const SCENT_NOTES = [
 {id:'Bergamot',zh:'佛手柑',color:'#d9d583'}, {id:'Lemon',zh:'檸檬',color:'#e7cc69'},
 {id:'Tea Plant',zh:'茶樹',color:'#9fbd89'}, {id:'Lavender',zh:'薰衣草',color:'#b7a1d7'},
 {id:'Rose Bush',zh:'玫瑰',color:'#dca3ad'}, {id:'Jasmine',zh:'茉莉',color:'#eee1ae'},
 {id:'Osmanthus',zh:'桂花',color:'#e8b870'}, {id:'Sandalwood',zh:'檀香',color:'#c9aa7a'},
 {id:'Taiwanese Hinoki Cypress',zh:'台灣檜木',color:'#bda57f'},
 {id:'Patchouli',zh:'廣藿香',color:'#96aa7b'}, {id:'Vetiver',zh:'香根草',color:'#b8b082'},
 {id:'Tonka Bean',zh:'零陵香豆',color:'#b49a87'},
];
export const BLENDS_KEY='scent-and-wander-blends';
export const BOARD_KEY='scent-and-wander-blackboard';
export function cleanLabel(value){
 const color=(v,fallback)=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v)?v:fallback;
 return {text:typeof value?.text==='string'?value.text.slice(0,60):'',subtitle:typeof value?.subtitle==='string'?value.subtitle.slice(0,80):'',paper:color(value?.paper,'#f0e6cb'),ink:color(value?.ink,'#3f4e36'),font:['serif','sans-serif','cursive'].includes(value?.font)?value.font:'serif'};
}
export function labelTextureCanvas(blend){
 const label=cleanLabel(blend?.label),canvas=document.createElement('canvas');canvas.width=384;canvas.height=448;
 const ctx=canvas.getContext('2d');ctx.fillStyle=label.paper;ctx.fillRect(0,0,384,448);ctx.strokeStyle=label.ink;ctx.globalAlpha=.3;ctx.strokeRect(14,14,356,420);ctx.globalAlpha=1;
 ctx.fillStyle=label.ink;ctx.textAlign='center';
 const write=(text,size,start,maxLines)=>{
  ctx.font=`${size}px ${label.font}`;let line='',lines=[];
  for(const char of text){if(ctx.measureText(line+char).width>324){lines.push(line);line=char;}else line+=char;}
  if(line)lines.push(line);lines.slice(0,maxLines).forEach((line,i)=>ctx.fillText(line,192,start+i*size*1.35));
 };
 write(label.text||blend?.name||'Scent & Wander',32,150,4);write(label.subtitle,18,340,3);
 return canvas;
}
export function blendPercentages(notes){
 const sum=notes.reduce((total,n)=>total+n.parts,0);
 if(!sum)return notes.map(()=>0);
 const raw=notes.map(n=>n.parts/sum*100),whole=raw.map(Math.floor);
 const order=raw.map((v,i)=>({i,remainder:v-whole[i]})).sort((a,b)=>b.remainder-a.remainder);
 for(let n=100-whole.reduce((a,b)=>a+b,0),i=0;i<n;i++)whole[order[i].i]++;
 return whole;
}
export function validBlend(value){
 return !!value&&typeof value.name==='string'&&value.name.trim().length>0&&value.name.length<=60&&
  Array.isArray(value.notes)&&value.notes.length===3&&value.notes.every(n=>n&&SCENT_NOTES.some(s=>s.id===n.id)&&Number.isInteger(n.parts)&&n.parts>=1&&n.parts<=10);
}
export function loadBlends(){
 try{const value=JSON.parse(localStorage.getItem(BLENDS_KEY));return Array.isArray(value)?value.filter(validBlend).slice(0,12).map(blend=>({...blend,label:cleanLabel(blend.label)})):[];}catch{return [];}
}
export function cleanBoard(value){
 const colors=['#f0e8cc','#e6b3bb','#b6cfa8','#ecd28a','#18332d'];
 return {message:typeof value?.message==='string'?value.message.slice(0,300):'',strokes:Array.isArray(value?.strokes)?value.strokes.slice(-100).filter(s=>s&&colors.includes(s.color)&&Array.isArray(s.points)).map(s=>({color:s.color,points:s.points.slice(0,600).filter(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1)})):[]};
}
export function loadBoard(){try{return cleanBoard(JSON.parse(localStorage.getItem(BOARD_KEY)));}catch{return cleanBoard(null);}}
export function drawStrokes(ctx,strokes,width,height){
 ctx.fillStyle='#18332d';ctx.fillRect(0,0,width,height);ctx.lineCap='round';ctx.lineJoin='round';
 for(const stroke of strokes){
  if(!stroke.points.length)continue;
  ctx.strokeStyle=stroke.color;ctx.lineWidth=stroke.color==='#18332d'?width*.025:width*.004;
  ctx.beginPath();stroke.points.forEach((p,i)=>{if(i)ctx.lineTo(p.x*width,p.y*height);else{ctx.moveTo(p.x*width,p.y*height);ctx.lineTo(p.x*width+.1,p.y*height+.1);}});ctx.stroke();
 }
}
export function boardTextureCanvas(board){
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=576;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#18332d';ctx.fillRect(0,0,768,576);
 ctx.fillStyle='#f0e8cc';ctx.font='28px Georgia, serif';ctx.fillText('Scent & Wander',26,42);
 ctx.font='22px serif';let line='',y=79;
 for(const char of board.message){
  if(char==='\n'||ctx.measureText(line+char).width>710){ctx.fillText(line,26,y);line=char==='\n'?'':char;y+=28;if(y>164)break;}else line+=char;
 }
 if(y<=164)ctx.fillText(line,26,y);
 const drawing=document.createElement('canvas');drawing.width=720;drawing.height=376;
 drawStrokes(drawing.getContext('2d'),board.strokes,720,376);ctx.drawImage(drawing,24,184);
 return canvas;
}
