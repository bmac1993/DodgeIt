"use strict"

function checkCollisions(circle,rect)
{
	var closestX = clamp(circle.x,rect.x,rect.x + rect.width);
	var closestY = clamp(circle.y,rect.y,rect.y + rect.height);
	
	var distanceX = circle.x - closestX;
	var distanceY = circle.y - closestY;
	
	var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
	return (distanceSquared < (circle.radius * circle.radius));
}

function checkCollisionsCirc(circle1,circle2)
{
	var d = Math.sqrt((Math.pow(circle2.x - circle1.x,2) + Math.pow(circle2.y - circle1.y,2)));
	return (d < (circle1.radius + circle2.radius));
}