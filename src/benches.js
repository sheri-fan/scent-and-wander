import {groundHeight,pathX,randomGenerator} from './world.js';
import {makeFlowerPatches,GARDEN_CENTER,GARDEN_RADIUS} from './flowers.js';

export function makeBenches(world){
 const rand=randomGenerator(98271),plants=makeFlowerPatches(world),benches=[];
 for(let attempt=0;attempt<16000&&benches.length<6;attempt++){
  const z=-9+rand()*59,side=rand()<.5?-1:1,x=pathX(z)+side*(4.4+rand()*6);
  if(Math.hypot(x-GARDEN_CENTER.x,z-GARDEN_CENTER.z)>GARDEN_RADIUS)continue;
  if(world.colliders.some(c=>Math.hypot(x-c.x,z-c.z)<c.radius+1.45))continue;
  if(plants.some(p=>Math.hypot(x-p.x,z-p.z)<p.footprint+1.65))continue;
  if(benches.some(b=>Math.hypot(x-b.x,z-b.z)<9))continue;
  const y=groundHeight(x,z);
  if(Math.abs(groundHeight(x+1,z+.4)-groundHeight(x-1,z-.4))>.16)continue;
  benches.push({x,y,z,angle:Math.atan2(pathX(z)-x,0),shade:.9+rand()*.18});
 }
 if(benches.length!==6)throw new Error('Unable to place spaced forest benches');
 return benches;
}

export function benchColliders(benches){
 return benches.flatMap(b=>Array.from({length:5},(_,i)=>{
  const offset=(i-2)*.38;
  return {x:b.x+Math.cos(b.angle)*offset,z:b.z-Math.sin(b.angle)*offset,radius:.37};
 }));
}
