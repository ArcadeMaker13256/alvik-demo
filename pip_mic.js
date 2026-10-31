/* Pip 4.2 continuous microphone controller.
 * No audio is stored by this module. Browser speech recognition may use cloud processing.
 * Respects manual OFF, permission failures, tab visibility, and Pip's own speech.
 */
(function(root, factory){
  const moduleValue = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = moduleValue;
  if (root) root.PipMic = moduleValue;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
  'use strict';
  const TERMINAL_ERRORS = new Set(['not-allowed','service-not-allowed','audio-capture','language-not-supported']);
  function createController(options){
    const SpeechRecognition = options.SpeechRecognition;
    const schedule = options.setTimeout || setTimeout;
    const unschedule = options.clearTimeout || clearTimeout;
    const onState = options.onState || function(){};
    const onTranscript = options.onTranscript || function(){};
    const onError = options.onError || function(){};
    const isHidden = options.isHidden || function(){ return false; };
    let enabled = false, pausedForSpeech = false, current = null;
    let restartTimer = null, restartCount = 0, networkErrors = 0, terminalError = false;
    const status = (key, message) => onState(key, message);
    function clearRestart(){ if(restartTimer !== null){ unschedule(restartTimer); restartTimer = null; } }
    function shouldListen(){ return enabled && !pausedForSpeech && !isHidden(); }
    function stopCurrent(){
      const r = current;
      if(r){
        // Drop the reference before abort: some browsers never fire onend on abort.
        // A late result or onend from the old session will then be ignored.
        current=null;
        try{ r.abort(); } catch(_){}
      }
    }
    function scheduleRestart(delay){
      if(!shouldListen() || current || restartTimer !== null) return;
      status('restarting', '🎙️ Microphone ON — reconnecting to speech recognition…');
      restartTimer = schedule(function(){ restartTimer=null; start(); }, delay);
    }
    function start(){
      if(!shouldListen() || current) return;
      if(!SpeechRecognition){
        enabled=false;
        status('error','Speech recognition is unavailable in this browser.');
        return;
      }
      let r;
      try{r = new SpeechRecognition();}
      catch(e){ enabled=false; status('error','Unable to create microphone: '+e.message);onError(e.message);return; }
      current = r;
      r.lang='en-US'; r.continuous=true; r.interimResults=false; r.maxAlternatives=1;
      r.onstart = function(){
        if(current===r && shouldListen()) status('listening','🎙️ Microphone ON — listening for your commands');
      };
      r.onresult = function(event){
        if(current!==r || !shouldListen()) return;
        const results = event.results || [];
        const index = Number.isInteger(event.resultIndex) ? event.resultIndex : 0;
        for(let i=index; i<results.length; i++){
          const item=results[i];
          if(!item || !item.isFinal || !item[0]) continue;
          const message=String(item[0].transcript || '').trim();
          if(message){restartCount=0;networkErrors=0;onTranscript(message);}
        }
      };
      r.onerror = function(event){
        if(current!==r || !enabled) return;
        const code=String(event && event.error || 'unknown');
        if(TERMINAL_ERRORS.has(code)){
          enabled=false;clearRestart();
          terminalError=true;status('error','🔇 Microphone stopped: '+code+'. Check microphone permission/device and click to retry.');
          onError(code);stopCurrent();
        }else if(code === 'network'){
          networkErrors++;
          if(networkErrors>=5){
            enabled=false;clearRestart();
            terminalError=true;status('error','🔇 Microphone stopped after repeated network errors. Click to retry.');
            onError('Speech recognition network errors');stopCurrent();
          }
        }else if(code !== 'no-speech' && code !== 'aborted'){
          status('restarting','🎙️ Microphone ON — speech service interrupted ('+code+')');
        }
      };
      r.onend = function(){
        if(current!==r) return;
        current=null;
        if(!enabled){if(!terminalError)status('off','🔇 Microphone OFF');return;}
        if(pausedForSpeech){status('paused','🔇 Paused while Pip speaks');return;}
        if(isHidden()){status('paused','🔇 Paused: return to the Pip tab to resume');return;}
        // Browsers end recognition after silence even with continuous=true.
        // Back off modestly to avoid rapid reconnect storms.
        restartCount=Math.min(restartCount+1,8);
        const delay=Math.min(2200,350+restartCount*220);
        scheduleRestart(delay);
      };
      try{
        status('starting','🎙️ Microphone ON — starting…');
        r.start();
      }catch(e){
        current=null;enabled=false;
        status('error','🔇 Microphone could not start: '+(e.message||String(e)));
        onError(e.message||String(e));
      }
    }
    function enable(){
      if(enabled) return;
      enabled=true;pausedForSpeech=false;restartCount=0;networkErrors=0;terminalError=false;
      // Called inside an explicit click; start synchronously to preserve user activation.
      if(isHidden())status('paused','🔇 Microphone armed — return to the Pip tab');
      else start();
    }
    function disable(){
      enabled=false;pausedForSpeech=false;terminalError=false;clearRestart();stopCurrent();
      status('off','🔇 Microphone OFF');
    }
    function pauseForSpeech(){
      if(!enabled)return;
      pausedForSpeech=true;clearRestart();stopCurrent();
      status('paused','🔇 Mic paused while Pip speaks (auto-resumes)');
    }
    function resumeAfterSpeech(){
      pausedForSpeech=false;
      if(shouldListen())scheduleRestart(450);
      else if(enabled && isHidden())status('paused','🔇 Paused: return to the Pip tab to resume');
    }
    function visibilityChanged(){
      if(!enabled)return;
      if(isHidden()){
        clearRestart();stopCurrent();
        status('paused','🔇 Paused: return to the Pip tab to resume');
      } else if(!pausedForSpeech && !current){
        scheduleRestart(300);
      }
    }
    return {enable,disable, toggle(){if(enabled)disable();else enable();},pauseForSpeech,resumeAfterSpeech,
      visibilityChanged,isEnabled(){return enabled;},isListening(){return !!current && enabled && !pausedForSpeech;}};
  }
  return {createController};
});
