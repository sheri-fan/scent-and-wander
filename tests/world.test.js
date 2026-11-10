import test from 'node:test';
import assert from 'node:assert/strict';
import { makeWorld, pathX, resolveMovement, WORLD_RADIUS } from '../src/world.js';
test('forest is deterministic and keeps the entire walking path clear',()=>{const a=makeWorld();assert.deepEqual(a,makeWorld());assert.ok(a.trees.length>400);for(const t of a.trees)assert.ok(Math.abs(t.x-pathX(t.z))>=3.3);for(let z=-85;z<85;z+=.2){const x=pathX(z);assert.ok(a.colliders.every(c=>Math.hypot(x-c.x,z-c.z)>c.radius+.32));}});
test('movement blocks solids, slides along them, and respects forest bounds',()=>{const c=[{x:1,z:0,radius:.5}];assert.deepEqual(resolveMovement(0,0,.5,.2,c),[0,.2]);assert.deepEqual(resolveMovement(0,0,-.5,.2,c),[-.5,.2]);assert.deepEqual(resolveMovement(WORLD_RADIUS-3,0,3,0,[]),[WORLD_RADIUS-3,0]);});

test('random woodland layout stays compact, spaced, and clear of solid scenery',async()=>{
 const {FLOWERS,makeFlowerPatches,GARDEN_CENTER,GARDEN_RADIUS,PATCH_GAP}=await import('../src/flowers.js');
 const world=makeWorld(),patches=makeFlowerPatches(world),flowers=patches.filter(p=>!p.ambient);
 assert.deepEqual(patches,makeFlowerPatches(world));
 assert.equal(flowers.length,FLOWERS.length*2);
 for(let type=0;type<FLOWERS.length;type++)assert.equal(flowers.filter(p=>p.type===type).length,2);
 for(const p of patches){
 assert.ok(Math.hypot(p.x-GARDEN_CENTER.x,p.z-GARDEN_CENTER.z)<=GARDEN_RADIUS);
 assert.ok(Math.hypot(p.x,p.z)<WORLD_RADIUS-2);
 assert.ok(Math.abs(p.x-pathX(p.z))>2.15+p.footprint);
 assert.ok(world.colliders.every(c=>Math.hypot(p.x-c.x,p.z-c.z)>c.radius+p.footprint+.4));
 }
 for(let i=0;i<patches.length;i++)for(let j=i+1;j<patches.length;j++)assert.ok(Math.hypot(patches[i].x-patches[j].x,patches[i].z-patches[j].z)>=patches[i].footprint+patches[j].footprint+PATCH_GAP);
 assert.ok(flowers.filter(p=>Math.abs(p.x-pathX(p.z))>7).length>flowers.length*.6,'Most flowers should be away from the trail');
});

test('every moss and mushroom instance belongs to the shared interactive layout',async()=>{
 const {FLOWERS,makeFlowerPatches}=await import('../src/flowers.js');
 const patches=makeFlowerPatches(makeWorld()),small=patches.filter(p=>['moss','mushroom'].includes(FLOWERS[p.type].kind));
 assert.equal(small.filter(p=>p.ambient).length,42);
 assert.ok(small.every(p=>p.interactive&&p.scale>0));
 assert.equal(new Set(patches.map(p=>p.id)).size,patches.length);
});

test('the linked aroma list is fully represented without duplicate discoveries',async()=>{
 const {FLOWERS}=await import('../src/flowers.js');
 const {AROMA_LIST_NAMES,AROMA_COLLECTION}=await import('../src/aromaCollection.js');
 const {localizePlant}=await import('../src/i18n.js');
 assert.equal(AROMA_LIST_NAMES.length,50);
 assert.equal(AROMA_COLLECTION.length,41);
 assert.equal(new Set(FLOWERS.map(p=>p.name)).size,FLOWERS.length);
 for(const name of AROMA_LIST_NAMES)assert.ok(FLOWERS.some(p=>p.name===name),name);
 for(const flower of AROMA_COLLECTION)for(const language of ['en','zh-Hant']){
 const localized=localizePlant(flower,language);
 assert.ok(localized.name&&localized.knowledge.profile&&localized.knowledge.growing&&localized.knowledge.fact);
 assert.match(localized.knowledge.source,/^https:\/\//);
 assert.equal(localized.origin.hasInformation,false);
 }
});

test('perfume examples match real exhibits and retain complete official-source metadata', async()=>{
 const {FLOWERS}=await import('../src/flowers.js');
 const {PERFUME_EXAMPLES}=await import('../src/perfumeExamples.js');
 const names=new Set(FLOWERS.map(p=>p.name));
 const hosts=new Set(['www.yslbeautyus.com','www.acquadiparma.com','www.chanel.com','www.dior.com','www.byredo.com','www.jomalone.com','www.prada-beauty.com','www.mugler.com','www.guerlain.com','www.fredericmalle.com','diptyqueparis.com','uk.diptyqueparis.com','www.lelabofragrances.com','www.gucci.com','www.hermes.com','sergelutens.fr','www.penhaligons.com','www.florislondon.com','www.esteelauder.com','www.tomfordbeauty.com','www.franciskurkdjian.com','parfums-de-marly.com','amouage.com','www.bykilian.com','bdkparfums.com','us.nishane.com','www.loccitane.com','www.dsanddurga.com','fr.lalique.com','www.giorgioarmanibeauty-usa.com','www.lancome-usa.com','www.chloe.com','www.artisanparfumeur.com','www.maisonmargiela-fragrances.us','us.louisvuitton.com','www.loewe.com','www.creedfragrance.com','www.valentino-beauty.us','www.panseven.com']);
 for(const [plant,examples] of Object.entries(PERFUME_EXAMPLES)){
  assert.ok(names.has(plant),plant);
  assert.equal(new Set(examples.map(p=>p.url)).size,examples.length,plant+' duplicate link');
  for(const p of examples){
   const url=new URL(p.url);
   assert.equal(url.protocol,'https:');assert.ok(hosts.has(url.hostname),p.url);
   assert.ok(p.brand&&p.name&&p.concentration&&p.en&&p.zh);
   assert.ok(['note','material','ingredient','accord'].includes(p.evidence));
  }
 }
 for(const plant of ['Gardenia','Tuberose','Osmanthus','Sweet Pea','Wisteria'])assert.ok(PERFUME_EXAMPLES[plant]?.length,plant);
});


test('requested fragrance houses and new valley bells are discoverable in both languages',async()=>{
 const {PERFUME_EXAMPLES}=await import('../src/perfumeExamples.js');
 const {FLOWERS,makeFlowerPatches}=await import('../src/flowers.js');
 const {localizePlant}=await import('../src/i18n.js');
 const {PERFUME_GARDEN}=await import('../src/perfumeGarden.js');
 const all=Object.values(PERFUME_EXAMPLES).flat();
 const houses=['L\u2019Artisan Parfumeur','Maison Margiela','Louis Vuitton','Tom Ford','LOEWE','Creed','Valentino'];
 for(const brand of houses)assert.ok(all.some(p=>p.brand===brand),brand);
 const patches=makeFlowerPatches(makeWorld());
 for(const species of PERFUME_GARDEN){
  const type=FLOWERS.indexOf(species);
  assert.ok(type>=0);
  assert.equal(patches.filter(p=>p.type===type&&p.interactive).length,2);
  for(const language of ['en','zh-Hant']){
   const card=localizePlant(species,language);
   assert.ok(card.name&&card.note&&card.knowledge.botanical&&card.knowledge.profile&&card.knowledge.growing&&card.knowledge.fact);
   if(species.name==='Lily of the Valley')assert.ok(card.examples.length>=2);
   if(species.name==='Salvia'){
    assert.equal(card.knowledge.botanical,'Salvia nemorosa');
    assert.equal(card.examples.length,0);
    assert.equal(card.origin.hasInformation,false);
   }
  }
 }
});

test('Simplified Chinese covers every plant while preserving source links and discovery IDs',async()=>{
 const {FLOWERS}=await import('../src/flowers.js');
 const {LANGUAGES,MESSAGES,localizePlant}=await import('../src/i18n.js');
 assert.ok(LANGUAGES.includes('zh-Hans'));
 assert.equal(MESSAGES['zh-Hans'].language,'\u8bed\u8a00');
 assert.equal(MESSAGES['zh-Hans'].continue,'\u7ee7\u7eed\u63a2\u7d22');
 assert.equal(MESSAGES['zh-Hans'].count(2,67),'\u5df2\u63a2\u7d22 2\uff0f67 \u79cd');
 for(const plant of FLOWERS){
  const traditional=localizePlant(plant,'zh-Hant'),simple=localizePlant(plant,'zh-Hans');
  assert.ok(simple.name&&simple.note&&simple.knowledge.profile&&simple.knowledge.growing&&simple.knowledge.fact);
  assert.equal(simple.secondaryName,plant.name);
  assert.equal(simple.knowledge.source,traditional.knowledge.source);
  assert.deepEqual(simple.examples.map(p=>p.url),traditional.examples.map(p=>p.url));
  assert.equal(simple.origin.hasInformation,traditional.origin.hasInformation);
 }
 assert.equal(localizePlant(FLOWERS.find(p=>p.name==='Lily of the Valley'),'zh-Hans').name,'\u94c3\u5170');
});

test('first visits default to English and returning visits preserve language preferences',async()=>{
 const {initialLanguage}=await import('../src/i18n.js');
 const previous=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
 try{
  for(const [saved,expected] of [[null,'en'],['unsupported','en'],['en','en'],['zh-Hant','zh-Hant'],['zh-Hans','zh-Hans']]){
   Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:()=>saved}});
   assert.equal(initialLanguage(),expected);
  }
  Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw new Error('Storage unavailable');}});
  assert.equal(initialLanguage(),'en');
 }finally{
  if(previous)Object.defineProperty(globalThis,'localStorage',previous);else delete globalThis.localStorage;
 }
});

test('P.Seven stores published notes and botanical references without inventing pending links',async()=>{
 const {PERFUME_ADDITIONS,PSEVEN_BRAND,PSEVEN_BOTANICAL_REFERENCES:references}=await import('../src/perfumeExpansion.js');
 const {PERFUME_EXAMPLES}=await import('../src/perfumeExamples.js');
 const {FLOWERS}=await import('../src/flowers.js');
 const entries=PERFUME_ADDITIONS.filter(p=>p.brand==='P.Seven');
 assert.equal(PSEVEN_BRAND.origin,'Taiwan');
 assert.equal(entries.length,11);
 assert.equal(new Set(entries.map(p=>p.url)).size,11);
 assert.equal(Object.keys(references).length,15);
 const verified=entries.filter(p=>p.verificationStatus==='published-notes-verified');
 const pending=entries.filter(p=>p.verificationStatus==='pending-full-note-verification');
 assert.equal(verified.length,3);assert.equal(pending.length,8);
 const known=new Set(FLOWERS.map(p=>p.name)),used=new Set();
 for(const entry of entries){
  assert.equal(new URL(entry.url).hostname,'www.panseven.com');
  assert.equal(entry.evidence,'note');assert.equal(entry.physicalIngredientsVerified,false);
  assert.equal(entry.concentrationVerified,false);
  for(const key of entry.botanicalReferences){assert.ok(references[key],key);used.add(key);}
  for(const plant of entry.plants){
   assert.ok(known.has(plant));
   assert.ok(entry.botanicalReferences.some(key=>references[key].exhibit===plant));
   assert.ok(PERFUME_EXAMPLES[plant].some(p=>p.url===entry.url));
  }
 }
 assert.equal(used.size,15);
 for(const entry of pending){
  assert.deepEqual(entry.plants,[]);assert.deepEqual(entry.botanicalReferences,[]);
  for(const lang of ['en','zh'])for(const stage of ['top','middle','base'])assert.deepEqual(entry.notes[lang][stage],[]);
 }
 assert.deepEqual(verified[0].notes.en.middle,['Jin Xuan tea']);
 assert.deepEqual(verified[1].notes.en.middle,['Osmanthus','Lily of the valley','Oolong tea']);
 assert.deepEqual(verified[2].notes.en.base,['Taiwania','Ho wood']);
 assert.deepEqual(verified[2].plants,['Tea Plant','Plum','Taiwania','Ho Wood']);
 assert.equal(references['Clary Sage'].exhibit,'Clary Sage');
 assert.equal(references['Sweet Orange'].exhibit,'Sweet Orange');
 assert.equal(references.Plum.exhibit,'Plum');
 assert.equal(FLOWERS.length,79);
});

test('all twelve added P.Seven plants have spaced clickable patches and complete localized cards',async()=>{
 const {PSEVEN_GARDEN}=await import('../src/perfumeGarden.js');
 const {FLOWERS,makeFlowerPatches}=await import('../src/flowers.js');
 const {localizePlant}=await import('../src/i18n.js');
 const patches=makeFlowerPatches(makeWorld());
 assert.equal(PSEVEN_GARDEN.length,12);assert.equal(patches.length,212);
 for(const plant of PSEVEN_GARDEN){
  const type=FLOWERS.indexOf(plant),instances=patches.filter(p=>p.type===type);
  assert.equal(instances.length,2);assert.ok(instances.every(p=>p.interactive));
  for(const lang of ['en','zh-Hant','zh-Hans']){
   const card=localizePlant(plant,lang);
   assert.ok(card.name&&card.knowledge.profile&&card.knowledge.growing&&card.knowledge.fact);
   assert.match(card.knowledge.source,/^https:\/\//);
   assert.ok(card.examples.some(p=>p.brand==='P.Seven'));
  }
 }
});

test('benches are deterministic, spaced, clear of plants and path, and block walking',async()=>{
 const {makeBenches,benchColliders}=await import('../src/benches.js');
 const {makeFlowerPatches}=await import('../src/flowers.js');
 const world=makeWorld(),plants=makeFlowerPatches(world),benches=makeBenches(world);
 assert.equal(benches.length,6);assert.deepEqual(benches,makeBenches(world));
 const solids=[...world.colliders,...benchColliders(benches)];
 for(const b of benches){
  assert.ok(Math.abs(b.x-pathX(b.z))>=4.4);
  assert.ok(plants.every(p=>Math.hypot(b.x-p.x,b.z-p.z)>=p.footprint+1.65));
  assert.ok(world.colliders.every(c=>Math.hypot(b.x-c.x,b.z-c.z)>=c.radius+1.45));
  const dx=Math.sin(b.angle),dz=Math.cos(b.angle),start=[b.x+dx,b.z+dz];
  const result=resolveMovement(...start,-dx*.8,-dz*.8,solids);
  assert.ok(Math.hypot(result[0]-b.x,result[1]-b.z)>.69);
 }
 for(let i=0;i<benches.length;i++)for(let j=i+1;j<benches.length;j++)assert.ok(Math.hypot(benches[i].x-benches[j].x,benches[i].z-benches[j].z)>=9);
 assert.equal(plants.length,212);
});

test('the cottage and mailbox occupy a clear site without moving existing discoveries',async()=>{
 const {makeBenches}=await import('../src/benches.js');
 const {makeCottage,cottageColliders}=await import('../src/cottage.js');
 const {makeFlowerPatches}=await import('../src/flowers.js');
 const world=makeWorld(),benches=makeBenches(world),plants=makeFlowerPatches(world),c=makeCottage(world,benches);
 assert.deepEqual(c,makeCottage(world,benches));
 assert.ok(Math.abs(c.x-pathX(c.z))>=6);
 assert.ok(world.colliders.every(s=>Math.hypot(c.x-s.x,c.z-s.z)>=s.radius+3.5));
 assert.ok(plants.every(p=>Math.hypot(c.x-p.x,c.z-p.z)>=p.footprint+3.5));
 assert.ok(benches.every(b=>Math.hypot(c.x-b.x,c.z-b.z)>=5));
 const solids=cottageColliders(c);
 assert.ok(!solids.some(s=>Math.hypot(s.x-c.x,s.z-c.z)<s.radius));
 const mail={x:c.x+Math.cos(c.angle)*2.25+Math.sin(c.angle)*1.4,z:c.z-Math.sin(c.angle)*2.25+Math.cos(c.angle)*1.4};
 assert.ok(solids.some(s=>Math.hypot(s.x-mail.x,s.z-mail.z)<.01));
 assert.equal(makeFlowerPatches(world).length,212);
});

test('the cottage door opens a walkable centre aisle with a level interior floor',async()=>{
 const {makeBenches}=await import('../src/benches.js');
 const {makeCottage,cottageColliders,cottageWorldPoint,cottageLocalPoint,cottageWalkingHeight,insideCottage}=await import('../src/cottage.js');
 const world=makeWorld(),c=makeCottage(world,makeBenches(world));
 for(const opened of [false,true])for(const offset of [-.25,0,.25]){
  const solids=[...world.colliders,...cottageColliders(c,opened)],start=cottageWorldPoint(c,offset,0,2.6);let x=start.x,z=start.z;
  for(let i=0;i<60;i++)[x,z]=resolveMovement(x,z,-Math.sin(c.angle)*.05,-Math.cos(c.angle)*.05,solids);
  const local=cottageLocalPoint(c,x,z);
  if(opened){assert.ok(local.z<.2);assert.ok(insideCottage(c,x,z));assert.equal(cottageWalkingHeight(c,x,z),c.y+.24);}
  else assert.ok(local.z>1.7);
 }
 const side=cottageWorldPoint(c,1.6,0,0);
 assert.ok(cottageColliders(c,true).some(s=>Math.hypot(s.x-side.x,s.z-side.z)<.15));
});

test('virtual perfume proportions normalize to 100 and invalid saved data is rejected',async()=>{
 const {blendPercentages,validBlend,cleanBoard}=await import('../src/workshop.js');
 assert.deepEqual(blendPercentages([{parts:1},{parts:1},{parts:1}]),[34,33,33]);
 assert.deepEqual(blendPercentages([{parts:3},{parts:4},{parts:3}]),[30,40,30]);
 assert.deepEqual(blendPercentages([]),[]);
 const blend={name:'Woodland tea',notes:[{id:'Tea Plant',parts:6},{id:'Osmanthus',parts:3},{id:'Sandalwood',parts:2}]};
 assert.equal(validBlend(blend),true);
 assert.equal(validBlend({...blend,notes:[null,...blend.notes.slice(1)]}),false);
 assert.equal(validBlend({...blend,name:''}),false);
 assert.equal(validBlend({...blend,notes:[{id:'Unknown',parts:3},...blend.notes.slice(1)]}),false);
 const board=cleanBoard({message:'Hello forest',strokes:[null,{color:'#f0e8cc',points:[null,{x:0,y:.5},{x:2,y:0}]}]});
 assert.equal(board.message,'Hello forest');assert.deepEqual(board.strokes,[{color:'#f0e8cc',points:[{x:0,y:.5}]}]);
 assert.equal(cleanBoard({message:'x'.repeat(500)}).message.length,300);
});

test('bottle labels preserve safe custom designs and migrate older blends',async()=>{
 const {cleanLabel,loadBlends,BLENDS_KEY}=await import('../src/workshop.js');
 const label={text:'Forest morning',subtitle:'Made with a little wonder',paper:'#ead2dd',ink:'#543452',font:'cursive'};
 assert.deepEqual(cleanLabel(label),label);
 assert.equal(cleanLabel({paper:'url(bad)',font:'unknown',text:'x'.repeat(100)}).paper,'#f0e6cb');
 assert.equal(cleanLabel({text:'x'.repeat(100)}).text.length,60);
 const previous=globalThis.localStorage;
 try{
  const blend={name:'Old scent',notes:[{id:'Bergamot',parts:3},{id:'Rose Bush',parts:4},{id:'Sandalwood',parts:3}]};
  globalThis.localStorage={getItem:key=>key===BLENDS_KEY?JSON.stringify([blend,{...blend,label}]):null};
  assert.deepEqual(loadBlends()[0].label,cleanLabel(null));
  assert.deepEqual(loadBlends()[1].label,label);
 }finally{if(previous===undefined)delete globalThis.localStorage;else globalThis.localStorage=previous;}
});
