/* Pip 4.0 deterministic robot commands. CommonJS for offline tests. */
(function(root) {
 'use strict';
 function clean(s) {return String(s||'').toLowerCase().replace(/[!?.,]/g,' ').replace(/\s+/g,' ').trim().replace(/^(hey pip |pip |please |can you |could you |would you )+/, '').replace(/ please$/, '');}
 function numberWithUnits(raw, defaultUnit) {
   const m=/^(\d+(?:\.\d+)?|half|one|two|three)\s*(millimeters?|mm|centimeters?|cm|meters?|m|inches?|inch|in|feet|foot|ft|degrees?|deg|°)?$/.exec(raw.trim());
   if(!m)return null;
   const n=({half:0.5,one:1,two:2,three:3})[m[1]]||Number(m[1]);
   if(!Number.isFinite(n))return null;
   const unit=(m[2]||defaultUnit).toLowerCase();
   if(/degree|deg|°/.test(unit))return {kind:'turn', value:n};
   const multiplier=/^m$|^meter/.test(unit)?100:/^mm|millimeter/.test(unit)?0.1:/^in|inch/.test(unit)?2.54:/^f(?:t|eet|oot)/.test(unit)?30.48:1;
   return {kind:'move', value:n*multiplier};
 }
 function segment(s) {
   s=s.trim().replace(/^and\s+|^then\s+/,'');
   let m=/^(?:move|go|drive|roll|walk|travel|step)\s+(forward|forwards|back|backward|backwards|reverse)\s+(.+)$/.exec(s);
   if(m) {
     const n=numberWithUnits(m[2],'cm');
     if(!n||n.kind!=='move')return null;
     return {kind:'move',cm:Math.round(n.value*10)/10*(m[1].startsWith('b')||m[1]==='reverse'?-1:1)};
   }
   m=/^(?:turn|rotate|spin)\s+(left|right)\s+(\d+(?:\.\d+)?)(?:\s*(?:degrees?|deg|°))?$/.exec(s);
   if(m)return {kind:'turn',deg:Number(m[2])*(m[1]==='left'?1:-1)};
   m=/^(?:turn|rotate|spin)\s+(\d+(?:\.\d+)?)(?:\s*(?:degrees?|deg|°))?\s+(left|right)$/.exec(s);
   if(m)return {kind:'turn',deg:Number(m[1])*(m[2]==='left'?1:-1)};
   if(/^(?:go|move|roll)\s+(forward|forwards|backward|backwards)$/.test(s))return {kind:'move',cm:s.includes('back')?-8:8};
   if(/^(?:turn|rotate)\s+(left|right)$/.test(s))return {kind:'turn',deg:s.endsWith('left')?45:-45};
   return null;
 }
 function validate(steps) {
   if(!Array.isArray(steps)||steps.length<1||steps.length>5)return null;
   let traveled=0, rotated=0;
   const out=[];
   for(const p of steps) {
     if(!p||!['move','turn'].includes(p.kind))return null;
     if(p.kind==='move'){
       const cm=Number(p.cm);
       if(!Number.isFinite(cm)||cm===0||cm>50||cm< -15)return null;
       traveled+=Math.abs(cm);
       out.push({kind:'move',cm:Math.round(cm*10)/10});
     } else {
       const deg=Number(p.deg);
       if(!Number.isFinite(deg)||deg===0||Math.abs(deg)>180)return null;
       rotated+=Math.abs(deg);
       out.push({kind:'turn',deg:Math.round(deg*10)/10});
     }
   }
   if(traveled>100||rotated>360)return null;
   return out;
 }
 function parse(input){
   const s=clean(input);
   if(/^(?:stop|stop now|halt|freeze|stop moving|emergency stop)$/.test(s))return {type:'stop',emergency:s==='emergency stop'};
   if(/^(?:how far (?:have you|did you) (?:walk|travel|move)|where are you|what is your position|show position|how far from (?:start|home))$/.test(s))return {type:'position'};
   if(/^(?:mark (?:this as )?(?:start|home)|set (?:start|home) here|reset (?:the )?(?:position|origin|odometry))$/.test(s))return {type:'mark_home'};
   if(/^(?:go home|return to (?:start|home)|go back to (?:the )?(?:start|starting point|home))$/.test(s))return {type:'go_home'};
   if(/^(?:rest|sleep|stop playing|rest mode)$/.test(s))return {type:'goal',goal:'rest'};
   if(/^(?:play tag|tag mode|let s play tag|lets play tag)$/.test(s))return {type:'goal',goal:'tag'};
   if(/^(?:color hunt|find colors|play color hunt)$/.test(s))return {type:'goal',goal:'color'};
   if(/^(?:explore|explore mode|play mode|start exploring)$/.test(s))return {type:'goal',goal:'explore'};
   if(/^(?:play rock paper scissors|rock paper scissors|rps)$/.test(s))return {type:'game',game:'rps'};
   if(/^(?:play number guessing|guess the number|number game)$/.test(s))return {type:'game',game:'number'};
   if(/^(?:play memory challenge|memory challenge|sequence game)$/.test(s))return {type:'game',game:'sequence'};
   if(/^(?:turn the (?:front )?lights on|lights on)$/.test(s))return {type:'lights',enabled:true};
   if(/^(?:turn the (?:front )?lights off|lights off)$/.test(s))return {type:'lights',enabled:false};
   // Do not run motor commands when negated or discussed hypothetically.
   if(/\b(don't|dont|not|never|why|what if|could|should|without|explain|how to)\b/.test(s))return null;
   const segments=s.split(/\s+(?:and then|then|and)\s+/);
   if(segments.length>5)return {type:'invalid_motion'};
   const steps=segments.map(segment);
   if(steps.some(x=>!x))return null;
   const safe=validate(steps);
   return safe?{type:'plan',steps:safe}:{type:'invalid_motion'};
 }
 const api={parse,validate,segment};root.PipCommands=api;
 if(typeof module!=='undefined' && module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
