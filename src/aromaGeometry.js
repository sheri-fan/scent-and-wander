import * as THREE from 'three';
// Curved petal surfaces provide distinct silhouettes without downloaded assets.
export function buildAromaPlant(species,{green,petals,centres,add,ball,stem,rand}){
 const kind=species.kind,tree=kind.includes('Tree'),flowerCount=species.stems||5;
 function segment(list,from,to,radius=.009){const a=new THREE.Vector3(...from),b=new THREE.Vector3(...to),d=b.clone().sub(a),g=new THREE.CylinderGeometry(radius*.7,radius,d.length(),5);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate(...a.add(b).multiplyScalar(.5).toArray());list.push(g);}
 function petal(list,x,y,z,length,width,angle,lift=0,curl=.035){
 const positions=[],uv=[],indices=[],rows=6;
 for(let j=0;j<=rows;j++){const t=j/rows,w=Math.sin(t*Math.PI)**.7*width;
 for(let k=0;k<3;k++){const side=k-1,d=t*length;positions.push(x+Math.cos(angle)*d-Math.sin(angle)*side*w,y+lift*t+curl*t*t+(side===0?.018*Math.sin(t*Math.PI):0),z+Math.sin(angle)*d+Math.cos(angle)*side*w);uv.push(t,k/2);}}
 for(let j=0;j<rows;j++)for(let k=0;k<2;k++){const a=j*3+k;indices.push(a,a+3,a+1,a+1,a+3,a+4);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();list.push(g);
 }
 function radial(x,y,z,r=.16,count=5,layers=1,lift=.025){for(let l=0;l<layers;l++)for(let j=0;j<count;j++)petal(petals,x,y+l*.018,z,r*(1-l*.16),r*.32,j*Math.PI*2/count+l*.45,lift,.015);}
 function cluster(x,y,z,r=.2,number=18){for(let j=0;j<number;j++){const a=j*2.4,d=r*Math.sqrt(j/number);radial(x+Math.cos(a)*d,y+.06*Math.cos(d/r*Math.PI*.5),z+Math.sin(a)*d,.037,4);}}
 function tube(x,y,z,length,radius,dir=[0,1,0]){const points=[];for(let j=0;j<=8;j++){const t=j/8;points.push(new THREE.Vector2(.014+radius*t*t,length*t));}const g=new THREE.LatheGeometry(points,12);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(...dir).normalize()));g.translate(x,y,z);petals.push(g);}
 function leaves(x,z,h,n=4){for(let j=0;j<n;j++){const a=j*2.4;petal(green,x,h*(.18+j*.12),z,tree?.25:.19,.055,a,.035,-.045);}}
 if(kind==='woodPieces'){
  // Bark-free, split heartwood billets, rather than another intact tree trunk.
  const section=new THREE.Shape();
  section.moveTo(-.075,-.055);section.lineTo(.07,-.06);section.lineTo(.095,.015);
  section.lineTo(.035,.08);section.lineTo(-.07,.065);section.closePath();
  for(const [x,y,z,length,angle] of [[-.06,.085,-.14,.88,.12],[.05,.095,.12,.73,-.17],[-.02,.235,-.015,.79,.3]]){
   const rotation=[0,Math.PI/2+angle,0],position=[x,y,z];
   const body=new THREE.ExtrudeGeometry(section,{depth:length,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.008,bevelThickness:.012});
   body.translate(0,0,-length/2);add(green,body,position,[1,1,1],rotation);
   for(const side of [-1,1]){
    const cap=new THREE.ShapeGeometry(section);cap.translate(0,0,side*(length/2+.013));
    add(petals,cap,position,[1,1,1],rotation);
    for(let ring=1;ring<4;ring++){
     const g=new THREE.TorusGeometry(ring*.019,.0013,3,28);g.scale(1,.65,1);g.translate(0,0,side*(length/2+.014));
     add(centres,g,position,[1,1,1],rotation);
    }
   }
   for(let j=0;j<7;j++){
    const cx=-.062+j*.02,points=[];
    for(let k=0;k<7;k++){
     const gx=cx+.002*Math.sin(k*1.1+j);
     const surface=gx<=.035?.065+(gx+.07)/.105*.015:.08-(gx-.035)/.06*.065;
     points.push(new THREE.Vector3(gx,surface+.002,k/6*(length-.035)-(length-.035)/2));
    }
    add(centres,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),16,.0016,3,false),position,[1,1,1],rotation);
   }
  }
  return;
 }
 if(kind==='woodLog'){
  const y=.19,length=1.12,radius=.17;
  add(green,new THREE.CylinderGeometry(radius*.94,radius,length,24),[0,y,0],[1,1,1],[0,0,-Math.PI/2]);
  for(const side of [-1,1]){
   const x=side*(length/2+.002);
   add(petals,new THREE.CylinderGeometry(radius*.94,radius*.94,.006,32),[x,y,0],[1,1,1],[0,0,-Math.PI/2]);
   for(let ring=1;ring<=6;ring++)add(centres,new THREE.TorusGeometry(radius*ring/7,.002,3,40),[x+side*.005,y,0],[1,1,.93],[0,Math.PI/2,0]);
   for(const a of [.8,3.7])segment(centres,[x+side*.009,y+Math.cos(a)*.075,Math.sin(a)*.075],[x+side*.009,y+Math.cos(a)*.15,Math.sin(a)*.15],.0025);
  }
  for(let i=0;i<16;i++){
   const a=i*Math.PI/8,cy=y+Math.cos(a)*radius*.99,z=Math.sin(a)*radius*.99;
   segment(centres,[-.5,cy,z],[-.07,cy+.003,z],.003);
   segment(centres,[.02,cy+.003,z],[.48,cy,z],.003);
  }
  return;
 }
 if(tree)segment(green,[0,0,0],[0,1.25,0],.04);
 if(kind==='coniferTree'){
  for(let level=0;level<7;level++){
   const y=.3+level*.17,reach=.54*(1-level/8);
   for(let j=0;j<6;j++){
    const a=j*Math.PI/3+level*.65,tip=[Math.cos(a)*reach,y-.06,Math.sin(a)*reach];
    segment(green,[0,y,0],tip,.009);
    for(let k=1;k<=5;k++){
     const t=k/5,x=tip[0]*t,z=tip[2]*t;
     for(const side of [-1,1]){
      const angle=a+side*.65;
      petal(green,x,y-.06*t,z,.12*(1-t*.4),species.name==='Taiwania'?.012:.035,angle,.025,-.025);
      if(species.name==='Cedar')petal(green,x,y-.06*t,z,.08,.008,angle+.45,.035,-.01);
     }
    }
   }
  }
  ball(petals,[0,1.38,0],[.025,.07,.025]);
  for(let i=0;i<3;i++){const a=i*2.1;ball(centres,[Math.cos(a)*.29,.73,Math.sin(a)*.29],[.025,.045,.025]);}
  return;
 }
 if(kind==='valleyBells'){
  for(let i=0;i<flowerCount;i++){
   const a=i*2.4,r=.3*Math.sqrt(i/flowerCount),x=Math.cos(a)*r,z=Math.sin(a)*r,h=.46+rand()*.13;
   for(let j=0;j<2;j++)petal(green,x,.035,z,.4,.105,a+j*2.3,.32,-.06);
   segment(green,[x,0,z],[x,h,z],.008);
   segment(green,[x,h,z],[x+.15,h+.035,z],.007);
   for(let j=0;j<6;j++){
    const bx=x+.035+j*.025,by=h+.025-j*.047;
    segment(green,[x,h-j*.043,z],[bx,by,z],.004);
    tube(bx,by,z,.055,.024,[0,-1,0]);
    for(let k=0;k<6;k++)ball(petals,[bx+Math.cos(k*Math.PI/3)*.033,by-.052,z+Math.sin(k*Math.PI/3)*.033],[.012,.009,.012]);
   }
  }
  return;
 }
 if(kind==='hangingClusters'){segment(green,[-.45,0,0],[-.45,1.5,0],.035);segment(green,[-.45,1.5,0],[.6,1.5,0],.025);}
 for(let i=0;i<flowerCount;i++){
 const a=i*2.4,r=.45*Math.sqrt(i/flowerCount),x=Math.cos(a)*r,z=Math.sin(a)*r,h=tree?1.15+rand()*.25:kind==='groundCluster'||kind==='clover'?.2+rand()*.12:kind==='lotus'?.52+rand()*.12:.5+rand()*.4;
 if(tree)segment(green,[0,.85,0],[x,h,z],.018);else if(kind!=='lotus'&&kind!=='hangingClusters')stem(x,z,h);
 if(kind==='lotus'){
 stem(x,z,h);ball(green,[x,.11,z],[.34,.014,.32]);radial(x,h,z,.28,9,3,.1);ball(centres,[x,h+.08,z],[.065,.045,.065]);continue;
 }
 leaves(x,z,h,kind==='lily'||kind==='sideTrumpets'?6:4);
 if(['teaTree','citrusFruitTree','foliageTree','tonkaTree'].includes(kind)){
  for(let j=0;j<10;j++){
   const theta=j*2.4,cx=x+Math.cos(theta)*.13,cz=z+Math.sin(theta)*.13;
   petal(green,cx,h+(j%3)*.035,cz,kind==='teaTree'?.18:.23,.06,theta,.06,-.025);
  }
  if(kind==='citrusFruitTree'){
   ball(petals,[x,h+.035,z],species.name==='Lemon'?[.07,.11,.07]:[.09,.09,.09]);
   for(let j=0;j<3;j++)ball(centres,[x+.15+Math.cos(j*2.1)*.025,h-.025,z+Math.sin(j*2.1)*.025],[.023,.014,.023]);
  }else if(kind==='tonkaTree'){
   radial(x,h+.03,z,.055,5,1,.025);
   ball(centres,[x+.09,h-.13,z],[.035,.08,.025]);
  }else if(kind==='teaTree'){
   radial(x,h+.05,z,.085,5,1,.03);ball(centres,[x,h+.075,z],[.03,.025,.03]);
  }else{
   cluster(x,h+.035,z,.065,4);ball(centres,[x,h+.055,z],[.015,.015,.015]);
  }
 }else if(kind==='salvia'){
  for(let j=0;j<10;j++){
   const y=h+j*.037,taper=1-j*.055;
   if(j<9)segment(green,[x,y,z],[x,y+.037,z],.005);
   for(let k=0;k<4;k++){
    const theta=k*Math.PI/2+j*.4,cx=x+Math.cos(theta)*.018,cz=z+Math.sin(theta)*.018;
    ball(centres,[cx,y-.008,cz],[.018,.013,.018]);
    petal(petals,cx,y,cz,.063*taper,.025,theta,.018,.018);
    petal(petals,cx,y+.012,cz,.042*taper,.017,theta,.036,-.012);
   }
  }
 }else if(kind==='layered'||kind==='ruffled'||kind==='pompon'||kind==='dahlia'){
 const layers=kind==='pompon'?4:3,count=kind==='dahlia'?16:kind==='ruffled'?11:9;
 radial(x,h,z,kind==='layered'?.22:.17,count,layers,kind==='pompon'?.11:.06);ball(centres,[x,h+.04,z],[.025,.02,.025]);
 }else if(kind==='panicle'||kind==='flowerSpike'||kind==='sideTrumpets'){
 const levels=kind==='panicle'?8:6;
 for(let j=0;j<levels;j++){const theta=j*2.4,y=h+j*.065,cx=x+Math.cos(theta)*.06,cz=z+Math.sin(theta)*.06;
 if(kind==='sideTrumpets')tube(cx,y,cz,.12,.065,[Math.cos(a),.4,Math.sin(a)]);
 else if(kind==='panicle')cluster(cx,y,cz,.11*(1-j/levels),6);
 else{tube(cx,y,cz,.07,.035,[Math.cos(theta),.5,Math.sin(theta)]);}}
 }else if(kind==='lily'){
 radial(x,h,z,.28,6,1,.08);for(let j=0;j<6;j++){const theta=j*Math.PI/3,to=[x+Math.cos(theta)*.085,h+.17,z+Math.sin(theta)*.085];segment(centres,[x,h,z],to,.004);ball(centres,to,[.025,.009,.012]);}
 }else if(kind==='narcissus'||kind==='daffodil'){
 const count=kind==='narcissus'?3:1;for(let j=0;j<count;j++){const cx=x+(j-1)*.08;radial(cx,h,z,kind==='daffodil'?.18:.1,6);tube(cx,h,z,kind==='daffodil'?.14:.05,kind==='daffodil'?.07:.035);ball(centres,[cx,h+.025,z],[.03,.025,.03]);}
 }else if(kind==='vineTrumpets'||kind==='nightTubes'||kind==='trumpetTree'){
 for(let j=0;j<(kind==='nightTubes'?9:3);j++){const theta=j*2.4,cx=x+Math.cos(theta)*.07,cz=z+Math.sin(theta)*.07;tube(cx,h,cz,kind==='trumpetTree'?.38:.17,kind==='trumpetTree'?.15:.035,[Math.cos(theta)*.3,kind==='trumpetTree'?-1:.25,Math.sin(theta)*.3]);}
 }else if(kind==='snowdrop'){
 segment(green,[x,h,z],[x+.08,h-.025,z],.009);for(let j=0;j<3;j++)petal(petals,x+.08,h-.025,z,.07,.035,j*2.094,-.12,-.01);
 }else if(kind==='calla'){
 const points=[];for(let j=0;j<=9;j++){const t=j/9;points.push(new THREE.Vector2(.025+.17*t*t,.27*t));}const g=new THREE.LatheGeometry(points,16,0,Math.PI*1.65);g.translate(x,h,z);petals.push(g);segment(centres,[x,h,z],[x,h+.22,z],.019);
 }else if(kind==='passion'){
 radial(x,h,z,.2,10);for(let j=0;j<36;j++){const theta=j*Math.PI*2/36;segment(centres,[x+Math.cos(theta)*.06,h+.02,z+Math.sin(theta)*.06],[x+Math.cos(theta)*.16,h+.05,z+Math.sin(theta)*.16],.003);}segment(centres,[x,h,z],[x,h+.1,z],.012);
 }else if(kind==='orchid'||kind==='pea'){
 const flowers=kind==='orchid'?3:2;
 for(let j=0;j<flowers;j++){const y=h+j*.13,cx=x+j*.06;
 petal(petals,cx,y,z,.17,.09,0,.07);petal(petals,cx,y,z,.17,.09,Math.PI,.07);petal(petals,cx,y,z,.13,.07,Math.PI*.5,.09);petal(petals,cx,y,z,.12,.075,-Math.PI*.5,-.035);ball(centres,[cx,y+.025,z],[.028,.035,.045]);}
 }else if(kind==='pompomTree'||kind==='stamenTree'){
 for(let j=0;j<12;j++){const theta=j*2.4,d=.17*Math.sqrt(j/12),cx=x+Math.cos(theta)*d,cz=z+Math.sin(theta)*d;ball(petals,[cx,h,cz],[.035,.035,.035]);for(let k=0;k<5;k++){const b=k*1.257;segment(petals,[cx,h,cz],[cx+Math.cos(b)*.055,h+.04,cz+Math.sin(b)*.055],.002);}}
 }else if(kind==='flatCluster'||kind==='flatClusterTree'||kind==='tinyBlossomTree'||kind==='groundCluster'){
 cluster(x,h,z,kind==='groundCluster'?.16:.21,kind==='tinyBlossomTree'?10:19);
 }else if(kind==='hangingClusters'){
 segment(green,[x,1.5,z],[x,.9,z],.008);for(let j=0;j<11;j++){const y=1.45-j*.05,theta=j*2.4;radial(x+Math.cos(theta)*.06,y,z+Math.sin(theta)*.06,.06*(1-j/14),5);}
 }else if(kind==='clover'){
 for(let j=0;j<18;j++){const theta=j*2.4,d=.065;ball(petals,[x+Math.cos(theta)*d,h+(j/18-.5)*.12,z+Math.sin(theta)*d],[.025,.04,.025]);}
 for(let j=0;j<3;j++)ball(green,[x+Math.cos(j*2.094)*.08,.1,z+Math.sin(j*2.094)*.08],[.075,.012,.05]);
 }else if(kind==='lindenTree'){
 for(let j=0;j<5;j++){const theta=j*1.257,cx=x+Math.cos(theta)*.12,cz=z+Math.sin(theta)*.12;segment(green,[x,h,z],[cx,h-.12,cz],.005);radial(cx,h-.12,cz,.045,5);}
 }else{
 const count=kind==='poppy'?4:kind==='aster'||kind==='buttonDaisy'?16:5;
 radial(x,h,z,kind==='poppy'?.22:.16,count,1,kind==='poppy'?.055:.025);ball(centres,[x,h+.025,z],[kind==='buttonDaisy'?.055:.03,.035,kind==='buttonDaisy'?.055:.03]);
 }
 }
}
