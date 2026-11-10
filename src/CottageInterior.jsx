import {useEffect,useMemo} from 'react';
import {RoundedBox} from '@react-three/drei';
import * as THREE from 'three';
import {boardTextureCanvas,labelTextureCanvas,SCENT_NOTES} from './workshop.js';

function Part({at,size,color,rotation}){return <mesh position={at} rotation={rotation} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={.88}/></mesh>;}
export default function CottageInterior({board,lastBlend}){
 const boardMap=useMemo(()=>{const t=new THREE.CanvasTexture(boardTextureCanvas(board));t.colorSpace=THREE.SRGBColorSpace;return t;},[board]);
 useEffect(()=>()=>boardMap.dispose(),[boardMap]);
 const labelMap=useMemo(()=>{const t=new THREE.CanvasTexture(labelTextureCanvas(lastBlend));t.colorSpace=THREE.SRGBColorSpace;return t;},[lastBlend]);
 useEffect(()=>()=>labelMap.dispose(),[labelMap]);
 const bottleColor=useMemo(()=>{
  const color=new THREE.Color('#d5b684');
  if(lastBlend?.notes){color.setRGB(0,0,0);const total=lastBlend.notes.reduce((n,p)=>n+p.parts,0);lastBlend.notes.forEach(p=>color.add(new THREE.Color(SCENT_NOTES.find(n=>n.id===p.id)?.color||'#d5b684').multiplyScalar(p.parts/total)));}
  return color;
 },[lastBlend]);
 return <group name="Cottage interior">
  <Part at={[0,.245,-.05]} size={[1.05,.012,1.65]} color="#b7a17e"/>
  {[-.43,.43].map(x=><Part key={x} at={[x,.253,-.05]} size={[.025,.004,1.58]} color="#e4d5b3"/>)}
  {/* Soft, rounded sofa along the left wall, facing the central aisle. */}
  <group name="Cozy sofa" position={[-1.05,.24,-.05]} rotation={[0,Math.PI/2,0]}>
   <Part at={[0,.16,0]} size={[1.4,.23,.66]} color="#68725b"/>
   <RoundedBox args={[1.4,.49,.19]} radius={.075} smoothness={3} position={[0,.48,-.26]} castShadow><meshStandardMaterial color="#92a080" roughness={1}/></RoundedBox>
   {[-.35,.35].map(x=><RoundedBox key={x} args={[.67,.19,.58]} radius={.055} smoothness={3} position={[x,.3,.025]} castShadow><meshStandardMaterial color="#a7b196" roughness={1}/></RoundedBox>)}
   {[-.69,.69].map(x=><RoundedBox key={x} args={[.16,.39,.7]} radius={.06} smoothness={3} position={[x,.34,0]} castShadow><meshStandardMaterial color="#8d9b7d" roughness={1}/></RoundedBox>)}
   <RoundedBox args={[.34,.32,.13]} radius={.065} smoothness={3} position={[-.4,.51,-.12]} rotation={[.1,0,.16]} castShadow><meshStandardMaterial color="#d2b5a0" roughness={1}/></RoundedBox>
   <Part at={[.52,.49,.07]} size={[.26,.035,.51]} color="#d6c6a7"/>
   <Part at={[.63,.34,.28]} size={[.21,.3,.035]} color="#d6c6a7"/>
  </group>
  {/* The experiment table holds a collection of scent vials and a finished bottle. */}
  <group name="Perfume experiment table" position={[1.08,.24,-.34]}>
   <Part at={[0,.6,0]} size={[.74,.085,1.22]} color="#a68157"/>
   {[-.26,.26].flatMap(x=>[-.47,.47].map(z=><Part key={`${x}-${z}`} at={[x,.29,z]} size={[.075,.58,.075]} color="#71553b"/>))}
   <Part at={[0,.49,0]} size={[.64,.11,1.02]} color="#8e6d49"/>
   {Array.from({length:6},(_,i)=><group key={i} position={[.16,.65,-.43+i*.16]}>
    <mesh position={[0,.065,0]} castShadow><cylinderGeometry args={[.033,.035,.13,12]}/><meshStandardMaterial color={SCENT_NOTES[i].color} transparent opacity={.82} roughness={.22}/></mesh>
    <Part at={[0,.145,0]} size={[.055,.045,.055]} color="#65533c"/>
   </group>)}
   <mesh name="Your perfume bottle" position={[-.12,.77,-.02]} castShadow><cylinderGeometry args={[.067,.073,.24,20]}/><meshStandardMaterial color={bottleColor} transparent opacity={.83} metalness={.1} roughness={.22}/></mesh>
   <Part at={[-.12,.91,-.02]} size={[.1,.05,.1]} color="#bba16d"/>
   <mesh name="Your perfume label" position={[-.12,.76,.06]}><planeGeometry args={[.09,.1]}/><meshStandardMaterial map={labelMap} roughness={.9}/></mesh>
   <Part at={[-.07,.66,.38]} size={[.37,.018,.27]} color="#e1d3b4" rotation={[0,.14,0]}/>
   <Part at={[-.08,.675,.38]} size={[.015,.01,.23]} color="#705c43" rotation={[0,.3,0]}/>
  </group>
  <group name="Message blackboard" position={[0,1.46,-1.13]}>
   <Part at={[0,0,0]} size={[1.28,.98,.07]} color="#6b5038"/>
   <mesh position={[0,0,.043]}><planeGeometry args={[1.16,.87]}/><meshBasicMaterial map={boardMap} toneMapped={false}/></mesh>
   <Part at={[0,-.51,.06]} size={[1.3,.045,.12]} color="#98774e"/>
   <Part at={[-.25,-.477,.09]} size={[.1,.015,.018]} color="#f0e8cc"/>
   <Part at={[-.09,-.477,.09]} size={[.09,.015,.018]} color="#e6b3bb"/>
  </group>
  <mesh position={[0,2.17,-.12]}><coneGeometry args={[.23,.2,24,1,true]}/><meshStandardMaterial color="#d9c7a2" side={THREE.DoubleSide} roughness={.9}/></mesh>
  <Part at={[0,2.53,-.12]} size={[.015,.55,.015]} color="#6b5944"/>
  <pointLight position={[0,1.95,-.1]} color="#ffd2a0" intensity={4} distance={4} decay={2}/>
 </group>;
}
