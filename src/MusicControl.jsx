import {useEffect,useRef,useState} from 'react';
import {createForestMusic,FOREST_TRACK} from './forestMusic.js';
import {chineseText} from './chinese.js';

function savedSettings(){
 try{const s=JSON.parse(localStorage.getItem('whispering-forest-music'));return {volume:typeof s?.volume==='number'&&Number.isFinite(s.volume)?Math.max(0,Math.min(1,s.volume)):.35,muted:s?.muted===true};}catch{return {volume:.35,muted:false};}
}
export default function MusicControl({language,locked}){
 const [settings,setSettings]=useState(savedSettings),[open,setOpen]=useState(false),[unavailable,setUnavailable]=useState(false);
 const engine=useRef(null),current=useRef(settings),panel=useRef(null);
 const zh=language!=='en',silent=settings.muted||settings.volume===0;
 const text=chineseText(zh?{music:'森林輕音樂',mute:'靜音',unmute:'開啟音樂',volume:'背景音樂音量',hint:'Esc · 調整音量',unavailable:'此瀏覽器暫時無法播放音樂'}:{music:'Forest music',mute:'Mute music',unmute:'Unmute music',volume:'Background music volume',hint:'Esc · adjust volume',unavailable:'Music is unavailable in this browser'},language);
 useEffect(()=>{
  current.current=settings;engine.current?.setVolume(settings.volume,settings.muted);
  try{localStorage.setItem('whispering-forest-music',JSON.stringify(settings));}catch{}
 },[settings]);
 useEffect(()=>{
  const begin=event=>{
   if(!event.target.closest?.('#enter-forest'))return;
   try{
    engine.current ||= createForestMusic();
    if(!engine.current){setUnavailable(true);return;}
    engine.current.setVolume(current.current.volume,current.current.muted);
    engine.current.start().then(()=>setUnavailable(false)).catch(()=>setUnavailable(true));
   }catch{setUnavailable(true);}
  };
  const visibility=()=>engine.current?.setHidden(document.hidden).catch(()=>{});
  document.addEventListener('click',begin,true);document.addEventListener('visibilitychange',visibility);
  return()=>{document.removeEventListener('click',begin,true);document.removeEventListener('visibilitychange',visibility);engine.current?.dispose();engine.current=null;};
 },[]);
 useEffect(()=>{if(locked)setOpen(false);},[locked]);
 useEffect(()=>{
  if(!open)return;
  const outside=e=>{if(!panel.current?.contains(e.target))setOpen(false);};
  const escape=e=>{if(e.key==='Escape')setOpen(false);};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};
 },[open]);
 return <div className="music-control" ref={panel}>
  <button className="music-toggle" aria-label={text.music} aria-expanded={open} aria-controls="music-panel" title={locked?text.hint:text.music} onClick={()=>setOpen(v=>!v)}>
   <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M11 4 5 9H2v6h3l6 5z"/>{silent?<path d="m16 9 6 6m0-6-6 6"/>:<><path d="M15 8a6 6 0 0 1 0 8"/><path d="M18 5a10 10 0 0 1 0 14"/></>}</svg>
  </button>
  {locked&&<small className="music-hint">{text.hint}</small>}
  {open&&<section id="music-panel" className="music-panel" aria-label={text.music}>
   <div className="music-heading"><span>{text.music}</span><button className="music-mute" aria-label={silent?text.unmute:text.mute} aria-pressed={silent} onClick={()=>setSettings(s=>({...s,muted:!silent,volume:s.volume||.35}))}>{silent?text.unmute:text.mute}</button></div>
   <p className="music-track">{FOREST_TRACK.title}<small>{FOREST_TRACK.artist}</small></p>
   <label htmlFor="music-volume">{text.volume}<output>{Math.round(settings.volume*100)}%</output></label>
   <input id="music-volume" type="range" min="0" max="100" step="1" value={Math.round(settings.volume*100)} onChange={e=>setSettings({volume:Number(e.target.value)/100,muted:false})}/>
   {unavailable&&<small role="status">{text.unavailable}</small>}
   <small className="music-credit">Music by @notchillykitty - Breath of the Forest at Dawn</small>
  </section>}
 </div>;
}
