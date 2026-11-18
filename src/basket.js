import {SCENT_NOTES} from './workshop.js';
export const BASKET_KEY='scent-and-wander-flower-basket';
export function cleanBasket(value){return Array.isArray(value)?[...new Set(value.filter(id=>typeof id==='string'&&SCENT_NOTES.some(n=>n.id===id)))]:[];}
export function loadBasket(){try{return cleanBasket(JSON.parse(localStorage.getItem(BASKET_KEY)));}catch{return [];}}
export function collectInBasket(basket,id){
 return storeBasket([...basket,id]);
}
export function removeFromBasket(basket,id){return storeBasket(cleanBasket(basket).filter(item=>item!==id));}
function storeBasket(value){
 const next=cleanBasket(value);
 try{localStorage.setItem(BASKET_KEY,JSON.stringify(next));return {basket:next,saved:true};}catch{return {basket:next,saved:false};}
}
export function canBlendFromBasket(notes,basket){
 const owned=cleanBasket(basket);
 return Array.isArray(notes)&&notes.length===3&&notes.every(n=>n&&owned.includes(n.id)&&Number.isInteger(n.parts)&&n.parts>=1&&n.parts<=10)&&new Set(notes.map(n=>n.id)).size===3;
}
