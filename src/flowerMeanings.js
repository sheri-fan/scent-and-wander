// Cultural symbolism, not biological properties. Meanings vary by source and era.
const almanac='https://www.almanac.com/flower-meanings-language-flowers';
const smithsonian='https://gardens.si.edu/meaning-of-flowers';
const meaning=(en,zh,contextEn,contextZh,url)=>({en,zh,contextEn,contextZh,url});
export const FLOWER_MEANINGS={
 Lavender:meaning('Devotion / distrust','專情／猜疑','Garden symbolism and Victorian dictionaries give contrasting readings.','園藝花語與維多利亞花語辭典，對薰衣草有不同詮釋。',almanac),
 'Rose Bush':meaning('Love; happiness for pink roses','愛情；粉玫瑰也代表幸福','Colour matters: red and pink roses carry different messages.','花色會改變寓意：紅玫瑰與粉玫瑰傳遞的訊息不同。',almanac),
 Hydrangea:meaning('Gratitude for understanding','感謝理解','Some historical dictionaries also give colder, less affectionate readings.','部分歷史花語辭典，也記錄了冷淡等不同解讀。',almanac),
 Daisy:meaning('Innocence','純真','A traditional flower-dictionary association.','傳統花語辭典中的一種象徵。',almanac),
 Tulip:meaning('Passion','熱情','Smithsonian Gardens presents this as a historical flower-language meaning.','史密森花園將它列為歷史花語的一種。',smithsonian),
 Bluebell:meaning('Kindness','善意','This Smithsonian interpretation specifically refers to English bluebells.','史密森的這項解讀，指的是英國藍鈴花。',smithsonian),
 Sunflower:meaning('Adoration','傾慕','The cited dictionary assigns this to dwarf sunflowers; tall ones have a different reading.','引用的辭典將此寓意用於矮性向日葵；高性種類有另一種解讀。',almanac),
 Cosmos:meaning('Harmony, balance and peace','和諧、平衡與和平','A floral-symbolism association described in the Almanac’s October birth-flower guide.','見於《農民曆》十月誕生花介紹中的象徵解讀。','https://www.almanac.com/october-birth-flowers'),
 Pansy:meaning('Thoughts','思念','A traditional association with thinking of someone.','傳統上與想起某個人、寄託思念相連。',almanac),
 Jasmine:meaning('Sweet love and friendliness','甜蜜的愛與親切','This entry refers to white jasmine.','這項花語指的是白色茉莉。',almanac),
 'Orange Blossom':meaning('Innocence and lasting love','純潔與長久的愛','A wedding-flower tradition described by florists.','花藝文化中，與婚禮花卉相連的寓意。','https://www.fromyouflowers.com/flower-resource/meaning-of-flowers.htm'),
 Iris:meaning('Faith, wisdom and hope','信念、智慧與希望','These meanings are recorded in a flower-language dictionary.','這些寓意見於花語辭典。',almanac),
 Rosemary:meaning('Remembrance','追憶與紀念','Herbs, as well as flowers, could carry symbolic messages.','除了花朵，芳香草本也能寄託象徵訊息。',smithsonian)
};
export const MEANING_LABELS={
 en:{title:'THE LANGUAGE OF FLOWERS',note:'Meanings vary with culture, period and flower colour.',source:'Symbolism source',missing:'No specific traditional meaning has been verified in the references reviewed for this plant.',background:'About flower symbolism'},
 'zh-Hant':{title:'花語',note:'花語會隨文化、時代與花色而有所不同。',source:'花語來源',missing:'本次查閱的資料中，尚未核實這種植物的特定傳統花語。',background:'認識花語文化'}
};
