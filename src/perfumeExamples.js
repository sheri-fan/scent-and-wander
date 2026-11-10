import { PERFUME_ADDITIONS } from './perfumeExpansion.js';
// Official brand pages reviewed 2026-11-09. Each concentration is a distinct example.
// Notes and accords are not evidence of an exact botanical extract or species.
const example=(brand,name,concentration,evidence,url,en,zh)=>({brand,name,concentration,evidence,url,en,zh});
export const EXAMPLE_MESSAGES = {
 en: {title:'MEET IT IN A PERFUME',official:'Official brand source',context:'Examples refer to the named concentration. A brand note describes a scent; an ingredient listing provides different evidence of plant materials. Formulas and regional labels can change.',empty:'No plant-specific example has been verified from an official brand source for this exhibit yet. A perfume name alone is not evidence that it uses this flower.',evidence:{note:'Brand-listed note',material:'Brand-described material',ingredient:'Listed plant ingredient',accord:'Fragrance interpretation'}},
 'zh-Hant': {title:'在哪些香水中遇見它？',official:'品牌官方資料',context:'例子以標示的濃度版本為準。品牌香調描述的是氣味；成分標示則提供植物原料的另一種依據。配方與各地標示可能更新。',empty:'目前尚未從品牌官方資料，確認這個展品的對應香水。香水名稱出現某種花，不代表一定使用該植物。',evidence:{note:'品牌香調',material:'品牌原料說明',ingredient:'官方成分標示',accord:'香氣意象'}}
};
const libre='https://www.yslbeautyus.com/fragrance/womens-fragrances/libre/libre-eau-de-parfum/109YSL.html';
const colonia='https://www.acquadiparma.com/en/gb/colonia/COLONIAEDCRP.html';
const n5='https://www.chanel.com/us/fragrance/p/125430/n5-eau-de-parfum-spray/';
const jadore='https://www.dior.com/en_us/beauty/products/j%E2%80%99adore-eau-de-parfum-Y0998031.html';
const ORIGINAL_EXAMPLES={
 Lavender:[
 example('Yves Saint Laurent','Libre','Eau de Parfum','material',libre,'YSL describes French lavender heart alongside Moroccan orange blossom.','品牌介紹以法國薰衣草香材，搭配摩洛哥橙花。'),
 example('Acqua di Parma','Colonia','Eau de Cologne','note',colonia,'Lavender appears in the aromatic heart with rosemary, rose and verbena.','薰衣草與迷迭香、玫瑰及馬鞭草，共同構成芳香中調。')
 ],
 'Rose Bush':[
 example('Dior',"Miss Dior Rose N’Roses",'Eau de Toilette','note','https://www.dior.com/en_int/beauty/products/miss-dior-rose-nroses-C099600514.html','Dior places Grasse roses at the centre of this sparkling floral fragrance.','Dior 以格拉斯玫瑰，呈現明亮的花香主題。'),
 example('CHANEL','N°5','Eau de Parfum','ingredient',n5,'The official ingredient list includes rose flower oil/extract; the composition highlights May rose.','官方成分表列有玫瑰花油／萃取物，香氣介紹也提及五月玫瑰。')
 ],
 Hydrangea:[],
 Daisy:[],
 Tulip:[
 example('Byredo','La Tulipe','Eau de Parfum','accord','https://www.byredo.com/uk_en/p/la-tulipe-eau-de-parfum','Byredo lists tulip at the heart. This is a named fragrance note, not confirmation of tulip oil.','品牌將鬱金香列為中調；這是香調描述，並非證實使用鬱金香精油。')
 ],
 Bluebell:[
 example('Jo Malone London','Wild Bluebell','Cologne','accord','https://www.jomalone.com/product/25946/18848/colognes/wild-bluebell-cologne','A bluebell-themed fragrance. The official page does not identify a natural bluebell extract.','以藍鈴花為主題的香氣；官方頁面未確認使用天然藍鈴花萃取物。')
 ],
 Sunflower:[],
 Cosmos:[],
 Pansy:[],
 'Little Wildflower Mix':[],
 Jasmine:[
 example('CHANEL','N°5','Eau de Parfum','ingredient',n5,'Jasmine oil/extract appears in the official ingredient list. That listing does not specify a jasmine species.','官方成分表列有茉莉油／萃取物，但該項標示未指定茉莉物種。'),
 example('Dior','J’adore','Eau de Parfum','note',jadore,'Jasmine joins rose and ylang-ylang in Dior’s description of the floral bouquet.','品牌以茉莉、玫瑰與依蘭，描繪這款香水的花香組合。')
 ],
 'Orange Blossom':[
 example('Yves Saint Laurent','Libre','Eau de Parfum','material',libre,'YSL identifies Moroccan orange blossom as a featured material.','品牌介紹將摩洛哥橙花，列為這款香水的代表原料。'),
 example('Jo Malone London','Orange Blossom','Cologne','note','https://www.jomalone.com/product/25946/10106/colognes/orange-blossom-cologne','The brand describes orange and clementine flowers, with white lilac and orriswood.','品牌描述結合橙花與柑橘花，搭配白丁香及鳶尾木質氣息。')
 ],
 Iris:[
 example('Prada','Infusion d’Iris','Eau de Parfum','note','https://www.prada-beauty.com/fragrance/les-infusions/infusion-diris-eau-de-parfum/8435137743179.html','Prada highlights iris pallida, accompanied by neroli, mandarin and benzoin.','品牌以淡色鳶尾為主題，搭配橙花、柑橘與安息香。')
 ],
 Patchouli:[
 example('Mugler','Angel','Eau de Parfum','note','https://www.mugler.com/fragrance/angel-eau-de-parfum-perfume/M010101003.html','Mugler pairs patchouli with praline, red fruits and vanilla absolute.','品牌描述以廣藿香，結合果仁糖、紅色水果與香草原精。'),
 example('Acqua di Parma','Colonia','Eau de Cologne','note',colonia,'Patchouli is listed in the base with vetiver and sandalwood.','品牌列出的後調中，廣藿香與香根草、檀香共同出現。')
 ],
 Vetiver:[
 example('Guerlain','Vétiver','Eau de Toilette','note','https://www.guerlain.com/us/en-us/p/vetiver-de-guerlain-paris-eau-de-toilette-G030486.html','Guerlain describes a composition inspired by vetiver roots, with woods, spices and tobacco.','品牌介紹以香根草根部為靈感，結合木質、辛香與菸草氣息。'),
 example('Acqua di Parma','Colonia','Eau de Cologne','note',colonia,'Vetiver forms part of the woody base.','品牌將香根草列為木質後調的一部分。')
 ],
 Rosemary:[
 example('Acqua di Parma','Colonia','Eau de Cologne','note',colonia,'Rosemary is explicitly listed in the aromatic heart.','品牌明確將迷迭香列入芳香中調。')
 ],
 Bergamot:[
 example('Dior','Sauvage','Eau de Toilette','material','https://www.dior.com/en_us/beauty/products/sauvage-eau-de-toilette-Y0685240.html','Dior highlights Calabrian bergamot at the opening.','品牌介紹以卡拉布里亞佛手柑，帶出開場的柑橘氣息。')
 ],
 'Ylang-Ylang':[
 example('CHANEL','N°5','Eau de Parfum','ingredient',n5,'The official ingredient list includes Cananga odorata oil/extract, the botanical name for ylang-ylang.','官方成分表列有 Cananga odorata 油／萃取物，這是依蘭的植物學名稱。'),
 example('Dior','J’adore','Eau de Parfum','note',jadore,'Dior includes ylang-ylang in its floral bouquet alongside rose and jasmine.','品牌描述的花香組合中，依蘭與玫瑰、茉莉共同出現。')
 ]
};

export const PERFUME_EXAMPLES = { ...ORIGINAL_EXAMPLES };
for (const { plants, ...perfume } of PERFUME_ADDITIONS) {
 for (const plant of plants) {
  PERFUME_EXAMPLES[plant] = [...(PERFUME_EXAMPLES[plant] || []), perfume];
 }
}
