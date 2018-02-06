"use strict"

var pickUpMult = 0;
var pickUpTimer = 0;
var multTime = 0;

function PickupSpawner()
{
	this.pickupArray = new Array();
	var multTimer = 0;
	
	this.update = function()
	{
		this.addPickup();
		multTimer += dt;
		
		if(multTimer > 3)
		{
			pickUpMult--;
			if(pickUpMult < 0)
			{
				pickUpMult = 0;	
			}
			multTimer = 0;
		}
		
		for(var i = 0; i < this.pickupArray.length; i++)
		{
			if(this.pickupArray[i].dead)
			{
				this.pickupArray.splice(i,1);
				i--;
			}
			else
			{
				this.pickupArray[i].update();
			}
		}
	}
	
	this.draw = function()
	{
		for(var i = 0; i < this.pickupArray.length; i++)
		{
			this.pickupArray[i].draw();	
		}	
	}
	
	this.addPickup = function()
	{
		if(Math.floor(Math.random() * 100) == 1 && (waveType != 2 || !levelMng.isWave))
		{
			var chooseOne = Math.random();
			if(chooseOne < .7)
			{
				this.pickupArray.push(new P_PlusOne());	
			}
			else if(chooseOne >= .7 && chooseOne < .9)
			{
				this.pickupArray.push(new P_MultTwo());	
			}
			else if(chooseOne >= .9)
			{
				this.pickupArray.push(new P_MultThree());	
			}
		}
	}
}

function Base_Pickup()
{
	this.x;
	this.y;
	this.radius;
	this.maxRad;
	this.maxLife;
	this.elaTime;
	this.color;
	
	this.update = function()
	{
		this.elaTime += dt;
		if(this.elaTime >= this.maxLife)
		{
			this.dead = true;	
		}
		
		this.radius = this.maxRad - (this.elaTime/this.maxLife * this.maxRad);
		
		var circle1 = {
			x: this.x,
			y: this.y,
			radius: this.radius	
		};
		var circle2 = {
			x: player.x,
			y: player.y,
			radius: player.radius
		};
		
		if(!revolve.retract || waveType == WAVETYPE_TUNNEL)
		{
			if(checkCollisionsCirc(circle1,circle2))
			{
				this.dead = true;
				this.doEffect();
				if(this instanceof P_PlusOne)
				{
					gainOrbSound();
				}
				else
				{
					gainMultiplierSound();
				}
			}
		}
	}
	
	this.draw = function()
	{
		if(!this.dead)
		{
			ctx.save();
			ctx.beginPath();
			ctx.arc(this.x,this.y,Math.abs(this.radius),0,2*Math.PI);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.fillStyle = "#2D4A28";
			this.drawSpecial();
			ctx.restore();
		}
	}
	
	this.drawSpecial = function(){}
	this.doEffect = function(){}
}

//---------------//
//PLUS ONE Pickup//
//_______________//

P_PlusOne.prototype = new Base_Pickup();
P_PlusOne.prototype.constructor = P_PlusOne;

function P_PlusOne(){
	this.x = Math.floor(Math.random() * CANVAS_WIDTH);
	this.y = Math.floor(Math.random() * CANVAS_HEIGHT);
	this.radius = 20;
	this.maxRad = this.radius;
	this.maxLife = 10;
	this.elaTime = 0;
	this.color = "#7FC97C";
	console.log(this.update());
}

P_PlusOne.prototype.doEffect = function(){
	orbAmt += 1 + pickUpMult;
}

P_PlusOne.prototype.drawSpecial = function(){
	ctx.fillStyle = "#2D4A28";
	ctx.font = 20 * this.radius/this.maxRad + "px Arial";
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.fillText("+" + (pickUpMult + 1),this.x,this.y);	
}


//---------------//
//MULT TWO Pickup//
//_______________//
P_MultTwo.prototype = new Base_Pickup();

P_MultTwo.prototype.constructor = P_MultTwo;

function P_MultTwo(){
	this.x = Math.floor(Math.random() * CANVAS_WIDTH);
	this.y = Math.floor(Math.random() * CANVAS_HEIGHT);
	this.radius = 15;
	this.maxRad = this.radius;
	this.maxLife = 7;
	this.elaTime = 0;
	this.color = "#B2ABE8";
}

P_MultTwo.prototype.doEffect = function(){
	pickUpMult += 2;	
}

P_MultTwo.prototype.drawSpecial = function(){
	ctx.fillStyle = "#2D4A28";
	ctx.font = 16 * this.radius/this.maxRad + "px Arial";
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.fillText("x2",this.x,this.y);
}

//---------------//
//MULT THREE Pickup//
//_______________//
P_MultThree.prototype = new Base_Pickup();

P_MultThree.prototype.constructor = P_MultTwo;

function P_MultThree(){
	this.x = Math.floor(Math.random() * CANVAS_WIDTH);
	this.y = Math.floor(Math.random() * CANVAS_HEIGHT);
	this.radius = 10;
	this.maxRad = this.radius;
	this.maxLife = 5;
	this.elaTime = 0;
	this.color = "#FF6C9A";
}

P_MultThree.prototype.doEffect = function(){
	pickUpMult += 3;	
}

P_MultThree.prototype.drawSpecial = function(){
	ctx.fillStyle = "#2D4A28";
	ctx.font = 16 * this.radius/this.maxRad + "px Arial";
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.fillText("x3",this.x,this.y);
}