import {useEffect,useRef,useState} from 'react';
import {SCENT_NOTES} from './workshop.js';
import {chineseText} from './chinese.js';

export function basketLabels(language){return chineseText(language==='en'?{
 title:'Your Flower Basket',collect:'Add to my basket',collected:'In your basket',open:'Flower basket',empty:'Your basket is waiting for its first discovery.',intro:'Look at a plant and press F to collect it, or add it from its discovery card. Bring three different scent studies to the cottage table to create your perfume.',reusable:'A collection of virtual scent studies. Plants stay in the forest, and your notes can be used again.',ready:'Your basket is ready for the perfume table.',progress:'Collect at least three different plants to begin blending.',return:'Continue exploring',close:'Close basket',edit:'Edit basket',done:'Done',remove:'Remove',editHint:'Remove any study from your basket. You can collect it again in the forest.',removed:'Removed from your basket. You can collect it again.',unsaved:'Basket updated for this visit. Browser storage is unavailable, so this collection may not survive a refresh.',
 }:{title:'你的花草籃',collect:'加入我的花草籃',collected:'已放入花草籃',open:'花草籃',empty:'花草籃正等著第一個發現。',intro:'看向植物按 F 收集，也可以從植物圖鑑加入花草籃。帶著三種不同的香氣筆記，到小屋的實驗桌調配自己的香水。',reusable:'收藏的是虛擬香氣筆記。植物會留在森林，筆記也可以重複使用。',ready:'可以帶著花草籃，到實驗桌開始調香了。',progress:'先收集至少三種不同植物，再開始調香。',return:'繼續探索',close:'關閉花草籃',edit:'編輯花草籃',done:'完成',remove:'移除',editHint:'可以將任何香氣筆記移出花草籃，之後仍可在森林重新收集。',removed:'已從花草籃移除，隨時可以再收集。',unsaved:'已更新本次收藏，但瀏覽器暫時無法儲存，重新整理後可能消失。'},language);}

export function BasketIcon(){return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 11h18l-3 10H6L3 11ZM7 11l5-8 5 8M2 11h20M8 14l1 4m7-4-1 4m-3-4v4"/></svg>;}

export default function FlowerBasket({basket,language,onClose,storageWarning,onRemove}){
 const t=basketLabels(language),ref=useRef(null),editButton=useRef(null);
 const [editing,setEditing]=useState(false),[removedName,setRemovedName]=useState(null);
 useEffect(()=>{const previous=document.activeElement;ref.current?.querySelector('button')?.focus();return()=>{if(previous?.isConnected)previous.focus();};},[]);
 const keyboard=e=>{
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();onClose();}
  if(e.key==='Tab'){const buttons=[...ref.current.querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
 };
 return <section className="workshop-panel basket-panel" ref={ref} role="dialog" aria-modal="true" aria-labelledby="basket-title" onKeyDown={keyboard}>
  <button className="workshop-close" aria-label={t.close} onClick={onClose}>×</button>
  <div className="workshop-eyebrow"><BasketIcon/> SCENT & WANDER</div><h2 id="basket-title">{t.title}</h2><p className="workshop-intro">{t.intro}</p>
  <p className="basket-progress">{basket.length} / {SCENT_NOTES.length} · {basket.length>=3?t.ready:t.progress}</p>
  <div className="basket-edit-tools"><button ref={editButton} className="basket-edit-toggle" disabled={!basket.length&&!editing} aria-pressed={editing} onClick={()=>setEditing(value=>!value)}>{editing?t.done:t.edit}</button>{editing&&<small>{t.editHint}</small>}</div>
  {removedName&&<p className="workshop-notice" role="status">{language==='en'?removedName:chineseText(SCENT_NOTES.find(n=>n.id===removedName).zh,language)} · {t.removed}</p>}
  {!basket.length?<p className="basket-empty">{t.empty}</p>:<ul className="basket-items">{basket.map(id=>{const note=SCENT_NOTES.find(n=>n.id===id);return <li key={id}><span style={{'--specimen-color':note.color}}>✿</span><span className="basket-item-name">{language==='en'?id:chineseText(note.zh,language)}</span>{editing&&<button className="basket-remove" aria-label={`${t.remove}: ${language==='en'?id:chineseText(note.zh,language)}`} onClick={()=>{onRemove(id);setRemovedName(id);editButton.current?.focus();}}>{t.remove}</button>}</li>;})}</ul>}
  <p className="workshop-muted">{t.reusable}</p>{storageWarning&&<p className="workshop-notice" role="status">{t.unsaved}</p>}
  <div className="workshop-footer"><small>{language==='en'?'Saved in this browser, just for you.':chineseText('只儲存在這個瀏覽器，留給你自己。',language)}</small><button id="enter-forest">{t.return} ↗</button></div>
 </section>;
}
