export const WORLD_RADIUS = 95;
export function randomGenerator(seed = 3491) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export const pathX = z => Math.sin(z * .048) * 8 + Math.sin(z * .11) * 2;
export const groundHeight = (x,z) => .34 * Math.sin(x * .09) * Math.sin(z * .075) + .16 * Math.sin(z * .15);
export function resolveMovement(x,z,dx,dz,colliders) {
 const valid=(a,b)=>a*a+b*b < (WORLD_RADIUS-2)**2 && colliders.every(c=>(a-c.x)**2+(b-c.z)**2 > (c.radius+.32)**2);
 // Separate axes allow the player to slide along trunks instead of sticking.
 if(valid(x+dx,z)) x+=dx;
 if(valid(x,z+dz)) z+=dz;
 return [x,z];
}
export function makeWorld() {
 const rand=randomGenerator(), trees=[], rocks=[], logs=[];
 for(let i=0;i<640;i++) { const x=(rand()-.5)*190,z=(rand()-.5)*190; if(x*x+z*z>95**2 || Math.abs(x-pathX(z))<3.3)continue; const h=12+rand()*13,r=.21+rand()*.36; trees.push({x,z,h,r,seed:rand(),y:groundHeight(x,z)}); }
 for(let i=0;i<105;i++) {const x=(rand()-.5)*176,z=(rand()-.5)*176;if(Math.abs(x-pathX(z))<2.2)continue; rocks.push({x,z,y:groundHeight(x,z),r:.25+rand()*.9,a:rand()*6.28});}
 for(let i=0;i<22;i++){const x=(rand()-.5)*160,z=(rand()-.5)*160;if(Math.abs(x-pathX(z))<5)continue;logs.push({x,z,y:groundHeight(x,z),a:rand()*6.28,length:2+rand()*4});}
 return {trees,rocks,logs,colliders:[...trees.map(t=>({x:t.x,z:t.z,radius:t.r})),...rocks.filter(r=>r.r>.55).map(r=>({x:r.x,z:r.z,radius:r.r})),...logs.flatMap(l=>Array.from({length:7},(_,i)=>({x:l.x+Math.sin(l.a)*(i/6-.5)*l.length,z:l.z+Math.cos(l.a)*(i/6-.5)*l.length,radius:.22})))]};
}
