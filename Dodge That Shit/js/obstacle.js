var WAVETYPE_BASIC = 1;
var WAVETYPE_TUNNEL = 2;
var waveType = 1;
var currentTime = 0;

function LevelManager()
{
	this.isWave = false;
	
	this.update = function()
	{
		if(this.isWave || obstacles.length == 0)
		{
			currentTime += dt;	
		}
		
		if(this.isWave && currentTime > waveTime)
		{
			currentTime = 0;
			this.isWave = !this.isWave;
		}
		else if(!this.isWave && currentTime > coolDownTime && obstacles.length == 0)
		{
			currentTime = 0;
			this.isWave = !this.isWave;
			revolve.retract = false;
			level++;
			
			waveType = Math.floor(Math.random() * 2) + 1;
			console.log(waveType);
		}
	}
}
function ObstacleSpawner(){
	this.counter = 0;
	this.addObstacles = function(){
		
		if(!levelMng.isWave){return;}
		if(waveType == 1)
		{
			if(Math.random() < level/100)
			{
				obstacles.push(new Obst_Basic());
			}
		}
		else if(waveType == 2)
		{
			this.counter += dt;
			if(this.counter >= (2.5 - (level/30)))
			{
				obstacles.push(new Obst_Tunnel());
				last = Object.create(obstacles[obstacles.length - 1]);
				last.y = last.height + last.gap;
				last.height = CANVAS_WIDTH - last.y;
				obstacles.push(last);
				this.counter = 0;
			}
		}
	}
	
	this.update = function(){
		for(var i = 0; i < obstacles.length; i++)
		{
			if(obstacles[i].dead)
			{
				obstacles.splice(i,1);
				i--;
			}
			else
			{
				obstacles[i].update();
			}
		}
	}
	
	this.draw = function(){
		for(var i = 0; i < obstacles.length; i++)
		{
			obstacles[i].draw();
		}
	}
}

function Obstacle_Base(){
	this.movesLeft;
	this.width;
	this.height;
	this.x;
	this.y;
	this.color;
	this.speed;
	this.currentSpeed;
	this.slowSpeed;
	this.slowRate;
	this.dead;
	
	this.spawnDist = 150;
	
	this.update = function(){
		if(waveType != WAVETYPE_TUNNEL)
		{
		if(revolve.retract)
		{
			console.log("retracting");
			this.currentSpeed -= this.slowRate * dt;	
			if(this.currentSpeed < this.slowSpeed)
			{
				this.currentSpeed = this.slowSpeed;
			}
		}
		else
		{
			this.currentSpeed += this.slowRate * dt;	
			if(this.currentSpeed > this.speed)
			{
				this.currentSpeed = this.speed;
			}	
		}
		}
		if(this.movesLeft == true)
		{
			this.x -= this.currentSpeed * dt;
			if(this.x + this.width < 0)
			{
				this.dead = true;
				console.log("dead");
			}
		}
		if(this.movesRight == true)
		{
			this.x += this.currentSpeed * dt;
			if(this.x > CANVAS_WIDTH)
			{
				this.dead = true;
				console.log("dead");	
			}
		}
		
	}
	
	this.draw = function(){
		if(!this.movesLeft)
		{
			if(this.x + this.width - 10 < 0)
			{
				ctx.globalAlpha = 1 - Math.abs(((this.x + this.width) * -1)/150);
				ctx.fillStyle = this.color;
				ctx.fillRect(0, this.y, 10, this.height);
				ctx.globalAlpha = 1;
			}
		}
		else if(this.movesLeft);
		{
			if( this.x + 10 > CANVAS_WIDTH)
			{
				ctx.globalAlpha = 1 - Math.abs((this.x - CANVAS_WIDTH)/150);
				ctx.fillStyle = this.color;
				ctx.fillRect(CANVAS_WIDTH - 10, this.y, 10, this.height);
				ctx.globalAlpha = 1;
			}
		}
		ctx.globalAlpha = 1;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

Obst_Basic.prototype = new Obstacle_Base();
Obst_Basic.prototype.constructor = Obst_Basic;

function Obst_Basic(){
	this.left = Math.floor(Math.random() * 2);
	this.x = this.x;
	this.y = this.y;

	this.width = this.getWidth();
	this.height = this.getHeight();
	this.x = this.getXStart();
	this.y = this.getYStart();
	this.color = getRandomColor();
	this.speed = this.getSpeed();
	this.currentSpeed = this.speed;
	this.slowSpeed = this.speed * .8;
	this.slowRate = this.speed * .2;
	this.dead;
}

Obst_Basic.prototype.getXStart = function (){
	if(Math.round(Math.random()))
	{
		this.movesRight = true;
		return -this.width - 150;
	}
	else
	{
		this.movesLeft = true;
		return CANVAS_WIDTH + 150;
	}
}
Obst_Basic.prototype.getYStart = function(){
	return Math.ceil(Math.random()*CANVAS_HEIGHT);
}
Obst_Basic.prototype.getWidth = function(){
	return Math.ceil(Math.random()*20) + 30;
	console.log("did");
}
Obst_Basic.prototype.getHeight = function(){
	return Math.ceil(Math.random()*10) + 10;
}
Obst_Basic.prototype.getSpeed = function(){
	return Math.random()*20 + 50 + (level*2);	
}

Obst_Tunnel.prototype = new Obstacle_Base();
Obst_Tunnel.prototype.constructor = Obst_Tunnel;

function Obst_Tunnel(){
	this.movesLeft = true;
	this.x = this.getXStart();
	this.y = 0;
	this.height = this.getHeight();
	this.width = this.getWidth();
	
	this.gap = this.getGap();

	this.color = getRandomColor();
	this.speed = this.getSpeed();
	this.currentSpeed = this.speed;
	this.slowSpeed = this.speed * .3;
	this.slowRate = this.speed * 1.3;
	this.spawnDist = 0;
	this.dead;
}

Obst_Tunnel.prototype.getXStart = function (){
		this.movesLeft = true;
		return CANVAS_WIDTH + 10;
}
Obst_Tunnel.prototype.getYStart = function(){
	return Math.ceil(Math.random()*CANVAS_HEIGHT);
}
Obst_Tunnel.prototype.getWidth = function(){
	return Math.ceil(Math.random()*5) + 10;
	console.log("did");
}
Obst_Tunnel.prototype.getHeight = function(){
	return Math.ceil((Math.random() * (CANVAS_HEIGHT - 200)) + 100);
}
Obst_Tunnel.prototype.getSpeed = function(){
	return 60 + level;	
}
Obst_Tunnel.prototype.getGap = function(){
	return Math.random()*50 + 80;	
}