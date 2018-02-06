"use strict"

var orbAmt = 20;

function Revolver()
{
	this.x = 0;
	this.y = 0;
	this.orbArray = new Array();
	var curOrbAmt = orbAmt;
	var angleSize = 360;
	this.retract = false;
	var orbDistance = 60;
	var retractDistance = 20;
	
    console.log("made a revolver");
    
	this.recreateOrbs = function()
	{
		var totalAngle = 0;
		angleSize = 360/orbAmt;
		this.orbArray.length = 0;
		
		for(var i = 0; i < orbAmt; i++)
		{
			if(this.retract)
			{
				this.orbArray.push(new RevolverOrb(totalAngle, retractDistance, 5));
				this.orbArray[i].retracted = true;
			}
			else
			{
				this.orbArray.push(new RevolverOrb(totalAngle, orbDistance, 5));
			}
			totalAngle += angleSize;
		}
	}
	this.update = function()
	{
		if(waveType == 2)
		{
			this.retract = true;	
		}
		if(orbAmt != curOrbAmt)
		{	
			if(orbAmt > curOrbAmt)
			{
				this.recreateOrbs();
			}
			curOrbAmt = orbAmt;
		}
		this.x = player.x;
		this.y = player.y;
		
		for(var i = 0; i < this.orbArray.length; i++)
		{
			if(this.orbArray[i].dead)
			{
				this.orbArray.splice(i,1);
				i--;
				orbAmt--;
				loseOrbSound();
			}
			else
			{
				if(this.retract)
				{
					this.orbArray[i].retracted = true;
					this.orbArray[i].distance -= 400 * dt;
					if(this.orbArray[i].distance < retractDistance)
					{
						this.orbArray[i].distance = retractDistance;	
					}
				}
				else
				{
					this.orbArray[i].retracted = false;	
					this.orbArray[i].distance += 400 * dt;
					if(this.orbArray[i].distance > orbDistance)
					{
						this.orbArray[i].distance = orbDistance;	
					}
				}
				this.orbArray[i].update(this.x,this.y);
			}
		}
	}
	this.draw = function()
	{
		for(var i = 0; i < this.orbArray.length; i++)
		{
			this.orbArray[i].draw();
		}
	}
}

function RevolverOrb(pAngle, pDistance, pRadius)
{
	this.x = 0;
	this.y = 0;
	this.angle = pAngle;
	this.distance = pDistance;
	this.radius = pRadius;
	this.dead = false;
	this.hit = false;
	var fallingSpeed = ((Math.random() * 100) + 600);
	
	this.retracted = false;

	this.update = function(pX,pY)
	{	
		if(!this.hit)
		{
        this.x = pX;
        this.y = pY;
		
		this.angle += .6 * dt;
		
		var val1 = Math.cos(this.angle) * this.distance;
		var val2 = Math.sin(this.angle) * this.distance;
		this.x += val1;
		this.y += val2;
		
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
			
			if(checkCollisions(circle,rect))
			{
				this.hit = true;
			}
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
		else
		{
			this.y += fallingSpeed * dt;
			if(this.y > CANVAS_HEIGHT + 30)
			{
				this.dead = true;	
			}
		}
	}
	
	this.draw = function()
	{	
		if(!this.dead)
		{
		ctx.save();
        ctx.fillStyle = "green";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0 , 2*Math.PI, false);
		ctx.fill();
        //ctx.fillRect(this.x - 5,this.y - 5,10,10);
		ctx.restore();
		}
	}
}