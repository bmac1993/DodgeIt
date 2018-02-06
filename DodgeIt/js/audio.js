"use strict"

	var bgAudio,gameOverAudio,effectAudio;

	var loseOrbAudio = "lose-orb.wav";
	var gainOrbAudio = "gain-orb.wav";
	var gainMultiplierAudio = "gain-multiplier.wav";
	var loseMultiplierAudio = "lose-multiplier.wav";
	
	function stopAudio(){ 
 		bgAudio.pause(); 
 		bgAudio.currentTime = 0; 
	}
	
	function loseOrbSound(){
		effectAudio.src = "media/" + loseOrbAudio; 
 		effectAudio.play(); 
	}
	
	function gainOrbSound(){
		effectAudio.src = "media/" + gainOrbAudio;
 		effectAudio.play(); 
	}
	
	function gainMultiplierSound(){
		effectAudio.src = "media/" + gainMultiplierAudio;
 		effectAudio.play(); 
	}
	
	function loseMultiplierSound(){
		effectAudio.src = "media/" + loseMultiplierAudio;
 		effectAudio.play(); 
	}
	
	function gameOverSound(){
		gameOverAudio.volume = 0.3;
 		gameOverAudio.play(); 
	}