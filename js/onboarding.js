"use strict"

function OnBoard()
{
	this.display = true;
	var fade = true;
	var fadeOut = false;
	var fadeInTime = 0;
	var fadeInMax = 4;
	
	this.up = false;
	this.left = false;
	this.down = false;
	this.right = false;
	this.space = false;
	
	this.used = false;
	
	this.update = function()
	{
		if(this.display)
		{
			if(fade)
			{
				fadeInTime += dt;
				if(fadeInTime > fadeInMax)
				{
					fadeInTime = fadeInMax;
					fade = false;
				}
			}
			
			if(fadeOut)
			{
				fadeInTime -= dt;
				if(fadeInTime < 0)
				{
					fadeInTime = 0;
					fadeOut = false;
					this.display = false;	
				}
			}
			
			if(this.up && this.down && this.left && this.right && this.space)
			{
				this.used = true;
			}

			if(this.used && !fade)
			{
				fadeOut = true;	
			}
		}
	}
	this.draw = function()
	{
		if(this.display)
		{
			var defFill = "#B9B9B9";
			var pressFill = "#5CC942";
			ctx.save();
			ctx.globalAlpha = fadeInTime / fadeInMax;
			ctx.font="30px Arial";
			ctx.textBaseline = 'middle';
			ctx.textAlign = 'center';
			if(this.up){ctx.fillStyle = pressFill;}
			else{ctx.fillStyle = defFill;}
			ctx.fillText("W",CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 50);
			
			if(this.left){ctx.fillStyle = pressFill;}
			else{ctx.fillStyle = defFill;}
			ctx.fillText("A",CANVAS_WIDTH/2 - 50, CANVAS_HEIGHT/2);
			
			if(this.down){ctx.fillStyle = pressFill;}
			else{ctx.fillStyle = defFill;}
			ctx.fillText("S",CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 50);
			
			if(this.right){ctx.fillStyle = pressFill;}
			else{ctx.fillStyle = defFill;}
			ctx.fillText("D",CANVAS_WIDTH/2 + 50, CANVAS_HEIGHT/2);
			
			if(this.space){ctx.fillStyle = pressFill;}
			else{ctx.fillStyle = defFill;}
			ctx.fillText("SPACE",CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 100);
			ctx.restore();
		}
	}
}