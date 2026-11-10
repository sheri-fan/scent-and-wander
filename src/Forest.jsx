import Flowers from './Flowers.jsx';
import { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { groundHeight, pathX, randomGenerator, resolveMovement } from './world';
const dummy=new THREE.Object3D();
function Instances({geometry, material, items, shadow=false}) {
 const ref=useRef();
 useEffect(()=>{items.forEach((p,i)=>{dummy.position.set(...p.p);dummy.rotation.set(...(p.r||[0,0,0]));dummy.scale.set(...p.s);dummy.updateMatrix();ref.current.setMatrixAt(i,dummy.matrix);if(p.c)ref.current.setColorAt(i,new THREE.Color(p.c));});ref.current.instanceMatrix.needsUpdate=true;if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true;},[items]);
 return <instancedMesh ref={ref} args={[geometry,material,items.length]} castShadow={shadow} receiveShadow frustumCulled={false}/>;
}
function texture(kind) {
 const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d'),rand=randomGenerator(44);
 ctx.fillStyle=kind==='bark'?'#6b6650':'#5c6140';ctx.fillRect(0,0,256,256);
 for(let i=0;i<12000;i++){const v=rand();ctx.fillStyle=kind==='bark'?`rgba(${v>.5?'29,31,23':'157,144,104'},${rand()*.38})`:`rgba(${v>.5?'31,45,23':'179,157,105'},${rand()*.3})`;ctx.fillRect(rand()*256,rand()*256,kind==='bark'?1+rand()*3:1+rand()*5,kind==='bark'?5+rand()*65:1+rand()*4);}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;if(kind==='ground')t.repeat.set(65,65);return t;
}
function Vegetation({world}) {
 const data=useMemo(()=>{
 const rand=randomGenerator(875),trunks=[],branches=[],crowns=[],grass=[],ferns=[],rocks=[],logs=[];
 const bark=new THREE.MeshStandardMaterial({map:texture('bark'),roughness:1});
 const leafCanvas=document.createElement('canvas');leafCanvas.width=leafCanvas.height=256;
 const leafContext=leafCanvas.getContext('2d');
 for(let i=0;i<520;i++){const x=rand()*256,y=rand()*256;leafContext.save();leafContext.translate(x,y);leafContext.rotate(rand()*6.28);leafContext.fillStyle=['#a2ac74','#8c9b61','#c0bb84','#697d4e'][i%4];leafContext.beginPath();leafContext.ellipse(0,0,3+rand()*5,1.5+rand()*3,0,0,Math.PI*2);leafContext.fill();leafContext.restore();}
 const leafMap=new THREE.CanvasTexture(leafCanvas);leafMap.colorSpace=THREE.SRGBColorSpace;leafMap.wrapS=leafMap.wrapT=THREE.RepeatWrapping;leafMap.repeat.set(3,2);
 const leaf=new THREE.MeshStandardMaterial({map:leafMap,alphaTest:.45,side:THREE.DoubleSide,color:'#acb886',roughness:1});
 const stone=new THREE.MeshStandardMaterial({color:'#828777',roughness:1});
 const grassMat=new THREE.MeshStandardMaterial({color:'#75844a',side:THREE.DoubleSide,roughness:1});
 grassMat.onBeforeCompile=shader=>{shader.uniforms.uTime={value:0};grassMat.userData.shader=shader;shader.vertexShader='uniform float uTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n transformed.x += sin(uTime * 1.3 + instanceMatrix[3].x * .8 + instanceMatrix[3].z * .5) * .1 * position.y;');};
 world.trees.forEach(t=>{
 trunks.push({p:[t.x,t.y+t.h/2,t.z],s:[t.r,t.h,t.r],r:[.015*Math.sin(t.seed*10),t.seed*6,.025*Math.cos(t.seed*10)],c:t.seed>.5?'#a7a18a':'#797e65'});
 // Radial branches and overlapping irregular foliage create a continuous high canopy.
 for(let j=0;j<7;j++){const a=j*2.4+t.seed*9, y=t.y+t.h*(.56+j*.055), reach=2.2+rand()*2.6;
 branches.push({p:[t.x+Math.cos(a)*reach*.43,y+.5,t.z+Math.sin(a)*reach*.43],s:[t.r*.32,reach*1.2,t.r*.32],r:[Math.sin(a)*.95,0,-Math.cos(a)*.95]});
 crowns.push({p:[t.x+Math.cos(a)*reach*.7,y+1.4,t.z+Math.sin(a)*reach*.7],s:[2.1+rand()*1.8,.8+rand()*1.2,2+rand()*1.5],r:[rand(),a,rand()],c:['#526b36','#6f8046','#415e34','#89904f'][j%4]});}
 });
 for(let i=0;i<19000;i++){const x=(rand()-.5)*180,z=(rand()-.5)*180,dist=Math.abs(x-pathX(z));if(dist<2+rand()*.9||x*x+z*z>91**2)continue;let h=.2+rand()*.65;grass.push({p:[x,groundHeight(x,z),z],s:[.3+rand()*.5,h,.3+rand()*.5],r:[0,rand()*6.28,0],c:['#718343','#536a36','#899451','#425a30'][i%4]});}
 for(let i=0;i<1200;i++){const x=(rand()-.5)*160,z=(rand()-.5)*160;if(Math.abs(x-pathX(z))<3)continue;const h=.45+rand()*.7;ferns.push({p:[x,groundHeight(x,z),z],s:[h,h,h],r:[0,rand()*6.28,0],c:i%2?'#557638':'#7f9146'});}
 world.rocks.forEach(r=>rocks.push({p:[r.x,r.y+r.r*.3,r.z],s:[r.r,r.r*.68,r.r*.8],r:[.1,r.a,.2],c:'#7b8070'}));
 world.logs.forEach(l=>logs.push({p:[l.x,l.y+.24,l.z],s:[.24,l.length,.24],r:[Math.PI/2,0,-l.a]}));
 const blade=new THREE.BufferGeometry();blade.setAttribute('position',new THREE.Float32BufferAttribute([-.05,0,0,.05,0,0,.015,.65,.025, .05,0,0,.08,.43,0,.015,.65,.025, 0,0,-.05,0,0,.05,.025,.55,.01],3));blade.computeVertexNormals();
 const fern=new THREE.BufferGeometry(),v=[];for(let a=0;a<7;a++){const angle=a*Math.PI*2/7;for(let j=0;j<8;j++){const t=j/8, u=(j+1)/8;const p=new THREE.Vector3(Math.cos(angle)*t*.9,Math.sin(t*Math.PI)*.65,Math.sin(angle)*t*.9);const q=new THREE.Vector3(Math.cos(angle)*u*.9,Math.sin(u*Math.PI)*.65,Math.sin(angle)*u*.9);const width=(1-t)*.19;for(const sign of [-1,1])v.push(p.x,p.y,p.z,q.x,q.y,q.z,p.x-Math.sin(angle)*width*sign,p.y-.05,p.z+Math.cos(angle)*width*sign);}}fern.setAttribute('position',new THREE.Float32BufferAttribute(v,3));fern.computeVertexNormals();
 return {trunks,branches,crowns,grass,ferns,rocks,logs,bark,leaf,stone,grassMat,blade,fern,trunk:new THREE.CylinderGeometry(.68,1,1,9,3),branch:new THREE.CylinderGeometry(.3,1,1,6),crown:new THREE.SphereGeometry(1,9,7),rock:new THREE.IcosahedronGeometry(1,1)};
 },[world]);
 useEffect(()=>()=>{[data.bark,data.leaf,data.stone,data.grassMat,data.blade,data.fern,data.trunk,data.branch,data.crown,data.rock].forEach(x=>x.dispose());data.bark.map.dispose();data.leaf.map.dispose();},[data]);
 useFrame(({clock})=>{if(data.grassMat.userData.shader)data.grassMat.userData.shader.uniforms.uTime.value=clock.elapsedTime;});
 return <><Instances geometry={data.trunk} material={data.bark} items={data.trunks} shadow/><Instances geometry={data.branch} material={data.bark} items={data.branches}/><Instances geometry={data.crown} material={data.leaf} items={data.crowns} shadow/><Instances geometry={data.blade} material={data.grassMat} items={data.grass}/><Instances geometry={data.fern} material={data.grassMat} items={data.ferns}/><Instances geometry={data.rock} material={data.stone} items={data.rocks} shadow/><Instances geometry={data.branch} material={data.bark} items={data.logs} shadow/></>;
}
function Ground() {
 const geometry=useMemo(()=>{const g=new THREE.PlaneGeometry(240,240,150,150);g.rotateX(-Math.PI/2);const pos=g.attributes.position;for(let i=0;i<pos.count;i++)pos.setY(i,groundHeight(pos.getX(i),pos.getZ(i)));g.computeVertexNormals();return g;},[]);
 const map=useMemo(()=>texture('ground'),[]);
 const path=useMemo(()=>{const v=[],uv=[];for(let i=0;i<240;i++){const z=-110+i;for(const dz of [0,1])for(const side of [-1,1]){const zz=z+dz,x=pathX(zz)+side*(2.05+.22*Math.sin(zz*.3));v.push(x,groundHeight(x,zz)+.018,zz);uv.push(side*.5+.5,zz*.25);}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));const idx=[];for(let i=0;i<240;i++){const a=i*4;idx.push(a,a+2,a+1,a+1,a+2,a+3);}g.setIndex(idx);g.computeVertexNormals();return g;},[]);
 return <><mesh geometry={geometry} receiveShadow><meshStandardMaterial map={map} color="#8a9165" roughness={1}/></mesh><mesh geometry={path} receiveShadow><meshStandardMaterial color="#a69670" map={map} roughness={1} side={THREE.DoubleSide}/></mesh></>;
}
function Walker({world,locked,onLock,onUnlock}) {
 const keys=useRef({}), velocity=useRef(new THREE.Vector2()),{camera,gl}=useThree();
 useEffect(()=>{const down=e=>{keys.current[e.code]=true;if(['KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight'].includes(e.code))e.preventDefault();},up=e=>keys.current[e.code]=false,blur=()=>{keys.current={};velocity.current.set(0,0);};window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);};},[]);
 useEffect(()=>{keys.current={};velocity.current.set(0,0);},[locked]);
 useFrame((state,delta)=>{if(!locked)return;const dt=Math.min(delta,.05),k=keys.current;const input=new THREE.Vector2(Number(!!k.KeyD)-Number(!!k.KeyA),Number(!!k.KeyS)-Number(!!k.KeyW)).normalize();const speed=k.ShiftLeft||k.ShiftRight?5.5:2.6;velocity.current.lerp(input.multiplyScalar(speed),1-Math.exp(-10*dt));const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();const right=new THREE.Vector3().crossVectors(forward,camera.up);const dx=(right.x*velocity.current.x-forward.x*velocity.current.y)*dt,dz=(right.z*velocity.current.x-forward.z*velocity.current.y)*dt;const [x,z]=resolveMovement(camera.position.x,camera.position.z,dx,dz,world.colliders);camera.position.x=x;camera.position.z=z;const walking=velocity.current.length();camera.position.y=groundHeight(x,z)+1.7+Math.sin(state.clock.elapsedTime*8)*.017*Math.min(walking,1);});
 useEffect(()=>{
 const canvas=gl.domElement,button=document.getElementById('enter-forest');
 const fail=()=>document.dispatchEvent(new Event('pointerlockerror'));
 const enter=()=>{try{const promise=canvas.requestPointerLock();promise?.catch(fail);}catch{fail();}};
 const change=()=>{if(document.pointerLockElement===canvas)onLock();else onUnlock();};
 const look=e=>{if(document.pointerLockElement!==canvas)return;const rotation=new THREE.Euler().setFromQuaternion(camera.quaternion,'YXZ');rotation.y-=e.movementX*.002;rotation.x=THREE.MathUtils.clamp(rotation.x-e.movementY*.002,-Math.PI/2+.03,Math.PI/2-.03);camera.quaternion.setFromEuler(rotation);};
 button?.addEventListener('click',enter);document.addEventListener('pointerlockchange',change);document.addEventListener('mousemove',look);
 return()=>{button?.removeEventListener('click',enter);document.removeEventListener('pointerlockchange',change);document.removeEventListener('mousemove',look);};
 },[gl,camera,onLock,onUnlock,locked]);
 return null;
}
function Motes(){const points=useMemo(()=>{const rand=randomGenerator(9);return new Float32Array(Array.from({length:1000*3},(_,i)=>(rand()-.5)*(i%3===1?18:120)+(i%3===1?8:0)));},[]);const ref=useRef();useFrame((_,dt)=>{ref.current.rotation.y+=dt*.002;});return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[points,3]}/></bufferGeometry><pointsMaterial color="#f0dfaa" size={.035} transparent opacity={.5} depthWrite={false}/></points>;}
export default function Forest({world,locked,onLock,onUnlock,quality,onAim,onDiscover}) {
 return <><color attach="background" args={['#b7c5a3']}/><fogExp2 attach="fog" args={['#a9b89a',.018]}/><Sky distance={450000} sunPosition={[50,28,-60]} inclination={.5} azimuth={.25} turbidity={6} rayleigh={1.1}/><hemisphereLight args={['#e5ead4','#38442c',1.6]}/><directionalLight position={[24,32,-35]} color="#fff0c4" intensity={3.2} castShadow shadow-mapSize={[quality==='high'?2048:1024,quality==='high'?2048:1024]} shadow-camera-left={-36} shadow-camera-right={36} shadow-camera-top={36} shadow-camera-bottom={-36} shadow-camera-far={110} shadow-normalBias={.07} shadow-bias={-.0002}><object3D attach="target" position={[0,0,0]}/></directionalLight><Ground/><Vegetation world={world}/><Motes/><Flowers world={world} locked={locked} onAim={onAim} onDiscover={onDiscover}/><Walker world={world} locked={locked} onLock={onLock} onUnlock={onUnlock}/></>;
}
