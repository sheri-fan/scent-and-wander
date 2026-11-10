import { AROMA_COLLECTION } from './aromaCollection.js';
import { PERFUME_GARDEN } from './perfumeGarden.js';
import { WOODLAND_SPECIES } from './woodland.js';
import { groundHeight, pathX, randomGenerator } from './world.js';
export const FLOWERS = [
 {name:'Lavender', chinese:'薰衣草',color:'#b9a0ff',kind:'spike',note:'Slender violet spires, gathered like a little purple cloud. Follow their soft light along the woodland edge.'},
 {name:'Rose Bush',chinese:'玫瑰花',color:'#ff9eae',kind:'rose',note:'Layer upon layer of rose-coloured petals. A small, luminous garden tucked beneath the trees.'},
 {name:'Hydrangea',chinese:'繡球花',color:'#a1baff',kind:'cluster',note:'Clouds of tiny blue and lilac blossoms, each one a small part of a much larger flower head.'},
 {name:'Daisy',chinese:'雛菊',color:'#fff3ca',kind:'daisy',note:'White petals surround a golden heart. A bright little constellation close to the forest floor.'},
 {name:'Tulip',chinese:'鬱金香',color:'#ffac7d',kind:'cup',note:'Warm pink and apricot cups rise between long, arching leaves, holding a little morning light.'},
 {name:'Bluebell',chinese:'藍鈴花',color:'#a1a6ff',kind:'bell',note:'Nodding blue bells on slender stems. A quiet glow beneath the shelter of the canopy.'},
 {name:'Sunflower',chinese:'向日葵',color:'#ffd36b',kind:'sun',note:'A crown of golden petals and a deep amber centre. The tallest flowers in this woodland collection.'},
 {name:'Cosmos',chinese:'波斯菊',color:'#ffb4d3',kind:'cosmos',note:'Papery pink petals on airy stems. Their delicate heads sway with the forest breeze.'},
 {name:'Pansy',chinese:'三色堇',color:'#c4a0ff',kind:'pansy',note:'Velvety violet and cream petals gather around a tiny golden centre, like little woodland faces.'},
 {name:'Little Wildflower Mix',chinese:'繽紛野花',color:'#ffdf98',kind:'mix',note:'Pink, violet, white and gold, growing together. A tiny meadow with no two blossoms quite alike.'},
 {name:'Jasmine',chinese:'茉莉',color:'#fff5d8',kind:'star',note:'Small ivory stars gather above glossy green leaves.',perfume:{part:'Flowers',scent:'Rich · floral · softly sweet',story:'Jasmine blossoms provide a rich floral material used at the heart of many perfumes.',source:'https://perfumesociety.org/ingredients-post/jasmine-2/'}},
 {name:'Orange Blossom',chinese:'橙花',color:'#ffe9b0',kind:'citrus',note:'White blossoms nestle among the leaves of a miniature bitter-orange tree.',perfume:{part:'Flowers',scent:'Fresh · floral · citrus',story:'Bitter-orange flowers yield neroli oil by distillation and orange blossom absolute by solvent extraction.',source:'https://perfumesociety.org/ingredients-post/orange-blossom/'}},
 {name:'Iris',chinese:'鳶尾',color:'#b3a0ff',kind:'iris',note:'Violet petals rise above a fan of upright, sword-shaped leaves.',perfume:{part:'Aged rhizomes',scent:'Powdery · violet-like · woody',story:'Orris comes from the aged underground rhizomes of certain irises, rather than their showy petals.',source:'https://www.firmenich.com/sites/default/files/uploads/files/ingredients/marketing-sheet/perfumery/ORRISCIENCE_8_IRONE_950289.pdf'}},
 {name:'Patchouli',chinese:'廣藿香',color:'#c3d692',kind:'herb',note:'A bushy herb with broad, deep-green leaves and tiny pale flower spikes.',perfume:{part:'Dried leaves and twigs',scent:'Earthy · woody · deep',story:'Steam distillation of dried leaves and twigs produces patchouli oil, an enduring earthy perfume material.',source:'https://greenhouse.biology.indiana.edu/features/fragrant/Pogostemon-cablin.html'}},
 {name:'Vetiver',chinese:'香根草',color:'#d7c68b',kind:'grass',note:'A fountain of long grass blades, glowing softly at the woodland edge.',perfume:{part:'Roots',scent:'Dry · earthy · woody',story:'The aromatic roots of this grass provide vetiver oil. Its woody impression comes from beneath the soil.',source:'https://perfumesociety.org/ingredients-post/vetiveria/'}},
 {name:'Rosemary',chinese:'迷迭香',color:'#b8cfff',kind:'needles',note:'Slender, needle-like leaves frame tiny blue-lilac flowers.',perfume:{part:'Leafy flowering shoots',scent:'Herbal · fresh · aromatic',story:'Rosemary oil gives aromatic herbal character to fragrances and has a long history in cologne-style perfumery.',source:'https://perfumesociety.org/ingredients-post/rosemary/'}},
 {name:'Bergamot',chinese:'佛手柑',color:'#e1e994',kind:'fruit',note:'A little citrus tree with glossy leaves and glowing yellow-green fruit.',perfume:{part:'Fruit peel',scent:'Bright · citrus · green',story:'Oil expressed from bergamot peel brings a fresh citrus opening to many perfumes.',source:'https://perfumesociety.org/ingredients-post/bergamot/'}},
 {name:'Ylang-Ylang',chinese:'依蘭',color:'#ffe381',kind:'ribbon',note:'Long golden petals curl beneath the foliage of a miniature tropical tree.',perfume:{part:'Flowers',scent:'Lush · floral · sweet',story:'The fragrant flowers of the ylang-ylang tree provide a rich, exotic floral material for perfumery.',source:'https://perfumesociety.org/ingredients-post/ylang-ylang/'}},
 ...WOODLAND_SPECIES,
 ...AROMA_COLLECTION,
 ...PERFUME_GARDEN,
];
// One shared placement list drives both rendering and discovery targeting.
export const GARDEN_CENTER={x:pathX(16),z:16};
export const GARDEN_RADIUS=38;
export const PATCH_GAP=1.6;
export function patchFootprint(type,scale=1){return (FLOWERS[type].kind==='lotus'?1.08:FLOWERS[type].kind==='moss'?1:.85)*scale;}
export function makeFlowerPatches(world) {
 const rand=randomGenerator(74529),patches=[];
 const within=(x,z)=>Math.hypot(x-GARDEN_CENTER.x,z-GARDEN_CENTER.z)<=GARDEN_RADIUS;
 const clear=(x,z,radius)=>within(x,z)
  &&Math.abs(x-pathX(z))>2.15+radius
  &&world.colliders.every(c=>Math.hypot(x-c.x,z-c.z)>c.radius+radius+.4)
  &&patches.every(p=>Math.hypot(x-p.x,z-p.z)>=radius+p.footprint+PATCH_GAP);
 const trees=world.trees.filter(t=>within(t.x,t.z)),logs=world.logs.filter(l=>within(l.x,l.z));
 function place(type,ambient=false){
 const scale=ambient?.65+rand()*.45:.9+rand()*.15,radius=patchFootprint(type,scale),kind=FLOWERS[type].kind;
 for(let attempt=0;attempt<16000;attempt++){
 let x,z;
 if(ambient&&attempt<120&&kind==='moss'&&trees.length){const t=trees[Math.floor(rand()*trees.length)],a=rand()*Math.PI*2,d=t.r+radius+.45+rand()*.7;x=t.x+Math.cos(a)*d;z=t.z+Math.sin(a)*d;}
 else if(ambient&&attempt<120&&kind==='mushroom'&&logs.length){const l=logs[Math.floor(rand()*logs.length)],a=rand()*Math.PI*2,d=radius+.7+rand();x=l.x+Math.cos(a)*d;z=l.z+Math.sin(a)*d;}
 else{const a=rand()*Math.PI*2,d=Math.sqrt(rand())*GARDEN_RADIUS;x=GARDEN_CENTER.x+Math.cos(a)*d;z=GARDEN_CENTER.z+Math.sin(a)*d;}
 if(!clear(x,z,radius))continue;
 patches.push({id:patches.length,type,x,z,y:groundHeight(x,z),phase:rand()*Math.PI*2,scale,footprint:radius,ambient,interactive:true});return;
 }
 throw new Error('No spaced planting position for '+FLOWERS[type].name);
 }
 const types=FLOWERS.flatMap((_,type)=>[type,type]);
 for(let i=types.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[types[i],types[j]]=[types[j],types[i]];}
 types.forEach(type=>place(type));
 for(const [kind,count] of [['moss',24],['mushroom',18],['fern',12]]){
 const type=FLOWERS.findIndex(p=>p.kind===kind);for(let i=0;i<count;i++)place(type,true);
 }
 return patches;
}
