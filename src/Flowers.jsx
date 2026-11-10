import {buildAromaPlant} from './aromaGeometry.js';
import {useMemo,useRef,useEffect} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {FLOWERS,makeFlowerPatches} from './flowers.js';
import {randomGenerator} from './world';

function plantGeometry(type){
 const rand=randomGenerator(type+61), green=[],petals=[],centres=[],species=FLOWERS[type];
 const add=(list,geo,p,s,r=[0,0,0])=>{const m=new THREE.Matrix4().compose(new THREE.Vector3(...p),new THREE.Quaternion().setFromEuler(new THREE.Euler(...r)),new THREE.Vector3(...s));geo.applyMatrix4(m);list.push(geo);};
 const ball=(list,p,s,r)=>add(list,new THREE.SphereGeometry(1,8,6),p,s,r);
 const stem=(x,z,h)=>add(green,new THREE.CylinderGeometry(.012,.022,1,5),[x,h/2,z],[1,h,1]);
 const daisy=(x,y,z,radius,count,colorIndex=0)=>{
 ball(centres,[x,y,z],[radius*.24,.065,radius*.24]);
 for(let j=0;j<count;j++){const a=j/count*Math.PI*2;ball(petals,[x+Math.cos(a)*radius*.57,y-.015,z+Math.sin(a)*radius*.57],[radius*.55,.035,radius*.19],[0,-a,0]);}
 };
 const aroma=species.collection==='aroma50'||species.collection==='perfumeGarden';
 if(aroma)buildAromaPlant(species,{green,petals,centres,add,ball,stem,rand});
 const special=aroma||['fern','moss','mushroom'].includes(species.kind);
 if(species.kind==='mushroom')for(let i=0;i<7;i++){
 const a=i*2.4,r=.44*Math.sqrt(i/7),x=Math.cos(a)*r,z=Math.sin(a)*r,h=.14+rand()*.17,cap=.085+rand()*.065;
 add(green,new THREE.CylinderGeometry(.012,.021,h,8),[x,h/2,z],[1,1,1]);
 const profile=[new THREE.Vector2(0,cap*.65),new THREE.Vector2(cap*.22,cap*.64),new THREE.Vector2(cap*.48,cap*.52),new THREE.Vector2(cap*.72,cap*.31),new THREE.Vector2(cap*.9,cap*.1),new THREE.Vector2(cap,-cap*.06)];
 add(petals,new THREE.LatheGeometry(profile,24),[x,h,z],[1,1,1]);
 ball(green,[x,h-cap*.06,z],[cap*.97,.009,cap*.97]);
 for(let j=0;j<14;j++){const angle=j*Math.PI/7;
 add(centres,new THREE.CylinderGeometry(.0015,.0015,cap*.8,3),[x+Math.cos(angle)*cap*.5,h-cap*.065,z+Math.sin(angle)*cap*.5],[1,1,1],[Math.sin(angle)*Math.PI/2,0,-Math.cos(angle)*Math.PI/2]);}
 }
 if(species.kind==='moss'){
 for(let i=0;i<24;i++){const a=i*2.4,r=.78*Math.sqrt(i/24);ball(green,[Math.cos(a)*r,.02+rand()*.035,Math.sin(a)*r],[.15+rand()*.14,.06+rand()*.06,.17+rand()*.12]);}
 for(let i=0;i<180;i++){const a=rand()*6.28,r=Math.sqrt(rand())*.9;add(petals,new THREE.ConeGeometry(.014,.065+rand()*.04,3),[Math.cos(a)*r,.09,Math.sin(a)*r],[1,1,1]);}
 }
 if(species.kind==='fern'){
 const vertices=[];
 for(let i=0;i<11;i++){const a=i*2.399,length=.65+rand()*.35;
 const p=t=>new THREE.Vector3(Math.cos(a)*t*length,Math.sin(t*Math.PI*.9)*.6,Math.sin(a)*t*length);
 const curve=new THREE.CatmullRomCurve3(Array.from({length:9},(_,j)=>p(j/8)));green.push(new THREE.TubeGeometry(curve,10,.009,4,false));
 for(let j=1;j<12;j++){const t=j/12,origin=p(t),next=p(t+.04),width=.13*Math.sin(t*Math.PI);for(const side of [-1,1]){const tip=origin.clone().add(new THREE.Vector3(-Math.sin(a)*width*side+Math.cos(a)*.035,-.025,Math.cos(a)*width*side+Math.sin(a)*.035));vertices.push(origin.x,origin.y,origin.z,tip.x,tip.y,tip.z,next.x,next.y,next.z);}}
 }
 const fronds=new THREE.BufferGeometry();fronds.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));fronds.computeVertexNormals();green.push(fronds);
 }
 const tree=['citrus','fruit','ribbon'].includes(species.kind);
 if(tree)add(green,new THREE.CylinderGeometry(.035,.07,1.25,7),[0,.625,0],[1,1,1]);
 const count=special?0:species.kind==='grass'?32:tree?7:species.kind==='spike'?17:species.kind==='cluster'?5:species.kind==='mix'?18:species.kind==='sun'?5:9;
 for(let i=0;i<count;i++){
 const a=i*2.399, spread=species.kind==='cluster'?.45:.62,x=Math.cos(a)*spread*Math.sqrt(i/count),z=Math.sin(a)*spread*Math.sqrt(i/count);
 const h=(['violet','anemone','berry'].includes(species.kind)?.18:tree?1.15:species.kind==='grass'?1:species.kind==='sun'?1.15:species.kind==='pansy'?.35:species.kind==='cluster'?.7:.65)+rand()*.4;
 if(species.kind==='grass'){
 const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(x*.2,0,z*.2),new THREE.Vector3(x*.5,h*.85,z*.5),new THREE.Vector3(x*1.25,h*.85,z*1.25));
 const vertices=[];for(let j=0;j<10;j++){const p=curve.getPoint(j/10),q=curve.getPoint((j+1)/10),w=.022*(1-j/10);vertices.push(p.x-w,p.y,p.z,p.x+w,p.y,p.z,q.x,q.y,q.z);}
 const blade=new THREE.BufferGeometry();blade.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));blade.computeVertexNormals();green.push(blade);
 if(i%5===0)ball(petals,[x*1.25,h*.85,z*1.25],[.018,.1,.018]);continue;
 }
 if(tree){
 const from=new THREE.Vector3(0,.85,0),to=new THREE.Vector3(x,h,z),direction=to.clone().sub(from),branch=new THREE.CylinderGeometry(.012,.025,direction.length(),5);branch.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize()));branch.translate((from.x+to.x)/2,(from.y+to.y)/2,(from.z+to.z)/2);green.push(branch);
 for(let j=0;j<7;j++){const b=j*2.4;ball(green,[x+Math.cos(b)*.14,h-.1+Math.sin(b)*.12,z+Math.sin(b)*.15],[.16,.035,.065],[.3,b,.25]);}
 }else stem(x,z,h);
 if(species.kind==='needles'){
 for(let j=0;j<12;j++)for(const side of [-1,1])ball(green,[x+side*.075,h*j/14,z],[.105,.013,.014],[0,a,side*.5]);
 for(let j=0;j<4;j++)ball(petals,[x+.025,h-j*.06,z],[.035,.025,.03]);continue;
 }
 if(species.kind==='herb'){
 for(let j=0;j<5;j++)for(const side of [-1,1])ball(green,[x+side*.12,h*(.2+j*.14),z],[.2,.028,.12],[.15,a+side,.2]);
 for(let j=0;j<6;j++)ball(petals,[x,h+j*.035,z],[.025,.025,.025]);continue;
 }
 for(let j=0;j<(tree?0:3);j++){const angle=a+j*2.4;ball(green,[x+Math.cos(angle)*.12,h*(.23+j*.16),z+Math.sin(angle)*.12],[species.kind==='cup'?.075:.16,.026,species.kind==='cup'?.4:.075],[species.kind==='cup'?-.65:.2,angle,.3]);}
 if(species.kind==='fruit'){
 ball(petals,[x,h-.1,z],[.11,.13,.11]);
 }else if(species.kind==='ribbon'){
 for(let j=0;j<6;j++){const b=j*Math.PI/3;ball(petals,[x+Math.cos(b)*.12,h-.1,z+Math.sin(b)*.12],[.18,.026,.036],[.5,-b,.3]);}ball(centres,[x,h,z],[.035,.035,.035]);
 }else if(species.kind==='iris'){
 for(let j=0;j<3;j++){const b=j*Math.PI*2/3;ball(petals,[x+Math.cos(b)*.12,h-.04,z+Math.sin(b)*.12],[.19,.045,.1],[.5,-b,.25]);ball(petals,[x+Math.cos(b)*.055,h+.12,z+Math.sin(b)*.055],[.09,.17,.045],[0,-b,.2]);}
 ball(centres,[x,h,z],[.045,.03,.045]);for(let j=0;j<3;j++)ball(green,[x+(j-1)*.08,h*.3,z],[.04,h*.45,.018],[0,a,(j-1)*.2]);
 }else if(species.kind==='violet'){
 for(let j=0;j<5;j++){const a=j*Math.PI*2/5;ball(petals,[x+Math.cos(a)*.065,h,z+Math.sin(a)*.065],[.075,.025,.06],[0,-a,0]);}ball(centres,[x,h+.015,z],[.02,.018,.02]);
 }else if(species.kind==='anemone'||species.kind==='berry'){
 daisy(x,h,z,.13,species.kind==='berry'?5:6);
 if(species.kind==='berry'){ball(centres,[x+.05,.12,z+.06],[.045,.065,.045]);}
 }else if(species.kind==='star'||species.kind==='citrus'){
 daisy(x,h,z,species.kind==='star'?.14:.12,5);
 }else if(species.kind==='spike'){
 for(let j=0;j<7;j++)for(let k=0;k<3;k++){const angle=k*2.094+j*.8,r=.065*(1-j/10);ball(petals,[x+Math.cos(angle)*r,h+j*.055,z+Math.sin(angle)*r],[.042,.06,.04]);}
 }else if(species.kind==='cluster'){
 for(let j=0;j<24;j++){const yy=1-j/12,rr=Math.sqrt(Math.max(0,1-yy*yy)),angle=j*2.399;const cx=x+Math.cos(angle)*rr*.25,cy=h+yy*.23,cz=z+Math.sin(angle)*rr*.25;for(let k=0;k<4;k++){const b=k*Math.PI/2;ball(petals,[cx+Math.cos(b)*.045,cy,cz+Math.sin(b)*.045],[.045,.025,.04]);}}
 }else if(species.kind==='cup'||species.kind==='bell'){
 const bell=species.kind==='bell';for(let j=0;j<6;j++){const a=j*Math.PI/3;ball(petals,[x+Math.cos(a)*.075,h+(bell?-.06:.07),z+Math.sin(a)*.075],[.075,bell?.13:.18,.055],[bell?.3:-.25,a,0]);}if(bell)ball(centres,[x,h-.18,z],[.04,.025,.04]);
 }else if(species.kind==='rose'){
 for(let layer=0;layer<3;layer++)for(let j=0;j<7;j++){const a=j*Math.PI*2/7+layer*.5,r=.15-layer*.045;ball(petals,[x+Math.cos(a)*r*.65,h+layer*.035,z+Math.sin(a)*r*.65],[r*.8,.06,r*.48],[.3,-a,.3]);}
 }else if(species.kind==='pansy'){
 for(let j=0;j<5;j++){const a=j*Math.PI*2/5;ball(j<2?centres:petals,[x+Math.cos(a)*.1,h,z+Math.sin(a)*.1],[.12,.035,.1],[0,-a,0]);}ball(centres,[x,h+.025,z],[.035,.025,.035]);
 }else daisy(x,h,z,species.kind==='sun'?.27:species.kind==='mix'?.1:.17,species.kind==='sun'?16:species.kind==='cosmos'?8:12);
 }
 if(type===9)petals.forEach((g,i)=>{const color=new THREE.Color(['#ffd36b','#ff99c3','#b89cff','#fff3cf'][Math.floor(i/12)%4]),values=[];for(let j=0;j<g.attributes.position.count;j++)values.push(color.r,color.g,color.b);g.setAttribute('color',new THREE.Float32BufferAttribute(values,3));});
 const merge=list=>{if(!list.length)ball(list,[0,0,0],[.001,.001,.001]);
 const needsNonIndexed=list.some(g=>!g.index),prepared=list.map(g=>{const result=needsNonIndexed&&g.index?g.toNonIndexed():g;if(!result.attributes.uv)result.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(result.attributes.position.count*2),2));return result;});
 const merged=mergeGeometries(prepared);new Set([...list,...prepared]).forEach(g=>g.dispose());if(!merged)throw new Error('Could not build '+species.name+' geometry');return merged;};
 return [merge(green),merge(petals),merge(centres)];
}
function haloTexture(){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d'),g=ctx.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,.5)');g.addColorStop(.25,'rgba(255,255,255,.2)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);}
function Species({type,patches,halo}){
 const refs=useRef([]),sprites=useRef([]),dummy=useMemo(()=>new THREE.Object3D(),[]);
 const geometries=useMemo(()=>plantGeometry(type),[type]);
 useEffect(()=>()=>geometries.forEach(g=>g.dispose()),[geometries]);
 useFrame(({clock})=>{const time=clock.elapsedTime;patches.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(Math.sin(time*.8+p.phase)*.018*(FLOWERS[type].wind??1),p.phase,Math.sin(time+p.phase)*.025*(FLOWERS[type].wind??1));dummy.scale.setScalar(p.scale||1);dummy.updateMatrix();refs.current.forEach(mesh=>mesh?.setMatrixAt(i,dummy.matrix));if(sprites.current[i])sprites.current[i].material.opacity=(FLOWERS[type].haloOpacity??.35)+Math.sin(time*1.4+p.phase)*.04;});refs.current.forEach(mesh=>{if(mesh)mesh.instanceMatrix.needsUpdate=true;});});
 return <><instancedMesh ref={r=>{refs.current[0]=r;}} args={[geometries[0],null,patches.length]} frustumCulled={false}><meshStandardMaterial color={FLOWERS[type].groundColor||'#598844'} roughness={.8} side={THREE.DoubleSide}/></instancedMesh><instancedMesh ref={r=>{refs.current[1]=r;}} args={[geometries[1],null,patches.length]} frustumCulled={false}><meshStandardMaterial vertexColors={type===9} color={type===9?'#ffffff':FLOWERS[type].color} emissive={type===9?'#554331':FLOWERS[type].color} emissiveIntensity={FLOWERS[type].emission??(['moss','fern','mushroom'].includes(FLOWERS[type].kind)?.08:.7)} roughness={.45} side={THREE.DoubleSide}/></instancedMesh><instancedMesh ref={r=>{refs.current[2]=r;}} args={[geometries[2],null,patches.length]} frustumCulled={false}><meshStandardMaterial color={FLOWERS[type].centreColor||(type===6?'#634021':'#ffe49a')} emissive={FLOWERS[type].centreColor||(type===6?'#ad621a':'#ffd270')} emissiveIntensity={FLOWERS[type].kind==='mushroom'?.02:.3}/></instancedMesh>{patches.filter(p=>FLOWERS[type].kind==='lotus'&&!p.ambient).map(p=><mesh key={'pond-'+p.id} position={[p.x,p.y+.025,p.z]}><cylinderGeometry args={[1,1,.035,32]}/><meshStandardMaterial color="#42706b" roughness={.22} metalness={.15}/></mesh>)}{patches.map((p,i)=>!p.ambient&&<sprite key={p.id} ref={r=>{sprites.current[i]=r;}} position={[p.x,p.y+(FLOWERS[type].targetHeight??.85)*p.scale,p.z]} scale={[2.7,2.7,1]}><spriteMaterial map={halo} color={FLOWERS[type].color} transparent opacity={.35} blending={THREE.AdditiveBlending} depthWrite={false}/></sprite>)}</>;
}
export default function Flowers({world,locked,onAim,onDiscover}){
 const patches=useMemo(()=>makeFlowerPatches(world),[world]);
 const halo=useMemo(haloTexture,[]),{camera,gl}=useThree(),target=useRef(null),previous=useRef(null),ray=useMemo(()=>new THREE.Ray(),[]),sphere=useMemo(()=>new THREE.Sphere(),[]),hit=useMemo(()=>new THREE.Vector3(),[]),direction=useMemo(()=>new THREE.Vector3(),[]);
 useEffect(()=>()=>halo.dispose(),[halo]);
 useFrame(()=>{let closest=null,distance=5;camera.getWorldDirection(direction);ray.set(camera.position,direction);if(locked)for(const p of patches){sphere.center.set(p.x,p.y+(FLOWERS[p.type].targetHeight??.8)*p.scale,p.z);sphere.radius=p.footprint;if(ray.intersectSphere(sphere,hit)){const d=hit.distanceTo(camera.position);if(d<distance){closest=p;distance=d;}}}target.current=closest;if(previous.current!==closest?.id){previous.current=closest?.id;onAim(closest?FLOWERS[closest.type]:null);}});
 useEffect(()=>{const click=()=>{if(!locked||!target.current)return;onDiscover(FLOWERS[target.current.type]);document.exitPointerLock();};gl.domElement.addEventListener('click',click);return()=>gl.domElement.removeEventListener('click',click);},[locked,gl,onDiscover]);
 return <group>{FLOWERS.map((_,type)=><Species key={type} type={type} patches={patches.filter(p=>p.type===type)} halo={halo}/>)}</group>;
}
