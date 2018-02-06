"use strict";

	var GAME_STATE_MENU = 0;
	var GAME_STATE_PLAYING = 1;
	var GAME_STATE_END = 2;
    var gameState = GAME_STATE_MENU;
	var level = 0;
    var score = 0;
	var baseInc = 2;
    
    var mouseX,mouseY = 0;

    var animationID;
    var paused = false;
    var canvas, ctx;

    var CANVAS_WIDTH = 640;
    var CANVAS_HEIGHT = 480;

	var lastTime;
	
	var dt = 0;
	var elapsedTime = 0;
	
	var ENEMY_PROBABILITY_PER_SECOND = 1.0;
	
	var revolve;
	var player;
	var pickupspawn;
	var obstaclespawn;
	var onboard;
	var levelMng;
	var obstacles = [];
	
	var highscore = 0;
	var coolDownTime = 5;
	var waveTime = 15;
	var level = 1;

    window.onload = init;

    function init() {
        console.log("init called");
        lastTime = 0;
        gameState = GAME_STATE_MENU;
        canvas = document.querySelector("canvas");
        ctx = canvas.getContext("2d");		
		localStorage.highscore = highscore;
		
        runListeners();
        
		bgAudio = document.querySelector("#bgAudio"); 
		bgAudio.volume=0.75; 
		gameOverAudio = document.querySelector("#gameOverAudio")
		effectAudio = document.querySelector("#effectAudio"); 
		effectAudio.volume = 0.3;

        window.onblur = function() {
            paused = true;
            cancelAnimationFrame(animationID);
			stopAudio();
            update();
        };
        window.onfocus = function() {
            cancelAnimationFrame(animationID);
            paused = false;
			bgAudio.play();
            update();
        };

        update();
    }

    function reset() {
		bgAudio.play();
		orbAmt = 5;
		score = 0;
		pickUpMult = 0;
		obstacles = [];
		onboard = new OnBoard();
		player = new Player();
		revolve = new Revolver();
		pickupspawn = new PickupSpawner();
		obstaclespawn = new ObstacleSpawner();
		levelMng = new LevelManager();
        revolve.recreateOrbs();
		elapsedTime = 0;
		level = 0;
    }

    function update() {
		dt = calculateDeltaTime(lastTime);
		elapsedTime += dt;
        if (paused) {
            drawPauseScreen();
            return;
        }
		
		if(gameState == GAME_STATE_PLAYING)
		{
			onboard.update();
			player.update();
			revolve.update();
			
			if(onboard.used)
			{
				levelMng.update();
				if(!revolve.retract || waveType == WAVETYPE_TUNNEL)
				{
					score += baseInc * (orbAmt + 1) * dt;
				}
				obstaclespawn.addObstacles();
				obstaclespawn.update();
				if(!revolve.retract || waveType == WAVETYPE_TUNNEL)
				{
					pickupspawn.update();
					console.log("spawning");
				}
			}
			if(player.dead)
			{
				gameState = GAME_STATE_END;	
				stopAudio();
				if(localStorage.highscore < score)
				{
					localStorage.highscore = score;
				}
			}
		}
		
		animationID = requestAnimationFrame(update);
        
        draw();
    }
	 function draw()
	 {
        ctx.fillStyle = "#d0d0d0";
        ctx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
		
		if(gameState == GAME_STATE_PLAYING)
		{	
			onboard.draw();
			player.draw();
       		revolve.draw();
			if(revolve.retract && waveType != WAVETYPE_TUNNEL){ctx.globalAlpha = .3;}
			pickupspawn.draw();
			ctx.globalAlpha = 1;
			obstaclespawn.draw();
		}
		
        drawHUD();
	 }


    function drawHUD() 
	{
		if(gameState == GAME_STATE_MENU)
		{
			ctx.fillStyle = "#214356";
			ctx.textAlign = "center"
			ctx.font="20px Arial";
			ctx.fillText("Click to start",CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
			
			ctx.font="80px Arial";
			ctx.fillText("Dodge-It",CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 100);
		}
		if(gameState == GAME_STATE_PLAYING)
		{
			ctx.fillStyle = "#214356";
			ctx.textAlign = "center"
			ctx.textBaseline = 'middle';
			if(revolve.retract && waveType != 2){ctx.fillStyle = "red"; ctx.font="30px Arial";}
			else{ctx.fillStyle = "#214356;"; ctx.font="20px Arial";}
			ctx.fillText(Math.floor(score),CANVAS_WIDTH/2, 30);
			ctx.fillStyle = "#214356;"
			ctx.font="20px Arial";
			ctx.save();
			ctx.textAlign = "left";
			ctx.fillText("Level " + level,30, 30);
			ctx.textAlign = "center";
			ctx.font="15px Arial";
			if(levelMng.isWave){ctx.fillText("WAVE IN PROGRESS",CANVAS_WIDTH/2, CANVAS_HEIGHT - 15);}
			else{ctx.fillText("WAVE COMPLETE",CANVAS_WIDTH/2, CANVAS_HEIGHT - 15)};
			ctx.textAlign = "right";
			ctx.font="20px Arial";
			if(!levelMng.isWave){ctx.fillStyle = "green"; ctx.font="20px Arial";}
			if(orbAmt === 0){ctx.fillStyle = "red"; ctx.font="30px Arial";}
			ctx.fillText("x" + (orbAmt),CANVAS_WIDTH - 30, 30);
			ctx.restore();
			drawTimer();
		}
		if(gameState == GAME_STATE_END)
		{
			ctx.fillStyle = "#214356";
			ctx.textAlign = "center"
			ctx.fillText("Someone Screwed Up",CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 40);
			ctx.fillText("Final Score: " + Math.floor(score),CANVAS_WIDTH/2, CANVAS_HEIGHT/2);	
			ctx.fillText("Highscore: " + Math.floor(localStorage.highscore),CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 20);	
			ctx.fillText("Click to restart...",CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 60);	
		}
    }

	function drawTimer(){
		
		if(levelMng.isWave)
		{
			ctx.fillStyle = "#555555";
			ctx.fillRect(0,0,CANVAS_WIDTH,10);
			ctx.fillStyle = "#AAAAAA";
			ctx.fillRect(0,0,currentTime/waveTime * CANVAS_WIDTH,10);	
		}
		else
		{
			ctx.fillStyle = "#AAAAAA";
			ctx.fillRect(0,0,CANVAS_WIDTH,10);
			ctx.fillStyle = "#555555";
			ctx.fillRect(CANVAS_WIDTH -(currentTime/coolDownTime * CANVAS_WIDTH),0,currentTime/coolDownTime * CANVAS_WIDTH,10);	
		}
	}
    function drawPauseScreen() {
        ctx.save();
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        //ctx.drawText("... PAUSED ...", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 60, "white");
        ctx.restore();
    }
    
    function calculateDeltaTime()
	{
		var now, fps;
		now = (+new Date);
		fps = 1000 / (now - lastTime);
		fps = clamp(fps, 12, 60);
		lastTime = now;
		return 1 / fps;
	}