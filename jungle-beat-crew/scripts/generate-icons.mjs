// No copyrighted game art is imported. Original Jungle Beat Crew gorilla icon.
// Draws a 1024x1024 PNG with only Node.js built-in modules.
import fs from 'node:fs';import zlib from 'node:zlib';
const W=1024,H=1024,pixels=Buffer.alloc(W*H*4),TAU=Math.PI*2;
function put(x,y,r,g,b,a=1){if(x<0||y<0||x>=W||y>=H)return;const i=(y*W+x)*4,t=Math.min(1,Math.max(0,a));let old=pixels[i+3]/255;let oa=t+old*(1-t);if(oa===0)return;pixels[i]=Math.round((r*t+pixels[i]*old*(1-t))/oa);pixels[i+1]=Math.round((g*t+pixels[i+1]*old*(1-t))/oa);pixels[i+2]=Math.round((b*t+pixels[i+2]*old*(1-t))/oa);pixels[i+3]=Math.round(oa*255);}
function color(c){return [parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)]}
function ellipse(cx,cy,rx,ry,hex,opacity=1){const [r,g,b]=color(hex);for(let y=Math.max(0,Math.floor(cy-ry-2));y<=Math.min(H-1,Math.ceil(cy+ry+2));y++)for(let x=Math.max(0,Math.floor(cx-rx-2));x<=Math.min(W-1,Math.ceil(cx+rx+2));x++){const d=Math.sqrt(((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2);const aa=Math.min(1,Math.max(0,(1-d)*Math.min(rx,ry)));if(aa)put(x,y,r,g,b,opacity*aa);}}
function line(x1,y1,x2,y2,width,hex){const [r,g,b]=color(hex);let minX=Math.max(0,Math.floor(Math.min(x1,x2)-width)),maxX=Math.min(W-1,Math.ceil(Math.max(x1,x2)+width));let minY=Math.max(0,Math.floor(Math.min(y1,y2)-width)),maxY=Math.min(H-1,Math.ceil(Math.max(y1,y2)+width));let dx=x2-x1,dy=y2-y1,z=dx*dx+dy*dy;for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){const t=Math.max(0,Math.min(1,((x-x1)*dx+(y-y1)*dy)/(z||1)));const d=Math.hypot(x-(x1+t*dx),y-(y1+t*dy));const aa=Math.min(1,Math.max(0,width/2-d));if(aa)put(x,y,r,g,b,aa)}}

function polygon(points,col,alpha=1) {
 const [r,g,b]=color(col);
 const min=Math.max(0,Math.floor(Math.min(...points.map(p=>p[1]))));
 const max=Math.min(H-1,Math.ceil(Math.max(...points.map(p=>p[1]))));
 for(let y=min;y<=max;y++){const edges=[];
  for(let i=0;i<points.length;i++){const [x1,y1]=points[i],[x2,y2]=points[(i+1)%points.length];
   if(y+.5>=Math.min(y1,y2)&&y+.5<Math.max(y1,y2)&&y1!==y2)edges.push(x1+(y+.5-y1)*(x2-x1)/(y2-y1));}
  edges.sort((a,b)=>a-b);
  for(let j=0;j<edges.length-1;j+=2)for(let x=Math.max(0,Math.ceil(edges[j]));x<=Math.min(W-1,Math.floor(edges[j+1]));x++)put(x,y,r,g,b,alpha);
 }
}
const S=6.6,O=89,T=56;function poly(points,c,a=1){polygon(points.map(([x,y])=>[O+S*x,T+S*y]),c,a)}
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const rad=Math.max(0,1-Math.hypot((x-512)/580,(y-512)/580)),t=y/H;put(x,y,Math.round(15+20*rad+10*t),Math.round(26+54*rad),Math.round(37+40*rad));}
ellipse(512,519,420,420,'#315D58');
ellipse(512,519,380,380,'#6253A8');
poly([[35,75],[18,80],[5,113],[8,130],[27,134],[39,114],[48,89]],'#483F8E');
poly([[18,80],[5,113],[20,115],[35,87]],'#9B82EC');
poly([[92,75],[110,81],[123,113],[120,130],[101,134],[89,114],[80,88]],'#483F8E');
poly([[109,81],[123,113],[109,116],[94,88]],'#9B82EC');
poly([[36,71],[92,71],[103,91],[92,126],[34,126],[25,92]],'#9577E0');
poly([[36,72],[54,81],[47,123],[34,126],[25,91]],'#6754B7');
poly([[91,74],[80,85],[83,125],[93,123],[104,91]],'#6A57B5');
poly([[47,90],[64,85],[81,91],[85,118],[65,127],[44,118]],'#D9D8E2');
poly([[16,43],[13,62],[26,74],[35,62],[26,45]],'#58489A');
poly([[114,43],[115,62],[103,74],[93,62],[102,45]],'#58489A');
poly([[39,9],[72,5],[95,15],[108,38],[104,71],[89,92],[62,96],[37,89],[22,69],[22,36]],'#9B81E4');
poly([[39,9],[22,36],[28,73],[39,80],[46,13]],'#6956B6');
poly([[72,5],[95,15],[107,38],[94,44],[79,15]],'#BBA7EE');
poly([[104,69],[88,91],[67,96],[71,76],[99,51]],'#6E59B8');
poly([[32,44],[39,35],[59,35],[65,43],[63,63],[53,69],[38,66],[31,58]],'#26303D');
poly([[66,42],[74,34],[92,34],[100,45],[96,61],[83,68],[69,63]],'#26303D');
poly([[36,44],[42,39],[56,39],[61,45],[59,60],[51,64],[41,61],[35,56]],'#FFF8EC');
poly([[71,43],[76,39],[90,39],[95,45],[92,57],[83,63],[74,59]],'#FFF8EC');
ellipse(49*S+O,53*S+T,5*S,7*S,'#222B33');
ellipse(83*S+O,52*S+T,5*S,7*S,'#222B33');
ellipse(51*S+O,50*S+T,2*S,2*S,'#FFFFFF');
ellipse(85*S+O,49*S+T,2*S,2*S,'#FFFFFF');
poly([[48,64],[65,61],[83,64],[93,73],[88,87],[67,92],[43,87],[36,75]],'#A5ACAE');
poly([[48,65],[65,61],[62,87],[43,86],[36,75]],'#E0E0D7');
ellipse(59*S+O,74*S+T,3*S,2*S,'#454B58');ellipse(74*S+O,74*S+T,3*S,2*S,'#454B58');
poly([[55,80],[64,86],[74,85],[79,80],[76,85],[66,89],[56,85]],'#53545F');
line(720,78,720,196,39,'#C7FC6C');line(718,81,779,81,29,'#C7FC6C');line(777,81,777,165,28,'#C7FC6C');
ellipse(705,210,33,24,'#C7FC6C');ellipse(765,179,29,22,'#C7FC6C');
// Make PNG from RGBA data.
const raw=Buffer.alloc((W*4+1)*H);for(let y=0;y<H;y++){const offset=y*(W*4+1);raw[offset]=0;pixels.copy(raw,offset+1,y*W*4,(y+1)*W*4)}
const CRC=(()=>{let table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;table[n]=c>>>0;}return b=>{let c=-1;for(const x of b)c=table[(c^x)&255]^(c>>>8);return (c^-1)>>>0}})();
function chunk(type,data){const t=Buffer.from(type);const len=Buffer.alloc(4);len.writeUInt32BE(data.length);const tail=Buffer.alloc(4);tail.writeUInt32BE(CRC(Buffer.concat([t,data])));return Buffer.concat([len,t,data,tail])}
const hdr=Buffer.alloc(13);hdr.writeUInt32BE(W,0);hdr.writeUInt32BE(H,4);hdr[8]=8;hdr[9]=6;
const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',hdr),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
const out=new URL('../assets/icon.png',import.meta.url);fs.writeFileSync(out,png);fs.copyFileSync(out,new URL('../assets/splash.png',import.meta.url));
console.log('Created original PNG icon and splash.');