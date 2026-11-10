import { PERFUME_EXAMPLES } from './perfumeExamples.js';
import { PERFUME_ORIGINS } from './perfumeOrigins.js';
import { PLANT_KNOWLEDGE } from './plantKnowledge.js';
import {simplified} from './chinese.js';
export const LANGUAGES = ['zh-Hant', 'zh-Hans', 'en'];
export const MESSAGES = {
 en: {
  museum:'VIRTUAL PERFUME MUSEUM',experience:'EXPERIENCE NO. 001',quiet:'A quiet place, just for a moment',home:'Scent & Wander home',welcome:'Welcome to the forest',invitation:'AN INVITATION TO SLOW DOWN',titleFirst:'Scent &',titleSecond:'Wander',introFirst:'Follow the light. Find your own path.',introSecond:'Let the world outside fall away.',preparing:'Preparing the forest…',enter:'Enter the Forest',return:'Return to the Forest',waiting:'Your walk is waiting for you.',wander:'A little space to wander. No destination required.',lockError:'Mouse capture was blocked. Please try again in the browser window.',exploring:'SCENT & WANDER',time:'Take your time.',discover:'Click to discover',herbarium:'THE WOODLAND HERBARIUM',discovery:'A SMALL DISCOVERY',palette:'IN THE PERFUMER’S PALETTE',harvest:'FROM PLANT TO PERFUME',method:'How it is used',regions:'Major growing & production regions',scope:'What these regions describe',originSources:'Ingredient & origin sources',part:'Fragrant part',scent:'Scent character',reading:'Botanical reading',continue:'Continue exploring',resume:'Your walk continues from this spot.',woodland:'THE WOODLAND',stillness:'A quiet moment among the trees',controls:'Exploration controls',walk:'Walk',look:'Look · click plants',faster:'Wander faster',pause:'Pause',morning:'MORNING LIGHT',summer:'EARLY SUMMER',failed:'The forest couldn’t load.',webgl:'Please use a desktop browser with WebGL enabled, then refresh this page.',language:'Language',closer:'ABOUT THIS PLANT',botanical:'Botanical reference',profile:'What is it?',growing:'Growth and habitat',fact:'Did you know?',source:'Knowledge source',exhibit:'Exhibit description',original:'Original English text',count:(n,total)=>`${n} of ${total} woodland discoveries`,
 },
 'zh-Hant': {
  museum:'虛擬香水博物館',experience:'體驗篇章 001',quiet:'留一點時間，享受片刻寧靜',home:'循香漫遊首頁',welcome:'歡迎來到森林',invitation:'邀請你，慢下腳步',titleFirst:'循香',titleSecond:'漫遊',introFirst:'循著光，走出自己的小徑。',introSecond:'讓外頭的喧囂，暫時遠去。',preparing:'森林準備中⋯',enter:'走進森林',return:'回到森林',waiting:'你的漫步，隨時可以繼續。',wander:'留一點空間漫步，不必急著抵達。',lockError:'瀏覽器未允許鎖定滑鼠，請在瀏覽器視窗中再試一次。',exploring:'循香漫遊',time:'慢慢走，別著急。',discover:'點擊探索植物',herbarium:'森林植物圖鑑',discovery:'一個小小的發現',palette:'調香師的香氣調色盤',harvest:'從植物到香水',method:'如何製成原料？',regions:'主要栽培與生產地',scope:'這裡比較的是',originSources:'原料與產地來源',part:'取香部位',scent:'香氣特色',reading:'延伸閱讀（原文）',continue:'繼續探索',resume:'從剛才停下的地方，繼續漫步。',woodland:'林間漫步',stillness:'在林間，輕享一刻寧靜',controls:'探索操作說明',walk:'移動',look:'環顧・點擊植物',faster:'加快腳步',pause:'暫停',morning:'晨間微光',summer:'初夏',failed:'森林暫時無法載入。',webgl:'請使用支援 WebGL 的桌面瀏覽器，然後重新整理頁面。',language:'語言',closer:'認識這種植物',botanical:'植物學參考',profile:'它是什麼？',growing:'生長與環境',fact:'你知道嗎？',source:'知識來源',exhibit:'展品描述',original:'閱讀英文原文',count:(n,total)=>`已探索 ${n}／${total} 種`,
 }
};
MESSAGES['zh-Hans']=simplified(MESSAGES['zh-Hant']);
export function initialLanguage(){try{const saved=localStorage.getItem('whispering-forest-language');return LANGUAGES.includes(saved)?saved:'en';}catch{return 'en';}}
const TRADITIONAL_PLANTS = {
 'Lavender':{name:'薰衣草',note:'纖細的紫色花穗，聚成一小片柔軟的雲。沿著它們的微光，漫步在森林邊緣。'},
 'Rose Bush':{name:'玫瑰花',note:'玫瑰色花瓣層層交疊，在樹蔭下，綻放成一座發著微光的小花園。'},
 'Hydrangea':{name:'繡球花',note:'藍紫色小花簇擁成雲朵般的花球，每一朵小花，都是這片溫柔的一部分。'},
 'Daisy':{name:'雛菊',note:'潔白花瓣圍繞著金黃色花心，像是散落在森林地面的小小星群。'},
 'Tulip':{name:'鬱金香',note:'粉紅與杏橙色的杯狀花朵，從修長葉片之間探出頭，捧著一點晨光。'},
 'Bluebell':{name:'藍鈴花',note:'小巧的藍色花鐘，在纖細花莖上輕輕低垂，於樹冠下散發安靜的微光。'},
 'Sunflower':{name:'向日葵',note:'金色花瓣圍繞著深琥珀色花心，是這片林間花叢裡最挺拔的身影。'},
 'Cosmos':{name:'波斯菊',note:'輕薄的粉色花瓣，隨著林間微風，在纖細花莖上輕輕搖曳。'},
 'Pansy':{name:'三色堇',note:'絲絨般的紫色與乳白色花瓣，圍著金色小花心，像一張張可愛的林間小臉。'},
 'Little Wildflower Mix':{name:'繽紛野花',note:'粉紅、紫色、白色與金黃，在這片小草地相伴生長，每一朵都有自己的模樣。'},
 'Jasmine':{name:'茉莉',note:'象牙白的小星星，點綴在油亮的綠葉之間。',perfume:{part:'花朵',scent:'馥郁・花香・柔和甜香',story:'茉莉花是重要的花香原料，常用來構築香水的中調。'}},
 'Orange Blossom':{name:'橙花',note:'迷你苦橙樹的綠葉之間，藏著一簇簇潔白花朵。',perfume:{part:'花朵',scent:'清新・花香・柑橘',story:'苦橙花透過蒸餾可取得橙花精油（Neroli），透過溶劑萃取則可製成橙花原精。'}},
 'Iris':{name:'鳶尾',note:'紫色花瓣，從扇形排列的劍狀葉片上方優雅綻放。',perfume:{part:'經熟成的地下根莖',scent:'粉香・紫羅蘭般花香・木質',story:'香水中的鳶尾香原料，取自特定鳶尾品種經熟成的地下根莖，而非醒目的花瓣。'}},
 'Patchouli':{name:'廣藿香',note:'茂密的草本植物，有著寬大的深綠葉片與細小的淡色花穗。',perfume:{part:'乾燥的葉片與嫩枝',scent:'泥土・木質・深沉',story:'乾燥的葉片與嫩枝經蒸汽蒸餾，可取得廣藿香精油，為香水帶來持久的泥土與木質氣息。'}},
 'Vetiver':{name:'香根草',note:'修長草葉像噴泉般向外舒展，在林間邊緣泛著柔和微光。',perfume:{part:'根部',scent:'乾燥・泥土・木質',story:'香根草的芳香根部可提取精油；那股木質氣息，其實來自土壤之下。'}},
 'Rosemary':{name:'迷迭香',note:'纖細的針狀葉片之間，綻放著藍紫色小花。',perfume:{part:'帶葉與花的枝梢',scent:'草本・清新・芳香',story:'迷迭香精油能為香水帶來清新的草本氣息，在古龍水風格的調香中有悠久的使用歷史。'}},
 'Bergamot':{name:'佛手柑',note:'油亮的綠葉間，掛著泛出黃綠色微光的柑橘果實。',perfume:{part:'果皮',scent:'明亮・柑橘・青綠',story:'從佛手柑果皮壓榨取得的精油，常為香水帶來清新明亮的柑橘前調。'}},
 'Ylang-Ylang':{name:'依蘭',note:'迷你熱帶樹的綠葉下，細長的金色花瓣輕輕捲曲、垂落。',perfume:{part:'花朵',scent:'濃郁・花香・甜美',story:'依蘭樹的芳香花朵，可提供濃郁而富有異國情調的花香原料。'}},
};
export function localizePlant(plant,language){
 if(!plant)return null;
 if(language==='zh-Hans')return simplified(localizePlant(plant,'zh-Hant'));
 const translation=TRADITIONAL_PLANTS[plant.name]||plant.translation;
 const origin=PERFUME_ORIGINS[plant.name]||{hasInformation:false,sources:[],en:{},zh:{}};
 const knowledge=PLANT_KNOWLEDGE[plant.name]||plant.knowledge;
 return {...plant,examples:(PERFUME_EXAMPLES[plant.name]||[]).map(example=>({...example,description:example[language==='zh-Hant'?'zh':'en']})),origin:{...origin,...origin[language==='zh-Hant'?'zh':'en']},knowledge:{...knowledge,...knowledge[language==='zh-Hant'?'zh':'en']},name:language==='zh-Hant'?translation.name:plant.name,secondaryName:language==='zh-Hant'?plant.name:translation.name,note:language==='zh-Hant'?translation.note:plant.note,perfume:plant.perfume?{...plant.perfume,...(language==='zh-Hant'?translation.perfume:{})}:undefined};
}
