import {useEffect,useMemo,useRef} from 'react';
import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {randomGenerator} from './world.js';

function benchGeometry(){
 const parts=[];
 const plank=(size,position,tilt=0)=>{
  const g=new THREE.BoxGeometry(...size);g.rotateX(tilt);g.translate(...position);parts.push(g);
 };
 for(const z of [-.2,0,.2])plank([1.9,.075,.17],[0,.48,z]);
 for(const x of [-.73,.73]){
  plank([.095,.46,.095],[x,.23,.24]);
  plank([.095,1.08,.095],[x,.54,-.3]);
  plank([.11,.1,.66],[x,.405,-.015]);
 }
 for(const y of [.69,.87,1.05])plank([1.9,.125,.065],[0,y,-.32],-.07);
 plank([1.5,.085,.085],[0,.2,-.24]);
 const merged=mergeGeometries(parts);parts.forEach(p=>p.dispose());return merged;
}
function woodTexture(){
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;
 const ctx=canvas.getContext('2d'),rand=randomGenerator(732);
 ctx.fillStyle='#92744d';ctx.fillRect(0,0,512,128);
 for(let i=0;i<280;i++){
  const y=rand()*128;ctx.strokeStyle=i%3===0?'#c2a57b44':'#433a2b44';ctx.lineWidth=.3+rand();
  ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(150,y+rand()*8-4,340,y+rand()*8-4,512,y);ctx.stroke();
 }
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
 return map;
}
export default function Benches({benches}){
 const ref=useRef();
 const geometry=useMemo(benchGeometry,[]),map=useMemo(woodTexture,[]);
 useEffect(()=>{
  const dummy=new THREE.Object3D();
  benches.forEach((b,i)=>{
   dummy.position.set(b.x,b.y,b.z);dummy.rotation.set(0,b.angle,0);dummy.updateMatrix();
   ref.current.setMatrixAt(i,dummy.matrix);ref.current.setColorAt(i,new THREE.Color().setRGB(b.shade,b.shade,b.shade));
  });
  ref.current.instanceMatrix.needsUpdate=true;ref.current.instanceColor.needsUpdate=true;
 },[benches]);
 useEffect(()=>()=>{geometry.dispose();map.dispose();},[geometry,map]);
 return <instancedMesh name="Woodland benches" ref={ref} args={[geometry,null,benches.length]} castShadow receiveShadow frustumCulled={false}>
  <meshStandardMaterial map={map} color="#c5aa83" roughness={.88}/>
 </instancedMesh>;
}
