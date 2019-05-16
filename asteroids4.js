		var sketchProc=function(processingInstance){ with (processingInstance){


var sizeX = 1000;
var sizeY = 550;
size(sizeX, sizeY); 
frameRate(60);

keys = [false,false,false,false,false];
var astNum = 1;
var Trail = function(xin,yin){
	this.size = 8;
	this.color = 250;
	this.x = xin;
	this.y = yin;
}

Trail.prototype.drawandshrink = function(){
	noStroke();
	fill(this.color,this.color,255);
	ellipse(this.x,this.y,this.size,this.size);
	ellipse(this.x,this.y,this.size,this.size);
	if (this.size > 0){
		this.size -= 1;
		this.color -= 60;
	}
	stroke(1);
}

var PlayerShip = function(xPos, yPos){
	this.x = xPos;
	this.y = yPos;
	this.xVelNew = 0;
	this.yVelNew = 0;
	this.xVelOld = 0;
	this.yVelOld = 0;
	this.xAcc = 0;
	this.yAcc = 0;
	this.acc = 0;
	this.angle = 0;
	this.deltaAngle = 0;
	this.trailsVector = [];
	this.health = 100;
	this.explodeRadius = 100;
	this.explodeColor = 255;
	this.exploded = false;
	this.trailsVec = [];
}

PlayerShip.prototype.draw = function() {
	pushMatrix();
	translate(this.x, this.y);
	rotate(this.angle);
	fill(255,255,255)
	stroke(1);
	pushMatrix();
	rotate(0.5)
	ellipse(0,5,5,20);
	rotate(-1)
	ellipse(0,5,5,20);
	popMatrix();
	ellipse(0,4,5,20);
	ellipse(10,10,5,20);
	ellipse(-10,10,5,20);
	ellipse(0,-12,23,23);
	fill(200,200,200);
	noStroke();
	ellipse(0,-12,18,18);
	fill(255,255,255);
	ellipse(0,-12,16,16);
	fill(100,100,200);
	ellipse(10,2,3,3);
	ellipse(-10,2,3,3);
	ellipse(10,18,3,3);
	ellipse(-10,18,3,3);
	popMatrix();
}

PlayerShip.prototype.move = function(){

	if (keys[0]==true && keys[2]==false) {
		this.acc = 0.15;
	}
	else if (keys[2]==true && keys[0]==false) {
		this.acc = -0.15;
	}
	else{
		this.acc = 0;
	}

	if (keys[1]==true && keys[3]==false){
		this.deltaAngle = -0.06;
	}
	else if (keys[3]==true && keys[1]==false){
		this.deltaAngle = 0.06;
	}
	else{
		this.deltaAngle = 0;
	}

	this.angle += this.deltaAngle
	this.xAcc = this.acc * sin(this.angle);
	this.yAcc = this.acc * -cos(this.angle);
	this.xVelNew = this.xVelOld + this.xAcc;
	this.yVelNew = this.yVelOld + this.yAcc;
	this.x += this.xVelNew;
	this.y += this.yVelNew;
	this.xVelOld = 1 * this.xVelNew;
	this.yVelOld = 1 * this.yVelNew;
	this.xVelOld = 0.95 * this.xVelNew;
	this.yVelOld = 0.95 * this.yVelNew;
}

PlayerShip.prototype.trails = function(){
	if (this.acc != 0){
		var pos1x = this.x + 20 * cos(this.angle+1);
		var pos1y = this.y + 20 * sin(this.angle+1);
		var pos2x = this.x + 20 * cos(this.angle+2.1);
		var pos2y = this.y + 20 * sin(this.angle+2.1);
		this.trailsVector.push(new Trail(pos1x,pos1y))
		this.trailsVector.push(new Trail(pos2x, pos2y))	
	}
	if (this.deltaAngle < 0){
		var pos1x = this.x + 20 * cos(this.angle+1);
		var pos1y = this.y + 20 * sin(this.angle+1);
		this.trailsVector.push(new Trail(pos1x,pos1y))
	}
	if (this.deltaAngle > 0){
		var pos1x = this.x + 20 * cos(this.angle+2.1);
		var pos1y = this.y + 20 * sin(this.angle+2.1);
		this.trailsVector.push(new Trail(pos1x,pos1y))
	}
	if (this.trailsVector.length > 20){
			this.trailsVector.reverse();
			while(this.trailsVector.length > 20){
				this.trailsVector.pop();
				}
			this.trailsVector.reverse();

	}
	for(var i = 0; i<this.trailsVector.length; i++){
		this.trailsVector[i].drawandshrink();

	}
}
PlayerShip.prototype.explode = function(){

	//run this only once to setup
	if(!this.exploded){
		//number of trails
		var trailsNum = floor(random(5,10));

		for(var i = 0; i < trailsNum; i++){
			//setup individual trail parameter
			//give radius and dissolve parameter
			var theta = random(0,2*3.14);
			var dissolveParam = random(0,0.4);
			this.trailsVec.push(new explosionTrail(theta, dissolveParam));
		}

	}

	this.exploded = true;

	pushMatrix();
	translate(this.x, this.y);
	var f = this.explodeColor;
	var r = this.explodeRadius;
	fill(255,f-50,f-50);

	if (this.explodeRadius > 0){
		for (var i = 0; i < this.trailsVec.length; i++){
			//println(this.trailsVec[i]);
			//println(this.trailsVec[i].theta);
			//println(this.trailsVec[i].dissolveParam)x
			var r2 = (-5 * r + 500) * this.trailsVec[i].dissolveParam;
			var x = r2 * cos(this.trailsVec[i].theta);
			var y = r2 * sin(this.trailsVec[i].theta);
			//println('x : ' + x);
			ellipse(x,y,this.explodeRadius * 0.5,this.explodeRadius * 0.5);

		}
	}

	ellipse(0,0,r,r);
	this.explodeRadius -= 10;
	this.explodeColor -= 50;
	popMatrix();
}

var missiles = [];
var Missile = function(xpos, ypos, xvelinit, yvelinit, canTurn){
	this.x = xpos;
	this.y = ypos;
	this.xVel = xvelinit;
	this.yVel = yvelinit;
	this.trailsVector = [];
	this.explodeRadius = 30;
	this.exploded = false;
	this.explodeSet = false;
	this.trailsVecExp = [];
	this.explodeColor = 255;
	this.explodeRadius = 30;
	this.canTurn = canTurn;
}

Missile.prototype.move = function(){

	if(this.canTurn){
		//turn rate of the missile
		var dt = 0.1;
		//calculate angles 1 and 2

		//angle of missile
		var theta1 = atan2(-this.yVel , this.xVel);
		//angle to mouse location
		var theta2 = atan2(-(mouseY - this.y) , (mouseX - this.x));

		var theta3 = theta2 - theta1;
		var turnLeft = false;
		var turnRight = false;

		if (abs(theta3) > 3.14){
			turnLeft = true;
		}
		else if (theta3 > 0){
			turnLeft = true;
		}
		else {
			turnRight = true;
		}

		if (turnRight){
			theta1 -= dt;
		}

		if (turnLeft){
			theta1 += dt;
		}

		this.xVel = missileSpeed * cos(theta1);
		this.yVel = missileSpeed * -sin(theta1);
	}

	this.x = this.x + this.xVel;
	this.y = this.y + this.yVel;

}
Missile.prototype.draw = function(){
	pushMatrix();
	translate(this.x, this.y)
	rotate(atan2(this.yVel, this.xVel) - 3.14/2)

	//creates some lag
	var flameSize = random(10,30);
	var brightness = random(100,255);
	fill(brightness,brightness,255);
	ellipse(0,-15,5,flameSize);
	ellipse(0,-15,0.5*flameSize,0.5*flameSize);
	//lag

	line(20,20,-20,-20);

	if (this.canTurn){
		fill(255,0,0);
	}
	if (!this.canTurn){
		fill(0,255,0);
	}



	ellipse(0,0,5,17);
	fill(255,255,255);
	ellipse(3,-6,3,10);
	ellipse(-3,-6,3,10);
	ellipse(0,-6,3,10);


	popMatrix();
}
Missile.prototype.trails = function(){

	var pos1x = this.x
	var pos1y = this.y
	this.trailsVector.push(new Trail(pos1x,pos1y))
	if (this.trailsVector.length > 100){
		this.trailsVector.reverse();
		this.trailsVector.pop();
		this.trailsVector.reverse();
	}
	for(var i = 0; i<this.trailsVector.length; i++){
		this.trailsVector[i].drawandshrink();
	}
}
Missile.prototype.explode = function(){

	if (!this.explodeSet){

		var trailsNum = floor(random(5,10));

			for(var i = 0; i < trailsNum; i++){
			//setup individual trail parameter
			//give radius and dissolve parameter
				var theta = random(0,2*3.14);
				var dissolveParam = random(0,0.06);
				this.trailsVecExp.push(new explosionTrail(theta, dissolveParam));
			}

	}

	this.explodeSet = true;
	pushMatrix();
	translate(this.x,this.y);

	var f = this.explodeColor;
	var r = this.explodeRadius;
	fill(255,f-50,f-50);

	if (this.explodeRadius > 0){
		for (var i = 0; i < this.trailsVecExp.length; i++){
			var r2 = (-5 * r + 500) * this.trailsVecExp[i].dissolveParam;
			var x = r2 * cos(this.trailsVecExp[i].theta);
			var y = r2 * sin(this.trailsVecExp[i].theta);
			//println('x : ' + x);
			ellipse(x,y,this.explodeRadius * 0.5,this.explodeRadius * 0.5);

		}
	}

	ellipse(0,0,this.explodeRadius,this.explodeRadius);
	if (this.explodeRadius > 2){
		this.explodeRadius -= 5;
		this.explodeColor -=40;
	}
	popMatrix();
}
var Asteroid = function(x, y, xVel, yVel, size){
	this.x = x;
	this.y = y;
	this.xVel = xVel;
	this.yVel = yVel;
	this.size = size;
	this.sizeOrig = this.size;

	this.health = 0.001 * this.size**3;
	this.maxHealth = this.health;
	this.explodeRadius = 1.5 * this.size;
	this.exploded = false;
	this.movePos = false;
	this.angle = random(0,2*3.14);
	this.dtheta = random(0,0.5)/this.size;
	this.astNum = astNum;
	this.ellipsesR = floor(random(1,5));
	this.ellipsesTheta = (2*3.14)/this.ellipsesR;
	this.changeVelocity = false;
	this.xVelNew = 0;
	this.yVelNew = 0;
	this.outSideTimer = outsideTimeToDelete;
	this.velocityShiftX = 0;
	this.velocityShiftY = 0;

	this.explodeSet = false;
	this.trailsVecExp = [];
	this.explodeColor = 255;
	this.explodeColor2 = 255;

	astNum++;
}
Asteroid.prototype.draw = function(){

	pushMatrix();
	translate(this.x,this.y);
	rotate(this.angle);
	this.angle += this.dtheta;
	var f = (55/100)*100*(this.health/this.maxHealth) + 200;
	var r = (40/100)*100*(this.health/this.maxHealth) + 230;
	fill(r,f,f);
	ellipse(0,0,this.size,this.size);

	pushMatrix();

	stroke(0);
	fill(200,200,200);

	for(var n = 0; n < this.ellipsesR; n++){
	rotate(this.ellipsesTheta);
	fill(200,200,200);
	ellipse(0, 0.47*this.size, 0.3*this.size, 0.1*this.size);
	}
	noStroke();
	
	popMatrix();

	var sizeParam = this.size/100;

	if (this.health/this.maxHealth < .60){
		stroke(1);
		line(10*sizeParam,10*sizeParam,-10*sizeParam,-10*sizeParam);
		line(20*sizeParam,20*sizeParam,-20*sizeParam,30*sizeParam);
		line(40*sizeParam,-10*sizeParam,2*sizeParam,13*sizeParam);
		line(-10*sizeParam,-30*sizeParam,10*sizeParam,40*sizeParam);
		noStroke();
	}

	if (this.health/this.maxHealth < .30){
		stroke(1);
		line(15*sizeParam,12*sizeParam,-5*sizeParam,-13*sizeParam);
		line(17*sizeParam,24*sizeParam,-12*sizeParam,23*sizeParam);
		line(20*sizeParam,-16*sizeParam,1*sizeParam,18*sizeParam);
		line(-20*sizeParam,-15*sizeParam,14*sizeParam,20*sizeParam);
		noStroke();
	}

	popMatrix();

	//write text upwright
	pushMatrix();
	translate(this.x,this.y);
	fill(255,0,0);
	// text('asteroid ' + this.astNum, -30, 0);
	// text('Health % : ' + floor(100 * this.health/this.maxHealth) + '%', -30, 10);
	// text('Health : ' + floor(this.health), -30, 20);
	popMatrix();
}
Asteroid.prototype.move = function(){
	this.x += this.xVel;
	this.y += this.yVel;
}
Asteroid.prototype.explode = function(){

	if (!this.explodeSet){

	var trailsNum = floor(random(5,10));

		for(var i = 0; i < trailsNum; i++){
			//setup individual trail parameter
			//give radius and dissolve parameter
			var theta = random(0,2*3.14);
			var dissolveParam = random(0,0.0005*this.sizeOrig);
			this.trailsVecExp.push(new explosionTrail(theta, dissolveParam));
		}

	}
	this.explodeSet = true;

	pushMatrix();
	translate(this.xExplode, this.yExplode);
	var f = this.explodeColor;
	var r = this.explodeRadius;
	fill(255,f-50,f-50, this.explodeColor2);

	if (this.explodeRadius > 0){
		for (var i = 0; i < this.trailsVecExp.length; i++){
			var r2 = (-5 * r + 5 * 1.5 * 500) * this.trailsVecExp[i].dissolveParam;
			var x = r2 * cos(this.trailsVecExp[i].theta);
			var y = r2 * sin(this.trailsVecExp[i].theta);
			ellipse(x,y,this.explodeRadius * 0.5,this.explodeRadius * 0.5);
		}
	}

	ellipse(0,0,this.explodeRadius, this.explodeRadius);
	this.explodeRadius -= 20;
	this.explodeColor -= 5;
	this.explodeColor2 -= 10;
	popMatrix();
}
var CollisionTimer = function(thisAsteroid,otherAsteroid){
	this.thisAsteroid = thisAsteroid;
	this.otherAsteroid = otherAsteroid;
	this.collisionTime = astCollisionTime; //the number of frames until these can collide again
}
CollisionTimer.prototype.countDown = function(){
	this.collisionTime -= 1;
}
var collisionTimerVec = [];

var PlayerCollisionTimer = function(asteroid){
	this.asteroid = asteroid;
	this.collisionTime = astPlayerCollisionTime; //the number of frames until these can collide again
}
PlayerCollisionTimer.prototype.countDown = function(){
	this.collisionTime -= 1;
}
createAsteroidOutsideBarrier = function(velocityMin, velocityMax, astSizeMin, astSizeMax){
	var astSize = random(astSizeMin, astSizeMax);
	var theta = random(0, 2*3.14);
	var velocity = random(velocityMin, velocityMax);
	var xVel = velocity * cos(theta);
	var yVel = velocity * sin(theta);
	var createRand = true;
	var position = random(0, 2 * sizeX + 2 * sizeY);


	if (position <= sizeX){
		//zone1
		var xPos = position;
		var yPos = -astSize/2;
	}
	else if (position <= sizeX + sizeY){
		//zone 2
		var yPos = position - sizeX;
		var xPos = sizeX + astSize/2;

	}
	else if (position <= 2 * sizeX + sizeY){
		//zone 3
		var xPos = position - sizeY - sizeX;
		var yPos = sizeY + astSize/2;

	}
	else{
		//zone 4
		var yPos = position - sizeY - 2 * sizeX;
		var xPos = -astSize/2;

	}
	for (var i = 0; i < asteroids.length; i++){
		if(dist(xPos, yPos, asteroids[i].x, asteroids[i].y) < (asteroids[i].size/2 + astSize/2)){
			createRand = false;
		}
	}

	if (createRand){
		asteroids.push(new Asteroid(xPos, yPos, xVel, yVel, astSize));
	}
}
var explosionTrail = function(theta, dissolveParam){
	this.theta = theta;
	this.dissolveParam = dissolveParam;
}
var ScorePoint = function(x,y,score){
	this.x = x;
	this.y = y;
	this.score = score;
	this.colorP = 255;
}
ScorePoint.prototype.drawAnimate = function(){
	fill(255,0,0, this.colorP);
	pushMatrix();
	translate(this.x, this.y);
	textSize(0.5 * this.score + 10);
	text('+ ' + floor(this.score),0,0);
	popMatrix();
	this.colorP -= 1;
}
var scoreVec = [];

var scene1 = {
	color1 : 255,
	color2 : 0,
	color3 : 0,
	buttonPushed : false,
	frameCount1 : 0,
	k : false
};

var playerAsteroidCollisionTimerVec = [];
var randPointsX = [];
var randPointsY = [];
var randPointsS = [];
for (var i = 0; i < 100; i++){
	randPointsX.push(random(0,1000));
	randPointsY.push(random(0,550));
	randPointsS.push(random(1,5));
}

drawBackground = function() {

	background(0,0,0);
	fill(255,255,255);
	noStroke();
	for (var i = 0; i < randPointsX.length; i++){
		ellipse(randPointsX[i],randPointsY[i], randPointsS[i], randPointsS[i]);
	}
}

//this function displays items
displayItems = function() {
	fill(255,0,255);

	// text('number of Asteroids ' + asteroids.length, 10, 10);
	// text('number of Missiles ' + missiles.length, 10, 20);
	// text('player trails vector length ' + playerShip.trailsVector.length, 10, 30);
	// text('mouseX :  ' + mouseX, 10, 40);
	// text('mouseY :  ' + mouseY, 10, 50);
	// text('collisionVectorLength: ' + collisionTimerVec.length, 10, 60);
	// text('Asteroid Multiplier : ' + asteroidMultiplier, 10, 70);
	// text('Ast Size Max : ' + astSizeMax, 10, 80);
	// text('Ast Vel Max : ' + astVelMax, 10, 90);
	// text(' time between creating asteroids : ' + createTime, 10, 100);


	//draw the life bars for the ship

	if (playerShip.health > 0){
		fill(100,100,100, 140);
		rect(20,500,300,20, 5);
		fill(0,0,255, 140);
		rect(20,500,300 * (playerShip.health/100),20, 5);
		fill(255,0,0,200);
		textSize(20);
		text('SCORE : ' + floor(score), 30, 495);

	}
	if (playerShip.health < 0){
		fill(255,0,0,255);
		textSize(40);
		text('SCORE : ' + floor(score), sizeX/2 - 103, sizeY/2);
		fill(100,100,100,100);
		rect(sizeX/2-100, sizeY/2-50 + 100, 200,100, 50);
		fill(255,100,100,200);
		text('REPLAY', sizeX/2-100 + 19, sizeY/2+110);

	}
}

playerShip = new PlayerShip(500,275);

var missileTimer = 0;
mouseClicked = function() {	

	if (scene ==1){
		if (mouseX > sizeX/2-100 && mouseX < (sizeX/2-100 + 200) && mouseY > sizeY/2-50 && mouseY < sizeY/2-50 + 100){
			scene1.color2 = 255;
			scene1.color3 = 255;
			scene1.buttonPushed = true;
		}

	}

	if (scene == 2){

	keys[4]=true;

	if (missiles.length < maxMissiles && (frameCount - missileTimer) > minTimeBetweenMissileLaunch && playerShip.health>0 && mouseButton ==37){

		var angle1 = playerShip.angle;
		var xVIn =  missileSpeed * sin(angle1);
		var yVIn =  - missileSpeed * cos(angle1);
		missiles.push(new Missile(playerShip.x, playerShip.y, xVIn, yVIn, true));

		// var angle2 = playerShip.angle - 1;
		// var xVIn =  missileSpeed * sin(angle2);
		// var yVIn =  - missileSpeed * cos(angle2);
		// missiles.push(new Missile(playerShip.x, playerShip.y, xVIn, yVIn, true));

		missileTimer = frameCount;
	}

	if (missiles.length < maxMissiles && (frameCount - missileTimer) > minTimeBetweenMissileLaunch && playerShip.health>0 && mouseButton ==39){
		var angle1 = playerShip.angle;
		var xVIn =  missileSpeed * sin(angle1);
		var yVIn =  - missileSpeed * cos(angle1);
		missiles.push(new Missile(playerShip.x, playerShip.y, xVIn, yVIn, false));
	}
	if (playerShip.health < 0 && mouseX > sizeX/2 - 100 && mouseX < sizeX/2 + 100 && mouseY > sizeY/2-50 + 100 && mouseY < sizeY/2-50 + 200){

		playerAsteroidCollisionTimerVec = [];
		missiles = [];
		asteroids = [];
		collisionTimerVec = [];
		scoreVec = [];
		playerShip = new PlayerShip(500,275);
		asteroidMultiplier = 0;
		astSizeMax = 40;
		astVelMax = 1;
		score = 0;
		frameCountScene2 = 0;
		scene = 1;

	}

	}


}
mouseUnclick = function() {
	if (keys[4] == true){
		keys[4] = false;
	}
}
keyPressed = function() {

  if(keyCode == 87){
    keys[0]=true;
	}
  if(keyCode == 65){
    keys[1]=true;
	}
  if(keyCode == 83){
    keys[2]=true;
	}
  if(keyCode == 68){
    keys[3]=true;
	}
}
keyReleased = function() {

  if(keyCode == 87){
    keys[0]=false;
	}
  if(keyCode == 65){
    keys[1]=false;
	}
  if(keyCode == 83){
    keys[2]=false;
	}
  if(keyCode == 68){
    keys[3]=false;
	}
}
//asteroid removal parameter
var outsideTimeToDelete = 60;

//intialiize the global parameter
var createTime = 0;


//asteroid collision parameters
var randMoveParam = 0.4;
var damageConst = 0.00009;

var minAstSize = 30;
var astCollisionTime = 1; // frames
var astPlayerCollisionTime = 1; // time until player can collide with same asteroid again
//player damage

//determines the amount of damage the asteroid does to the ship
var shipDamageConst = 0.002;
var missileSpeed = 5;
var maxMissiles = 40;
var missileDamage = 150;
var missileMomentumParam = 50000;
var playerShipSize = 30;
var massShip = 5000;
var bounceParamShip = 1;
var minTimeBetweenMissileLaunch = 1;

asteroids = [];
//asteroids.push(new Asteroid(200,200,0,0,40));
//asteroids.push(new Asteroid(300,200,0,0,40));

//global parameters that change 
var asteroidMultiplier = 0;
var astSizeMax = 40;
var astVelMax = 1;
var scene = 1;
var score = 0;
var frameCountScene2 = 0;

runGame = function(){
	drawBackground();	

	//remove the missile from the missiles vector once the missile has finished exploding
	for (var i = 0; i < missiles.length; i++){

		if(missiles[i].explodeRadius<3 | missiles[i].x > sizeX + 100 | missiles[i].x < -100 | missiles[i].y < -100 | missiles[i].y > sizeY + 100){
			missiles.splice(i, 1);
		}
	}

	//remove the asteroid from asteroid vecotor once it has finished exploding
	for (var j = 0; j < asteroids.length; j++){
		//remove asteroid if exploded
		if (asteroids[j].explodeRadius<1){
			asteroids.splice(j, 1);
		}
	}

	//move the asteroids and create new asteroids when destroyed
	for (var j = 0; j < asteroids.length; j++){

		//draw explosion animation and make size 0
		if(asteroids[j].health < 0){

			if (!asteroids[j].exploded && asteroids[j].size > minAstSize){
	
				var numNewAst = floor(random(2,4));
				//for the case create 2 asteroids
				if (numNewAst == 2){
					var radiusFromCenter = asteroids[j].size/3.8;
					theta = random(0, 2*3.14);
					xPlace = radiusFromCenter * cos(theta);
					yPlace = radiusFromCenter * sin(theta);
					var xPos = asteroids[j].xExplode + xPlace;
					var yPos = asteroids[j].yExplode + yPlace;
					var xVel = asteroids[j].xVel + random(-randMoveParam,randMoveParam);
					var yVel = asteroids[j].yVel + random(-randMoveParam,randMoveParam);
					var sizeNew = (1)*asteroids[j].size/numNewAst;
					asteroids.push(new Asteroid(xPos, yPos ,xVel, yVel, sizeNew));
					var xPos = asteroids[j].xExplode - xPlace;
					var yPos = asteroids[j].yExplode - yPlace;
					var xVel = asteroids[j].xVel + random(-randMoveParam,randMoveParam);
					var yVel = asteroids[j].yVel + random(-randMoveParam,randMoveParam);
					var sizeNew = (1)*asteroids[j].size/numNewAst;
					asteroids.push(new Asteroid(xPos, yPos ,xVel, yVel, sizeNew));
					// 2 asteroids
				}
				//for the case create 3 asteroids
				if (numNewAst == 3){
					var radiusFromCenter = asteroids[j].size/4.5;
					theta = random(0, 2*3.14);

					xPlace = radiusFromCenter * cos(theta);
					yPlace = radiusFromCenter * sin(theta);
					var xPos = asteroids[j].xExplode + xPlace;
					var yPos = asteroids[j].yExplode + yPlace;
					var xVel = asteroids[j].xVel + random(-randMoveParam,randMoveParam);
					var yVel = asteroids[j].yVel + random(-randMoveParam,randMoveParam);
					var sizeNew = (1)*asteroids[j].size/numNewAst;
					asteroids.push(new Asteroid(xPos, yPos ,xVel, yVel, sizeNew));
					xPlace = radiusFromCenter * cos(theta + (2*3.14)/3);
					yPlace = radiusFromCenter * sin(theta + (2*3.14)/3);
					var xPos = asteroids[j].xExplode + xPlace;
					var yPos = asteroids[j].yExplode + yPlace;
					var xVel = asteroids[j].xVel + random(-randMoveParam,randMoveParam);
					var yVel = asteroids[j].yVel + random(-randMoveParam,randMoveParam);
					var sizeNew = (1)*asteroids[j].size/numNewAst;
					asteroids.push(new Asteroid(xPos, yPos ,xVel, yVel, sizeNew));
					xPlace = radiusFromCenter * cos(theta + (4*3.14)/3);
					yPlace = radiusFromCenter * sin(theta + (4*3.14)/3);
					var xPos = asteroids[j].xExplode + xPlace;
					var yPos = asteroids[j].yExplode + yPlace;
					var xVel = asteroids[j].xVel + random(-randMoveParam,randMoveParam);
					var yVel = asteroids[j].yVel + random(-randMoveParam,randMoveParam);
					var sizeNew = (1)*asteroids[j].size/numNewAst;
					asteroids.push(new Asteroid(xPos, yPos ,xVel, yVel, sizeNew));
				}

			}
			asteroids[j].size = 0;
			asteroids[j].exploded = true;
		}
		else{
		asteroids[j].move();
		}
		
		asteroids[j].draw();
	}

	//reset asteroid velocities to 0
	for (var j = 0; j < asteroids.length; j++){
		asteroids[j].xVelNew = 0;
		asteroids[j].yVelNew = 0;
	}

	//collide the asteroids
	for (var j = 0; j < asteroids.length; j++){
		for(var k = 0; k < asteroids.length; k++){
			if (k!==j){
				var radiiAdded = asteroids[k].size/2 + asteroids[j].size/2;
				var distance = dist(asteroids[k].x, asteroids[k].y, asteroids[j].x, asteroids[j].y);
				if(radiiAdded > distance){

					var canCollide = true;
					for(var m = 0; m < collisionTimerVec.length;m++){
					//determine if this vector object exists
						if(collisionTimerVec[m].thisAsteroid == asteroids[j].astNum && collisionTimerVec[m].otherAsteroid == asteroids[k].astNum){
							canCollide = false;
						}
					}
					//if it does not exist
					if(canCollide){

						//calculate collision vector
						var collX = asteroids[k].x - asteroids[j].x;
						var collY = asteroids[k].y - asteroids[j].y;
						var length = (collX**2 + collY**2)**0.5;
						var collXN = collX/length;
						var collYN = collY/length;

						var massJ = asteroids[j].size**3;
						var massK = asteroids[k].size**3;



						//define the initial momentum vector of j asteroid
						var jPInitX = asteroids[j].xVel * massJ;
						var jPInitY = asteroids[j].yVel * massJ;


						//velocity of j asteroid along collision
						var jVelColl = asteroids[j].xVel * collXN + asteroids[j].yVel * collYN;

						//momentum of k asteroid along collision
						var jPColl = jVelColl * massJ;



						//velocity of k along collision
						var kVelColl = asteroids[k].xVel * collXN + asteroids[k].yVel * collYN;

						//momentum of k along collision
						var kPColl = kVelColl * massK;

						var velCollisionNew = ((massJ - massK)/(massJ + massK))*jVelColl + ((2*massK)/(massJ + massK))*kVelColl;
						var pCollisionNew = massJ * velCollisionNew;

						//have to calculate momentum impulse
						var impulse = pCollisionNew - jPColl;
						


						//add the impulse in the collision direction
						//add the impulse to the initial momentum
						var jPFinalX = jPInitX + impulse * collXN;
						var jPFinalY = jPInitY + impulse * collYN;

						
					
						asteroids[j].xVelNew += jPFinalX / massJ;
						asteroids[j].yVelNew += jPFinalY / massJ;
						//println(impulse);
						asteroids[j].health -= damageConst * abs(impulse);
						asteroids[j].changeVelocity = true;
						collisionTimerVec.push(new CollisionTimer(asteroids[j].astNum, asteroids[k].astNum));

					}
				}
			}
		}
	}

	//draw the explosion animation for asteroids
	for (var j = 0; j < asteroids.length; j++){
		if(asteroids[j].exploded){
			asteroids[j].explode();
		}	
	}

	//check for missile collisions
	for (var i = 0; i < missiles.length; i++){

		//check for collision with asteroid
		for (var j = 0; j < asteroids.length; j++){

			if(dist(missiles[i].x,missiles[i].y,asteroids[j].x,asteroids[j].y)<asteroids[j].size/2 && !missiles[i].exploded){
				missiles[i].exploded = true;
				asteroids[j].health -= missileDamage;
				if (asteroids[j].health < 0 && playerShip.health > 0){
					var scoreEarned = (asteroids[j].size / 20)**2;
					score += scoreEarned;
					//println(scoreEarned);
					scoreVec.push(new ScorePoint(asteroids[j].x, asteroids[j].y, scoreEarned));
					//insert floating score

				}


				asteroids[j].xVel += (missileMomentumParam / asteroids[j].size**3) * missiles[i].xVel;
				asteroids[j].yVel += (missileMomentumParam / asteroids[j].size**3) * missiles[i].yVel;
			}
		}

		//move the missiles if they are not exploded
		if(!missiles[i].exploded){
		missiles[i].move();
		missiles[i].draw();
		}

		//draw the explosion animation if the missile is exploded
		if (missiles[i].exploded){
			missiles[i].explode();
		}
	}

	//move the x and y points of the asteroid, so the newly created asteroids dont collide with it after it explodes
	for(var j = 0; j < asteroids.length; j++){
		if(asteroids[j].health < 0 && !asteroids[j].movePos){
			asteroids[j].movePos = true;
			asteroids[j].xExplode = asteroids[j].x;
			asteroids[j].yExplode = asteroids[j].y;
			asteroids[j].x = undefined;
			asteroids[j].y = undefined;

		}
	} 

	//run the timer for the collision timers
	for (var i = 0; i < collisionTimerVec.length; i++){
		collisionTimerVec[i].countDown();
	}
	//remove timers that are below 0
	for (var i = 0; i < collisionTimerVec.length; i++){

		if(collisionTimerVec[i].collisionTime < 0){
			collisionTimerVec.splice(i, 1);
		}
	}

	//remove asteroids that leave the space using timer
	for (var j = 0; j < asteroids.length; j++){

		if ((asteroids[j].x + asteroids[j].size/2) < 0 | (asteroids[j].y + asteroids[j].size/2) < 0
			| (asteroids[j].x - asteroids[j].size/2) > 1000 | (asteroids[j].y - asteroids[j].size/2 ) > 550){

			asteroids[j].outSideTimer -= 1;
			//println(asteroids[j].outSideTimer);
		}
		else{
			asteroids[j].outSideTimer = outsideTimeToDelete;
		}

		if (asteroids[j].outSideTimer < 0){
			asteroids.splice(j, 1);
		}	
	}

	//collide asteroids with playership
	for (var j = 0; j < asteroids.length; j++){

		var distAstShip = dist(playerShip.x, playerShip.y, asteroids[j].x, asteroids[j].y);
		var minDist = (playerShipSize/2) + (asteroids[j].size/2);

		if(distAstShip < minDist){
			var canCollide = true;

			//check if the collision is already in the collision vector and not allowed
			for(var k = 0; k < playerAsteroidCollisionTimerVec.length; k ++){
				if(playerAsteroidCollisionTimerVec[k].asteroid == asteroids[j].astNum){
					canCollide = false;
				}
			}

			if (canCollide){
				//calculate collision vector
				var collX = playerShip.x - asteroids[j].x;
				var collY = playerShip.y - asteroids[j].y;
				var length = (collX**2 + collY**2)**0.5;
				var collXN = collX/length;
				var collYN = collY/length;

				var massJ = asteroids[j].size**3;
				//massShip  is defined

				//define the initial momentum vector of j asteroid
				var jPInitX = asteroids[j].xVel * massJ;
				var jPInitY = asteroids[j].yVel * massJ;
				// println('initial x velocity : ' + asteroids[j].xVel);
				// println('initial y velocity : ' + asteroids[j].yVel);


				//velocity of j asteroid along collision
				var jVelColl = asteroids[j].xVel * collXN + asteroids[j].yVel * collYN;

				//momentum of j asteroid along collision
				var jPColl = jVelColl * massJ;

				//velocity of ship along collision
				var sVelColl = playerShip.xVelOld * collXN + playerShip.yVelOld * collYN;

				//momentum of ship along x and y
				var sPInitX = playerShip.xVelOld * massShip;
				var sPInitY = playerShip.yVelOld * massShip;


				//momentum of Ship along collision
				var sPColl = sVelColl * massShip;
				var velCollisionNew = ((massJ - massShip)/(massJ + massShip))*jVelColl + ((2*massShip)/(massJ + massShip))*sVelColl;
				var pCollisionNew = massJ * velCollisionNew;

				//have to calculate momentum impulse
				var impulse = pCollisionNew - jPColl;
				// println('impulse : ' + impulse);
				//println(impulse);

				//this prevents the ship from getting stuck in the asteroid
				if (impulse > 0){
					impulse = 0;
				}
				
				//add the impulse in the collision direction
				//add the impulse to the initial momentum
				var jPFinalX = jPInitX + impulse * collXN;
				var jPFinalY = jPInitY + impulse * collYN;

				//calculate ship final momentum
				var sPFinalX = sPInitX - impulse * collXN;
				var sPFinalY = sPInitY - impulse * collYN;
				playerShip.xVelOld = sPFinalX / massShip;
				playerShip.yVelOld = sPFinalY / massShip;


				// println('jPFinalX : ' + jPFinalX);
				// println('jPFinalY : ' + jPFinalY);
				// println('new x velocity before : ' + asteroids[j].xVelNew);
				// println('new y velocity before : ' + asteroids[j].yVelNew);

				asteroids[j].xVelNew += jPFinalX / massJ;
				asteroids[j].yVelNew += jPFinalY / massJ;


				//println('new x velocity after : ' + asteroids[j].xVelNew);
				//println('new y velocity after : ' + asteroids[j].yVelNew);


				asteroids[j].health -= damageConst * abs(impulse);
				playerShip.health -= shipDamageConst * abs(impulse);
				asteroids[j].changeVelocity = true;
				playerAsteroidCollisionTimerVec.push(new PlayerCollisionTimer(asteroids[j].astNum));
				//calculate impulse force to asteroid and ship

				//println(' ');


			}
		}
	}
		//change velocities on asteroids
	for (var j = 0; j < asteroids.length; j++){
		if(asteroids[j].changeVelocity){
			asteroids[j].xVel = asteroids[j].xVelNew;
			asteroids[j].yVel = asteroids[j].yVelNew;
			// println('asteroid : ' + asteroids[j].astNum);
			// println('xVel : ' + asteroids[j].xVel);
			// println('yVel : ' + asteroids[j].yVel);
			asteroids[j].changeVelocity = false;

		}	
	}

		//run the timer for the collision timers for player collisions
	for (var i = 0; i < playerAsteroidCollisionTimerVec.length; i++){

		playerAsteroidCollisionTimerVec[i].countDown();
	}
	//remove timers that are below 0 for player collisions
	for (var i = 0; i < playerAsteroidCollisionTimerVec.length; i++){

		if(playerAsteroidCollisionTimerVec[i].collisionTime < 0){
			playerAsteroidCollisionTimerVec.splice(i, 1);
		}
	}

	//animate score counters
	for(var i = 0; i < scoreVec.length; i++){
		scoreVec[i].drawAnimate();

	}
	//animate score counters
	for(var i = 0; i < scoreVec.length; i++){

		if(scoreVec[i].colorP < 0){
			scoreVec.splice(i, 1);
		}
	}

	//change global difficulty parameters
	asteroidMultiplier = floor(frameCountScene2/10);

	if (playerShip.health > 0){
		score += 0.01;
	}
	

	if (frameCountScene2 % 100 === 0){

		if (astSizeMax < 300){
			astSizeMax = astSizeMax + 3;
		}

		astVelMax += 0.1;
	}

	if (asteroidMultiplier < 95){
		createTime = 100 - asteroidMultiplier;
	}

	if (frameCountScene2 % createTime === 0){

		createAsteroidOutsideBarrier(0.5,astVelMax,30,astSizeMax);
	}
	//
	//draw and move playership
	if (playerShip.health > 0){
		playerShip.move();
		playerShip.draw();
		playerShip.trails();
	}
	else{
		playerShip.explode();
	}

	displayItems();
	mouseUnclick();
	frameCountScene2 += 1;
}

draw = function() {

if (scene == 1){
	drawBackground();

	fill(100,100,100,100);
	rect(sizeX/2-350,sizeY/2+60, 700, 150);

	textSize(45);
	fill(255,0,0);
	text('WASD : move ship', sizeX/2 - 280, sizeY/2 + 100);
	text('Left Click : fire guided missile', sizeX/2 - 280, sizeY/2 + 140);
	text('Right Click : fire normal missile', sizeX/2 - 280, sizeY/2 + 180);


	if(!scene1.buttonPushed){
		fill(100,100,100,100);
	}
	if(scene1.buttonPushed){
		fill(255,100,100,100);

		if(!scene1.k){
		scene1.frameCount1 = frameCount;
		scene1.k = true;
		}

		if(frameCount - scene1.frameCount1 > 10){
			scene = 2;
		}
	}

	rect(sizeX/2-100,sizeY/2-50,200,100, 50);
	fill(255,0,0);
	textSize(100);
	text('Asteroids', 300,100);
	textSize(45);
	fill(scene1.color1 ,scene1.color2,scene1.color3, 255);
	text('START', 427,290);

}
if (scene == 2){
	runGame();
}

}

		}};
