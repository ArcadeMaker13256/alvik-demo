/* Editable browser-only memory; export to transfer to another browser/device. */
(function(root){
 'use strict';
 const KEY='pip.assistant.memory.v2', LEGACY='pip.pet.memories.v1', MAX=200, LIMIT=260;
 function clean(t){return String(t||'').replace(/[\u0000-\u001f]/g,' ').replace(/\s+/g,' ').trim().slice(0,LIMIT)}
 function rawLoad(){try {return JSON.parse(root.localStorage.getItem(KEY)||'null')}catch(_){return null}}
 function entries(){
   let data=rawLoad();
   if(!Array.isArray(data)) {
     try {const old=JSON.parse(root.localStorage.getItem(LEGACY)||'[]');
       data=Array.isArray(old)?old.filter(x=>typeof x==='string').map((text,i)=>({id:'old-'+i,text:clean(text),at:0})):[];
       root.localStorage.setItem(KEY,JSON.stringify(data));
     }catch(_){data=[]}
   }
   return data.filter(x=>x&&typeof x.text==='string').map(x=>({id:String(x.id||''),text:clean(x.text),at:Number(x.at)||0})).filter(x=>x.text).slice(-MAX);
 }
 function save(items){try{root.localStorage.setItem(KEY,JSON.stringify(items.slice(-MAX)));return true}catch(_){return false}}
 function add(text){text=clean(text);if(text.length<3)return false;
   const items=entries().filter(x=>x.text.toLowerCase()!==text.toLowerCase());
   items.push({id:String(Date.now())+'-'+Math.floor(Math.random()*100000),text,at:Date.now()});return save(items)}
 function remove(id){return save(entries().filter(x=>x.id!==id))}
 function edit(id,text){text=clean(text);if(text.length<3)return false;return save(entries().map(x=>x.id===id?{...x,text}:x))}
 function clear(){return save([])}
 function exportData(){return JSON.stringify({app:'pip-memory',version:2,entries:entries()},null,2)}
 function importData(data){try{const obj=JSON.parse(data);if(obj.app!=='pip-memory'||!Array.isArray(obj.entries)||obj.entries.length>MAX)throw Error();
    const rows=obj.entries.map(x=>({id:String(x.id||''),text:clean(x.text),at:Number(x.at)||0})).filter(x=>x.text.length>=3);
    return save(rows)?{ok:true,count:rows.length}:{ok:false,error:'Storage denied'};
   }catch(_){return {ok:false,error:'Invalid memory export'}}}
 function load(){return entries().map(x=>x.text)}
 function context(query){const q=String(query||'').toLowerCase().split(/\W+/).filter(w=>w.length>3);
   return entries().map((e,i)=>({text:e.text,score:q.reduce((a,w)=>a+(e.text.toLowerCase().includes(w)?3:0),0)+i/1000}))
     .sort((a,b)=>b.score-a.score).slice(0,12).map(x=>x.text)}
 function handle(text){const t=String(text||'').trim();
   if(/^remember(?: that)?\s+/i.test(t))return add(t.replace(/^remember(?: that)?\s+/i,''))?{kind:'saved',reply:'I saved that. You can review or edit it in Memory Manager.'}:{kind:'error',reply:'Memory could not be saved.'};
   if(/^(?:what do you remember|show memory|show memories)\s*[!?]?$/i.test(t))return {kind:'list',reply:entries().length?'I have '+entries().length+' saved memories. Open Memory Manager to review or edit them.':'I have no saved memories yet.'};
   return null;
 }
 const api={MAX,entries,load,context,add,remove,edit,clear,exportData,importData,handle};root.PipMemory=api;
 if(typeof module!=='undefined' && module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
