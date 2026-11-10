import {WORLD_RADIUS} from './world.js';

export const WALK_KEY='scent-and-wander-last-walk';
export function validWalk(value,colliders=[]){
 return value?.version===1&&['x','z','yaw','pitch'].every(key=>Number.isFinite(value[key]))&&
  Math.abs(value.pitch)<=Math.PI/2&&Math.abs(value.yaw)<=Math.PI*2&&
  value.x**2+value.z**2<(WORLD_RADIUS-2)**2&&
  colliders.every(c=>Number.isFinite(c.top)||(value.x-c.x)**2+(value.z-c.z)**2>(c.radius+.32)**2);
}
export function loadWalk(){
 try{const value=JSON.parse(localStorage.getItem(WALK_KEY));return validWalk(value)?{...value,doorOpen:value.doorOpen===true}:null;}catch{return null;}
}
export function saveWalk(value){
 if(!validWalk(value))return false;
 try{localStorage.setItem(WALK_KEY,JSON.stringify(value));return true;}catch{return false;}
}
