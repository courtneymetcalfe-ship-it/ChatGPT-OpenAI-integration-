import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Animated, Dimensions, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {useAudioPlayer, setAudioModeAsync} from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {Circle, Ellipse, G, Path, Polygon, Rect} from 'react-native-svg';

const BG='#10171E', CREAM='#F6F9F8', MINT='#C7FC6C', PALE='#9DB0AD';
const SAVE_KEY='jungle-beat-crew-mixes-v1';
const CREW=[
  {name:'EMBER',role:'Kick',color:'#E9933B',dark:'#A55832',item:'cap'},
  {name:'RUBY',role:'Claps',color:'#E75B60',dark:'#983A49',item:'band'},
  {name:'FROST',role:'Shaker',color:'#75D8D9',dark:'#3A8B9C',item:'spike'},
  {name:'VIOLET',role:'Bass',color:'#9464D9',dark:'#543A94',item:'glasses'},
  {name:'BLOOM',role:'Chords',color:'#E784BF',dark:'#93467D',item:'flower'},
  {name:'SOL',role:'Melody',color:'#F1C451',dark:'#AF762E',item:'tuft'},
  {name:'SKY',role:'Bells',color:'#69ADFF',dark:'#4066A1',item:'star'},
  {name:'MOSS',role:'Toms',color:'#5DBB83',dark:'#30734F',item:'leaf'},
  {name:'ECHO',role:'Vox',color:'#B0D77B',dark:'#5D8042',item:'headset'},
  {name:'GLITCH',role:'Synth',color:'#CEB7A0',dark:'#86715D',item:'bolt'},
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


function Buddy({id,size=80,happy=true}) {
 const c=CREW[id];
 return <Svg width={size} height={size*1.12} viewBox="0 0 128 144" accessibilityLabel={c.name+' low-poly gorilla'}>
   <Ellipse cx="64" cy="138" rx="50" ry="5" fill="#102129" opacity=".14"/>
   <Path d="M35 75 L18 80 L5 113 L8 130 L27 134 L39 114 L48 89 Z" fill={c.dark}/>
   <Polygon points="18,80 5,113 20,115 35,87" fill={c.color}/>
   <Path d="M92 75 L110 81 L123 113 L120 130 L101 134 L89 114 L80 88 Z" fill={c.dark}/>
   <Polygon points="109,81 123,113 109,116 94,88" fill={c.color}/>
   <Path d="M36 71 L92 71 L103 91 L92 126 L34 126 L25 92 Z" fill={c.color}/>
   <Polygon points="36,72 54,81 47,123 34,126 25,91" fill={c.dark} opacity=".65"/>
   <Polygon points="91,74 80,85 83,125 93,123 104,91" fill={c.dark} opacity=".46"/>
   <Path d="M47 90 Q64 83 81 91 L85 118 Q65 129 44 118Z" fill="#CED4D2"/>
   <Polygon points="48,93 63,86 65,120 45,116" fill="#F1F0E8" opacity=".65"/>
   <Polygon points="24,49 17,41 12,46 11,66 24,74 37,65" fill={c.dark}/>
   <Polygon points="104,49 112,42 118,49 115,67 105,72 91,65" fill={c.dark}/>
   <Polygon points="14,51 25,48 29,62 17,65" fill="#DACCC0"/>
   <Polygon points="114,50 102,48 99,63 111,64" fill="#DACCC0"/>
   <Path d="M39 9 L72 5 L95 15 L108 38 L104 71 L89 92 L62 96 L37 89 L22 69 L22 36 Z" fill={c.color}/>
   <Polygon points="39,9 22,36 28,73 39,80 46,13" fill={c.dark} opacity=".53"/>
   <Polygon points="72,5 95,15 107,39 96,44 78,15" fill="#FFFFFF" opacity=".16"/>
   <Polygon points="104,70 89,91 68,96 71,75 98,52" fill={c.dark} opacity=".45"/>
   <Path d="M32 44 L39 35 L59 35 L65 43 L63 63 L53 69 L38 66 L31 58Z" fill="#23303A"/>
   <Path d="M66 42 L74 34 L92 34 L100 45 L96 61 L83 68 L69 63Z" fill="#23303A"/>
   <Path d="M36 44 L42 39 L56 39 L61 45 L59 60 L51 64 L41 61 L35 56Z" fill="#F6F8F0"/>
   <Path d="M71 43 L76 39 L90 39 L95 45 L92 57 L83 63 L74 59Z" fill="#F6F8F0"/>
   <Ellipse cx="49" cy="53" rx="5.6" ry="7.7" fill="#252631"/>
   <Ellipse cx="83" cy="52" rx="5.6" ry="7.7" fill="#252631"/>
   <Circle cx="51" cy="50" r="2" fill="white"/><Circle cx="85" cy="49" r="2" fill="white"/>
   <Path d="M48 64 L65 61 L83 64 L93 73 L88 87 L67 92 L43 87 L36 75 Z" fill="#A9B2AF"/>
   <Polygon points="48,64 65,61 62,87 43,86 36,75" fill="#E0E0D7" opacity=".8"/>
   <Ellipse cx="59" cy="74" rx="3" ry="2.3" fill="#525A5B"/>
   <Ellipse cx="73" cy="73" rx="3" ry="2.3" fill="#525A5B"/>
   {happy?<Path d="M56 81 Q66 87 78 80" stroke="#525157" strokeWidth="2.7" fill="none" strokeLinecap="round"/>:<Ellipse cx="67" cy="82" rx="6" ry="4.5" fill="#50525B"/>}
   {c.item==='cap'&&<><Path d="M28 24 L39 8 L77 3 L97 19 L91 31 L30 32Z" fill="#DB523F"/><Path d="M66 26 L108 26 L111 32 L72 37Z" fill="#FFA45B"/></>}
   {c.item==='band'&&<><Path d="M24 36 L34 21 L96 19 L105 36" stroke="#FDE789" strokeWidth="7" fill="none"/><Circle cx="26" cy="35" r="6" fill="#FDE789"/></>}
   {c.item==='spike'&&<Polygon points="40,13 46,-1 57,11 70,-2 78,13 88,9 90,22 40,23" fill="#B2F5EE"/>}
   {c.item==='glasses'&&<><Rect x="32" y="40" width="32" height="27" rx="5" fill="#1C1638" opacity=".7"/><Rect x="67" y="39" width="34" height="27" rx="5" fill="#1C1638" opacity=".7"/></>}
   {c.item==='flower'&&<><Circle cx="89" cy="15" r="6" fill="#FFEA93"/><Circle cx="89" cy="4" r="7" fill="#FDF8FF"/><Circle cx="100" cy="15" r="7" fill="#FDF8FF"/><Circle cx="89" cy="26" r="7" fill="#FDF8FF"/><Circle cx="78" cy="15" r="7" fill="#FDF8FF"/></>}
   {c.item==='tuft'&&<Polygon points="41,16 36,1 53,10 60,-3 73,12 84,6 87,22" fill="#B57C34"/>}
   {c.item==='star'&&<Path d="M64 -1 L69 11 L81 13 L72 23 L75 34 L64 28 L53 34 L56 23 L47 13 L59 11Z" fill="#FFEB91"/>}
   {c.item==='leaf'&&<><Path d="M57 23 Q37 -2 24 6 Q30 24 57 23" fill="#A6EE9D"/><Path d="M71 24 Q91 -2 105 7 Q100 24 71 24" fill="#7EEBAA"/></>}
   {c.item==='headset'&&<><Path d="M24 54 Q18 -3 65 0 Q112 2 109 54" stroke="#2D3642" strokeWidth="9" fill="none"/><Rect x="19" y="44" width="12" height="26" rx="5" fill="#313B47"/><Rect x="100" y="44" width="12" height="26" rx="5" fill="#313B47"/></>}
   {c.item==='bolt'&&<Polygon points="66,-2 49,22 64,22 56,43 85,13 69,13 76,-2" fill="#FFF08A"/>}
 </Svg>;
}
function JungleDecor() {return <Svg width="100%" height="100%" viewBox="0 0 400 340" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFillObject} pointerEvents="none">
  <Rect width="400" height="340" fill="#7ED8E4"/>
  <Circle cx="310" cy="61" r="39" fill="#FFF1A4" opacity=".8"/>
  <Path d="M-10 72 Q20 47 48 68 Q90 45 115 76 Q104 93 75 89 H17Z" fill="#F0FDF5" opacity=".7"/>
  <Path d="M246 95 Q265 73 281 90 Q310 73 331 99 L318 110 H260Z" fill="#EDF7F3" opacity=".67"/>
  <Path d="M0 218 Q64 157 146 214 Q240 157 320 205 Q356 171 410 185 L410 340 H0Z" fill="#6DBB89"/>
  <Path d="M0 258 Q100 197 186 258 Q280 219 400 255 L400 340 H0Z" fill="#3D976E"/>
  <Path d="M27 151 L35 270 H54 L61 147Z" fill="#87684A"/>
  <Path d="M-24 161 L43 42 L105 160Z" fill="#2C916B"/>
  <Path d="M-7 115 L43 13 L88 116Z" fill="#329A76"/>
  <Path d="M333 168 L345 270 H361 L367 163Z" fill="#866447"/>
  <Path d="M296 170 L356 27 L422 170Z" fill="#267D60"/>
  <Path d="M309 124 L356 0 L409 124Z" fill="#33A075"/>
  <Path d="M0 310 Q200 287 400 314 V340 H0Z" fill="#32654E"/>
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
 const [stage,setStage]=useState([0,1,3,4,6,null]);
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
      <View><Text style={styles.eyebrow}>GORILLAS + MUSIC = YOUR REMIX</Text><Text style={styles.title}>MONKE<Text style={{color:MINT}}> MIX</Text></Text><Text style={styles.subtitle}>STUDIO <Text style={{color:'#79A8A1',fontSize:13}}>• gorilla remix creator</Text></Text></View>
      <Pressable onPress={()=>setShowLibrary(true)} accessibilityRole="button" accessibilityLabel="Open your saved beats" style={styles.libraryButton}><Text style={{fontSize:21}}>♫</Text><Text style={styles.libraryTiny}>MY MIXES</Text></Pressable>
    </View>
    <View style={styles.infoStrip}><View style={styles.liveDot}/><Text style={styles.infoText}>REMIX STUDIO</Text><View style={{flex:1}}/><Text style={styles.infoText}>112 BPM</Text><Text style={{color:MINT,fontSize:13,fontWeight:'900'}}>  ✦</Text><Text style={styles.infoText}>2-BAR LOOP</Text></View>
    <LinearGradient colors={['#16474B','#0B2935','#0D2530']} style={styles.stagePanel}>
      <JungleDecor/>
      <View style={styles.stageTop}><Text style={styles.stageHeading}>GORILLA SOUND STAGE</Text><Text style={styles.stageCount}>{activeCount}/6 ON STAGE</Text></View>
      <View style={styles.stageGrid}>
       {stage.map((id,slot)=><Pressable key={slot} accessibilityRole="button" accessibilityLabel={id===null?`Empty stage position ${slot+1}`:`Remove ${CREW[id].name} from stage`} onPress={()=>removeSlot(slot)} style={[styles.stageSpot,{width:narrow?'32%':'31.8%'}]}>
        {id===null?<><View style={styles.emptyStage}><Text style={styles.plus}>+</Text></View><Text style={styles.emptyCaption}>ADD BEAT</Text></>
        :<><Animated.View style={{transform:[{translateY:playing?danceY:0}],alignItems:'center'}}><View style={[styles.spotGlow,{backgroundColor:CREW[id].color+'30'}]}/><Buddy id={id} size={narrow?79:90} happy={!playing||Math.round(progress*16+slot)%3!==0}/></Animated.View><Text style={styles.stageLabel}>{CREW[id].name}</Text></>}
       </Pressable>)}
      </View>
      <View style={styles.stageFooter}><Text style={styles.stageHint}>TAP A SOUND TO ADD • TAP A GORILLA TO REMOVE</Text><Text style={{fontSize:17,color:MINT}}>✦</Text></View>
    </LinearGradient>
    <View style={styles.console}>
       <View style={styles.consoleHeader}><Text style={styles.consoleTitle}>NOW PLAYING</Text><Text style={styles.consoleHint}>BUILD YOUR BEAT</Text></View>
       <Spectrum active={playing?activeCount:0} progress={progress}/>
       <View style={styles.controls}>
        <Pressable onPress={togglePlay} accessibilityRole="button" accessibilityLabel={playing?'Pause beat':'Play beat'} style={styles.playButton}><Text style={styles.playIcon}>{playing?'Ⅱ':'▶'}</Text><Text style={styles.playLabel}>{playing?'PAUSE':'PLAY MIX'}</Text></Pressable>
        <RoundButton text="↻ SHUFFLE" onPress={shuffle} small/>
        <RoundButton text="✕ CLEAR" onPress={clear} small/>
        <RoundButton text="♡ SAVE" onPress={()=>setShowSave(true)} small color="#3C3657"/>
       </View>
    </View>
    <View style={styles.sectionRow}><View><Text style={styles.sectionTitle}>CHOOSE YOUR SOUNDS</Text><Text style={styles.sectionSub}>Give each gorilla a beat, melody or voice</Text></View><Text style={{fontSize:23}}>✳</Text></View>

    <View style={styles.soundShelf}>
     <View style={styles.categoryRow}><Text style={styles.categoryLabel}>BEATS</Text><Text style={styles.categoryLabel}>EFFECTS</Text><Text style={styles.categoryLabel}>MELODIES</Text><Text style={styles.categoryLabel}>VOICES</Text></View>
     <View style={styles.crewGrid}>
      {CREW.map((c,id)=>{const selected=stage.includes(id);return <Pressable key={id} onPress={()=>addOrRemove(id)} accessibilityRole="button" accessibilityLabel={(selected?'Remove ':'Add ')+c.name+' '+c.role+' sound'} style={[styles.crewCard,selected&&styles.crewCardSelected]}>
        <View style={[styles.crewImage,{backgroundColor:selected?'#2C4A42':'#22313E'}]}><Buddy id={id} size={55}/></View>
        <Text numberOfLines={1} style={styles.crewName}>{c.name}</Text><Text style={styles.crewRole}>{c.role}</Text>
        <View style={[styles.addPill,{backgroundColor:selected?MINT:'#304550'}]}><Text style={{fontSize:9,fontWeight:'900',color:selected?'#15322D':CREAM}}>{selected?'✓ ON':'＋ ADD'}</Text></View>
      </Pressable>})}
     </View>
    </View>
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
 stagePanel:{borderRadius:20,minHeight:312,overflow:'hidden',borderWidth:2,borderColor:'#3B978E',paddingHorizontal:10,paddingTop:15,paddingBottom:11},
 stageTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:8,zIndex:1},stageHeading:{color:'#143A3B',fontSize:13,letterSpacing:1.6,fontWeight:'900'},stageCount:{color:'#204F45',fontSize:10,fontWeight:'800'},
 stageGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',marginTop:7,minHeight:230,zIndex:1},
 stageSpot:{height:120,alignItems:'center',justifyContent:'flex-end'},spotGlow:{height:63,width:69,borderRadius:50,position:'absolute',left:'15%',top:26},
 emptyStage:{width:68,height:65,borderRadius:45,borderWidth:2,borderStyle:'dashed',borderColor:'#517778',backgroundColor:'#18373D88',alignItems:'center',justifyContent:'center',marginBottom:7},plus:{fontSize:29,color:'#2C6D67'},emptyCaption:{fontSize:9,color:'#174E47',fontWeight:'900',letterSpacing:.7,marginBottom:2},
 stageLabel:{color:'#173C3B',fontSize:9.5,fontWeight:'900',letterSpacing:.7,marginTop:-1},stageFooter:{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:10,marginTop:3},stageHint:{fontSize:9,color:'#174D43',fontWeight:'900',letterSpacing:1},
 console:{backgroundColor:'#112B32',borderRadius:20,marginTop:13,paddingHorizontal:14,paddingTop:15,paddingBottom:14,borderWidth:1,borderColor:'#28494C'},
 consoleHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},consoleTitle:{fontSize:14,fontWeight:'900',color:CREAM,letterSpacing:1},consoleHint:{fontSize:9,color:'#779C9B',fontWeight:'800'},
 spectrum:{height:61,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:6,marginTop:5,marginBottom:7},
 controls:{flexDirection:'row',flexWrap:'wrap',gap:7,alignItems:'center'},playButton:{backgroundColor:MINT,borderRadius:14,height:42,paddingHorizontal:16,flexDirection:'row',alignItems:'center',gap:7},playIcon:{fontSize:19,fontWeight:'900',color:'#16312E'},playLabel:{fontSize:11,fontWeight:'900',color:'#16312E',letterSpacing:.5},
 roundButton:{minHeight:42,borderRadius:12,alignItems:'center',justifyContent:'center',paddingHorizontal:14},roundButtonText:{fontSize:12,fontWeight:'900',letterSpacing:.35},
 sectionRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:25,marginBottom:12,paddingHorizontal:1},sectionTitle:{fontSize:18,color:CREAM,fontWeight:'900',letterSpacing:.5},sectionSub:{color:'#8EAAA8',fontSize:12,marginTop:3,lineHeight:18},

 soundShelf:{backgroundColor:'#0B1016',padding:8,borderRadius:16,borderWidth:1,borderColor:'#2C3E48'},
 categoryRow:{flexDirection:'row',justifyContent:'space-around',gap:4,marginTop:4,marginBottom:10},
 categoryLabel:{fontSize:9,letterSpacing:.55,fontWeight:'900',color:'#B6D5CA'},
 crewGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:8},
 crewCard:{width:'19%',minHeight:118,backgroundColor:'#1D2732',borderRadius:11,borderWidth:1.2,borderColor:'#3C4A56',paddingVertical:6,paddingHorizontal:2,alignItems:'center',justifyContent:'space-between'},
 crewCardSelected:{borderColor:MINT,backgroundColor:'#254338'},
 crewImage:{width:'95%',height:62,borderRadius:8,alignItems:'center',justifyContent:'center',marginBottom:1,overflow:'hidden'},
 crewName:{fontSize:8.2,color:CREAM,fontWeight:'900',letterSpacing:.15},
 crewRole:{fontSize:8,color:'#A5C3BA',marginTop:1},
 addPill:{marginTop:3,borderRadius:12,paddingVertical:4,paddingHorizontal:8},
 mixOptions:{marginTop:14,backgroundColor:'#10272C',padding:15,borderRadius:19,borderWidth:1,borderColor:'#223E42'},miniHeading:{fontSize:12,fontWeight:'900',color:'#E7F0DC',letterSpacing:1,marginTop:9},
 mixerRow:{minHeight:48,flexDirection:'row',alignItems:'center',gap:8,borderBottomWidth:1,borderColor:'#294346'},mixerDot:{width:12,height:12,borderRadius:10},mixerName:{color:CREAM,fontSize:11.5,fontWeight:'900',width:80},mixerRole:{color:'#82A6A0',fontSize:11,flex:1},
 footer:{color:'#487570',fontSize:9,textAlign:'center',marginTop:23,fontWeight:'900',letterSpacing:1.9},
 modalShade:{flex:1,backgroundColor:'#020E13D9',justifyContent:'center',padding:21},modalCard:{backgroundColor:'#133037',borderWidth:1,borderColor:'#4C7471',borderRadius:25,padding:22,gap:14},modalTitle:{fontSize:20,fontWeight:'900',color:CREAM,letterSpacing:.8},
 textField:{backgroundColor:'#071F27',borderRadius:13,paddingHorizontal:15,paddingVertical:13,color:'#FFFFFF',borderWidth:1,borderColor:'#385C5B',fontSize:15},
 savedRow:{flexDirection:'row',alignItems:'center',gap:10,marginVertical:6,borderRadius:12,padding:9,backgroundColor:'#21434A'},savedTitle:{color:CREAM,fontWeight:'900',fontSize:14}
});