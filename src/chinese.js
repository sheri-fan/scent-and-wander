import {Converter} from 'opencc-js/t2cn';

const convert=Converter({from:'tw',to:'cn'});
// Convert presentation data without changing IDs, source URLs, or the originals.
export function simplified(value){
 if(typeof value==='string')return /^https?:\/\//.test(value)?value:convert(value);
 if(typeof value==='function')return (...args)=>simplified(value(...args));
 if(Array.isArray(value))return value.map(simplified);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,simplified(item)]));
 return value;
}
export const chineseText=(value,language)=>language==='zh-Hans'?simplified(value):value;
