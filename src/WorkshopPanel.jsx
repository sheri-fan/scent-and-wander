import {useEffect,useRef,useState} from 'react';
import {chineseText} from './chinese.js';
import {SCENT_NOTES,BLENDS_KEY,BOARD_KEY,blendPercentages,cleanLabel,loadBlends,cleanBoard,drawStrokes} from './workshop.js';

function labels(language){return chineseText(language==='en'?{
 lab:'THE PERFUME WORKSHOP',board:'THE COTTAGE BLACKBOARD',labTitle:'A scent of your own',boardTitle:'Leave a little of yourself',
 intro:'Choose three notes and adjust their balance. Give your virtual scent a name.',name:'Name your scent',top:'Opening note',heart:'Heart note',base:'Lasting note',parts:'Parts',save:'Save my scent',saved:'Your scent is saved.',collection:'Your saved scents',empty:'Your first scent is waiting to be made.',load:'Use this blend',remove:'Delete',local:'Saved in this browser, just for you.',return:'Back to the cottage',close:'Close',
 message:'Your message',messageHint:'A thought, a wish, a note for your next visit…',draw:'Draw on the board',chalk:'Chalk colour',eraser:'Eraser',undo:'Undo',clear:'Clear drawing',saveBoard:'Save to the blackboard',boardSaved:'Your message and drawing are on the board.',storage:'Could not save. Your browser storage may be full.',nameRequired:'Give your scent a name first.',defaultName:'My woodland scent',virtual:'A virtual scent composition',
 }:{
 lab:'香氣實驗室',board:'小屋黑板',labTitle:'調一款屬於你的香氣',boardTitle:'留下一點你的心意',intro:'選擇三種香調，調整彼此的比例，再為你的虛擬香氣取個名字。',name:'香氣名稱',top:'開場香調',heart:'中間香調',base:'持久香調',parts:'份數',save:'收藏我的香氣',saved:'你的香氣已收藏。',collection:'你收藏的香氣',empty:'第一款香氣，等著你來調配。',load:'使用這款配方',remove:'刪除',local:'只儲存在這個瀏覽器，留給你自己。',return:'回到小屋',close:'關閉',message:'你的留言',messageHint:'一個念頭、一個願望，或留給下次造訪的自己⋯',draw:'在黑板上畫畫',chalk:'粉筆顏色',eraser:'橡皮擦',undo:'復原',clear:'清除畫作',saveBoard:'留在黑板上',boardSaved:'留言與畫作已留在黑板上。',storage:'暫時無法儲存，瀏覽器的儲存空間可能已滿。',nameRequired:'先為香氣取個名字吧。',defaultName:'我的林間香氣',virtual:'虛擬香氣創作',
 },language);}

function ScentLab({language,t,onSaved}){
 const [name,setName]=useState(t.defaultName),[notes,setNotes]=useState([{id:'Bergamot',parts:3},{id:'Rose Bush',parts:4},{id:'Sandalwood',parts:3}]);
 const [label,setLabel]=useState(()=>cleanLabel(null)),[editingLabel,setEditingLabel]=useState(false);
 const lt=chineseText(language==='en'?{edit:'Customize label',hint:'Click the label to customize',text:'Label text',subtitle:'Small inscription',paper:'Paper colour',ink:'Text colour',font:'Lettering',serif:'Classic serif',sans:'Simple',script:'Handwritten',done:'Done',follow:'Leave empty to use your scent name'}:{edit:'設計瓶身標籤',hint:'點擊標籤開始設計',text:'標籤文字',subtitle:'小字題記',paper:'紙張顏色',ink:'文字顏色',font:'字體',serif:'典雅襯線',sans:'簡約',script:'手寫風格',done:'完成',follow:'留白以使用香氣名稱'},language);
 const updateLabel=update=>{setLabel(old=>({...old,...update}));setNotice('');};
 const [saved,setSaved]=useState(loadBlends),[notice,setNotice]=useState('');
 const percentages=blendPercentages(notes),noteName=n=>language==='en'?(n.id==='Rose Bush'?'Rose':n.id):chineseText(n.zh,language);
 const change=(i,update)=>{setNotes(ns=>ns.map((n,j)=>j===i?{...n,...update}:n));setNotice('');};
 const save=()=>{
  if(!name.trim()){setNotice(t.nameRequired);return;}
  const blend={name:name.trim(),label:cleanLabel(label),notes:notes.map(n=>({...n})),createdAt:new Date().toISOString()};
  const next=[blend,...saved].slice(0,12);
  try{localStorage.setItem(BLENDS_KEY,JSON.stringify(next));setSaved(next);onSaved(blend);setNotice(t.saved);}catch{setNotice(t.storage);}
 };
 const remove=index=>{const next=saved.filter((_,i)=>i!==index);try{localStorage.setItem(BLENDS_KEY,JSON.stringify(next));setSaved(next);}catch{setNotice(t.storage);}};
 return <>
  <p className="workshop-intro">{t.intro}</p>
  <div className="blend-layout"><div className="blend-controls">
   <label className="workshop-label" htmlFor="blend-name">{t.name}</label>
   <input id="blend-name" maxLength={60} value={name} onChange={e=>{setName(e.target.value);setNotice('');}}/>
   {notes.map((note,i)=><div className="blend-note" key={i}>
    <label htmlFor={`scent-note-${i}`}>{[t.top,t.heart,t.base][i]}<strong>{percentages[i]}%</strong></label>
    <select id={`scent-note-${i}`} value={note.id} onChange={e=>change(i,{id:e.target.value})}>
     {SCENT_NOTES.map(n=><option key={n.id} value={n.id}>{noteName(n)}</option>)}
    </select>
    <label className="parts-label" htmlFor={`scent-parts-${i}`}>{t.parts}<output>{note.parts}</output></label>
    <input id={`scent-parts-${i}`} type="range" min="1" max="10" step="1" value={note.parts} onChange={e=>change(i,{parts:Number(e.target.value)})}/>
   </div>)}
  </div><div className="blend-preview" aria-label={t.virtual}>
   <div className="scent-bottle"><div className="scent-bottle-cap"/><div className="scent-bottle-liquid" style={{background:`linear-gradient(0deg,${notes.map(n=>SCENT_NOTES.find(s=>s.id===n.id).color).join(',')})`}}/><button type="button" className="bottle-label" aria-label={lt.edit} aria-expanded={editingLabel} aria-controls="label-editor" onClick={()=>setEditingLabel(open=>!open)} style={{background:label.paper,color:label.ink,fontFamily:label.font}}><span>{label.text||name||t.defaultName}</span>{label.subtitle&&<small>{label.subtitle}</small>}</button></div>
   <small>{t.virtual}</small><small>{lt.hint}</small>
  </div></div>
  {editingLabel&&<fieldset className="label-editor" id="label-editor"><legend>{lt.edit}</legend>
   <label htmlFor="label-text">{lt.text}</label><input id="label-text" maxLength={60} placeholder={lt.follow} value={label.text} onChange={e=>updateLabel({text:e.target.value})} autoFocus/>
   <label htmlFor="label-subtitle">{lt.subtitle}</label><input id="label-subtitle" maxLength={80} value={label.subtitle} onChange={e=>updateLabel({subtitle:e.target.value})}/>
   <div className="label-colors"><label>{lt.paper}<input aria-label={lt.paper} type="color" value={label.paper} onChange={e=>updateLabel({paper:e.target.value})}/></label><label>{lt.ink}<input aria-label={lt.ink} type="color" value={label.ink} onChange={e=>updateLabel({ink:e.target.value})}/></label></div>
   <label htmlFor="label-font">{lt.font}</label><select id="label-font" value={label.font} onChange={e=>updateLabel({font:e.target.value})}><option value="serif">{lt.serif}</option><option value="sans-serif">{lt.sans}</option><option value="cursive">{lt.script}</option></select>
   <button type="button" onClick={()=>{setEditingLabel(false);document.querySelector('.bottle-label')?.focus();}}>{lt.done}</button>
  </fieldset>}
  <button className="workshop-primary" onClick={save}>{t.save} <span>✧</span></button>
  <p className="workshop-notice" role="status">{notice}</p>
  <h3>{t.collection}</h3>
  {!saved.length?<p className="workshop-muted">{t.empty}</p>:<ul className="saved-blends">{saved.map((blend,i)=><li key={`${blend.createdAt}-${i}`}>
   <div><strong>{blend.name}</strong><small>{blend.notes.map(n=>noteName(SCENT_NOTES.find(s=>s.id===n.id))).join(' · ')}</small></div>
   <button onClick={()=>{setName(blend.name);setLabel(cleanLabel(blend.label));setNotes(blend.notes.map(n=>({...n})));setNotice('');}}>{t.load}</button>
   <button onClick={()=>remove(i)} aria-label={`${t.remove}: ${blend.name}`}>{t.remove}</button>
  </li>)}</ul>}
 </>;
}

function Blackboard({t,initial,onSaved}){
 const [message,setMessage]=useState(initial.message),[strokes,setStrokes]=useState(initial.strokes),[color,setColor]=useState('#f0e8cc'),[notice,setNotice]=useState('');
 const canvas=useRef(null),active=useRef(null);
 const redraw=items=>{const c=canvas.current;if(c)drawStrokes(c.getContext('2d'),items,c.width,c.height);};
 useEffect(()=>{redraw(strokes);},[strokes]);
 const point=e=>{const r=canvas.current.getBoundingClientRect();return {x:Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*10000)/10000,y:Math.round(Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))*10000)/10000};};
 const start=e=>{if(e.button!==0&&e.pointerType==='mouse')return;e.preventDefault();canvas.current.setPointerCapture(e.pointerId);active.current={color,points:[point(e)]};redraw([...strokes,active.current]);setNotice('');};
 const move=e=>{
  if(!active.current)return;e.preventDefault();const p=point(e),points=active.current.points,last=points[points.length-1];
  if(points.length<600&&Math.hypot(p.x-last.x,p.y-last.y)>.0015){points.push(p);redraw([...strokes,active.current]);}
 };
 const end=e=>{if(!active.current)return;const stroke=active.current;active.current=null;setStrokes(old=>[...old,stroke].slice(-100));if(canvas.current.hasPointerCapture(e.pointerId))canvas.current.releasePointerCapture(e.pointerId);};
 const save=()=>{
  const board=cleanBoard({message,strokes});
  try{localStorage.setItem(BOARD_KEY,JSON.stringify(board));onSaved(board);setNotice(t.boardSaved);}catch{setNotice(t.storage);}
 };
 return <>
  <label className="workshop-label" htmlFor="board-message">{t.message}</label>
  <textarea id="board-message" maxLength={300} rows={3} placeholder={t.messageHint} value={message} onChange={e=>{setMessage(e.target.value);setNotice('');}}/>
  <div className="chalk-tools" role="group" aria-label={t.chalk}>
   {['#f0e8cc','#e6b3bb','#b6cfa8','#ecd28a'].map((c,i)=><button key={c} aria-label={`${t.chalk} ${i+1}`} aria-pressed={color===c} style={{'--chalk':c}} className="chalk-swatch" onClick={()=>setColor(c)}/>)}
   <button aria-pressed={color==='#18332d'} onClick={()=>setColor('#18332d')}>{t.eraser}</button>
   <button disabled={!strokes.length} onClick={()=>{setStrokes(s=>s.slice(0,-1));setNotice('');}}>{t.undo}</button>
   <button disabled={!strokes.length} onClick={()=>{setStrokes([]);setNotice('');}}>{t.clear}</button>
  </div>
  <canvas ref={canvas} className="drawing-board" width={960} height={500} aria-label={t.draw} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}/>
  <button className="workshop-primary" onClick={save}>{t.saveBoard} <span>✧</span></button>
  <p className="workshop-notice" role="status">{notice}</p>
 </>;
}

export default function WorkshopPanel({activity,language,board,onBoardSaved,onBlendSaved,onClose}){
 const t=labels(language),ref=useRef(null);
 useEffect(()=>{ref.current?.querySelector('input,textarea,button')?.focus();},[activity]);
 const keyDown=e=>{
  if(e.key==='Escape'){e.stopPropagation();onClose();}
  if(e.key==='Tab'){
   const items=[...ref.current.querySelectorAll('button:not(:disabled),input,select,textarea')],first=items[0],last=items[items.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
 };
 return <section className="workshop-panel" ref={ref} role="dialog" aria-modal="true" aria-labelledby="workshop-title" onKeyDown={keyDown}>
  <button className="workshop-close" aria-label={t.close} onClick={onClose}>×</button>
  <div className="workshop-eyebrow">{activity==='lab'?t.lab:t.board}</div>
  <h2 id="workshop-title">{activity==='lab'?t.labTitle:t.boardTitle}</h2>
  {activity==='lab'?<ScentLab language={language} t={t} onSaved={onBlendSaved}/>:<Blackboard t={t} initial={board} onSaved={onBoardSaved}/>}
  <div className="workshop-footer"><small>{t.local}</small><button id="enter-forest">{t.return} <span>↗</span></button></div>
 </section>;
}
