import {useMemo,useEffect,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import CottageInterior from './CottageInterior.jsx';
import * as THREE from 'three';
import {randomGenerator} from './world.js';

function timberMap(){
 const c=document.createElement('canvas');c.width=256;c.height=256;
 const ctx=c.getContext('2d'),rand=randomGenerator(185);
 ctx.fillStyle='#ab8156';ctx.fillRect(0,0,256,256);
 for(let i=0;i<450;i++){
  ctx.strokeStyle=i%3?'#573d2840':'#e0bc8640';ctx.lineWidth=.4+rand();
  const y=rand()*256;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(80,y+rand()*6,180,y-rand()*6,256,y);ctx.stroke();
 }
 for(let y=0;y<256;y+=32){ctx.fillStyle='#402e2555';ctx.fillRect(0,y,256,2);}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function Box({size,at,material,rotation}){
 return <mesh position={at} rotation={rotation} material={material} castShadow receiveShadow><boxGeometry args={size}/></mesh>;
}
export default function Cottage({cottage:c,doorOpen=false,board,lastBlend}){
 const doorLeaf=useRef();
 useFrame((_,dt)=>{if(doorLeaf.current)doorLeaf.current.rotation.y=THREE.MathUtils.damp(doorLeaf.current.rotation.y,doorOpen?-Math.PI*.62:0,10,dt);});
 const materials=useMemo(()=>{
  const map=timberMap();
  return {wood:new THREE.MeshStandardMaterial({map,roughness:.92,color:'#d1b48a'}),trim:new THREE.MeshStandardMaterial({color:'#654b35',roughness:.9}),roof:new THREE.MeshStandardMaterial({color:'#535d48',roughness:.95}),door:new THREE.MeshStandardMaterial({color:'#61775c',roughness:.82}),glass:new THREE.MeshStandardMaterial({color:'#ffd99a',emissive:'#ffae47',emissiveIntensity:2.2}),brass:new THREE.MeshStandardMaterial({color:'#c7a264',metalness:.5,roughness:.45})};
 },[]);
 const gable=useMemo(()=>{
  const s=new THREE.Shape();s.moveTo(-1.6,0);s.lineTo(1.6,0);s.lineTo(0,1.02);s.closePath();
  return new THREE.ExtrudeGeometry(s,{depth:.07,bevelEnabled:false});
 },[]);
 useEffect(()=>()=>{materials.wood.map.dispose();Object.values(materials).forEach(m=>m.dispose());gable.dispose();},[materials,gable]);
 const {wood,trim,roof,door,glass,brass}=materials;
 const windowAt=(x,y,z,side=false)=><group key={`${x}-${z}`} position={[x,y,z]} rotation={[0,typeof side==='number'?side:side?Math.PI/2:0,0]}>
  <Box size={[.72,.83,.07]} at={[0,0,0]} material={trim}/>
  <Box size={[.59,.69,.025]} at={[0,0,.046]} material={glass}/>
  <Box size={[.035,.7,.045]} at={[0,0,.065]} material={trim}/>
  <Box size={[.6,.035,.045]} at={[0,0,.065]} material={trim}/>
  <Box size={[.86,.07,.17]} at={[0,-.45,.03]} material={trim}/>
  <Box size={[.74,.06,.15]} at={[0,.45,.02]} material={trim}/>
 </group>;
 return <group name="Warm woodland cottage" position={[c.x,c.y,c.z]} rotation={[0,c.angle,0]}>
  <Box size={[3.38,.24,2.7]} at={[0,.12,0]} material={trim}/>
  <Box size={[3.1,.04,2.4]} at={[0,.22,0]} material={wood}/>
  <Box size={[3.2,2.05,.14]} at={[0,1.23,-1.25]} material={wood}/>
  {[-1,1].map(side=><group key={`wall-${side}`}>
   <Box size={[.14,2.05,2.5]} at={[side*1.6,1.23,0]} material={wood}/>
   <Box size={[.9,2.05,.14]} at={[side*1.15,1.23,1.25]} material={wood}/>
  </group>)}
  <Box size={[1.4,.24,.14]} at={[0,2.13,1.25]} material={wood}/>
  {[-1.26,1.25].map(z=><mesh key={z} position={[0,2.25,z]} geometry={gable} material={wood} castShadow/>)}
  {[-1,1].map(side=><group key={side}>
   <Box size={[2.22,.16,3.15]} at={[side*.95,2.78,0]} rotation={[0,0,-side*.49]} material={roof}/>
   <Box size={[.13,2.2,.13]} at={[side*1.57,1.3,1.28]} material={trim}/>
   {Array.from({length:9},(_,i)=><Box key={i} size={[.025,.025,3.15]} at={[side*(.15+i*.205),3.37-(.15+i*.205)*.54,0]} material={trim}/>)}
  </group>)}
  <Box size={[.12,.14,3.25]} at={[0,3.32,0]} material={trim}/>
  {[-.72,.72].map(x=><Box key={x} size={[.08,1.94,.17]} at={[x,1.2,1.29]} material={trim}/>)}
  <Box size={[1.52,.09,.17]} at={[0,2.16,1.29]} material={trim}/>
  <group name="Cottage door" position={[-.68,0,1.34]} ref={doorLeaf}>
   <Box size={[1.36,1.82,.07]} at={[.68,1.15,0]} material={door}/>
   <Box size={[.38,.42,.08]} at={[.68,1.64,0]} material={glass}/>
   <Box size={[.025,.44,.09]} at={[.68,1.64,0]} material={trim}/>
   <mesh position={[1.2,1.05,.065]} material={brass}><sphereGeometry args={[.035,10,8]}/></mesh>
   <mesh position={[1.2,1.05,-.065]} material={brass}><sphereGeometry args={[.035,10,8]}/></mesh>
  </group>
  {windowAt(-1.18,1.42,1.29)}{windowAt(1.18,1.42,1.29)}{windowAt(1.63,1.42,-.15,true)}
  {windowAt(-1.18,1.42,1.16,Math.PI)}{windowAt(1.18,1.42,1.16,Math.PI)}{windowAt(1.5,1.42,-.15,-Math.PI/2)}
  <CottageInterior board={board} lastBlend={lastBlend}/>
  <Box size={[1.28,.17,.65]} at={[0,.16,1.5]} material={wood}/>
  <Box size={[1.45,.09,.33]} at={[0,.045,1.89]} material={trim}/>
  <pointLight position={[0,1.7,1.85]} color="#ffb45d" intensity={3} distance={6} decay={2}/>
  {/* Small wall lantern beside the door. */}
  <Box size={[.17,.26,.13]} at={[.84,1.88,1.42]} material={trim}/>
  <Box size={[.105,.17,.145]} at={[.84,1.88,1.43]} material={glass}/>
  <Box size={[.23,.045,.21]} at={[.84,2.03,1.42]} material={roof}/>
  {/* A freestanding wooden mailbox with a rounded roof and raised red flag. */}
  <group name="Cottage mailbox" position={[2.25,0,1.4]}>
   <Box size={[.105,1.04,.105]} at={[0,.52,0]} material={trim}/>
   <Box size={[.45,.29,.52]} at={[0,1.11,0]} material={wood}/>
   <mesh position={[0,1.255,0]} rotation={[-Math.PI/2,0,0]} material={roof} castShadow><cylinderGeometry args={[.245,.245,.57,20,1,false,0,Math.PI]}/></mesh>
   <Box size={[.32,.035,.025]} at={[0,1.16,.275]} material={trim}/>
   <Box size={[.36,.045,.03]} at={[0,.97,.28]} material={trim}/>
   <mesh position={[0,1.02,.298]} material={brass}><sphereGeometry args={[.022,8,6]}/></mesh>
   <Box size={[.025,.29,.035]} at={[.255,1.3,0]} material={brass}/>
   <mesh position={[.31,1.415,0]}><boxGeometry args={[.13,.09,.025]}/><meshStandardMaterial color="#bc6651" roughness={.8}/></mesh>
  </group>
 </group>;
}
