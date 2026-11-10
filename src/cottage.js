import {groundHeight,pathX,randomGenerator} from './world.js';
import {makeFlowerPatches,GARDEN_CENTER,GARDEN_RADIUS} from './flowers.js';

export function makeCottage(world,benches){
 const rand=randomGenerator(87052),plants=makeFlowerPatches(world),choices=[];
 for(let i=0;i<24000;i++){
  const a=rand()*Math.PI*2,r=12+rand()*(GARDEN_RADIUS-4);
  const x=GARDEN_CENTER.x+Math.cos(a)*r,z=GARDEN_CENTER.z+Math.sin(a)*r;
  if(Math.abs(x-pathX(z))<6)continue;
  if(world.colliders.some(c=>Math.hypot(x-c.x,z-c.z)<c.radius+3.5))continue;
  if(plants.some(p=>Math.hypot(x-p.x,z-p.z)<p.footprint+3.5))continue;
  if(benches.some(b=>Math.hypot(x-b.x,z-b.z)<5))continue;
  if(Math.abs(groundHeight(x+2,z+2)-groundHeight(x-2,z-2))>.3)continue;
  choices.push({x,z,y:groundHeight(x,z),angle:Math.atan2(pathX(z)-x,0)});
 }
 if(!choices.length)throw new Error('No clear space for woodland cottage');
 choices.sort((a,b)=>Math.hypot(a.x-pathX(24),a.z-24)-Math.hypot(b.x-pathX(24),b.z-24));
 return choices[0];
}
export function cottageWorldPoint(c,x,y,z){
 return {x:c.x+Math.cos(c.angle)*x+Math.sin(c.angle)*z,y:c.y+y,z:c.z-Math.sin(c.angle)*x+Math.cos(c.angle)*z};
}
export function cottageLocalPoint(c,x,z){
 const dx=x-c.x,dz=z-c.z;
 return {x:Math.cos(c.angle)*dx-Math.sin(c.angle)*dz,z:Math.sin(c.angle)*dx+Math.cos(c.angle)*dz};
}
export function insideCottage(c,x,z){const p=cottageLocalPoint(c,x,z);return Math.abs(p.x)<1.53&&p.z> -1.19&&p.z<1.22;}
export function cottageWalkingHeight(c,x,z){
 const p=cottageLocalPoint(c,x,z),ground=groundHeight(x,z);
 if(Math.abs(p.x)<1.67&&p.z>=-1.4&&p.z<=1.5)return c.y+.24;
 if(Math.abs(p.x)<.8&&p.z>1.5&&p.z<2.3){const t=(2.3-p.z)/.8;return ground+(c.y+.24-ground)*t;}
 return ground;
}
export function cottageColliders(c,doorOpen=false){
 const point=(x,z,radius)=>({x:c.x+Math.cos(c.angle)*x+Math.sin(c.angle)*z,z:c.z-Math.sin(c.angle)*x+Math.cos(c.angle)*z,radius});
 const solids=[];
 // Thin perimeter walls and a genuine walk-through doorway.
 for(let z=-1.25;z<=1.26;z+=.22){solids.push(point(-1.6,z,.1),point(1.6,z,.1));}
 for(let x=-1.6;x<=1.61;x+=.2){solids.push(point(x,-1.25,.1));if(Math.abs(x)>.72)solids.push(point(x,1.25,.1));}
 if(!doorOpen)for(const x of [-.5,-.25,0,.25,.5])solids.push(point(x,1.32,.15));
 else for(const t of [.15,.5,.85,1.2])solids.push(point(-.68+Math.cos(Math.PI*.62)*t,1.34+Math.sin(Math.PI*.62)*t,.06));
 // Furniture occupies the sides, leaving the centre aisle open.
 for(let z=-.72;z<=.65;z+=.23)solids.push(point(-1.12,z,.27));
 for(let z=-.85;z<=.25;z+=.22)solids.push(point(1.1,z,.27));
 solids.push(point(2.25,1.4,.23));
 return solids;
}
