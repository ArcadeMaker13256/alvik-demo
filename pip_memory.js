/* Pip's optional, explicit local memory. No server, no secrets stored here.
 * Only phrases beginning with "remember ..." are saved. */
(function(root) {
  'use strict';
  const KEY='pip.pet.memories.v1';
  const MAX=12, MAX_LEN=160;
  function clean(s) {return String(s||'').replace(/[\r\n\t]+/g,' ').replace(/\s+/g,' ').trim().slice(0,MAX_LEN);}
  function load() {
    try {
      const raw=JSON.parse(root.localStorage.getItem(KEY)||'[]');
      if(!Array.isArray(raw))return [];
      return raw.filter(x=>typeof x==='string').map(clean).filter(Boolean).slice(-MAX);
    } catch(_) {return [];}
  }
  function write(items) {
    try {root.localStorage.setItem(KEY,JSON.stringify(items.slice(-MAX)));return true;}
    catch(_) {return false;}
  }
  function clear(){return write([])}
  function remember(note){
    note=clean(note);
    if(note.length<3)return {kind:'error',reply:'Brrp? Tell me what to remember!'};
    const items=load().filter(x=>x.toLowerCase()!==note.toLowerCase());
    items.push(note);
    if(!write(items))return {kind:'error',reply:'My little memory box is unavailable in this browser.'};
    return {kind:'saved',reply:'Pip pip! I tucked that into my memory box.'};
  }
  function handle(text) {
    const value=String(text||'').trim();
    if(/^\s*(?:forget everything|forget all(?: my)? memories|clear (?:your |my )?memory)\s*[.!?]*$/i.test(value)){
      return clear()?{kind:'cleared',reply:'Boop! My memory box is empty now.'}:{kind:'error',reply:'I could not clear my memory here.'};
    }
    if(/^\s*(?:what do you remember(?: about me)?|show (?:your |my )?memories|show (?:your |my )?memory)\s*[!?]*$/i.test(value)){
      const items=load();
      return {kind:'list',reply:items.length?'I remember:\n'+items.map((x,i)=>(i+1)+'. '+x).join('\n'):'My memory box is empty! Say “remember that ...” to teach me something.'};
    }
    const match=/^\s*remember(?: that)?\s+(.+?)\s*[.!?]*$/i.exec(value);
    if(match)return remember(match[1]);
    return null;
  }
  const api={load,remember,clear,handle};
  root.PipMemory=api;
  if(typeof module!=='undefined' && module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
