import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Animated, Dimensions, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {useAudioPlayer, setAudioModeAsync} from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {Circle, Ellipse, G, Path, Rect} from 'react-native-svg';

const BG='#091A21', CREAM='#FFF6DF', MINT='#B9F96B', PALE='#9DB0AD';
const SAVE_KEY='jungle-beat-crew-mixes-v1';
const CREW=[
  {name:'PONGO', role:'Kick', color:'#FFAE73', dark:'#C76747', item:'cap'},
  {name:'CLAPPY', role:'Claps', color:'#FF8190', dark:'#BD4C69', item:'ears'},
  {name:'SHIVER', role:'Shaker', color:'#76DBD0', dark:'#278F96', item:'spike'},
  {name:'RUMBLE', role:'Bass', color:'#B29BFA', dark:'#6D61B6', item:'glasses'},
  {name:'LUMA', role:'Chords', color:'#FC9FCF', dark:'#A65E9F', item:'flower'},
  {name:'PIP', role:'Melody', color:'#F9D87A', dark:'#C2943E', item:'hair'},
  {name:'GLIMMER', role:'Bells', color:'#8BD4FF', dark:'#438BC5', item:'star'},
  {name:'TIKI', role:'Toms', color:'#8DB0FF', dark:'#5466B9', item:'leaf'},
  {name:'ROO', role:'Vox', color:'#B9ED80', dark:'#548C51', item:'headset'},
  {name:'SPARK', role:'Synth', color:'#F1DABC', dark:'#AE8C6A', item:'bolt'},
];
const PRESETS=[
  {name:'JUNGLE BOUNCE', picks:[0,1,2,3,5,7], glyph:'🌿'},
  {name:'MOONLIGHT', picks:[2,4,5,6,8,9], glyph:'🌙'},
  {name:'BANANA BASS', picks:[0,1,3,4,7,8], glyph:'🍌'},
];
const TRACK_ASSETS=[
  require('./assets/audio/01-pongo.wav'),
  require('./assets/audio/02-clappy.wav'),
  require('./assets/audio/03-shiver.wav'),
  require('./assets/audio/04-rumble.wav'),
  require('./assets/audio/05-luma.wav'),
  require('./assets/audio/06-pip.wav'),
  require('./assets/audio/07-glimmer.wav'),
  require('./assets/audio/08-tiki.wav'),
  require('./assets/audio/09-roo.wav'),
  require('./assets/audio/10-spark.wav'),
];

function Buddy({id,size=80, happy=true}) {
  const c=CREW[id];
  return <Svg width={size} height={size} viewBox="0 0 120 126" accessibilityLabel={`${c.name} gorilla character`}>
    <Ellipse cx="60" cy="119" rx="40" ry="5" fill="#06191D" opacity=".24"/>
    <Ellipse cx="60" cy="102" rx="39" ry="28" fill={c.dark}/>
    <Ellipse cx="60" cy="104" rx="23" ry="17" fill={c.color} opacity=".65"/>
    <Ellipse cx="18" cy="89" rx="12" ry="22" fill={c.dark} transform="rotate(13 18 89)"/>
    <Ellipse cx="102" cy="89" rx="12" ry="22" fill={c.dark} transform="rotate(-13 102 89)"/>
    <Circle cx="23" cy="53" r="20" fill={c.dark}/><Circle cx="97" cy="53" r="20" fill={c.dark}/>
    <Circle cx="23" cy="53" r="10.5" fill={c.color}/><Circle cx="97" cy="53" r="10.5" fill={c.color}/>
    <Ellipse cx="60" cy="55" rx="44" ry="49" fill={c.color}/>
    <Ellipse cx="60" cy="71" rx="30" ry="25" fill="#FDE8C5"/>
    <Ellipse cx="47" cy="53" rx="9.5" ry="12" fill="#FFF9EC"/><Ellipse cx="73" cy="53" rx="9.5" ry="12" fill="#FFF9EC"/>
    <Circle cx="48" cy="56" r="4.3" fill="#1C2933"/><Circle cx="74" cy="56" r="4.3" fill="#1C2933"/>
    <Circle cx="49" cy="54" r="1.3" fill="#FFFFFF"/><Circle cx="75" cy="54" r="1.3" fill="#FFFFFF"/>
    <Ellipse cx="54" cy="73" rx="3" ry="2" fill={c.dark}/><Ellipse cx="66" cy="73" rx="3" ry="2" fill={c.dark}/>
    {happy ? <Path d="M49 81 Q60 91 71 81" fill="none" stroke="#553B43" strokeWidth="3.8" strokeLinecap="round"/> : <Ellipse cx="60" cy="82" rx="7" ry="8" fill="#553B43"/>}
    {c.item==='cap'&& <><Path d="M27 24 Q55 -4 88 24 L85 36 Q58 26 35 37 Z" fill="#FF724F"/><Path d="M47 31 L100 30 Q107 30 111 36 Q84 44 44 38Z" fill="#FCCA50"/></>}
    {c.item==='ears'&& <><Circle cx="29" cy="22" r="9" fill="#F9D2F1"/><Circle cx="93" cy="18" r="10" fill="#F9D2F1"/><Circle cx="61" cy="11" r="8" fill="#F8DF68"/></>}
    {c.item==='spike'&& <><Path d="M39 13 L47 -3 L57 13 L65 -4 L78 15 L90 14" fill={c.dark} stroke={c.dark} strokeWidth="4" strokeLinejoin="round"/></>}
    {c.item==='glasses'&& <><Rect x="34" y="46" width="26" height="18" rx="8" fill="#322954" opacity=".8"/><Rect x="64" y="46" width="26" height="18" rx="8" fill="#322954" opacity=".8"/><Path d="M58 52 Q62 49 66 52" stroke="#322954" fill="none" strokeWidth="5"/></>}
    {c.item==='flower'&& <><Circle cx="86" cy="18" r="7" fill="#FFF3A5"/><Circle cx="86" cy="7" r="7" fill="#FFFFFF"/><Circle cx="97" cy="18" r="7" fill="#FFFFFF"/><Circle cx="86" cy="29" r="7" fill="#FFFFFF"/><Circle cx="75" cy="18" r="7" fill="#FFFFFF"/></>}
    {c.item==='hair'&& <><Path d="M31 22 Q36 0 51 13 Q54 -5 68 12 Q81 -1 89 23" fill="#D98A34"/></>}
    {c.item==='star'&& <Path d="M60 0 L66 14 L81 15 L69 25 L73 39 L60 31 L47 39 L51 25 L39 15 L54 14 Z" fill="#FBE888"/>}
    {c.item==='leaf'&& <Path d="M61 34 Q41 4 23 8 Q29 36 61 34 M64 30 Q84 -1 105 9 Q93 36 64 30" stroke="#2D8266" strokeWidth="3" fill="#8FE9A5"/>}
    {c.item==='headset'&& <><Path d="M26 55 Q22 3 60 4 Q99 5 95 55" stroke="#253B45" strokeWidth="8" fill="none"/><Rect x="18" y="46" width="13" height="24" rx="6" fill="#253B45"/><Rect x="89" y="46" width="13" height="24" rx="6" fill="#253B45"/></>}
    {c.item==='bolt'&& <Path d="M60 0 L47 20 H62 L52 40 L81 12 H64 L72 0Z" fill="#FFE36D"/>}
    <Circle cx="38" cy="77" r="4" fill="#FF8A95" opacity=".55"/><Circle cx="83" cy="77" r="4" fill="#FF8A95" opacity=".55"/>
  </Svg>;
}
function JungleDecor() {return <Svg width="100%" height="100%" viewBox="0 0 400 330" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFillObject} pointerEvents="none">
  <Circle cx="202" cy="115" r="116" fill="#1C6059" opacity=".3"/>
  <Circle cx="202" cy="120" r="72" fill="#6BB497" opacity=".09"/>
  <Path d="M-20 0 Q55 60 45 182 Q3 142 -20 150Z" fill="#257A69" opacity=".44"/>
  <Path d="M30 -30 Q128 42 75 160 Q54 99 30 -30Z" fill="#48A174" opacity=".38"/>
  <Path d="M420 0 Q337 57 359 183 Q404 142 420 142Z" fill="#2E9B7B" opacity=".4"/>
  <Path d="M381 -23 Q275 60 325 146 Q365 88 381 -23Z" fill="#39866F" opacity=".35"/>
  <Path d="M-30 293 Q70 233 130 309 L148 345 H-30Z" fill="#153F42"/>
  <Path d="M425 293 Q322 245 272 309 L260 345 H425Z" fill="#153F42"/>
  <Ellipse cx="200" cy="310" rx="184" ry="30" fill="#07191C" opacity=".55"/>
  {Array.from({length:13},(_,i)=><Circle key={i} cx={(i*67+29)%390} cy={(i*41+19)%240} r={i%3===0?3:1.8} fill="#C1F98A" opacity={i%3===0?.62:.32}/>)}
</Svg>}
function Spectrum({active,progress}) {return <View style={styles.spectrum} accessibilityLabel="Animated rhythm visualiser">
 {Array.from({length:34},(_,i)=>{const x=(i*7+progress*34)%15;const h=9+Math.max(3,Math.sin(x*1.26)*16+Math.cos(i*2.6)*9+active*3);return <View key={i} style={{width:4,height:Math.max(5,h),borderRadius:6,backgroundColor:i%5===0?'#F99ABB':'#9DE7B6',opacity:active?.92:.25}}/>})}
 </View>}
function RoundButton({text,onPress,selected=false,color='#1D3D41',small=false,disabled=false,accessibilityLabel}) {
 return <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={accessibilityLabel||text} style={({pressed})=>[{backgroundColor:selected?MINT:color,opacity:pressed?.75:1},styles.roundButton,small&&{height:35,paddingHorizontal:13}]}><Text style={[styles.roundButtonText,{color:selected?'#14302B':CREAM},small&&{fontSize:11}]}>{text}</Text></Pressable>
}

export default function App(){
 const p0=useAudioPlayer(TRACK_ASSETS[0]);const p1=useAudioPlayer(TRACK_ASSETS[1]);
 const p2=useAudioPlayer(TRACK_ASSETS[2]);const p3=useAudioPlayer(TRACK_ASSETS[3]);
 const p4=useAudioPlayer(TRACK_ASSETS[4]);const p5=useAudioPlayer(TRACK_ASSETS[5]);
 const p6=useAudioPlayer(TRACK_ASSETS[6]);const p7=useAudioPlayer(TRACK_ASSETS[7]);
 const p8=useAudioPlayer(TRACK_ASSETS[8]);const p9=useAudioPlayer(TRACK_ASSETS[9]);
 const players=useMemo(()=>[p0,p1,p2,p3,p4,p5,p6,p7,p8,p9],[p0,p1,p2,p3,p4,p5,p6,p7,p8,p9]);
 const [stage,setStage]=useState([0,1,3,null,null,null]);
 const [playing,setPlaying]=useState(false);
 const [muted,setMuted]=useState([]);const [solo,setSolo]=useState(null);
 const [mixes,setMixes]=useState([]);const [showSave,setShowSave]=useState(false);
 const [showLibrary,setShowLibrary]=useState(false);const [mixName,setMixName]=useState('');
 const [progress,setProgress]=useState(0);
 const dancer=useRef(new Animated.Value(0)).current;
 const activeCount=stage.filter(x=>x!==null).length;
 const stageString=stage.join(',');
 useEffect(()=>{
  // All players run against the same 112 BPM, two-bar looping grid. Silent player volumes
  // allow new instruments to join in phase rather than restarting at their own first beat.
  for(const player of players){player.loop=true;player.volume=0;}
  setAudioModeAsync({playsInSilentMode:true,shouldPlayInBackground:false}).catch(()=>{});
  AsyncStorage.getItem(SAVE_KEY).then(raw=>{if(raw){const v=JSON.parse(raw);if(Array.isArray(v))setMixes(v)}}).catch(()=>{});
  return ()=>players.forEach(player=>player.pause());
 },[players]);
 useEffect(()=>{
  players.forEach((p,id)=>{
   const shouldHear=playing && stage.includes(id) && !muted.includes(id) && (solo===null || solo===id);
   p.volume=shouldHear?.50:0;
  });
 },[players,playing,stageString,muted,solo]);
 useEffect(()=>{
  if(!playing){setProgress(0);dancer.stopAnimation();dancer.setValue(0);return;}
  const animation=Animated.loop(Animated.sequence([
   Animated.timing(dancer,{toValue:1,duration:250,useNativeDriver:true}),
   Animated.timing(dancer,{toValue:0,duration:250,useNativeDriver:true}),
  ]));animation.start();
  const tick=setInterval(()=>setProgress(t=>(t+.12/(8*60/112))%1),120);
  return ()=>{clearInterval(tick);animation.stop();};
 },[playing,dancer]);
 const togglePlay=useCallback(async ()=>{
   if(playing){players.forEach(p=>p.pause());setPlaying(false);return;}
   try{await Promise.all(players.map(p=>p.seekTo(0)));players.forEach(p=>p.play());setProgress(0);setPlaying(true);}
   catch(e){Alert.alert('Sound not ready','Please try pressing play again.');}
 },[players,playing]);
 const addOrRemove=(id)=>{
  setStage(before=>{
   const next=[...before],exists=next.indexOf(id);
   if(exists>=0){next[exists]=null;return next;}
   const empty=next.indexOf(null);if(empty<0){Alert.alert('Stage full','Tap a creature on the stage to make space.');return before;}
   next[empty]=id;return next;
  });
  setSolo(null);
 };
 const removeSlot=slot=>{const id=stage[slot];setStage(old=>old.map((v,i)=>i===slot?null:v));if(id===solo)setSolo(null);};
 const setPreset=(picks)=>{setStage([...picks]);setMuted([]);setSolo(null);};
 const shuffle=()=>{const shuffled=[...CREW.keys()].sort(()=>Math.random()-.5);setStage(shuffled.slice(0,6));setMuted([]);setSolo(null);};
 const clear=()=>{setStage(Array(6).fill(null));setSolo(null);setMuted([]);};
 const saveMix=async()=>{
  const name=(mixName.trim()||`My Beat ${mixes.length+1}`).slice(0,40);
  const next=[{id:`${Date.now()}`,name,stage:[...stage]},...mixes].slice(0,25);
  try {await AsyncStorage.setItem(SAVE_KEY,JSON.stringify(next));setMixes(next);setShowSave(false);setMixName('');Alert.alert('Saved!','Your jungle mix is saved on this device.');}
  catch{Alert.alert('Could not save','Check your phone storage and try again.');}
 };
 const loadMix=item=>{if(!Array.isArray(item.stage)||item.stage.length!==6)return;const valid=item.stage.map(v=>(v===null||(Number.isInteger(v)&&v>=0&&v<CREW.length))?v:null);setStage(valid);setSolo(null);setMuted([]);setShowLibrary(false);};
 const deleteMix=async(id)=>{const next=mixes.filter(m=>m.id!==id);try{await AsyncStorage.setItem(SAVE_KEY,JSON.stringify(next));setMixes(next);}catch{Alert.alert('Could not delete','Try again.')}};
 const danceY=dancer.interpolate({inputRange:[0,1],outputRange:[0,-7]});
 const narrow=Dimensions.get('window').width<370;
 return <View style={styles.root}>
   <StatusBar barStyle="light-content" backgroundColor={BG}/>
   <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
    <View style={styles.topRow}>
      <View><Text style={styles.eyebrow}>THE WILDEST LITTLE MUSIC MAKERS</Text><Text style={styles.title}>JUNGLE<Text style={{color:MINT}}> BEAT</Text></Text><Text style={styles.subtitle}>CREW <Text style={{color:'#79A8A1',fontSize:13}}>• original rhythm playground</Text></Text></View>
      <Pressable onPress={()=>setShowLibrary(true)} accessibilityRole="button" accessibilityLabel="Open your saved beats" style={styles.libraryButton}><Text style={{fontSize:21}}>♫</Text><Text style={styles.libraryTiny}>MY MIXES</Text></Pressable>
    </View>
    <View style={styles.infoStrip}><View style={styles.liveDot}/><Text style={styles.infoText}>JUNGLE STUDIO</Text><View style={{flex:1}}/><Text style={styles.infoText}>112 BPM</Text><Text style={{color:MINT,fontSize:13,fontWeight:'900'}}>  ✦</Text><Text style={styles.infoText}>2-BAR LOOP</Text></View>
    <LinearGradient colors={['#16474B','#0B2935','#0D2530']} style={styles.stagePanel}>
      <JungleDecor/>
      <View style={styles.stageTop}><Text style={styles.stageHeading}>THE GROOVE GROVE</Text><Text style={styles.stageCount}>{activeCount}/6 ON STAGE</Text></View>
      <View style={styles.stageGrid}>
       {stage.map((id,slot)=><Pressable key={slot} accessibilityRole="button" accessibilityLabel={id===null?`Empty stage position ${slot+1}`:`Remove ${CREW[id].name} from stage`} onPress={()=>removeSlot(slot)} style={[styles.stageSpot,{width:narrow?'32%':'31.8%'}]}>
        {id===null?<><View style={styles.emptyStage}><Text style={styles.plus}>+</Text></View><Text style={styles.emptyCaption}>ADD BEAT</Text></>
        :<><Animated.View style={{transform:[{translateY:playing?danceY:0}],alignItems:'center'}}><View style={[styles.spotGlow,{backgroundColor:CREW[id].color+'25'}]}/><Buddy id={id} size={narrow?76:86} happy={!playing||Math.round(progress*16+slot)%3!==0}/></Animated.View><Text style={styles.stageLabel}>{CREW[id].name}</Text></>}
       </Pressable>)}
      </View>
      <View style={styles.stageFooter}><Text style={styles.stageHint}>TAP A CHARACTER BELOW TO JOIN THE JAM</Text><Text style={{fontSize:17,color:MINT}}>✦</Text></View>
    </LinearGradient>
    <View style={styles.console}>
       <View style={styles.consoleHeader}><Text style={styles.consoleTitle}>YOUR SOUND LAB</Text><Text style={styles.consoleHint}>LAYER IT. LOVE IT. LOOP IT.</Text></View>
       <Spectrum active={playing?activeCount:0} progress={progress}/>
       <View style={styles.controls}>
        <Pressable onPress={togglePlay} accessibilityRole="button" accessibilityLabel={playing?'Pause beat':'Play beat'} style={styles.playButton}><Text style={styles.playIcon}>{playing?'Ⅱ':'▶'}</Text><Text style={styles.playLabel}>{playing?'PAUSE':'PLAY MIX'}</Text></Pressable>
        <RoundButton text="↻ SHUFFLE" onPress={shuffle} small/>
        <RoundButton text="✕ CLEAR" onPress={clear} small/>
        <RoundButton text="♡ SAVE" onPress={()=>setShowSave(true)} small color="#3C3657"/>
       </View>
    </View>
    <View style={styles.sectionRow}><View><Text style={styles.sectionTitle}>PICK YOUR CREW</Text><Text style={styles.sectionSub}>Tap to add a sound • tap again to remove</Text></View><Text style={{fontSize:23}}>✳</Text></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.crewScroller}>
     {CREW.map((c,id)=>{const selected=stage.includes(id);return <Pressable key={id} onPress={()=>addOrRemove(id)} accessibilityRole="button" accessibilityLabel={`${selected?'Remove':'Add'} ${c.name} ${c.role} sound`} style={[styles.crewCard,selected&&styles.crewCardSelected]}>
       <View style={[styles.crewImage,{backgroundColor:c.color+'24'}]}><Buddy id={id} size={74}/></View>
       <Text numberOfLines={1} style={styles.crewName}>{c.name}</Text><Text style={styles.crewRole}>{c.role}</Text>
       <View style={[styles.addPill,{backgroundColor:selected?MINT:'#25454A'}]}><Text style={{fontSize:10,fontWeight:'900',color:selected?'#15322D':CREAM}}>{selected?'✓ ON':'＋ ADD'}</Text></View>
      </Pressable>})}
    </ScrollView>
    <View style={styles.mixOptions}>
     <Text style={styles.miniHeading}>QUICK VIBES</Text>
     <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,paddingVertical:6}}>{PRESETS.map(p=><RoundButton key={p.name} text={`${p.glyph} ${p.name}`} small onPress={()=>setPreset(p.picks)}/>)}</ScrollView>
     <Text style={styles.miniHeading}>MIXING DESK</Text>
     <Text style={[styles.sectionSub,{marginTop:4,marginBottom:10}]}>Mute a beat, or tap SOLO to hear just one.</Text>
     {stage.filter(id=>id!==null).map(id=><View key={id} style={styles.mixerRow}>
       <View style={[styles.mixerDot,{backgroundColor:CREW[id].color}]}/><Text style={styles.mixerName}>{CREW[id].name}</Text><Text style={styles.mixerRole}>{CREW[id].role}</Text>
       <RoundButton text={muted.includes(id)?'UNMUTE':'MUTE'} small selected={muted.includes(id)} onPress={()=>setMuted(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])}/>
       <RoundButton text="SOLO" small selected={solo===id} onPress={()=>setSolo(v=>v===id?null:id)}/>
     </View>)}
     {activeCount===0&&<Text style={styles.sectionSub}>Your stage is empty. Pick someone from your crew!</Text>}
    </View>
    <Text style={styles.footer}>MADE FOR IMAGINATION  ✦  MADE FOR MUSIC</Text>
   </ScrollView>
   <Modal visible={showSave} transparent animationType="fade" onRequestClose={()=>setShowSave(false)}><View style={styles.modalShade}><View style={styles.modalCard}>
     <Text style={styles.modalTitle}>SAVE THIS JAM ♫</Text><Text style={styles.sectionSub}>Give your mix a name. It stays on this device.</Text>
     <TextInput value={mixName} onChangeText={setMixName} placeholder="My amazing jungle beat" placeholderTextColor="#728E8D" maxLength={40} style={styles.textField}/>
     <View style={{flexDirection:'row',gap:9}}><View style={{flex:1}}><RoundButton text="CANCEL" onPress={()=>setShowSave(false)}/></View><View style={{flex:1}}><RoundButton text="SAVE MIX" selected onPress={saveMix}/></View></View>
   </View></View></Modal>
   <Modal visible={showLibrary} transparent animationType="slide" onRequestClose={()=>setShowLibrary(false)}><View style={styles.modalShade}><View style={styles.modalCard}>
     <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><Text style={styles.modalTitle}>YOUR SAVED MIXES</Text><RoundButton text="✕" small onPress={()=>setShowLibrary(false)}/></View>
     {mixes.length===0?<Text style={styles.sectionSub}>No mixes yet! Build a beat and tap SAVE.</Text>:<ScrollView style={{maxHeight:360}}>{mixes.map(item=><View key={item.id} style={styles.savedRow}><Pressable style={{flex:1}} onPress={()=>loadMix(item)} accessibilityRole="button"><Text style={styles.savedTitle}>{item.name}</Text><Text style={styles.sectionSub}>Tap to load • {item.stage.filter(x=>x!==null).length} sounds</Text></Pressable><RoundButton text="DELETE" small onPress={()=>Alert.alert('Delete this mix?',item.name,[{text:'Cancel'},{text:'Delete',style:'destructive',onPress:()=>deleteMix(item.id)}])}/></View>)}</ScrollView>}
   </View></View></Modal>
 </View>
}
const styles=StyleSheet.create({
 root:{flex:1,backgroundColor:BG},page:{paddingTop:26,paddingBottom:40,paddingHorizontal:17},
 topRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20},
 eyebrow:{color:'#A3B4AE',fontSize:9,letterSpacing:2.15,fontWeight:'800'},title:{fontSize:35,fontWeight:'900',color:CREAM,letterSpacing:-2.5,marginTop:4},
 subtitle:{color:'#FDE3AB',fontSize:18,fontWeight:'900',letterSpacing:3.5,marginTop:-3},libraryButton:{backgroundColor:'#153439',borderRadius:17,paddingHorizontal:12,height:67,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#285456'},
 libraryTiny:{fontSize:9,color:'#DFF2DF',fontWeight:'900',marginTop:4},
 infoStrip:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:10,paddingHorizontal:3},liveDot:{height:8,width:8,borderRadius:8,backgroundColor:MINT},infoText:{color:'#A1C5B9',fontSize:10,fontWeight:'900',letterSpacing:.7},
 stagePanel:{borderRadius:24,minHeight:302,overflow:'hidden',borderWidth:1.5,borderColor:'#326965',paddingHorizontal:12,paddingTop:16,paddingBottom:11},
 stageTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:8,zIndex:1},stageHeading:{color:'#FFE8C0',fontSize:13,letterSpacing:1.6,fontWeight:'900'},stageCount:{color:'#B7EBC1',fontSize:10,fontWeight:'800'},
 stageGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',marginTop:7,minHeight:230,zIndex:1},
 stageSpot:{height:115,alignItems:'center',justifyContent:'flex-end'},spotGlow:{height:63,width:69,borderRadius:50,position:'absolute',left:'15%',top:26},
 emptyStage:{width:68,height:65,borderRadius:45,borderWidth:2,borderStyle:'dashed',borderColor:'#517778',backgroundColor:'#18373D88',alignItems:'center',justifyContent:'center',marginBottom:7},plus:{fontSize:29,color:'#73A59E'},emptyCaption:{fontSize:9,color:'#6E9D98',fontWeight:'900',letterSpacing:.7,marginBottom:2},
 stageLabel:{color:'#FEF1D4',fontSize:9.5,fontWeight:'900',letterSpacing:.7,marginTop:-1},stageFooter:{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:10,marginTop:3},stageHint:{fontSize:9,color:'#92B9B2',fontWeight:'900',letterSpacing:1},
 console:{backgroundColor:'#112B32',borderRadius:20,marginTop:13,paddingHorizontal:14,paddingTop:15,paddingBottom:14,borderWidth:1,borderColor:'#28494C'},
 consoleHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},consoleTitle:{fontSize:14,fontWeight:'900',color:CREAM,letterSpacing:1},consoleHint:{fontSize:9,color:'#779C9B',fontWeight:'800'},
 spectrum:{height:61,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:6,marginTop:5,marginBottom:7},
 controls:{flexDirection:'row',flexWrap:'wrap',gap:7,alignItems:'center'},playButton:{backgroundColor:MINT,borderRadius:14,height:42,paddingHorizontal:16,flexDirection:'row',alignItems:'center',gap:7},playIcon:{fontSize:19,fontWeight:'900',color:'#16312E'},playLabel:{fontSize:11,fontWeight:'900',color:'#16312E',letterSpacing:.5},
 roundButton:{minHeight:42,borderRadius:12,alignItems:'center',justifyContent:'center',paddingHorizontal:14},roundButtonText:{fontSize:12,fontWeight:'900',letterSpacing:.35},
 sectionRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:25,marginBottom:12,paddingHorizontal:1},sectionTitle:{fontSize:18,color:CREAM,fontWeight:'900',letterSpacing:.5},sectionSub:{color:'#8EAAA8',fontSize:12,marginTop:3,lineHeight:18},
 crewScroller:{gap:9,paddingBottom:11,paddingRight:6},crewCard:{width:104,backgroundColor:'#153239',borderRadius:16,borderWidth:1.2,borderColor:'#2D4C50',padding:9,alignItems:'center'},crewCardSelected:{borderColor:MINT,backgroundColor:'#1B3D3B'},crewImage:{width:84,height:81,borderRadius:13,alignItems:'center',justifyContent:'center',marginBottom:8},crewName:{fontSize:11.5,color:CREAM,fontWeight:'900',letterSpacing:.7},crewRole:{fontSize:10,color:'#90B9B1',marginTop:3},addPill:{marginTop:10,borderRadius:20,paddingVertical:6,paddingHorizontal:13},
 mixOptions:{marginTop:14,backgroundColor:'#10272C',padding:15,borderRadius:19,borderWidth:1,borderColor:'#223E42'},miniHeading:{fontSize:12,fontWeight:'900',color:'#E7F0DC',letterSpacing:1,marginTop:9},
 mixerRow:{minHeight:48,flexDirection:'row',alignItems:'center',gap:8,borderBottomWidth:1,borderColor:'#294346'},mixerDot:{width:12,height:12,borderRadius:10},mixerName:{color:CREAM,fontSize:11.5,fontWeight:'900',width:80},mixerRole:{color:'#82A6A0',fontSize:11,flex:1},
 footer:{color:'#487570',fontSize:9,textAlign:'center',marginTop:23,fontWeight:'900',letterSpacing:1.9},
 modalShade:{flex:1,backgroundColor:'#020E13D9',justifyContent:'center',padding:21},modalCard:{backgroundColor:'#133037',borderWidth:1,borderColor:'#4C7471',borderRadius:25,padding:22,gap:14},modalTitle:{fontSize:20,fontWeight:'900',color:CREAM,letterSpacing:.8},
 textField:{backgroundColor:'#071F27',borderRadius:13,paddingHorizontal:15,paddingVertical:13,color:'#FFFFFF',borderWidth:1,borderColor:'#385C5B',fontSize:15},
 savedRow:{flexDirection:'row',alignItems:'center',gap:10,marginVertical:6,borderRadius:12,padding:9,backgroundColor:'#21434A'},savedTitle:{color:CREAM,fontWeight:'900',fontSize:14}
});