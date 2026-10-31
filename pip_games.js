/* Local, fast interactive games: no LLM latency and no wheel movement. */
(function(root){
 'use strict';
 let game=null, secret=0, turns=0, sequence=[];
 const picks=['rock','paper','scissors'];
 function begin(which){game=which;turns=0;
   if(which==='rps')return 'Rock, paper, scissors! Choose rock, paper, or scissors.';
   if(which==='number'){secret=Math.floor(Math.random()*20)+1;return 'I picked a number from 1 to 20. Guess it!';}
   if(which==='sequence'){sequence=Array.from({length:3},()=>Math.floor(Math.random()*4)+1);return 'Memory challenge: remember '+sequence.join(' - ')+'. Type the numbers in that order.';}
   game=null;return 'Choose rock paper scissors, number guessing, or memory challenge.';
 }
 function play(input){if(!game)return null;const t=String(input||'').toLowerCase().trim();
   if(/^(quit game|end game|cancel game)$/.test(t)){game=null;return 'Game ended.';}
   if(game==='rps'){
     if(!picks.includes(t))return 'Choose rock, paper, or scissors (or say quit game).';
     const me=picks[Math.floor(Math.random()*3)];
     const outcome=me===t?'Tie!':(t==='rock'&&me==='scissors'||t==='paper'&&me==='rock'||t==='scissors'&&me==='paper')?'You win!':'I win!';
     return 'I chose '+me+'. '+outcome+' Another round?';
   }
   if(game==='number'){
     if(!/^\d+$/.test(t))return 'Guess a whole number between 1 and 20.';
     const n=Number(t);if(n<1||n>20)return 'Pick between 1 and 20.';turns++;
     if(n===secret){game=null;return 'Correct! You got it in '+turns+' guesses. Want another game?';}
     return n<secret?'Too low. Try higher!':'Too high. Try lower!';
   }
   if(game==='sequence'){
     const values=t.split(/[ ,\-]+/).filter(Boolean).map(Number);
     if(values.length!==sequence.length||values.some(v=>!Number.isInteger(v)||v<1||v>4))return 'Enter '+sequence.length+' numbers from 1 to 4, separated by spaces.';
     const won=values.every((x,i)=>x===sequence[i]);
     if(!won){game=null;return 'Not quite! The sequence was '+sequence.join(' - ')+'. Try again?';}
     turns++;if(turns===3){game=null;return 'You completed three memory rounds! Amazing.';}
     sequence.push(Math.floor(Math.random()*4)+1);return 'Correct! Next sequence: '+sequence.join(' - ')+'. Remember it!';
   }
 }
 const api={begin,play,isActive:()=>!!game};root.PipGames=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
