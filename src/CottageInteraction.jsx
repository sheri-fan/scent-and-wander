import {useEffect,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {cottageWorldPoint,cottageLocalPoint,insideCottage} from './cottage.js';

export default function CottageInteraction({cottage,locked,doorOpen,onDoor,onAim,onActivity,onInside}){
 const {camera,gl}=useThree(),target=useRef(null),last=useRef(null),lastInside=useRef(false);
 const ray=useRef(new THREE.Ray()),direction=useRef(new THREE.Vector3()),sphere=useRef(new THREE.Sphere()),hit=useRef(new THREE.Vector3());
 useFrame(()=>{
  const inside=insideCottage(cottage,camera.position.x,camera.position.z);
  if(inside!==lastInside.current){lastInside.current=inside;onInside(inside);}
  let closest=null,distance=2.9;
  if(locked){
   camera.getWorldDirection(direction.current);ray.current.set(camera.position,direction.current);
   const local=cottageLocalPoint(cottage,camera.position.x,camera.position.z);
   const targets=[{id:'door',x:doorOpen?-.93:0,y:1.13,z:doorOpen?1.97:1.34,r:.49},
    ...(inside?[{id:'lab',x:1.05,y:1.13,z:-.34,r:.43},{id:'board',x:0,y:1.46,z:-1.06,r:.49}]:[])];
   for(const t of targets){
    if(t.id==='door'&&!inside&&local.z<1.1)continue;
    const p=cottageWorldPoint(cottage,t.x,t.y,t.z);sphere.current.center.set(p.x,p.y,p.z);sphere.current.radius=t.r;
    if(ray.current.intersectSphere(sphere.current,hit.current)){const d=camera.position.distanceTo(hit.current);if(d<distance){closest=t.id;distance=d;}}
   }
  }
  target.current=closest;if(last.current!==closest){last.current=closest;onAim(closest);}
 });
 useEffect(()=>{
  const use=e=>{
   if(!locked||!target.current)return;
   if(e.type==='keydown'&&(e.code!=='KeyE'||e.repeat))return;
   e.preventDefault();e.stopImmediatePropagation();
   if(target.current==='door')onDoor();else{onActivity(target.current);document.exitPointerLock();}
  };
  gl.domElement.addEventListener('click',use,true);window.addEventListener('keydown',use);
  return()=>{gl.domElement.removeEventListener('click',use,true);window.removeEventListener('keydown',use);};
 },[gl,locked,onDoor,onActivity]);
 return null;
}
