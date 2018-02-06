"use strict"

function Player()
{
	this.x = CANVAS_WIDTH/2;
	this.y = CANVAS_HEIGHT/2;
	this.radius = 20;
	this.speed = 200;
	
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;
	
	this.update = function()
	{	
		for(var i = 0; i < obstacles.length; i++)
		{
			var rect = {
				x: obstacles[i].x,
				y: obstacles[i].y,
				width: obstacles[i].width,
				height: obstacles[i].height
			};
			
			var circle = {
				x: this.x,
				y: this.y,
				radius: this.radius
			};
			
			if(checkCollisions(circle,rect))	//Check for collisions with obstacle
			{
				if(orbAmt > 0)	// remove all orbs if we have more than 0
				{
					for(var p = 0; p < revolve.orbArray.length; p++)
					{
						revolve.orbArray[p].hit = true;
					}
					obstacles[i].dead = true;
					loseMultiplierSound();
				}
				else	// end game if you have 0 orbs
				{
					gameOverSound();
					this.dead = true;
					obstacles[i].dead = true;
				}
			}
		}
		
		if(this.up)
		{
			this.y -= this.speed * dt;	
		}
		else if (this.down)
		{
			this.y += this.speed * dt;	
		}
		
		if(this.left)
		{
			this.x -= this.speed * dt;	
		}
		else if (this.right)
		{
			this.x += this.speed * dt;
		}	
		
		if(this.x > CANVAS_WIDTH + 5)
		{
			this.x = -10 + this.x - CANVAS_WIDTH;
		}
		else if(this.x < -5)
		{
			this.x = CANVAS_WIDTH + 5 + this.x + 5;
		}
		
		if(this.y > CANVAS_HEIGHT + 5)
		{
			this.y = -10 + this.y - CANVAS_HEIGHT;
		}
		else if(this.y < -5)
		{
			this.y = CANVAS_HEIGHT + 5 + this.y + 5;
		}
	}
	
	this.draw = function()
	{
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
		ctx.fillStyle = "#555555";
		ctx.fill();
	}
}