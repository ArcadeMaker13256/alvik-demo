/* Deterministic, narrowly scoped tricks. No AI call is needed for wheel commands.
   Return null when text is uncertain, negated, or merely discussing motion. */
(function (root) {
  'use strict';
  function parsePetCommand(input) {
    let text = String(input || '').toLowerCase().replace(/[!?.,]/g, ' ')
      .replace(/\s+/g, ' ').trim();
    text = text.replace(/^(?:(?:hey |hi )?alvik |please )+/g, '');
    text = text.replace(/^(?:can you |could you |would you |will you )/g, '');
    text = text.replace(/^please /, '').replace(/\s+please$/, '').replace(/\s+for me$/, '').trim();
    if (/^(?:wake up|wake|play|play mode|explore|start exploring|go play|let s play|lets play|be playful)$/.test(text))
      return {type: 'pet_mode', mode: 'play'};
    if (/^(?:rest|rest now|go to sleep|sleep|take a nap|nap time|rest mode|be still)$/.test(text))
      return {type: 'pet_mode', mode: 'rest'};
    if (/^(?:good pet|good boy|good girl|who s a good pet|who's a good pet|you are a good pet|you re cute|you're cute|cute pip|i love you|pet pip|give pets|head pat|pat pat|treat|here s a treat|here's a treat)$/.test(text))
      return {type: 'affection'};
    if (/^(?:stop|stop now|stop moving|halt|freeze|emergency stop|stop right now|don t move|don't move|do not move)$/.test(text)) {
      return {type: 'stop', emergency: text === 'emergency stop'};
    }
    if (/\b(?:not|don't|dont|never|without|can't|cannot|won't|why|if|how|should|what|when|say|tell|explain)\b/.test(text)) return null;

    const trail = '(?: (?:a little|a bit|a tiny bit|a little bit|slightly|for a moment|now|quickly|one step|a step|please))?';
    let direction;
    if (new RegExp('^(?:move |go |roll |drive |step |take a step |walk )?(?:forward|forwards|straight ahead|ahead)' + trail + '$').test(text)) direction = 'forward';
    else if (new RegExp('^(?:move |go |roll |drive |step |take a step |walk )?(?:back|backward|backwards|reverse)' + trail + '$').test(text) ||
             new RegExp('^(?:back up|reverse)' + trail + '$').test(text)) direction = 'backward';
    else if (new RegExp('^(?:turn |rotate |spin |go |move )left' + trail + '$').test(text)) direction = 'left';
    else if (new RegExp('^(?:turn |rotate |spin |go |move )right' + trail + '$').test(text)) direction = 'right';
    else if (/^(?:dance|do a little dance|do a dance|wiggle)$/.test(text)) direction = 'right';
    if (!direction) return null;
    const turning = direction === 'left' || direction === 'right';
    return {type: 'move', direction: direction,
      duration_ms: turning ? 400 : 650, speed_rpm: turning ? 18 : 22};
  }
  root.PetCommands = {parsePetCommand: parsePetCommand};
  if (typeof module !== 'undefined') module.exports = {parsePetCommand: parsePetCommand};
})(typeof window !== 'undefined' ? window : globalThis);
