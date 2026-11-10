import {useEffect,useRef} from 'react';
import {chineseText} from './chinese.js';

export function authorLabels(language){return chineseText(language==='en'?{
 open:'ABOUT US',eyebrow:'ABOUT US',title:'Meet the Creators',titleEnd:'',intro:'The people and ideas behind Scent & Wander',
 role:'Co-creator',project:'SCENT & WANDER',story:'A quiet place to follow your curiosity. Through flowers, fragrance and small discoveries, this virtual perfume museum invites you to explore at your own pace.',
 closing:'Thank you for wandering with us.',back:'Back to the forest',close:'Close author page',
 }:{open:'認識創作者',eyebrow:'來自創作者的一頁',title:'認識創作者',titleEnd:'',intro:'循香漫遊背後的人與靈感',role:'共同創作者',project:'循香漫遊',story:'留一處安靜的地方，讓好奇心帶路。透過花草、香氣與微小的發現，這座虛擬香水博物館邀請你，以自己的步調探索。',closing:'謝謝你，與我們一起漫遊。',back:'回到森林',close:'關閉創作者頁面'},language);}

export function BookIcon(){return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5.5C9 3.7 5.2 3.4 2.5 4.3v14c3-.9 6.7-.5 9.5 1.2 2.8-1.7 6.5-2.1 9.5-1.2v-14c-2.7-.9-6.5-.6-9.5 1.2Zm0 0v14"/><path d="M5.5 8c1.2-.1 2.4.1 3.5.6M5.5 11c1.2-.1 2.4.1 3.5.6M15 8.6c1.1-.5 2.3-.7 3.5-.6"/></svg>;}

function BotanicalCactus(){return <svg className="author-sprig" viewBox="0 0 310 250" fill="none" aria-hidden="true">
 <g transform="translate(155 45) scale(.9)">
 <ellipse cx="91" cy="211" rx="43" ry="5" fill="currentColor" opacity=".09"/>
 <path d="M76 207V137H62c-19 0-30-12-30-30V83c0-9 5-15 12-15s12 6 12 15v22c0 6 3 9 9 9h11V57c0-17 8-28 20-28s20 11 20 28v78h10c7 0 10-4 10-10V103c0-9 5-15 12-15s12 6 12 15v24c0 20-11 32-30 32h-14v48Z" fill="currentColor" opacity=".3"/>
 <path d="M76 207V137H62c-19 0-30-12-30-30V83c0-9 5-15 12-15s12 6 12 15v22c0 6 3 9 9 9h11V57c0-17 8-28 20-28s20 11 20 28v78h10c7 0 10-4 10-10V103c0-9 5-15 12-15s12 6 12 15v24c0 20-11 32-30 32h-14v48" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".7"/>
 <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity=".5"><path d="M95 38v168M85 47v159M106 47v159M43 78v28c0 13 7 20 22 20h10M148 98v28c0 15-7 21-21 21h-10"/>
 <path d="m71 66 8 3m-8 17 8 2m-9 67 9 2m-9 20 9 1m-9 18 9 1m33-113 8-3m-8 25 8-2m-8 68 8-3m-8 24 8-2m-87-93 9 3m-8 17 9 1m112 6 8-3m-10 22 8 1"/></g>
 <path d="m70 211 11-2 11 2 12-1 13 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity=".45"/>
 </g>
 <defs><pattern id="author-cactus-spines" width="14" height="19" patternUnits="userSpaceOnUse"><circle cx="7" cy="9" r="1.1" fill="currentColor" opacity=".52"/><path d="m7 9-2-3m2 3 2-2m-2 2v3" stroke="currentColor" strokeWidth=".6" opacity=".4"/></pattern></defs>
 <ellipse cx="72" cy="220" rx="43" ry="5" fill="currentColor" opacity=".09"/>
 {[{x:36,y:144,rx:25,ry:41,r:-29},{x:102,y:145,rx:24,ry:43,r:22},{x:65,y:117,rx:26,ry:44,r:5},{x:40,y:66,rx:24,ry:39,r:-21},{x:86,y:45,rx:25,ry:41,r:15},{x:71,y:185,rx:39,ry:34,r:-5}].map((p,i)=><g key={i} transform={`rotate(${p.r} ${p.x} ${p.y})`}>
  <ellipse cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} fill="currentColor" opacity={i%2?.29:.36}/>
  <ellipse cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} stroke="currentColor" strokeWidth="1.25" opacity=".65"/>
  <ellipse cx={p.x} cy={p.y} rx={p.rx-2} ry={p.ry-2} fill="url(#author-cactus-spines)"/>
 </g>)}
 </svg>;}


export default function AuthorsPage({language,onClose,returnFocus}){
 const t=authorLabels(language),page=useRef(null);
 useEffect(()=>{
  page.current?.querySelector('button')?.focus();
  return()=>returnFocus.current?.focus();
 },[returnFocus]);
 const keyboard=e=>{
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();onClose();}
  if(e.key==='Tab'){
   const buttons=[...page.current.querySelectorAll('button')],first=buttons[0],last=buttons.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
 };
 return <div className="authors-backdrop" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
  <section className="authors-page" ref={page} role="dialog" aria-modal="true" aria-labelledby="authors-title" onKeyDown={keyboard}>
   <button className="authors-close" aria-label={t.close} onClick={onClose}>×</button>
   <div className="authors-paper">
    <span className="parchment-curl parchment-curl-top" aria-hidden="true"/>
    <span className="parchment-curl parchment-curl-bottom" aria-hidden="true"/>
    <div className="authors-kicker"><BookIcon/><span>{t.eyebrow}</span></div>
    <h2 id="authors-title">{language==='en'?<>Meet the <span className="creators-accent">Creators</span></>:t.title}{t.titleEnd&&<><br/><em>{t.titleEnd}</em></>}</h2>
    <p className="authors-intro">{t.intro}</p>
    <div className="authors-credits">{['Hui-Ju Fan','Cindy Lee'].map((name,i)=><article key={name}><span className="author-number">0{i+1}</span><h3 lang="en">{name}</h3><p>{t.role}</p><span className="author-signature" aria-hidden="true">{i===0?'HF':'CL'}</span></article>)}</div>
    <div className="authors-story"><div><span>{t.project}</span><p>{t.story}</p></div><BotanicalCactus/></div>
    <div className="authors-ending"><p>{t.closing}</p><button onClick={onClose}><span>←</span>{t.back}</button></div>
    <span className="authors-folio" aria-hidden="true">S & W / 001</span>
   </div>
  </section>
 </div>;
}
