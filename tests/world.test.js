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
 const hosts=new Set(['www.yslbeautyus.com','www.acquadiparma.com','www.chanel.com','www.dior.com','www.byredo.com','www.jomalone.com','www.prada-beauty.com','www.mugler.com','www.guerlain.com','www.fredericmalle.com','diptyqueparis.com','uk.diptyqueparis.com','www.lelabofragrances.com','www.gucci.com','www.hermes.com','sergelutens.fr','www.penhaligons.com','www.florislondon.com','www.esteelauder.com','www.tomfordbeauty.com','www.franciskurkdjian.com','parfums-de-marly.com','amouage.com','www.bykilian.com','bdkparfums.com','us.nishane.com','www.loccitane.com','www.dsanddurga.com','fr.lalique.com','www.giorgioarmanibeauty-usa.com','www.lancome-usa.com','www.chloe.com','www.artisanparfumeur.com','www.maisonmargiela-fragrances.us','us.louisvuitton.com','www.loewe.com','www.creedfragrance.com','www.valentino-beauty.us']);
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
