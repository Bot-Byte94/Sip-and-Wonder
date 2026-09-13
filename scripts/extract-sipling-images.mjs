// Split the existing artwork into standalone files. Connected pieces are assigned
// whole, rather than cutting through wings or tails at atlas-cell boundaries.
import fs from 'node:fs';
import sharp from 'sharp';
import {buildSync} from 'esbuild';
const source=buildSync({entryPoints:['lib/creatures.ts'],bundle:true,platform:'node',format:'esm',write:false}).outputFiles[0].text;
const {creatures}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const atlas=JSON.parse(fs.readFileSync('lib/creature-atlas.json'));
fs.mkdirSync('public/siplings',{recursive:true});
fs.mkdirSync('work/isolated',{recursive:true});
const report=[];
for(const [sheetId,sheet] of Object.entries(atlas)){
 const {data,info}=await sharp('public/'+sheet.file).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const {width:w,height:h,channels}=info,n=w*h;
 const labels=new Int32Array(n),components=[null],queue=new Int32Array(n);
 const dark=i=>Math.min(data[i*channels],data[i*channels+1],data[i*channels+2])<228;
 const centers=sheet.cells.map(([x,y,cw,ch])=>[x+cw/2,y+ch/2,cw,ch]);
 const owner=(x,y)=>{let best=0,distance=Infinity;for(let c=0;c<centers.length;c++){const [cx,cy,cw,ch]=centers[c];const d=((x-cx)/cw)**2+((y-cy)/ch)**2;if(d<distance){distance=d;best=c;}}return best;};
 for(let i=0;i<n;i++){
  if(labels[i]||!dark(i))continue;
  const id=components.length;let head=0,tail=1;queue[0]=i;labels[i]=id;
  let minX=w,minY=h,maxX=0,maxY=0;const votes=new Int32Array(centers.length);
  while(head<tail){const p=queue[head++],x=p%w,y=Math.floor(p/w);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);votes[owner(x,y)]++;
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;let nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;let np=ny*w+nx;if(!labels[np]&&dark(np)){labels[np]=id;queue[tail++]=np;}}
  }
  const rank=Array.from(votes,(v,c)=>({v,c})).sort((a,b)=>b.v-a.v);
  components.push({owner:rank[0].c,area:tail,minX,minY,maxX,maxY,ambiguous:rank[1].v>tail*.16&&rank[1].v>1500});
 }
 const ambiguous=components.filter(c=>c?.ambiguous);
 for(let cell=0;cell<sheet.cells.length;cell++){
  if(sheetId==='12'&&[22,27].includes(cell))continue; // Individually redrawn: touching source artwork.
  const selected=components.map((c,id)=>({...c,id})).filter(c=>c.owner===cell&&c.area>=12);
  if(!selected.length)throw Error('No creature at '+sheetId+':'+cell);
  const ids=new Set(selected.map(c=>c.id));
  const x=Math.max(0,Math.min(...selected.map(c=>c.minX))-4),y=Math.max(0,Math.min(...selected.map(c=>c.minY))-4);
  const right=Math.min(w,Math.max(...selected.map(c=>c.maxX))+5),bottom=Math.min(h,Math.max(...selected.map(c=>c.maxY))+5),cw=right-x,ch=bottom-y;
  // A small dilation retains antialiased outlines and faint neighboring highlights.
  const mask=new Uint8Array(cw*ch);
  for(let yy=0;yy<ch;yy++)for(let xx=0;xx<cw;xx++){if(!ids.has(labels[(y+yy)*w+x+xx]))continue;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){let nx=xx+dx,ny=yy+dy;if(nx>=0&&ny>=0&&nx<cw&&ny<ch)mask[ny*cw+nx]=1;}}
  // Fill enclosed white interiors, preserving white fur and clouds.
  let head=0,tail=0;const outside=new Uint8Array(cw*ch);
  const add=p=>{if(!mask[p]&&!outside[p]){outside[p]=1;queue[tail++]=p;}};
  for(let xx=0;xx<cw;xx++){add(xx);add((ch-1)*cw+xx)}for(let yy=0;yy<ch;yy++){add(yy*cw);add(yy*cw+cw-1)}
  while(head<tail){const p=queue[head++],xx=p%cw,yy=Math.floor(p/cw);if(xx)add(p-1);if(xx<cw-1)add(p+1);if(yy)add(p-cw);if(yy<ch-1)add(p+cw);}
  const rgba=Buffer.alloc(cw*ch*4,255);
  for(let yy=0;yy<ch;yy++)for(let xx=0;xx<cw;xx++){let p=yy*cw+xx;if(!mask[p]&&outside[p])continue;let src=((y+yy)*w+x+xx)*channels;for(let c=0;c<3;c++)rgba[p*4+c]=data[src+c];}
  const file=`work/isolated/${sheetId}-${cell}.webp`;
  await sharp(rgba,{raw:{width:cw,height:ch,channels:4}}).resize(336,336,{fit:'contain',background:'#ffffff'}).extend({top:24,bottom:24,left:24,right:24,background:'#ffffff'}).webp({quality:94}).toFile(file);
  report.push({sheet:Number(sheetId),cell,file,bounds:[x,y,cw,ch],ambiguous:selected.some(c=>c.ambiguous),components:selected.length});
 }
 console.log('Sheet',sheetId,'complete; connected overlaps to review:',ambiguous.length);
}
for(const c of creatures){if(c.sheet===12&&[22,27].includes(c.cell))continue;fs.copyFileSync(`work/isolated/${c.sheet}-${c.cell}.webp`,`public/siplings/${c.id}.webp`);}
fs.writeFileSync('work/extraction-report.json',JSON.stringify(report,null,2));
for(const c of creatures)if(!fs.existsSync(`public/siplings/${c.id}.webp`))throw Error(`Missing standalone image for ${c.id}; preserve the hand-reviewed repair assets.`);
console.log('Verified',creatures.length,'individual Sipling image files.');
