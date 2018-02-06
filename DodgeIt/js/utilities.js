"use strict"

	function pointInsideCircle(x, y, I)
	{
		var dx = x - I.x;
		var dy = y - I.y;
		return dx * dx + dy * dy <= I.radius * I.radius;
	}

	function circlesIntersect(c1, c2)
	{
		var dx = c2.x - c1.x;
		var dy = c2.y - c1.y;
		var distance = Math.sqrt(dx * dx + dy * dy);
		return distance < c1.radius + c2.radius;
	}

	function getRandomUnitVector()
	{
		var x = getRandom(-1, 1);
		var y = getRandom(-1, 1);
		var length = Math.sqrt(x * x + y * y);
		if (length == 0)
		{
			x = 1;
			y = 0;
			length = 1;
		}
		else
		{
			x /= length;
			y /= length;
		}

		return {
			x: x,
			y: y
		};
	}

	function getRandom(min, max)
	{
		return Math.random() * (max - min) + min;
	}

	function getRandomColor()
	{
		var red = Math.round(Math.random() * 200 + 55);
		var green = Math.round(Math.random() * 200 + 55);
		var blue = Math.round(Math.random() * 200 + 55);
		var color = 'rgb(' + red + ',' + green + ',' + blue + ')';
		return color;
	}

	function clamp(val, min, max)
	{
		return Math.max(min, Math.min(max, val));
	}

	function runListeners()
	{
		canvas.addEventListener("mousemove", function(e)
		{
			var x = e.clientX;
			var y = e.clientY;
			var rect = canvas.getBoundingClientRect();

			x -= rect.left;
			y -= rect.top;

			mouseX = x;
			mouseY = y;
		},false);
		
		window.addEventListener('keydown',function(e)
		{
			var code = e.keyCode;
			console.log(code);
			switch(code)
			{
				case 37:
				case 65: player.left = true; onboard.left = true; break;
				case 38:
        		case 87: player.up = true; onboard.up = true; break;
        		case 39:
				case 68: player.right = true; onboard.right = true; break;
        		case 40:
				case 83: player.down = true; onboard.down = true; break;
				case 32: revolve.retract = true; onboard.space = true; break;
				case 71: orbAmt++; break;
			}
//			
//			if(code == 65){player.left = true;}
//			else{player.left = false;}
//			
//			if(code == 87){player.up = true;}
//			else{player.up = false;}
//			
//			if(code == 68){player.right = true;}
//			else{player.right = false;}
//			
//			if(code == 83){player.down = true;}
//			else{player.down = false;};


		},false);
		
		window.addEventListener('keyup',function(e)
		{
			var code = e.keyCode;
			
			switch(code)
			{
				case 37:
				case 65: player.left = false; break;
        		case 38:
				case 87: player.up = false; break;
        		case 39:
				case 68: player.right = false; break;
        		case 40:
				case 83: player.down = false; break;
				case 32: revolve.retract = false; break;
			}
		},false);
		
		window.addEventListener('mousedown',function(e) 
		{
			bgAudio.play();
        	if (paused) {
           	 	paused = false;
           	 	update();
           	 	return;
       		 };
		
			if(gameState == GAME_STATE_MENU)
			{
				gameState = GAME_STATE_PLAYING;
				reset();
				return;	
			}
			
			if(gameState == GAME_STATE_END)
			{
				gameState = GAME_STATE_PLAYING;
				reset();
				return;	
			}
    	},false);
	}
	
var clone = (function(){ 
  return function (obj) { Clone.prototype=obj; return new Clone() };
  function Clone(){}
}());