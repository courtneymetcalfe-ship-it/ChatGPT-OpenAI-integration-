// Deterministic, ORIGINAL sound synthesis. Runs during npm install and before cloud builds.
// Creates ten 2-bar, 112 BPM, 22,050 Hz PCM WAV loops with precisely the same frame count.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = new URL('../assets/audio/', import.meta.url);
fs.mkdirSync(ROOT, {recursive: true});
const SR = 22050, BPM = 112, LEN = Math.round(SR * 8 * 60 / BPM), TAU = Math.PI * 2;
const BEAT = 60 / BPM;
function prng(seed) {let a = seed|0;return () => {a ^= a<<13; a ^= a>>>17; a ^= a<<5;return ((a>>>0)/4294967296)*2-1;};}
const noise = prng(12345);
const clamp = x => Math.max(-1, Math.min(1,x));
const sine = t => Math.sin(TAU*t);
const notes = { C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196,A3:220,B3:246.94,C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.26,G5:783.99 };
function kick(t){if(t<0 || t>.45)return 0;return (sine(70*t + 95*(1-Math.exp(-t*35))/TAU)*Math.exp(-t*13)+.16*noise()*Math.exp(-t*95))*.88;}
function snare(t){if(t<0||t>.22)return 0;return (.75*noise()+.25*sine(170*t))*Math.exp(-t*19);}
function hat(t){if(t<0||t>.13)return 0;return (.75*noise()+.2*sine(3400*t))*Math.exp(-t*37);}
function tom(t){if(t<0||t>.36)return 0;return sine(145*t+40*(1-Math.exp(-t*22))/TAU)*Math.exp(-t*10);}
function bass(t,f){if(t<0||t>.7)return 0;const env=Math.min(1,t*24)*Math.exp(-t*4.8);return (sine(f*t)+.24*sine(f*2*t))*env*.75;}
function pluck(t,f){if(t<0||t>.65)return 0;return (sine(f*t)+.31*sine(f*2*t)+.16*sine(f*3*t))*Math.exp(-t*7)*.48;}
function bell(t,f){if(t<0||t>1.6)return 0;return (sine(f*t)+.42*sine(f*2.02*t)+.2*sine(f*3.01*t))*Math.exp(-t*3.4)*.34;}
function pad(t,f){if(t<0||t>.85)return 0;const e=Math.min(1,t*5)*Math.max(0,1-t/.85);return (.7*sine(f*t)+.26*sine(f*1.998*t))*e*.4;}
function vocal(t, f){if(t<0||t>.48)return 0;const bend=1+.045*sine(5*t),env=Math.sin(Math.PI*Math.min(1,t/.48))**2;return (sine(f*t*bend)+.45*sine(f*2*t*bend)+.22*sine(f*3*t*bend))*env*.28;}
function events(pattern,fn){return t => {let r=0;for(const [beat,...params] of pattern){const d=t-beat*BEAT;if(d>=0&&d<1.7)r+=fn(d,...params);}return r;};}
const eights=Array.from({length:16},(_,i)=>[i*.5]);
const modes = [
  events([[0],[1],[2],[3],[4],[5],[6],[7]],kick),
  events([[1],[3],[5],[7]],snare),
  events(eights,hat),
  events([[0,notes.C3],[1.5,notes.C3],[2,notes.G3],[3.5,notes.G3],[4,notes.A3],[5.5,notes.G3],[6,notes.F3],[7,notes.G3]],bass),
  events([[0,notes.C4],[0,notes.E4],[0,notes.G4],[2,notes.F4],[2,notes.A4],[2,notes.C5],[4,notes.G4],[4,notes.B4],[4,notes.D5],[6,notes.G4],[6,notes.B4],[6,notes.D5]],pad),
  events([[0,notes.E4],[.75,notes.G4],[1.5,notes.A4],[2,notes.G4],[3,notes.E4],[4,notes.D4],[5.5,notes.E4],[6.5,notes.G4],[7,notes.C5]],pluck),
  events([[0,notes.C5],[2,notes.G5],[4,notes.A4],[5,notes.E5],[6,notes.D5]],bell),
  events([[.5],[1.5],[2.5],[3.5],[4.5],[5.5],[6.5],[7.5]],tom),
  events([[0,notes.C4],[1.5,notes.E4],[2.5,notes.D4],[4,notes.G3],[5.5,notes.C4],[7,notes.E4]],vocal),
  events([[.25,notes.C5],[.75,notes.E5],[1.25,notes.G5],[1.75,notes.E5],[2.25,notes.D5],[2.75,notes.G5],[3.25,notes.D5],[3.75,notes.G4],[4.25,notes.A4],[4.75,notes.C5],[5.25,notes.E5],[5.75,notes.C5],[6.25,notes.G4],[6.75,notes.B4],[7.25,notes.D5],[7.75,notes.G4]],pluck)
];
const names = ['01-pongo','02-clappy','03-shiver','04-rumble','05-luma','06-pip','07-glimmer','08-tiki','09-roo','10-spark'];
for(let track=0;track<modes.length;track++){
  const samples=Buffer.alloc(LEN*2), fn=modes[track];
  // Small fade at loop edge; loops share common tempo and sample length.
  for(let i=0;i<LEN;i++){
    const time=i/SR, v=fn(time);
    const gain=Math.min(1,i/220,(LEN-1-i)/220);
    samples.writeInt16LE(Math.round(clamp(v*gain*.72)*32767),i*2);
  }
  const header=Buffer.alloc(44);
  header.write('RIFF',0);header.writeUInt32LE(36+samples.length,4);header.write('WAVEfmt ',8);
  header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(1,22);
  header.writeUInt32LE(SR,24);header.writeUInt32LE(SR*2,28);
  header.writeUInt16LE(2,32);header.writeUInt16LE(16,34);
  header.write('data',36);header.writeUInt32LE(samples.length,40);
  fs.writeFileSync(new URL(names[track]+'.wav',ROOT),Buffer.concat([header,samples]));
}
console.log(`Created ${names.length} original rhythm loops (112 BPM).`);