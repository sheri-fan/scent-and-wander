// Decorative lettering ornament, drawn locally so it remains crisp at any size.
export default function TitleVines(){
 const leaves=[
  [24,42,-50,.85],[30,68,135,.7],[24,106,-120,.8],[63,128,20,.8],
  [111,124,155,.7],[163,131,-10,.85],[230,129,175,.65],
  [380,126,15,.7],[440,117,155,.8],[509,111,-25,.8],
  [548,87,145,.8],[554,56,-45,.75],[543,28,155,.65],
 ];
 return <svg className="title-vines" viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true" focusable="false">
  <g className="vine-stems" fill="none" strokeLinecap="round" strokeLinejoin="round">
   <path d="M42 15C12 32 14 54 30 69S49 96 25 108C10 119 28 137 61 129S113 119 162 131S233 137 257 125C287 111 321 149 354 135"/>
   <path d="M354 135C391 119 416 131 443 117S484 129 510 111S535 92 550 85C575 73 548 56 549 41S555 21 569 12"/>
   <path className="vine-tendril" d="M162 131C173 112 192 111 192 122C192 133 178 128 183 121M510 111C499 92 515 77 524 86C532 95 517 100 517 91M30 69C49 55 59 44 52 36C44 27 37 42 46 43"/>
  </g>
  <g className="vine-leaves">{leaves.map(([x,y,angle,scale],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
   <path d="M0 0C-3-11 5-22 15-26C20-13 13-2 0 0Z"/>
   <path className="leaf-vein" d="M1-1 12-22"/>
  </g>)}</g>
 </svg>;
}
