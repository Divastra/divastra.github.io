/* ── Classify ── keyword classifier, rank reply, follow-up resolver, message logger */
import { CFG } from './divu.config.js';
import { pick } from './divu.utils.js';
import { FU_R } from './divu.replies.js';

export function classify(raw){
  const t=raw.toLowerCase();
  if(/\b(hi|hello|hey|hiya|heya|namaste|namaskar|sup|yo|wassup|howdy|good\s*(morning|evening|afternoon|night))\b|how are you|kaise ho|kaisa hai/.test(t)) return'greeting';
  if(/your name|who are you|what are you|kaun ho|naam kya|tum kaun|are you (a |an )?(ai|bot|real|human)|is this (ai|a bot|real)|what do you do|introduce yourself|divu kaun/.test(t)) return'name';
  if(/\b(date me|marry me|marry you|girlfriend|boyfriend|go out with|be mine|will you be my|can we be together|be with me|ask you out)\b/.test(t)) return'flirt';
  if(/i love you|love you|i like you|i have a crush|you.?re my type|main tumse pyar|mujhe pyar|i.?m in love|falling for you/.test(t)) return'love';
  if(/\b(cute|beautiful|pretty|gorgeous|adorable|lovely|stunning|attractive|charming|nice design|love your design|amazing design|best ai|nicely made)\b/.test(t)) return'compliment';
  if(/\b(thank|thanks|shukriya|dhanyavad|tysm|thx|appreciated|very helpful|bahut achha|bahut acha|so helpful)\b/.test(t)) return'thanks';
  if(/\b(bye|goodbye|alvida|tata|ttyl|cya|see you|baad mein|gtg|gotta go|leaving now|see ya|good night|ok bye|okay bye)\b/.test(t)) return'bye';
  if(/prabhat|bhaiya|blue t.?shirt|blue tshirt|who is sir|sir ke baare/.test(t)) return'prabhat';
  if(/josaa|choice\s*fill|preference\s*list|csab|floating|sliding|freeze|seat\s*allot|upgrade\s*seat|reporting date|document\s*verif|withdrawal/.test(t)) return'josaa';
  if(/\bplacements?\b|salary|package\b|lpa\b|career\s*scope|job\s*prospect|campus\s*recruit|highest\s*package|average\s*package|off\s*campus|hiring/.test(t)) return'placement';
  if(/should i drop|drop\s*year|repeat\s*year|gap\s*year|give again|join or drop|dropper|drop or join|take a drop|should.*drop|kya karu.*drop/.test(t)) return'dropper';
  if(/\b(stressed|tensed|tense\b|worried|worry\b|scared\b|anxious|anxiety|panic\b|nervous\b|upset\b|crying|depressed|hopeless|i give up|khatam|dil toot|bahut dukh|feel alone|very lonely)\b/.test(t)) return'stress';
  if(/software\s*(job|career|field|engineer|developer)|become\s*(a\s*)?(\w+\s+)?(developer|programmer|coder)|coding\s*career|tech\s*career|want.*work.*tech|\bfaang\b|software\s*company/.test(t)) return'career_software';
  if(/data\s*science|machine\s*learning|\bml\s*career|\bai\s*career|deep\s*learning|data\s*engineer|data\s*analyst|\bllm\b.*career/.test(t)) return'career_data';
  if(/\bpsu\b|bhel\b|ongc\b|ntpc\b|sail\b|gail\b|barc\b|drdo\b|isro\b|core\s*(job|career|engineering)|government\s*job\s*after|govt\s*job\s*after/.test(t)) return'career_core';
  if(/\bupsc\b|civil\s*services|become.*\bias\b|\bias\s*after|\bies\b|government\s*job\b.*career|\bssc\b.*engineer/.test(t)) return'career_govt';
  if(/\bmba\b|\bcat\b.*exam|\biim\b|\bpgdm\b|mba\s*after|business\s*school|management\s*after|mba\s*from/.test(t)) return'career_mba';
  if(/ms\s*abroad|phd\s*abroad|masters.*abroad|study\s*abroad|\bgre\b|ms\s*in\s*(cs|ece|usa|us|germany|canada)/.test(t)) return'career_ms';
  if(/\bstartup\b|entrepreneur|found.*company|build.*startup|own.*business/.test(t)) return'career_startup';
  if(/research\s*career|become.*researcher|become.*professor|academic\s*career|\biisc\b|r&d\s*career/.test(t)) return'career_research';
  if(/\bgate\b.*exam|\bgate\b.*prep|\bm\.?tech\b|higher\s*studies\s*india|masters\s*india|gate\s*score/.test(t)) return'gate';
  if(/nit\s*(trichy|trichirappalli|tiruchirappalli)|nit-t\b|nitt\b/.test(t)) return'nit_trichy';
  if(/nit\s*(warangal)|nit-w\b|nitw\b/.test(t)) return'nit_warangal';
  if(/nit\s*(surathkal|karnataka)|nitk\b/.test(t)) return'nit_surathkal';
  if(/nit\s*(calicut|kozhikode)|nitc\b/.test(t)) return'nit_calicut';
  if(/nit\s*(allahabad|prayagraj)|mnnit\b|motilal\s*nehru/.test(t)) return'nit_allahabad';
  if(/first\s*(gen|generation)|first\s*in\s*(my\s*)?family|no.*one.*engineer.*family|nobody.*engineer/.test(t)) return'first_gen';
  if(/girl(s)?\s*(college|hostel|quota|campus|student)|supernumerary|women\s*(quota|seat|reservation)|female\s*(student|engineer)/.test(t)) return'girl_student';
  if(/\b(obc\b|pwd\b|reservation\b|reserved\s*category|category\s*rank|caste\s*certificate|category\s*seat|creamy\s*layer|ews\b.*category)\b/.test(t)) return'reservation';
  if(/scholarship|merit\s*scholar|fee\s*waiver|financial\s*aid/.test(t)) return'scholarship';
  if(/lateral\s*entry|diploma.*engineering|polytechnic/.test(t)) return'lateral';
  if(/integrated|dual\s*degree|5\s*year.*degree|b\.?tech\s*\+\s*m\.?tech/.test(t)) return'integrated';
  if(/jee\s*(main|mains|exam|paper|tips|prep)|how.*crack.*jee|jee\s*preparation/.test(t)) return'jee_tips';
  if(/improve.*rank|re.?attempt|second.*attempt|appearing.*again|attempt.*better|next.*jee.*attempt/.test(t)) return'improvement';
  if(/motivat|inspire\s*me|i\s*can.?t\s*do\s*this|giv\w*\s*up|feeling\s*(low|down)|lost\s*(hope|motivation)|no\s*hope|why\s*study|feel\s*like\s*quit|don.?t\s*feel\s*like|i\s*want\s*to\s*quit|want\s*to\s*quit|feel.*demotivat|feel.*hopeless/.test(t)) return'motivation';
  if(/\bbooks?\b.*jee|jee.*books?|\bhc\s*verma\b|\bdc\s*pandey\b|\brd\s*sharma\b|which.*books?|best.*books?|\birodov\b|\bncert\b.*book|ncert.*follow|cengage\b|\bsl\s*loney\b|\barihant\b/.test(t)) return'books';
  if(/mock\s*test|full.*test\s*series|test\s*series.*jee|practice\s*test|sample\s*paper|give.*mock|take.*mock|how\s*many\s*mocks/.test(t)) return'mock_test';
  if(/self\s*study|without\s*coaching|no\s*coaching|home\s*study|home\s*prep|coaching\s*vs|online.*course.*jee|self.*prep|self.*study.*jee/.test(t)) return'self_study';
  if(/learn.*cod|start.*cod|cod.*begin|which.*language.*start|programming.*start|how.*learn.*program|python.*beginner|c\+\+.*learn|how.*code/.test(t)) return'coding_learn';
  if(/\b(sleep\s*schedule|lack.*sleep|not\s*sleeping|back\s*pain|eye\s*strain|mental\s*health|study\s*break|too\s*tired|feeling\s*sick|eye.*problem|headache.*study|posture.*study)\b/.test(t)) return'health';
  if(/parent.*pressur|family.*pressur|pressur.*from|mom.*jee|dad.*jee|ghar\s*wale|ghar\s*waale|mummy.*pressur|papa.*pressur|forced.*study|parental\s*expect|family.*force|parent.*force|ghar.*pressure|pressure.*ghar|parents.*want|parents.*forcing/.test(t)) return'family_pressure';
  if(/what.*this.*site|about.*divastra|what.*divastra|about.*this.*page|who.*made.*this|about.*this.*website|what.*is.*divastra|who.*built/.test(t)) return'about_site';
  if(/nit\s*(jamshedpur|jsr)|nitjsr\b/.test(t)) return'nit_jamshedpur';
  if(/nit\s*(rourkela|rkl)|nitr\b/.test(t)) return'nit_rourkela';
  if(/nit\s*(durgapur|dgp)|nitdgp\b/.test(t)) return'nit_durgapur';
  if(/cutoff\s*trend|opening\s*rank|closing\s*rank|round.*cutoff|cutoff.*drop|cutoff.*rise|seat\s*matrix|previous.*cutoff|cutoff.*previous|cutoff.*last\s*year/.test(t)) return'cutoff';
  if(/\b(what.*do\s*you\s*like|your\s*hobbies|your\s*interests|tell.*fun\s*fact|favourite.*thing|favorite.*thing|what.*is.*your\s*fav|do\s*you\s*like)\b/.test(t)) return'hobby';
  if(/time\s*table|study\s*schedule|time\s*management|how\s*many\s*hours.*study|hours.*study.*day|daily.*routine.*study|study\s*plan|productive.*study|daily\s*plan/.test(t)) return'time_mgmt';
  if(/weather.*college|climate.*college|how\s*hot.*nit|how\s*cold.*nit|temperature.*campus|location.*weather/.test(t)) return'weather_loc';
  if(/\b(cse\b|ece\b|mechanical\b|mech\b|civil\b|chemical\b|eee\b|electrical\b|which\s*branch|better\s*branch|branch\s*vs|cs\s*vs|ece\s*vs|it\s*vs|cse\s*vs|mech\s*vs|change\s*branch)\b/.test(t)) return'branch';
  if(/\b(vit\b|manipal|bits\b|srm\b|lpu\b|amity\b|sharda\b|management\s*quota|nri\s*quota|iiit\s*hyderabad|iiit\s*hyd|iiit\s*bangalore|iiit\s*blr)\b/.test(t)) return'private';
  if(/\bvs\b|versus|which is better|better than|compare|nit or iit|iit or nit|private or govt|govt or private|nit or private|which one better/.test(t)) return'comparison';
  if(/\b(uptac|jceceb|comedk|kcet|mhtcet|mht.?cet|home\s*state|state\s*quota|domicile\b|state\s*rank|state\s*counsell)\b/.test(t)) return'state';
  if(/jee\s*advanced|jee\s*adv|\biit\s+[a-z]|\biit\b.*college|old iit|new iit|iit bombay|iit delhi|iit madras|iit kharagpur|iit roorkee|iit kanpur|iit bhu|iit dhanbad|ism dhanbad/.test(t)) return'iit';
  if(/hostel|campus\s*life|mess\s*food|ragging|girls\s*hostel|single\s*room|sports\s*complex|campus\s*facilit|college\s*life/.test(t)) return'hostel';
  if(/\b(yaar\b|bhai\b|didi\b|kya\s*ho\b|theek\s*ho|haan\b|nahi\b|kya\s*bolu|iska\s*kya|koi\s*baat|sahi\s*hai\b|bohot\b|arre\b|acha\b|achha\b|samajh\s*nahi|kal\s*se|abhi\s*kya|kab\s*tak|yeh\s*kya)\b/.test(t)) return'hindi';
  if(/lol|lmao|haha|hehe|rofl|joke\b|funny|😂|boring.*do|entertain me|crack a joke|comedy/.test(t)) return'funny';
  if(/useless|fake\b|waste of time|not helpful|bakwas|bakwaas|fraud\b|scam\b|horrible|worst site|disappoint|cheat|lame site|not working at all/.test(t)) return'angry';
  if(/price|cost\b|fee\b|kitna\b|how\s*much|charges\b|rupee|₹|paisa|payment|pdf\s*price|session\s*cost|how\s*to\s*pay/.test(t)) return'price';
  if(/suggest.*college|recommend.*college|which college|college suggest|college recommend/.test(t)) return'college';
  if(/\b(help\b|guide\s*me|suggest\s*me|batao\b|help\s*me|confused\b|what\s*should\s*i|kya\s*karu\b|don.?t\s*know\s*what|how\s*do\s*i|where\s*do\s*i)\b/.test(t)) return'help';
  if(/\b(rank\b|my\s*rank|rank\s*(hai|mili|aayi|kitni|kya)|mera\s*rank|got\s*rank|rank\s*mila|got\s*air|my\s*air|percentile|my\s*score)\b/.test(t)) return'rank';
  if(/college|nit\b|iiit\b|gfti\b|admission|cutoff|counsel/.test(t)) return'college';
  return'deflect';
}

export function rankReply(n){
  if(n<500) return[
    'Under 500 AIR?! IIT Bombay CS is literally within reach — you\'re a legend!! 😍💕',
    'TOP 500 in all of India!! IIT Delhi, Bombay, Madras — pick your dream~ 💕',
    'Under 500 means old IITs are YOURS~ don\'t waste this on a new IIT please~ 😌',
  ];
  if(n<2000) return[
    'Top 2000 AIR — IIT Kharagpur, Roorkee, Kanpur + top NIT CS are all in play~ 😊',
    '1-2K range = very solid IIT options! CS at old IITs, all branches at newer ones~ 💕',
    'This rank opens the top 6 IITs for non-CS branches + IIT Bombay for non-CS~ excellent!! 😌',
  ];
  if(n<6000) return[
    '2-6K range!! NIT Trichy CS, Warangal CS, IIIT Hyderabad — very accessible~ 💕',
    'Solid position!! NIT Warangal, Surathkal, Calicut core branches + IIITs~ 😊',
    'This rank puts you in the top NITs for most branches~ check the PDF guide! 😌',
  ];
  if(n<15000) return[
    '6-15K is very workable!! Mid-tier NITs like Durgapur, Bhopal, Silchar are solid~ 💕',
    'NIT Jamshedpur, NIT Hamirpur, NIT Rourkela — real options at this range~ 😊',
    'This range: tier-2 NITs for CSE/ECE + state quota at flagship NITs~ 😌',
  ];
  if(n<35000) return[
    '15-35K — tier-3 NITs + GFTIs + state counselling opens up nicely~ 💕',
    'NIT Patna, NIT Srinagar, NIT Jalandhar are reachable at this range~ 😊',
    'Many good GFTIs and IIITs in this range! Don\'t underestimate CSAB options~ 😌',
  ];
  if(n<80000) return[
    '35-80K — state counselling + some GFTIs. CSAB special round is your friend~ 💕',
    'At this range, state quota NIT seats + government state colleges are solid paths~ 😊',
    'State counselling (UPTAC, COMEDK etc.) can give really solid options here~ 😌',
  ];
  return[
    'Above 80K — DON\'T panic! State counselling + CSAB late rounds + private options~ 💕',
    'High rank number ≠ no options! State engineering colleges can be solid paths~ 😊',
    'Private colleges like VIT/Manipal + state government colleges are your main play~ 😌',
  ];
}

export function resolveFollowUp(pendingFU, txt){
  if(!pendingFU) return null;
  const t=txt.toLowerCase();
  const nm=t.match(/\b(\d{3,6})\b/);
  if(pendingFU==='fu_rank_type'){
    if(/air|jee\s*main|main|national|all\s*india|central/.test(t)) return{pool:FU_R.fu_rank_was_air,cat:'josaa',next:null};
    if(/state|uptac|comedk|kcet|jceceb|mhtcet/.test(t)) return{pool:FU_R.fu_rank_was_state,cat:'state',next:null};
    if(nm) return{pool:rankReply(parseInt(nm[1])),cat:'rank',next:null};
  }
  if(pendingFU==='fu_dropper_aim'){
    if(/not sure|unsure|don.?t know|maybe|idk|confused|not confident|scared|no\b/.test(t)) return{pool:FU_R.fu_dropper_no,cat:'dropper',next:null};
    if(/\b(yes|improve|better|definitely|sure|can do|will do|i think|confident)\b/.test(t)) return{pool:FU_R.fu_dropper_yes,cat:'dropper',next:null};
    if(nm) return{pool:rankReply(parseInt(nm[1])),cat:'rank',next:null};
  }
  if(pendingFU==='fu_stress_why'){
    if(/rank|number|score|result/.test(t)) return{pool:FU_R.fu_stress_share,cat:'stress',next:'fu_stress_num'};
    if(/next|what|steps|do|proceed|now|kya|plan/.test(t)) return{pool:FU_R.fu_help_josaa,cat:'josaa',next:null};
    if(nm) return{pool:rankReply(parseInt(nm[1])),cat:'rank',next:null};
  }
  if(pendingFU==='fu_stress_num'){
    if(nm) return{pool:rankReply(parseInt(nm[1])),cat:'rank',next:null};
  }
  if(pendingFU==='fu_branch_int'){
    if(/cod|cs|tech|software|program|dev|app|digital/.test(t)) return{pool:FU_R.fu_branch_tech,cat:'branch',next:null};
    if(/core|machine|civil|mech|electr|chemical|manufactur|factory/.test(t)) return{pool:FU_R.fu_branch_core,cat:'branch',next:null};
    return{pool:FU_R.fu_branch_unsure,cat:'branch',next:null};
  }
  if(pendingFU==='fu_col_rank'||pendingFU==='fu_cmp_rank'||pendingFU==='fu_cs_rank'||pendingFU==='fu_cc_rank'){
    if(nm) return{pool:rankReply(parseInt(nm[1])),cat:'rank',next:null};
    if(/high|good|top|low.*rank|under|low\b/.test(t)) return{pool:rankReply(/high|good|top/.test(t)?3000:50000),cat:'rank',next:null};
  }
  if(pendingFU==='fu_help_what'){
    if(/college|which\s*coll/.test(t)) return{pool:FU_R.fu_help_col,cat:'college',next:'fu_col_rank'};
    if(/branch|cse|ece|mech|cs\b/.test(t)) return{pool:FU_R.fu_help_branch,cat:'branch',next:'fu_branch_int'};
    if(/josaa|choice|prefer|fill/.test(t)) return{pool:FU_R.fu_help_josaa,cat:'josaa',next:null};
    if(/state|uptac|comedk/.test(t)) return{pool:FU_R.fu_rank_was_state,cat:'state',next:null};
  }
  if(pendingFU==='fu_greet_why'){
    if(/college|guid|help|rank|counsel|confused|advice/.test(t)) return{pool:FU_R.fu_greet_guidance,cat:'help',next:null};
    return{pool:FU_R.fu_greet_hi,cat:'greeting',next:null};
  }
  if(pendingFU==='fu_cg_branch'){
    if(/mech|civil|chem|eee|electrical/.test(t)) return{pool:FU_R.fu_career_co,cat:'career_core',next:null};
    return{pool:FU_R.fu_career_govt,cat:'career_govt',next:null};
  }
  if(pendingFU==='fu_cm_iim') return{pool:FU_R.fu_career_mba,cat:'career_mba',next:null};
  if(pendingFU==='fu_cr_where') return{pool:FU_R.fu_career_ms,cat:'career_ms',next:null};
  return null;
}

export function logMsg(txt, cat, sid, reply){
  const known=cat!=='deflect';
  const entry={
    ts:new Date().toISOString(),
    msg:txt.slice(0,500),
    cat,
    url:location.href,
    sid,
    ref:document.referrer||'direct',
  };
  try{
    const prev=JSON.parse(sessionStorage.getItem('divu_chat')||'[]');
    prev.push(entry);
    sessionStorage.setItem('divu_chat',JSON.stringify(prev));
  }catch(_){}
  if(window._dLog)window._dLog('chat',{userMsg:txt.slice(0,500),reply:(reply||'').slice(0,500),category:cat,known});
  if(CFG.divaLog){
    try{navigator.sendBeacon(CFG.divaLog,new Blob([JSON.stringify(entry)],{type:'application/json'}));}
    catch(_){fetch(CFG.divaLog,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(entry),keepalive:true}).catch(()=>{});}
  }
  if(CFG.divaFormAction&&CFG.divaFormField){
    try{
      const fd=new FormData();
      fd.append(CFG.divaFormField,`[${entry.ts}] [${cat}] ${txt}`.slice(0,500));
      if(CFG.divaFormUrl)fd.append(CFG.divaFormUrl,entry.url);
      navigator.sendBeacon(CFG.divaFormAction,fd);
    }catch(_){}
  }
}
