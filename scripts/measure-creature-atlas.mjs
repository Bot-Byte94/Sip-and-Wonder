import sharp from 'sharp';
import fs from 'node:fs';
const sheets=[1,2,3,4,5,6,7,8,9,10,11,12];
let atlas={};
for(const n of sheets){
 const cols=n<4?4:5,rows=n<4?3:6;
 const file=`roster-${n}${![1,4,7,10].includes(n)?'-evolved':''}.webp`;
 const {data,info}=await sharp('public/'+file).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const {width:w,height:h,channels:ch}=info;
 const ink=(x,y)=>{let i=(y*w+x)*ch;return Math.min(data[i],data[i+1],data[i+2])<218?1:0};
 function seam(expect,radius,min,max,cost){let best=expect,bestCost=Infinity;for(let p=Math.max(min,Math.round(expect-radius));p<Math.min(max,expect+radius);p++){let score=cost(p)+Math.abs(p-expect)*.04;if(score<bestCost){bestCost=score;best=p}}return best;}
 const ys=[0];for(let r=1;r<rows;r++)ys.push(seam(r*h/rows,h/rows*.3,ys.at(-1)+50,h-50,y=>{let c=0;for(let x=0;x<w;x++)c+=ink(x,y);return c;}));ys.push(h);
 const cells=[];const clips=[];
 function boundary(x0,x1,expected){
 if(expected===0||expected===h)return [[x0,expected],[x1,expected]];
 const lo=Math.max(0,expected-36),hi=Math.min(h-1,expected+36),size=hi-lo+1;
 let prev=Array(size).fill(0);const traces=[];
 for(let x=x0;x<x1;x++){let next=Array(size).fill(Infinity),trace=[];
 for(let i=0;i<size;i++){let best=i;for(let j=Math.max(0,i-1);j<=Math.min(size-1,i+1);j++)if(prev[j]+Math.abs(j-i)*.12<prev[best]+Math.abs(best-i)*.12)best=j;
 const y=lo+i;next[i]=prev[best]+Math.abs(best-i)*.12+ink(x,y)*30+Math.abs(y-expected)*.012;trace[i]=best;}
 prev=next;traces.push(trace);}
 let i=prev.indexOf(Math.min(...prev)),points=[];
 for(let x=x1-1;x>=x0;x--){points.push([x,lo+i]);i=traces[x-x0][i];}points.reverse();points.push([x1,points.at(-1)[1]]);
 return points.filter((p,i,a)=>i===0||i===a.length-1||(p[1]-a[i-1][1])!==(a[i+1][1]-p[1]));
 }
 for(let r=0;r<rows;r++){
 const xs=[0];for(let c=1;c<cols;c++)xs.push(seam(c*w/cols,w/cols*.25,xs.at(-1)+50,w-50,x=>{let v=0;for(let y=ys[r];y<ys[r+1];y++)v+=ink(x,y);return v;}));xs.push(w);
 for(let c=0;c<cols;c++){
 const top=boundary(xs[c],xs[c+1],ys[r]);
 const bottom=boundary(xs[c],xs[c+1],ys[r+1]);
 const minY=Math.min(...top.map(p=>p[1])),maxY=Math.max(...bottom.map(p=>p[1]));
 cells.push([xs[c],minY,xs[c+1]-xs[c],maxY-minY]);
 clips.push([...top,...bottom.reverse()].map(p=>p.join(',')).join(' '));
 }
 }
 atlas[n]={file,width:w,height:h,cells,clips};console.log(n,'rows',ys);
}
fs.writeFileSync('lib/creature-atlas.json',JSON.stringify(atlas,null,2)+'\n');
