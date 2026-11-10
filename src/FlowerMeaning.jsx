import {FLOWER_MEANINGS,MEANING_LABELS} from './flowerMeanings.js';
import {chineseText} from './chinese.js';
export default function FlowerMeaning({name,language}){
 const labels=chineseText(MEANING_LABELS[language==='en'?'en':'zh-Hant'],language),meaning=chineseText(FLOWER_MEANINGS[name],language),zh=language!=='en';
 return <section className={`flower-meaning ${meaning?'':'flower-meaning-unrecorded'}`} aria-label={labels.title}><h3>{labels.title}</h3>{meaning?<><p className="meaning-words">{zh?meaning.zh:meaning.en}</p><p className="meaning-context">{zh?meaning.contextZh:meaning.contextEn}</p><small>{labels.note}</small><a href={meaning.url} target="_blank" rel="noreferrer">{labels.source} ↗</a>{name==='Lavender'&&<a href="https://www.nhg.com/wp-content/uploads/2016/02/Herb-List.pdf" target="_blank" rel="noreferrer">{chineseText(zh?'園藝象徵資料':'Garden symbolism reference',language)} ↗</a>}</>:<p className="meaning-context">To Be Contiune...</p>}</section>;
}
