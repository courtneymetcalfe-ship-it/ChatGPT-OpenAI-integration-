// No copyrighted game art is imported. Original Jungle Beat Crew gorilla icon.
// Draws a 1024x1024 PNG with only Node.js built-in modules.
import fs from 'node:fs';import zlib from 'node:zlib';
const W=1024,H=1024,pixels=Buffer.alloc(W*H*4),TAU=Math.PI*2;
function put(x,y,r,g,b,a=1){if(x<0||y<0||x>=W||y>=H)return;const i=(y*W+x)*4,t=Math.min(1,Math.max(0,a));let old=pixels[i+3]/255;let oa=t+old*(1-t);if(oa===0)return;pixels[i]=Math.round((r*t+pixels[i]*old*(1-t))/oa);pixels[i+1]=Math.round((g*t+pixels[i+1]*old*(1-t))/oa);pixels[i+2]=Math.round((b*t+pixels[i+2]*old*(1-t))/oa);pixels[i+3]=Math.round(oa*255);}
function color(c){return [parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)]}
function ellipse(cx,cy,rx,ry,hex,opacity=1){const [r,g,b]=color(hex);for(let y=Math.max(0,Math.floor(cy-ry-2));y<=Math.min(H-1,Math.ceil(cy+ry+2));y++)for(let x=Math.max(0,Math.floor(cx-rx-2));x<=Math.min(W-1,Math.ceil(cx+rx+2));x++){const d=Math.sqrt(((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2);const aa=Math.min(1,Math.max(0,(1-d)*Math.min(rx,ry)));if(aa)put(x,y,r,g,b,opacity*aa);}}
function line(x1,y1,x2,y2,width,hex){const [r,g,b]=color(hex);let minX=Math.max(0,Math.floor(Math.min(x1,x2)-width)),maxX=Math.min(W-1,Math.ceil(Math.max(x1,x2)+width));let minY=Math.max(0,Math.floor(Math.min(y1,y2)-width)),maxY=Math.min(H-1,Math.ceil(Math.max(y1,y2)+width));let dx=x2-x1,dy=y2-y1,z=dx*dx+dy*dy;for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){const t=Math.max(0,Math.min(1,((x-x1)*dx+(y-y1)*dy)/(z||1)));const d=Math.hypot(x-(x1+t*dx),y-(y1+t*dy));const aa=Math.min(1,Math.max(0,width/2-d));if(aa)put(x,y,r,g,b,aa)}}
for(let y=0;y<H;y++)for(let x=0;x<W;x++){let t=y/H,rad=Math.hypot((x-W*.5)/W,(y-H*.4)/H);let glow=Math.max(0,1-rad*1.8);put(x,y,Math.round(10+5*t+20*glow),Math.round(37+25*glow),Math.round(46+9*t+17*glow));}
ellipse(520,489,360,362,'#1D7266',.38);ellipse(520,467,300,302,'#9DFA93',.1);
ellipse(151,240,115,246,'#216B5D',.7);ellipse(900,219,97,258,'#276E58',.75);
line(110,150,260,395,30,'#1E866D');line(919,131,752,404,26,'#1C8065');
ellipse(510,839,347,220,'#4E5DAB');ellipse(200,670,89,158,'#665FA5');ellipse(836,665,90,158,'#665FA5');
ellipse(204,425,118,129,'#6E64B9');ellipse(815,425,118,129,'#6E64B9');ellipse(204,425,69,84,'#E8B39D');ellipse(815,425,69,84,'#E8B39D');
ellipse(512,492,323,353,'#9B8EED');ellipse(512,565,233,183,'#F9D9B0');
ellipse(419,426,68,91,'#FFF4DC');ellipse(605,426,68,91,'#FFF4DC');
ellipse(442,444,31,49,'#263249');ellipse(582,444,31,49,'#263249');ellipse(452,429,11,15,'#FFFFFF');ellipse(592,429,11,15,'#FFFFFF');
ellipse(462,569,27,18,'#806D84');ellipse(560,569,27,18,'#806D84');
for(let i=0;i<16;i++){const a=(i/15)*Math.PI;const x1=424+i*11.7,y1=617+48*Math.sin(a);if(i){const a0=((i-1)/15)*Math.PI;line(424+(i-1)*11.7,617+48*Math.sin(a0),x1,y1,18,'#795E69');}}
ellipse(355,587,30,17,'#F2A7AE',.5);ellipse(664,587,30,17,'#F2A7AE',.5);
// Oversized lime headband and antenna-like music symbols.
line(240,305,355,210,45,'#A4F26D');line(355,210,666,205,45,'#A4F26D');line(666,205,772,296,45,'#A4F26D');
ellipse(742,100,24,25,'#FFB6CF');line(759,94,759,32,16,'#FFB6CF');line(759,32,807,17,14,'#FFB6CF');ellipse(801,82,21,23,'#FFB6CF');line(817,80,817,8,16,'#FFB6CF');
// Make PNG from RGBA data.
const raw=Buffer.alloc((W*4+1)*H);for(let y=0;y<H;y++){const offset=y*(W*4+1);raw[offset]=0;pixels.copy(raw,offset+1,y*W*4,(y+1)*W*4)}
const CRC=(()=>{let table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;table[n]=c>>>0;}return b=>{let c=-1;for(const x of b)c=table[(c^x)&255]^(c>>>8);return (c^-1)>>>0}})();
function chunk(type,data){const t=Buffer.from(type);const len=Buffer.alloc(4);len.writeUInt32BE(data.length);const tail=Buffer.alloc(4);tail.writeUInt32BE(CRC(Buffer.concat([t,data])));return Buffer.concat([len,t,data,tail])}
const hdr=Buffer.alloc(13);hdr.writeUInt32BE(W,0);hdr.writeUInt32BE(H,4);hdr[8]=8;hdr[9]=6;
const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',hdr),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
const out=new URL('../assets/icon.png',import.meta.url);fs.writeFileSync(out,png);fs.copyFileSync(out,new URL('../assets/splash.png',import.meta.url));
console.log('Created original PNG icon and splash.');