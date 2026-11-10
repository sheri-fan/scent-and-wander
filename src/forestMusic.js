import trackUrl from '../Stephan Lawson Piano - Breath of the Forest at Dawn [Thematic].mp3?url';

export const FOREST_TRACK = {
 title:'Breath of the Forest at Dawn',
 artist:'Stephan Lawson Piano',
 url:trackUrl,
};

// One local recording, reused when resuming exploration or closing plant cards.
export function createForestMusic() {
 const audio = new Audio(FOREST_TRACK.url);
 audio.loop = true;
 audio.preload = 'metadata';
 audio.volume = 0;
 let started = false, disposed = false;
 return {
  async start(){
   if(disposed)return;
   started=true;
   if(!document.hidden&&audio.paused)await audio.play();
  },
  setVolume(volume,muted){
   audio.volume=Math.max(0,Math.min(1,volume));
   audio.muted=muted;
  },
  async setHidden(hidden){
   if(disposed||!started)return;
   if(hidden)audio.pause();else if(audio.paused)await audio.play();
  },
  dispose(){
   disposed=true;audio.pause();audio.removeAttribute('src');audio.load();
  }
 };
}
