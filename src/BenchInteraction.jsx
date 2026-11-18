import {useEffect,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {benchStandPosition} from './benches.js';

export default function BenchInteraction({benches,colliders,locked,seated,onSeat,onAim}){
 const {camera,gl,scene}=useThree(),ray=useRef(new THREE.Raycaster()),target=useRef(null),last=useRef(null);
 useFrame(()=>{
  let aimed=null;target.current=null;
  if(locked&&seated)aimed='stand';
  else if(locked){
   const mesh=scene.getObjectByName('Woodland benches');
   ray.current.setFromCamera({x:0,y:0},camera);ray.current.far=2.8;
   const hit=mesh&&ray.current.intersectObject(mesh,false)[0];
   if(hit&&Number.isInteger(hit.instanceId)){
    const b=benches[hit.instanceId],dx=camera.position.x-b.x,dz=camera.position.z-b.z;
    const front=Math.sin(b.angle)*dx+Math.cos(b.angle)*dz;
    const standing=benchStandPosition(b,colliders);
    if(front>.45&&camera.position.y<b.y+1.95&&standing){target.current={bench:b,standing};aimed='bench';}
   }
  }
  if(aimed!==last.current){last.current=aimed;onAim(aimed);}
 });
 useEffect(()=>{
  const use=e=>{
   if(!locked||(!seated&&!target.current)||e.isComposing)return;
   if(e.type==='keydown'&&(e.code!=='KeyE'||e.repeat||e.target?.closest?.('input,textarea,select,[contenteditable]')))return;
   e.preventDefault();e.stopImmediatePropagation();onSeat(seated?null:target.current);
  };
  gl.domElement.addEventListener('click',use,true);window.addEventListener('keydown',use);
  return()=>{gl.domElement.removeEventListener('click',use,true);window.removeEventListener('keydown',use);};
 },[gl,locked,seated,onSeat]);
 return null;
}
