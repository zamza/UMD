
/* simpleGame.js
   a very basic game library for the canvas tag
   adapted from Python gameEngine
   Andy Harris - 2011
*/

/* Tylers TODO:
   - Add Force Model Physics :: DONE(11/30/11)
   - Create predefined blank tile where nothing is drawn :: DONE(11/30/11)
   - Precalculate animation frame locations :: DONE(12/3/11)
   - Show which side of a tile has been collided with. :: DONE(12/5/11)
   - Add boundary action that keeps you from moving past edge :: DONE(12/5/11)
   - Allow user to lock camera so that it will not display off tilemap :: DONE (12/8/11)
   - Allow user to switch scenes :: DONE State Management Implemented  (3/10/12)
   - Allow user to animate a tile
   - Allow animation setting to play only a certain number of times
   - Allow user to set a tile onClick callback
   - Add scrolling background
   - get platform side collision working (Case by Case analysis)
*/

//variable holding key being pressed
  var currentKey = null;
  var keysDown = new Array(256);

var Timer = function()
{
   this.date = new Date();
   this.lastTime = 0;
   this.currentTime = 0;
   
   this.start = function(){ 
	 this.currentTime = Date.now();
   }
   
   this.reset = function(){ 
	 this.currentTime = Date.now();
   }
   
   this.getTimeElapsed = function(){ 
     this.lastTime = this.currentTime;
	 this.currentTime = Date.now();
	 return (this.currentTime - this.lastTime);
   }
}

function Vector(x, y){
	this.x = x;
	this.y = y;
	
	this.set = function(x, y){ this.x = x; this.y = y; }
}

VectorMath = function(){
	//remember y axis is positive in the downward direction when using this class. You may need to correct for that.
	this.add = function(vec1, vec2){ return new Vector( vec1.x + vec2.x, vec1.y + vec2.y ); }
	this.subtract = function(vec1, vec2){ return new Vector( vec1.x - vec2.x, vec1.y - vec2.y ); }
	this.multiply = function(vec, scalar){ return new Vector( vec.x *= scalar, vec.y *= scalar ) ; }
	this.angleBetween = function(vec1, vec2){ //returns in radians
		return Math.acos( this.dot(vec1, vec2) / ( this.magnitude(vec1) * this.magnitude(vec2) ) )
	}
	this.dot = function(vec1, vec2){ return (vec1.x * vec2.x) + (vec1.y * vec2.y); }
	this.normalize = function(vec){
		var mag = this.magnitude(vec);
		return new Vector( vec.x / mag, vec.y / mag );
	}
	this.isEqual = function(vec1, vec2){
		if( vec1.x == vec2.x && vec1.y == vec2.y ){ return true; }
		else{ return false; }
	}
	this.magnitude = function(vec1){ return Math.sqrt( Math.pow(vec1.x, 2) + Math.pow(vec1.y, 2) ); }
	this.distanceFrom = function(vec1, vec2){ return Math.sqrt( Math.pow(vec1.x - vec2.x, 2) + Math.pow(vec1.y - vec2.y, 2) ); }
}

function State(nam, ucallb, icallb){
	this.name = nam;
	this.stateUpdateCallback = ucallb;
	this.stateInitCallback = icallb;
}

function StateMan(){
	this.stateStack = new Array();
	this.usingStates = false;
	this.firstState = false;
	this.currentState = false;
	this.emptyStack = true;
	this.needsInitFlag = false;
	
	this.addState = function(name, updateCallback, initCallback){
		var tState = new State(name, updateCallback, initCallback);
		if(!this.currentState){ 
			this.currentState = tState;
			this.usingStates = true;
		}
		else{ 
			this.stateStack.push(this.currentState);
			this.currentState = tState;
		}
		if(!this.firstState){ this.firstState = this.currentState; }
		this.needsInitFlag = true;
		return this.currentState;
	}
	
	this.lastState = function(){
		if(this.firstState === this.currentState){ this.usingStates = false; }
		this.currentState = this.stateStack.pop();
	}
	
	this.setState = function(state){
		if(this.currentState != false){ this.stateStack.push(this.currentState); }
		this.currentState = state;
	}
	
	this.update = function(){
		if(this.needsInitFlag){ this.currentState.stateInitCallback(); this.needsInitFlag = false; }
		this.currentState.stateUpdateCallback();
	}
}

function Rectangle(x, y, w, h){
	this.leftX = x;
	this.rightX = x + w;
	this.topY = y;
	this.bottomY = y + h;
	this.width = w;
	this.height = h;
	
	this.collideRectangle = function(rect2){
			if( !( (this.bottomY < rect2.topY) ||
					 (this.topY > rect2.bottomY) ||
					 (this.rightX < rect2.leftX) ||
					 (this.leftX > rect2.rightX) ) )
			{ return true; }
			else{ return false; }
	}
	this.collidePoint = function(tx, ty){
		if( tx >= this.leftX && tx <= this.rightX && ty >= this.topY && ty <= this.bottomY ){ return true; }
		else{ return false; }
	}
	this.collideCircle = function(){}
	this.contains = function(){}
	this.move = function(){}
}

function Button(scene, x, y, w, h, func){
	this.scene = scene;
	this.context = scene.camera.context;
	this.topLeftX = x;
	this.topLeftY = y;
	this.height = h;
	this.width = w;
	this.image = false;
	this.color = "#FF00FF";
	this.borderColor = false;
	this.isClickable = false;
	this.clickCallback = func;
	this.isClickArea = false;
	this.notCameraRelative = true;
	this.scene.inputMan.addClickable(this.topLeftX, this.topLeftY, this.width, this.height, this);
	
	this.setBorderColor = function(bc){ this.borderColor = bc; }
	this.setColor = function(col){ this.color = col; }
	this.setPosition = function(nx, ny){ this.topLeftX = nx; this.topLeftY = ny; }
	this.setImage = function(imgsrc){ 
		this.image = new Image(); 
		this.image.src = imgsrc; 
		this.width = this.image.width; 
		this.height = this.image.height;
	}
	this.setClickArea = function(){ this.isClickArea = true; }
	this.draw = function(){
		if(!this.isClickArea){
			if(this.image){
				this.context.drawImage(this.image, this.topLeftX, this.topLeftY);
			}
			else{
				this.context.save();
				this.context.fillStyle = this.color;
				this.context.strokeStyle = this.borderstyle ? this.borderStyle : this.color;
				this.context.lineWidth = 1;
				this.context.beginPath();
				var tx = this.topLeftX + this.width;
				var ty = this.topLeftY + this.height;
				this.context.moveTo(this.topLeftX, this.topLeftY); // give the (x,y) coordinates
				this.context.lineTo(tx, this.topLeftY);
				this.context.lineTo(tx, ty);
				this.context.lineTo(this.topLeftX, ty);
				this.context.lineTo(this.topLeftX, this.topLeftY);
				this.context.fill();
				this.context.stroke();
				this.context.closePath();
				this.context.restore();
			}
		}
	}
	
	this.setClickable = function(callback){
		if(this.isClickable == false){
			this.isClickable = true;
			this.clickCallback = callback;
			this.scene.inputMan.addClickable(this.topLeftX, this.topLeftY, this.width, this.height, this);
		}
	}
  
	this.removeClickable = function(){
		if(this.isClickable == true){
			this.isClickable = false;
			this.scene.inputMan.removeClickable(this);
		}
	}
}

function Static(scene, x, y, w, h, imgsrc){
	this.scene = scene;
	this.context = scene.camera.context;
	this.topLeftX = x;
	this.topLeftY = y;
	this.height = h;
	this.width = w;
	this.image = new Image();
	this.image.src = imgsrc;
	this.notCameraRelative = true;
	
	this.setPosition = function(nx, ny){ this.topLeftX = nx; this.topLeftY = ny; }
	this.setImage = function(imgsrc){ 
		this.image = new Image(); 
		this.image.src = imgsrc; 
		this.width = this.image.width; 
		this.height = this.image.height;
	}
	this.setCameraRelative = function(){ this.notCameraRelative = false; }
	
	this.draw = function(){
		if(this.notCameraRelative){ this.context.drawImage(this.image, this.topLeftX, this.topLeftY); }
		else{ this.context.drawImage(this.image, this.topLeftX - this.scene.camera.cameraOffsetX, this.topLeftY - this.scene.camera.cameraOffsetY); }
	}
}

function Text(scene, x, y, txt, col, font, maxWidth){
	this.scene = scene;
	this.context = scene.camera.context;
	this.topLeftX = x;
	this.topLeftY = y;
	this.text = txt;
	this.font = typeof font != "undefined" ? font : false;
	this.color = typeof col != "undefined" ? col : false;
	this.maxWidth = typeof maxWidth != "undefined" ? maxWidth : false;
	
	this.setText = new function(ntxt){ this.text = ntxt; }
	this.setFont = new function(nf){ this.font = nf; }
	this.setPosition = new function(nx, ny){ this.topLeftX = nx; this.topLeftY = ny; }
	this.setColor = new function(c){ this.color = c; }
	this.setMaxWidth = new function(nw){ this.maxWidth = nw; }
	
	this.draw = function(){
		this.context.fillStyle = this.color ? this.color : "#000000";
		this.context.font = this.font ? this.font : "italic 30px sans-serif";
		this.context.textBaseline = 'top';
		this.context.fillText  (this.text, this.topLeftX, this.topLeftY);
	}
}

function Meter(scene, max, meterX, meterY, col, w, h, dir, imgsrc, imgX, imgY){
	this.camera = scene.camera;
	this.context = scene.camera.context;
	this.maximum = max;
	this.width = w;
	this.height = h;
	this.direction = dir;
	this.current = this.maximum;
	this.color = col;
	this.borderColor = '#FFFFFF';
	this.meterTopLeftX = meterX;
	this.meterTopLeftY = meterY;
	this.hasImage = false;
	this.notCameraRelative = true;
	this.fill = false;
	this.overlay = false;
	
	if( typeof img != "undefined" ){
		this.image = new Image();
		this.image.src = imgsrc;
		this.imageTopLeftX = imgX;
		this.imageTopLeftY = imgY;
		this.hasImage = true;
	}
	
	this.fill = function(){ this.current = this.maximum; }
	this.setCurrent = function(cur){ this.current = cur; }
	this.subtract = function(amt){ this.current -= amt; }
	this.add = function(amt){ this.current += amt; }
	this.getCurrent = function(){ return this.current; }
	this.isMeterEmpty = function(){ 
		if( this.current <= 0 ){ return true; }
		else{ return false; }
	}
	this.setColor = function(col){ this.color = col; }
	this.setMax = function(max){ this.maximum = max; }
	this.setWidth = function(w){ this.width = w; }
	this.setHeight = function(h){ this.height = h; }
	this.setBorderColor = function(col){ this.borderColor = col; }
	this.setX = function(x){ this.meterTopLeftX = x; }
	this.setY = function(y){ this.meterTopLeftY = y; }
	
	this.setFancyMeter = function(fill, overlay){ 
		this.fill = new Image(); 
		this.fill.src = fill;
		this.overlay = new Image();
		this.overlay.src = overlay; 
	}//hacked in for 7DRL
	
	this.draw = function(){
		var percentFill = this.current / this.maximum;
		var x = this.meterTopLeftX;
		var y = this.meterTopLeftY;
		var maxX = this.meterTopLeftX + this.width;
		var maxY = this.meterTopLeftY + this.height;
		var w = this.width;
		var h = this.height;
		if( this.direction == DRAIN_LEFT ){ w = Math.round(this.width * percentFill); }
		else if( this.direction == DRAIN_RIGHT ){ w = Math.round(this.width * percentFill); x += this.width - w; }
		else if( this.direction == DRAIN_UP ){ h = Math.round(this.height * percentFill); }
		else if( this.direction == DRAIN_DOWN ){ h = Math.round(this.height * percentFill); y += this.height - h; }
		if( w <= 0 ){ w = 0; }
		if( h <= 0 ){ h = 0; }
		if( x >= maxX ){ x = maxX; }
		if( y >= maxY ){ y = maxY; }
		if( this.overlay == false){
			this.context.fillStyle = this.color;
			this.context.fillRect(x, y, w, h);
			this.context.strokeStyle = this.borderColor;
			this.context.strokeRect(x, y, w, h);
			if(this.hasImage){ this.context.drawImage(this.image, this.imageTopLeftX, this.imageTopLeftY); }
		}
		else{
			this.context.drawImage(this.fill, 0, 0, w, h, x, y, w, h);
			this.context.drawImage(this.overlay, this.meterTopLeftX, this.meterTopLeftY);
		}
	}
}

function InputMan(scene){
	this.scene = scene;
	this.clickRects = new Array();
	this.clickObjects = new Array();
	this.objectStates = new Array();
	
	this.clickCheck = function(){
		for(var i = 0; i < this.clickRects.length; i++){
			if( this.clickObjects[i].notCameraRelative && this.clickRects[i].collidePoint(Mouse["camX"], Mouse["camY"]) 
				&& this.objectStates[i] == this.scene.stateMan.currentState.name ){ this.clickObjects[i].clickCallback(this.clickObjects[i]); }
			else if( this.clickRects[i].collidePoint(Mouse["posX"], Mouse["posY"]) 
				&& this.objectStates[i] == this.scene.stateMan.currentState.name ){ this.clickObjects[i].clickCallback(this.clickObjects[i]); }
		}
	}
	
	this.addClickable = function(x, y, w, h, obj){
		this.clickRects.push( new Rectangle(x, y, w, h) );
		this.clickObjects.push(obj);
		this.objectStates.push( this.scene.stateMan.currentState.name );
	}
	
	this.removeClickable = function(obj){
		var index;
		for( i = 0; i < this.clickObjects.length; i++){
			if( this.clickObjects[i] == obj ){ index = i; }
		}
		this.clickObjects.splice(index, 1);
		this.objectStates.splice(index, 1);
	}
	
}

function Animation(spriteSheet, imgWidth, imgHeight, cellWidth, cellHeight){//for simplicity, all cells must be the same width and height combination
  this.sheet = spriteSheet;
  this.imgWidth = imgWidth;
  this.imgHeight = imgHeight;
  this.cellWidth = cellWidth;
  this.cellHeight = cellHeight;
  this.animationLength = 1000;
  this.changeLength = false;
  this.cycles = new Array();
  this.currentCycleName = "";
  this.currentCycle = null;
  this.cyclePlaySettings = new Array( PLAY_LOOP, PLAY_LOOP, PLAY_LOOP, PLAY_LOOP );
  this.changeAnimation = false;
  this.timer = new Timer();
  this.framesPerRow = 0;
  this.framesPerColumn = 0;
  this.totalCycleTime = 0;
  this.fps = 0;
  this.isPaused = false;
  
  this.setup = function(){
    this.timer.start();
	this.framesPerRow = Math.floor( this.imgWidth / this.cellWidth );
	this.framesPerColumn = Math.floor( this.imgHeight / this.cellHeight );
  }
  
  this.addCycle = function(cycleName, startingCell, frames){
    cellLocs = this.calculateFrameLocations( startingCell, frames );
    cycle = new Array(cycleName, startingCell, frames, cellLocs);
	this.cycles.push(cycle);
  }
  
  this.calculateFrameLocations = function( startCell, frames){
    frameLocs = new Array();
    for( i=0; i < frames; i++ ){
	  row = Math.floor( ( startCell + i ) / this.framesPerRow );
	  col = (startCell + i) - (row * this.framesPerRow);
	  frameY = row * this.cellHeight;
	  frameX = col * this.cellWidth;
	  frameLocs[i] = new Array( frameX, frameY );
	}
	return frameLocs;
  }
  
  this.drawFrame = function(ctx){//most of the math in this function could be done only once if we want to make it faster
    this.fps += 1;
    if( !this.isPaused ){ this.totalCycleTime += this.timer.getTimeElapsed(); }
    if(this.changeAnimation == true){// find the correct animation in
	  for( i = 0; i < this.cycles.length; i++ ){ 
	    if( this.cycles[i][0] == this.currentCycleName ){ 
		  this.currentCycle = this.cycles[i];
		}
	  }
	}
	if( this.changeAnimation || this.changeLength ){
	  this.frameDelta = this.animationLength / this.currentCycle[2]; // this will be how much time should pass at a minimum before switching to the next frame
	  this.changeAnimation = false;
	  this.changeLength = false;
	  this.fps = 0;
	}
	currentFrame = Math.floor( (this.totalCycleTime % this.animationLength) / this.frameDelta );
	frameX = this.currentCycle[3][currentFrame][0];
	frameY = this.currentCycle[3][currentFrame][1];
	ctx.drawImage(this.sheet, frameX, frameY, this.cellWidth, this.cellHeight, 0 - (this.cellWidth / 2), 0 - (this.cellHeight / 2), this.cellWidth, this.cellHeight);
  }
  
  this.setCycle = function(cycleName){
    this.currentCycleName = cycleName;
	this.changeAnimation = true;
	this.totalCycleTime = 0;
  }
  
  this.renameCycles = function(cycleNames){
    for(i = 0; i < cycleNames.length; i++){
	  number = parseInt( this.cycles[i][0].slice(5) );
	  if(this.currentCycleName == this.cycles[i][0]){ this.currentCycleName = cycleNames[number-1]; }
	  this.cycles[i][0] = cycleNames[number-1];
	}
  }
  
  this.play = function(){
    this.isPaused = false;
	this.timer.reset();
  }
  
  this.pause = function(){
    this.isPaused = true;
  }
  
  this.reset = function(){
    this.totalCycleTime = 0;
	this.timer.reset();
  }
  
  this.setAnimationSpeed = function( animLength ){//animLength is in milliseconds
    if( animLength <= 50 ){ animLength = 50; }
	this.animationLength = animLength;
	this.changeLength = true;
  }
  
  this.genCycles = function(slicingFlag, framesArray){
    //Default: assume each row is a cycle and give them names Cycle1, Cycle2, ... , CycleN
	//SINGLE_ROW: all the sprites are in one row on the sheet, the second parameter is either a number saying each cycle is that many frames or a list of how many frames each cycle is
	//SINGLE_COLUMN: all the sprites are in one column on the sheet, the second parameter is either a number saying each cycle is that many frames or a list of how many frames each cycle is
	//VARIABLE_LENGTH: How many frames are in each cycle. framesArray must be defined.
	numCycles = 0;
	nextStartingFrame = 0;
	  if(typeof framesArray == "number" || typeof slicingFlag == "undefined"){
	    if( slicingFlag == SINGLE_COLUMN ){ numCycles = (this.imgHeight/this.cellHeight)/framesArray; }
		else if( typeof slicingFlag == "undefined" ){ numCycles = (this.imgHeight/this.cellHeight); framesArray = this.imgWidth/this.cellWidth; }
	    else{ numCycles = (this.imgWidth/this.cellWidth)/framesArray; }
		for(t = 0; t < numCycles; t++){
		  cycleName = "cycle" + (t+1);
		  this.addCycle(cycleName, t*framesArray, framesArray);
		}
	  }
	  else{
	    numCycles = framesArray.length;
		for(i = 0; i < numCycles; i++){ 
		  cycleName = "cycle" + (i+1);
		  this.addCycle(cycleName, nextStartingFrame, framesArray[i]);
		  nextStartingFrame += framesArray[i];
		}
	  }
	this.setCycle("cycle1");
  }
  
}// end of Animation class

function Camera(scene){
  this.canvas = scene.canvas;
  this.context = this.canvas.getContext("2d");
  this.cHeight = parseInt(this.canvas.height);
  this.cWidth = parseInt(this.canvas.width);
  this.cameraOffsetX = 0;
  this.cameraOffsetY = 0;
  this.target = false;
  this.waitX = 0;
  this.waitY = 0;
  this.focalPointX = 0;
  this.focalPointY = 0;
  this.lockedToArea = false;
  this.X1 = 0;
  this.X2 = 0;
  this.Y1 = 0;
  this.Y2 = 0;
  
  this.lockToArea = function(x, y, w, h){
	this.lockedToArea = true;
	this.X1 = x;
	this.X2 = x + w;
	this.Y1 = y;
	this.Y2 = y + h;
  }
  
  this.checkLock = function(){
	tempX2 = (this.cameraOffsetX + this.cWidth);
	tempY2 = (this.cameraOffsetY + this.cHeight);
	if( this.cameraOffsetX < this.X1 ){ this.cameraOffsetX = this.X1; }
	if( tempX2 > this.X2 ){ this.cameraOffsetX -= (tempX2 - this.X2); }
	if( this.cameraOffsetY < this.Y1 ){ this.cameraOffsetY = this.Y1; }
	if( tempY2 > this.Y2 ){ this.cameraOffsetY -= (tempY2 - this.Y2); }
  }
  
  this.moveCamera = function(x, y){
    this.cameraOffsetX += x;
	this.cameraOffsetY += y;
	if( this.lockedToArea ){ this.checkLock(); }
	Mouse["camX"] = Mouse["posX"] + this.cameraOffsetX;
	Mouse["camY"] = Mouse["posY"] + this.cameraOffsetY;
  }
  
  this.followSprite = function(sprite, waitX, waitY){
	this.target = sprite;
	sprite.cameraFocused = true;
	if( typeof waitX != "undefined" ){
	  this.waitX = waitX;
	  this.waitY = waitY;
	}
  }
  
  this.update = function(){
    // center the camera on the sprite
	this.focalPointX = this.cameraOffsetX + this.cWidth/2;
	this.focalPointY = this.cameraOffsetY + this.cHeight/2;
	mods = this.checkFocusBounds();
	if(this.target){
	  this.cameraOffsetX = this.target.x + (this.target.halfWidth) - (this.cWidth/2) + mods[0];
	  this.cameraOffsetY = this.target.y + (this.target.halfHeight) - (this.cHeight/2) + mods[1];
	}
	//update mouse position relative to camera
	Mouse["camX"] = Mouse["posX"] + this.cameraOffsetX;
	Mouse["camY"] = Mouse["posY"] + this.cameraOffsetY;
	if( this.lockedToArea ){ this.checkLock(); }
  }
  
  this.checkFocusBounds = function(){
    centerX = this.target.x + (this.target.halfWidth);
	centerY = this.target.y + (this.target.halfHeight);
	distX = (this.focalPointX - centerX);
	distY = (this.focalPointY - centerY);
	waitModifier = new Array(distX, distY);
    if( distX >= this.waitX ){ waitModifier[0] = this.waitX; }
	if( distY >= this.waitY ){ waitModifier[1] = this.waitY; }
	if( distX < -1*this.waitX ){ waitModifier[0] = -1*this.waitX; }
	if( distY < -1*this.waitY ){ waitModifier[1] = -1*this.waitY; }
	return waitModifier;
  }
  
  this.objectInView = function( drawX, drawY, hWidth, hHeight ){
	camLeft = 0;
	camRight = this.cWidth;
	camTop = 0;
	camBottom = this.cHeight;
	spriteLeft = drawX - hWidth;
	spriteRight = drawX + hWidth;
	spriteTop = drawY - hHeight;
	spriteBottom = drawY + hHeight;
		
		if( !( (spriteBottom < camTop) ||
			     (spriteTop > camBottom) ||
			     (spriteRight < camLeft) ||
			     (spriteLeft > camRight) ) )
		{ return true; }
		else{ return false; }
  }
  
}

function Tile( mapX, mapY, x, y, type ){
  this.x = x;
  this.y = y;
  this.mapX = mapX;
  this.mapY = mapY;
  this.isCollidable = false;
  this.collisionCallback = false;
  this.type = type;
  this.isAnimated = false;
  this.isCollidable = false;
  this.isClickable = false;
  this.clickCallback = false;
  this.collisionSide = NO_COLLISION;
  this.lastCollision = NO_COLLISION;
  this.checkSides = new Array( true, true, true, true );// right, left, top, bottom
  this.collisionType = TILE;
  this.animationPlaying = false;
  this.allowEnter = false;
  
  this.setCollision = function( callBack , collisionSides){
    this.collisionCallback = callBack;
	this.isCollidable = true;
	if( typeof collisionSides != "undefined" ){ this.checkSides = collisionSides; this.collisionType = PLATFORM_HORIZONTAL; }
  }
  
  this.removeCollision = function(){
	this.collisionCallback = false;
	this.isCollidable = false;
  }
  
  this.setAnimation = function(){
    this.isAnimated = true;
  }
  
  this.setClick = function( callBack ){
    this.isClickable = true;
	this.clickCallback = callBack;
  }
  
  this.changeType = function(newType){ this.type = newType; }
  this.allowCollisionEnter = function(bool){ this.allowEnter = bool; }
  
  this.checkCollision = function( sprite, w, h ){
    this.lastCollision = this.collisionSide;
    this.collisionSide = NO_COLLISION;
	if( this.collisionCallback != false ){
		tileLeft = this.x;
		tileRight = this.x + w;
		tileTop = this.y;
		tileBottom = this.y + h;
		spriteLeft = sprite.x - sprite.halfWidth;
		spriteRight = sprite.x + sprite.halfWidth;
		spriteTop = sprite.y - sprite.halfHeight;
		spriteBottom = sprite.y + sprite.halfHeight;
		
		if( !( (spriteBottom < tileTop) ||
			     (spriteTop > tileBottom) ||
			     (spriteRight < tileLeft) ||
			     (spriteLeft > tileRight) ) )
		{
			if(!this.allowEnter){
				penetrationX = 0;
				penetrationY = 0;
				if( Math.abs(sprite.dx) > Math.abs(sprite.dy)  ){
					if( sprite.dx < 0 && this.checkSides[0] ){ this.collisionSide = COLLISION_RIGHT; sprite.x = tileRight + (sprite.halfWidth+1); }
					if( sprite.dx > 0 && this.checkSides[1] ){ this.collisionSide = COLLISION_LEFT; sprite.x = tileLeft - (sprite.halfWidth+1); }
				}
				else{
					if( sprite.dy > 0 && this.checkSides[2] ){ this.collisionSide = COLLISION_TOP; sprite.y = tileTop - (sprite.halfHeight+1); }
					if( sprite.dy < 0 && this.checkSides[3] ){ this.collisionSide = COLLISION_BOTTOM; sprite.y = tileBottom + (sprite.halfHeight+1); }
					
				}
			}
			this.collisionCallback(this);
		}
	}
  }
  
}

function Background(scene, background, width, height){
	this.background = new Image();
	this.background.src = background;
	this.bgImageChunks = new Array();
	this.bgWidth = width;
	this.bgHeight = height;
	this.camera = scene.camera;
	this.borderType = WRAP_NONE;
	this.initialTopLeftX = 0;
	this.initialTopLeftY = 0;
	this.chunkSizeX = 512;
	this.chunkSizeY = 512;
	//this.chunkBackgroundImage(background);
	
	this.chunkBackgroundImage = function(bg){
		// break up the background image into chunks of maximum texture size for the machine
	}
	
	this.drawBackground = function(){
		this.camera.update();
		ctx = this.camera.context;
		ctx.save();
		drawX = this.initialTopLeftX - this.camera.cameraOffsetX;
		drawY = this.initialTopLeftY - this.camera.cameraOffsetY;
		if( this.borderType == WRAP_X || this.borderType == WRAP_BOTH ){
			if(this.camera.cameraOffsetX < this.initialTopLeftX){
				
			}
		}
		if( this.borderType == WRAP_Y || this.borderType == WRAP_BOTH ){}
		ctx.drawImage(this.background, 0, 0, this.camera.cWidth, this.camera.cHeight, drawX, drawY, this.camera.cWidth, this.camera.cHeight);
		ctx.restore();
	}
	
	this.cameraFollowSprite = function(sprite, waitX, waitY){ 
		this.camera.followSprite(sprite, waitX, waitY); 
		sprite.setCameraRelative( this.camera ); 
	}
}

function TileMap(scene){
  this.tileSheet = new Image();
  this.tiles;
  this.symbolImageMap = new Array();
  this.mapData = false;
  this.visibleGrid = false;
  this.tileWidth = 0;
  this.tileHeight = 0;
  this.sheetWidth = 0;
  this.sheetHeight = 0;
  this.camera = scene.camera;
  this.tileAnimations = new Array();
  this.specificTileAnimations = new Array();
  
  this.mapAsCanvas = new Image();
  
  this.loadTileSheet = function(tileWidth, tileHeight, sheetWidth, sheetHeight, tileSheet, tileSymbols){
    this.tileSheet.src = tileSheet;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	this.SheetWidth = sheetWidth;
	this.SheetHeight = sheetHeight;
	numRows = Math.floor(this.SheetWidth/this.tileWidth);
	numCols = Math.floor(this.SheetHeight/this.tileHeight);
	for(i = 0; i < numRows; i++){
	  for(j = 0; j < numCols; j++){
	    if( (i*numCols)+j < tileSymbols.length ){
	      this.symbolImageMap[(i*numCols)+j] = new Array( j*this.tileWidth, i*this.tileHeight, tileSymbols[(i*numCols)+j] );
		}
	  }
	}
  }
  
  this.loadMapData  = function(mapArray){// mapArray must be a 2-dimensional Array
    this.mapData = new Array();
	this.tiles = new Array();
    for(i = 0; i < mapArray.length; i++){
	  this.mapData.push( new Array() );
	  temp = new Array();
	  for(j = 0; j < mapArray[i].length; j++){
	    k = 0;
		notConverted = true;
	    while( notConverted && k < this.symbolImageMap.length ){
		  if( mapArray[i][j] == this.symbolImageMap[k][2]){ this.mapData[i][j] = k; notConverted = false; } // convert tile symbols to integers for faster comparisons
		  k++;
		  if( mapArray[i][j] == "blank" ){ this.mapData[i][j] = -1; notConverted = false; k = -1; }
		}
		temp[j] = new Tile(j, i, j*this.tileWidth, i*this.tileHeight, k-1);// k = tile type
	  }
	  this.tiles.push(temp)
	}
	
	this.drawMapToImage();
  }
  
  this.drawMapToImage = function(){
	this.mapAsCanvas = document.createElement("canvas");
	this.mapAsCanvas.height = this.tileHeight * this.mapData.length;
	this.mapAsCanvas.width = this.tileWidth * this.mapData[0].length;
	var tContext = this.mapAsCanvas.getContext("2d");
	
	for(i = 0; i < this.mapData.length; i++){
		for(j = 0; j < this.mapData[0].length; j++){
			sheetX = this.symbolImageMap[ this.mapData[i][j] ][0];
			sheetY = this.symbolImageMap[ this.mapData[i][j] ][1];
			tContext.drawImage(this.tileSheet, sheetX, sheetY, this.tileWidth, this.tileHeight, this.tiles[i][j].x, this.tiles[i][j].y, this.tileWidth, this.tileHeight);
		}
	}
	
  }
  
  this.drawMap = function(){//this could be WAY faster
    this.camera.update();
    ctx = this.camera.context;
	drawX = this.camera.cameraOffsetX;
	drawY = this.camera.cameraOffsetY;
	drawW = this.camera.cWidth;
	drawH = this.camera.cHeight;
	destX = 0;
	destY = 0;
	farRightCheck = (this.camera.cameraOffsetX + this.camera.cWidth) - this.mapAsCanvas.width;
	farDownCheck = (this.camera.cameraOffsetY + this.camera.cHeight) - this.mapAsCanvas.height;
	if( this.camera.cameraOffsetX < 0 ){ drawX = 0; drawW += this.camera.cameraOffsetX; destX -= this.camera.cameraOffsetX; }
	if( this.camera.cameraOffsetY < 0 ){ drawY = 0; drawH += this.camera.cameraOffsetY; destY -= this.camera.cameraOffsetY; }
	if( farRightCheck > 0 ){ drawW -= farRightCheck;}
	if( farDownCheck > 0 ){ drawH -= farDownCheck; }
	ctx.drawImage(this.mapAsCanvas, drawX, drawY, drawW, drawH, destX, destY, drawW, drawH);
	if( this.visibleGrid && this.mapData ){// draw the grid lines
		var offX = this.camera.cameraOffsetX % this.tileWidth;
		var offY = this.camera.cameraOffsetY % this.tileHeight;
		ctx.save();
		ctx.beginPath();//this is very important, remove this line for special effects :)
		ctx.lineWidth = 1;
		var i;
		for(i = 0; i < this.camera.cHeight; i += this.tileHeight){
			var yLoc = i - offY + this.tileHeight;
			ctx.moveTo(0, yLoc);
			ctx.lineTo(this.camera.cWidth, yLoc);
		}
		for(i = 0; i < this.camera.cWidth; i += this.tileWidth){
			var xLoc = i - offX + this.tileWidth;
			ctx.moveTo(xLoc, 0);
			ctx.lineTo(xLoc, this.camera.cHeight);
		}
		ctx.stroke();
		ctx.restore();
	}
  }
  
  this.getTileSymbol = function( tileX, tileY ){
	return this.symbolImageMap[ this.tiles[tileY][tileX].type ][2];
  }
  
  this.changeTileType = function(mapX, mapY, newName){
	var newFound = false;
	var stopFlag = false;
	var k = 0;
	while( !newFound && !stopFlag){
		if( k < this.symbolImageMap.length ){ if( this.symbolImageMap[k][2] == newName ){ newFound = k; } }
		else{ stopFlag = true; }
		k++;
	}
	this.mapData[mapY][mapX] = newFound;
	this.tiles[mapY][mapX].changeType(newFound);
	this.drawTileToMap(mapX, mapY);
  }
  
  this.drawTileToMap = function( _x, _y ){//not tested yet.
	var symx = this.symbolImageMap[ this.tiles[_y][_x].type ][0];
	var symy = this.symbolImageMap[ this.tiles[_y][_x].type ][1];
	var tContext = this.mapAsCanvas.getContext("2d");
	tContext.drawImage(this.tileSheet, symx, symy, this.tileWidth, this.tileHeight, this.tiles[_y][_x].x, this.tiles[_y][_x].y, this.tileWidth, this.tileHeight);
  }
  
  this.getMapData = function(){// spits out the map data as the original named array sent in
	var map = new Array();
	for(var i = 0; i < this.mapData.length; i++){
		map[i] = new Array();
		for(var j = 0; j < this.mapData[i].length; j++){
			map[i][j] = this.symbolImageMap[ this.mapData[i][j] ][2];
		}
	}
	return map;
  }
  
  this.addTileCollision = function( collisionCallback, typeOrX, y ){// accept tile type or coordinates
    if( typeof y == "undefined" ){ // then the first argument is a tile type
	  for( i = 0; i < this.tiles.length; i++ ){
	    for( j = 0; j < this.tiles[i].length; j++ ){
		  if( this.tiles[i][j].type == typeOrX ){
		    this.tiles[i][j].setCollision( collisionCallback );
		  }//end if
		}//end for j
	  }//end for i
	}//end if type
	else{ // then a tile coordinate was passed in
	  this.tiles[typeOrX][y].setCollision( collisionCallback );
	}
  }
  
  this.loadCollisionMap = function( collisionMap ){// tile Symbol and collision Callback - - NOTE: This function will overwrite specific Collision Callbacks
    //convert collisionMap symbols to their associated integers
	for( l = 0; l < collisionMap.length; l++ ){
	  c = 0;
	  notConverted = true;
	  while( c < this.symbolImageMap.length && notConverted ){
	    if( this.symbolImageMap[c][2] == collisionMap[l][0] ){
	      collisionMap[l][0] = c+1;
		  notConverted = false;
	    }
		c++;
	  }
	}
	//set collision callback for each tile
    for( i = 0; i < this.tiles.length; i++ ){
	  for( j = 0; j < this.tiles[i].length; j++ ){
	    k = 0;
		notAssigned = true;
	    while( k < collisionMap.length && notAssigned ){
	      if( this.tiles[i][j].type == collisionMap[k][0] ){
		    this.tiles[i][j].setCollision( collisionMap[k][1] );
			notAssigned = false;
		  }
		  k++;
		}
	  }
	}
  }
  
  this.mapScroll = function( dx, dy ){ this.camera.moveCamera(dx, dy); }
  this.cameraFollowSprite = function(sprite, waitX, waitY){ 
	this.camera.followSprite(sprite, waitX, waitY); 
	sprite.setCameraRelative( this.camera ); 
  }
  
  this.addTileAnimation = function( imgWidth, imgHeight, cellWidth, cellHeight, tileName, animSheet ){
    animation = new Animation(animSheet, imgWidth, imgHeight, cellWidth, cellHeight);
	animation.setup();
	for( i = 0; i < this.symbolImageMap.length; i++ ){ // find the tile number that corresponds to the tile name.
		if( this.symbolImageMap[i][2] = tileName ){
			this.tileAnimations[i] = animation;// i = tileNumber, animation
		}
	}
  }
  
  this.addSpecificTileAnimation = function(imgWidth, imgHeight, cellWidth, cellHeight, tileX, tileY, animSheet){
    animation = new Animation(animSheet, imgWidth, imgHeight, cellWidth, cellHeight);
	animation.setup();
	this.specificTileAnimations[tileX][tileY] = animation;
  }
  
  this.drawTileAnimation = function( tile, ctx ){
	  notSpecific = true;
	  if (typeof this.specificTileAnimations[tile.mapX][tile.mapY] !== 'undefined' && this.specificTileAnimations[tile.mapX][tile.mapY] !== null) { 
	  	notSpecific = false; 
		this.specificTileAnimations[tile.mapX][tile.mapY].reset();
		this.specificTileAnimations[tile.mapX][tile.mapY].drawFrame(ctx);
	  }
	  if (typeof this.tileAnimations[tile.type] !== 'undefined' && this.tileAnimations[tile.type] !== null && notSpecific) { 
	    this.tileAnimations[tile.type].reset();
		this.tileAnimations[tile.type].drawFrame(ctx);
	  }
  }
  
  this.playTileAnimation = function( tile ){ tile.animationPlaying = true; }
  this.stopTileAnimation = function( tile ){ tile.animationPlaying = false; }
  
  this.specifyPlatform = function( direction, startRowCol, firstColRow, numTiles, callBack ){
    if( direction == "vertical"){
	  platformTop = new Array(true, true, true, false);//right, left, top, bottom
	  platformMiddle = new Array(true, true, false, false);
	  platformBottom = new Array(true, true, false, true);
	  vertical = true;
	}
	else if( direction == "horizontal" ){
	  platformTop = new Array(true, false, true, true);//right, left, top, bottom
	  platformMiddle = new Array(false, false, true, true);
	  platformBottom = new Array(false, true, true, true);
	  vertical = false;
	}
	end = firstColRow + numTiles;
	  for( current = firstColRow; current < end; current++ ){
	    if( current == firstColRow ){ collisionSides = platformTop; }
		else if( current == (end-1) ){ collisionSides = platformBottom; }
		else{ collisionSides = platformMiddle; }
		if(vertical){ this.tiles[current][startRowCol].setCollision(callBack, collisionSides); }
		else{ this.tiles[startRowCol][current].setCollision(callBack, collisionSides); }
	  }
  }
  
  this.checkCollisions = function(sprite){ //check for collisions between sprite and tile
    tileCoordX = Math.floor( sprite.x/this.tileWidth );
	tileCoordY = Math.floor( sprite.y/this.tileHeight );
	modX = Math.floor( ( (sprite.width/this.tileWidth)+2 )/2 );
	modY = Math.floor( ( (sprite.height/this.tileHeight)+2 )/2 );
	checkRowsBegin = tileCoordX - modX;
	checkRowsEnd = tileCoordX + modY+1;
	checkColsBegin = tileCoordY - modX;
	checkColsEnd = tileCoordY + modY+1;
	runCheck = false;
	if( tileCoordX == -1 ){ tileCoordX = 0; }
	if( tileCoordY == -1 ){ tileCoordY = 0; }
	if( tileCoordX == 0 ){ checkRowsBegin = 0; }
	if( tileCoordY == 0 ){ checkColsBegin = 0; }
	if( tileCoordX > -1 && tileCoordY > -1 && tileCoordY < this.mapData.length && tileCoordX < this.mapData[0].length ){// if sprite is in a tile
	  if( tileCoordX == (this.mapData[0].length-1) ){ checkRowsEnd = this.mapData[0].length; }
	  if( tileCoordY == (this.mapData.length-1) ){ checkColsEnd = this.mapData.length; }
	  runCheck = true;
	}
	else if( tileCoordX >= this.mapData[0].length && tileCoordX <= this.mapData[0].length + modX && tileCoordY > -1 ){ 
		checkRowsEnd = this.mapData[0].length; runCheck = true; 
	}
	else if( tileCoordY >= this.mapData.length && tileCoordY <= this.mapData.length + modY && tileCoordX > -1 ){ 
		checkColsEnd = this.mapData.length; runCheck = true; 
	}
	if( runCheck ){
		for( i = checkColsBegin; i < checkColsEnd; i++ ){
			for( j = checkRowsBegin; j < checkRowsEnd; j++ ){
			if( this.tiles[i][j].isCollidable ){
				this.tiles[i][j].checkCollision(sprite, this.tileWidth, this.tileHeight);// TODO: i and j can be out of bounds, find out how
			  }
			}
		}
	}
  }
  
  this.showGrid = function(){ this.visibleGrid = true; }
  this.hideGrid = function(){ this.visibleGrid = false; }
  this.makeSpriteMapRelative = function(sprite){ sprite.setCameraRelative( this.camera ); }
  this.lockCameraToMap = function(){
	lockX = this.tiles[0][0].x;
	lockY = this.tiles[0][0].y;
	lockW = this.tiles[0].length * this.tileWidth;
	lockH = this.tiles.length * this.tileHeight;
	this.camera.lockToArea(lockX, lockY, lockW, lockH);
  }
}

function Physics(){
  this.forces = new Array();
  
  this.addForce = function( dx, dy, name ){
    this.forces.push( new Array( dx, dy, name ) );
  }
  
  this.changeForce = function( ddx, ddy, name ){
    index = this.findForceIndex(name);
	this.forces[index][0] += ddx;
	this.forces[index][1] += ddy;
  }
  
  this.setForce = function( dx, dy, name){
    index = this.findForceIndex(name);
	this.forces[index][0] = dx;
	this.forces[index][1] = dy;
  }
  
  this.removeForce = function( name ){
    index = this.findForceIndex(name);
	this.forces.splice(index, 1);
  }
  
  this.findForceIndex = function( name ){
    for( i = 0; i < this.forces.length; i++){
	  if( this.forces[i][2] == name ){ return i; }
	}
	return -1; //if force is not found 
  }
  
  this.applyPhysics = function( ){
    dx = 0;
	dy = 0;
    for( i = 0; i < this.forces.length; i++ ){
      dx += this.forces[i][0];
	  dy += this.forces[i][1];
	}
	return new Array( dx, dy );
  }
}

function Sprite(scene, imageFile, width, height){ 
    //core class for game engine
    /*
    TODO:
      Add collision detection (DONE 2/4/11)
      Add access modifiers for x,y,dx,dy (DONE 10/26/11)
      Add multiple boundActions
      Support multiple images / states (DONE 10/26/11)
      Sprite element now expects scene rather than canvas
    */
  this.scene = scene;
  this.canvas = scene.canvas;
  this.context = this.canvas.getContext("2d");
  this.image = new Image();
  this.image.src = imageFile;
  this.animation = false; // becomes Animation Class
  this.width = width;
  this.halfWidth = this.width/2;
  this.height = height;
  this.halfHeight = this.height/2;
  this.cHeight = parseInt(this.canvas.height);
  this.cWidth = parseInt(this.canvas.width);
  this.x = 200;
  this.y = 200;
  this.dx = 10;
  this.dy = 0;
  this.ddx = 0;
  this.ddy = 0;
  this.imgAngle = 0;
  this.moveAngle = 0;
  this.speed = 10;
  this.camera = scene.camera;
  this.cameraFocused = false;
  this.boundaryAction = BOUNDARY_WRAP;
  this.physics = new Physics();
  this.physics.addForce( this.dx, this.dy, "movement" );
  this.physics.addForce( 0, 0, "gravity" ) //default is no gravity
  this.isJumping = false;
  this.isClickable = false;
  this.clickCallback;

  this.setPosition = function(x, y){
    //position is position of center
    this.x = x; 
    this.y = y;
  } // end setPosition function
  
  this.setX = function (nx){ this.x = nx; }
  this.setY = function (ny){ this.y = ny; }
  
  this.setChangeX = function (ndx){ 
    this.dx = ndx; 
	this.physics.setForce( this.dx, this.dy, "movement" );
  }
  
  this.setChangeY = function (ndy){ 
    this.dy = ndy; 
	this.physics.setForce( this.dx, this.dy, "movement" ); 
  }
  
  this.setGravity = function ( dx, dy ){ 
    this.physics.setForce( dx, dy, "gravity" );
  }
  
  this.turnOnGravity = function(){ 
	this.physics.setForce( 0, 2, "gravity" ); // <0, 2> is the default gravity vector
  }
  
  this.turnOffGravity = function(){ 
    this.physics.removeForce("gravity");
  }
  
  this.jump = function(){
    if( this.isJumping != true ){ this.physics.addForce(0, -30, "jump"); }
	this.isJumping = true;
  }
  
  this.land = function(){
    this.physics.removeForce("jump");
	this.isJumping = false;
  }
  
  this.setBoundaryAction = function(action){
    if( action == BOUNDARY_SCROLL && this.camera == false ){ this.camera = new Camera(this.scene); }
    this.boundaryAction = action;
  }

  this.draw = function(){
    //draw self on canvas;
		//intended only to be called from update, should never
		//need to be deliberately called
    ctx = this.context;

    ctx.save();
		drawX = this.x - this.camera.cameraOffsetX;
		drawY = this.y - this.camera.cameraOffsetY;
	ctx.translate(drawX, drawY);
    ctx.rotate(this.imgAngle);
    //draw image with center on origin
	if( this.camera.objectInView( drawX, drawY, this.halfWidth, this.halfHeight ) ){
		if( this.animation != false ){
		this.animation.drawFrame(ctx);
		ctx.strokeRect(0 - this.width/2,0 - this.height/2,this.width,this.height);//collision debug helper
		}
		else{
		ctx.drawImage(this.image, 
			0 - (this.width / 2), 
			0 - (this.height / 2),
			this.width, this.height);
		}
	}
    ctx.restore();
     
  } // end draw function

  this.applyPhysics = function(){
    if(this.isJumping == true ){ this.physics.changeForce(0, 2, "jump"); }
    velocityVec = this.physics.applyPhysics( ); 
	this.dx = velocityVec[0];
	this.dy = velocityVec[1];
	this.x += this.dx;
	this.y += this.dy;
  }
  
  this.update = function(){
	
	this.checkBounds();
    this.draw();
  } // end update

  this.checkBounds = function(){
	rightBorder = this.cWidth;
	leftBorder = 0;
	topBorder = 0;
	bottomBorder = this.cHeight;
	if(this.camera){ 
		camX = this.camera.cameraOffsetX; 
		camY = this.camera.cameraOffsetY; 
		if(this.camera.lockedToArea){
			rightBorder = this.camera.X2;
			leftBorder = this.camera.X1;
			topBorder = this.camera.Y1;
			bottomBorder = this.camera.Y2;
		}
		else{
			rightBorder = this.cWidth + camX;
			leftBorder = camX;
			topBorder = camY;
			bottomBorder = this.cHeight + camY;
		}
	}
	if(this.cameraFocused){
		if (this.x > rightBorder){
			if( this.boundaryAction == BOUNDARY_WRAP ){ this.x = leftBorder; }
			if( this.boundaryAction == BOUNDARY_STOP ){ this.x = rightBorder; }
			if( this.boundaryAction == BOUNDARY_SCROLL && this.camera ){ this.camera.moveCamera( (this.cHeight-this.height), 0 ); }
		} // end if

		if (this.y > bottomBorder){
			if( this.boundaryAction == BOUNDARY_WRAP ){ this.y = topBorder; }
			if( this.boundaryAction == BOUNDARY_STOP ){ this.y = bottomBorder; }
			if( this.boundaryAction == BOUNDARY_SCROLL && this.camera ){ this.camera.moveCamera(0, (this.cHeight-this.height) ); }
		} // end if

		if (this.x < leftBorder){
			if( this.boundaryAction == BOUNDARY_WRAP ){ this.x = rightBorder; }
			if( this.boundaryAction == BOUNDARY_STOP ){ this.x = leftBorder; }
			if( this.boundaryAction == BOUNDARY_SCROLL && this.camera ){ this.camera.moveCamera( -1*(this.cHeight-this.height), 0 ); }
		} // end if

		if (this.y < topBorder){
			if( this.boundaryAction == BOUNDARY_WRAP ){ this.y = bottomBorder; }
			if( this.boundaryAction == BOUNDARY_STOP ){ this.y = topBorder; }
			if( this.boundaryAction == BOUNDARY_SCROLL && this.camera ){ this.camera.moveCamera(0, -1*(this.cHeight-this.height) ); }
		}
	}
  } // end checkbounds

  this.loadAnimation = function (imgWidth, imgHeight, cellWidth, cellHeight){
    this.animation = new Animation(this.image, imgWidth, imgHeight, cellWidth, cellHeight);
	this.animation.setup();
  }
  
  this.generateAnimationCycles = function(slicingFlag, framesArray){
    //Default: assume each row is a cycle and give them names Cycle1, Cycle2, ... , CycleN
	//SINGLE_ROW: all the sprites are in one row on the sheet, the second parameter is either a number saying each cycle is that many frames or a list of how many frames each cycle is
	//SINGLE_COLUMN: all the sprites are in one column on the sheet, the second parameter is either a number saying each cycle is that many frames or a list of how many frames each cycle is
	//VARIABLE_LENGTH: How many frames are in each cycle. framesArray must be defined.
	this.animation.genCycles(slicingFlag, framesArray);
  }
  
  this.renameCycles = function(cycleNames){ this.animation.renameCycles(cycleNames); }
  this.specifyCycle = function(cycleName, startingCell, frames){ this.animation.addCycle(cycleName, startingCell, frames); }
  this.specifyState = function(stateName, cellName){ this.animation.addCycle(stateName, cellName, 1); }
  this.setCurrentCycle = function(cycleName){ this.animation.setCycle(cycleName); }
  this.pauseAnimation = function(){ this.animation.pause(); }
  this.playAnimation = function(){ this.animation.play(); }
  this.resetAnimation = function(){ this.animation.reset(); }
  this.setAnimationSpeed = function(speed){ this.animation.setAnimationSpeed(speed); }
  
  this.calcVector = function(){
    //used throughout speed / angle calculations to 
    //recalculate dx and dy based on speed and angle
    this.dx = this.speed * Math.cos(this.moveAngle);
    this.dy = this.speed * Math.sin(this.moveAngle);
  } // end calcVector

  this.setSpeed = function(speed){
    this.speed = speed;
    this.calcVector();
	this.physics.setForce(this.dx, this.dy, "movement");
  } // end setSpeed

  this.changeSpeedBy = function(diff){
    this.speed += diff;
    this.calcVector();
	this.physics.setForce(this.dx, this.dy, "movement");
  } // end changeSpeedBy

  this.setImgAngle = function(degrees){
    //convert degrees to radians
    this.imgAngle = degrees * Math.PI / 180;
  } // end setImgAngle

  this.changeImgAngleBy = function(degrees){
    rad = degrees * Math.PI / 180;
    this.imgAngle += rad;
  } // end changeImgAngle

  this.setMoveAngle = function(degrees){
    //take movement angle in degrees
    //convert to radians
    this.moveAngle = degrees * Math.PI / 180;
    this.calcVector();
	this.physics.setForce(this.dx, this.dy, "movement");
  } // end setMoveAngle

  this.changeMoveAngleBy = function(degrees){
    //convert diff to radians
    diffRad = degrees * Math.PI / 180;
    //add radian diff to moveAngle
    this.moveAngle += diffRad;
    this.calcVector();
	this.physics.setForce(this.dx, this.dy, "movement");
  } // end changeMoveAngleBy

  //convenience functions combine move and img angles
  this.setAngle = function(degrees){
    this.setMoveAngle(degrees);
    this.setImgAngle(degrees);
  } // end setAngle

  this.changeAngleBy = function(degrees){
      this.changeMoveAngleBy(degrees);
      this.changeImgAngleBy(degrees);
  } // end changeAngleBy
  
  this.collidesWith = function(sprite){
    //define borders
    myLeft = this.x;
    myRight = this.x + this.width;
    myTop = this.y;
    myBottom = this.y + this.height;
    otherLeft = sprite.x;
    otherRight = sprite.x + sprite.width;
    otherTop = sprite.y;
    otherBottom = sprite.y + sprite.height;

    //assume collision
    collision = true;
    
    //determine non-colliding states
    if ((myBottom < otherTop) ||
        (myTop > otherBottom) ||
        (myRight < otherLeft) ||
        (myLeft > otherRight)) {
          collision = false;
    } // end if
    return collision;
  } // end collidesWith
  
  this.setCameraRelative = function( cam ){ this.camera = cam; this.cameraFocused = true; }
  
  this.setClickable = function(callback){
	this.isClickable = true;
	this.clickCallback = callback;
	this.scene.inputMan.addClickable(this.x, this.y, this.width, this.height, this)
  }
  
  this.removeClickable = function(){
	this.isClickable = false;
  }
  
  this.report = function(){
      //used only for debugging. Requires browser with JS console
      console.log ("x: " + this.x + ", y: " + this.y + ", dx: "
		   + this.dx + ", dy: " + this.dy
		   + ", speed: "  + this.speed
		   + ", angle: " + this.moveAngle);
  } // end report
} // end Sprite class def

function Scene(placementId){
    //Scene that encapsulates the animation background
    /*
    TODO: 
      AddSprite method
      Put sprites in linked list
      Automatically update each sprite in list
      Add keyboard input (initial version done)
      array of keydowns like PyGame? (DONE: 2/25/11)
      keyboard constants (DONE: 2/25/11)
      Consider drawing canvas directly on page - position absolute
      (DONE - Scene now creates own canvas)
      mouse input
      virtual buttons for portable devices
    */

    //determine if it's a touchscreen device
    touchable = 'createTouch' in document;
    //dynamically create a canvas element
    this.canvas = document.createElement("canvas");
    if( typeof placementId != "undefined" ){ document.getElementById(placementId).appendChild(this.canvas); }
	else{ document.body.appendChild(this.canvas); }
    this.context = this.canvas.getContext("2d");
    
	this.mouse = false;
	this.inputMan = new InputMan(this);
	this.stateMan = new StateMan();
	
    this.clear = function(){
      this.context.clearRect(0, 0, this.width, this.height);
    }

    this.start = function(){
      //set up keyboard reader if not a touch screen.
      if (!touchable){
		this.initKeys();
		document.onkeydown = this.updateKeys;
		document.onkeyup = this.clearKeys;
		this.mouse = new MouseUpdater(this);
		this.mouse.calculateCanvasOffset();
      } // end if
      this.intID = setInterval(localUpdate, 25);
    } 

    this.stop = function(){
      clearInterval(this.intID);
    }

    this.updateKeys = function(e){      
      //set current key
      currentKey = e.keyCode;
      keysDown[e.keyCode] = true;
    } // end updateKeys
    
    this.clearKeys = function(e){
      currentKey = null;
      keysDown[e.keyCode] = false;
    } // end clearKeys
    
    this.initKeys = function(){
      //initialize keys array to all false
      for (keyNum = 0; keyNum < 256; keyNum++){
	      keysDown[keyNum] = false;
      } // end for
    } // end initKeys
    
    this.setSizePos = function(height, width, top, left){
      //modify the canvas' style to conform to the new parameters
      //styleString = "background-color: yellow; \n";
      styleString = "";
      styleString += "position: absolute; \n";
      styleString += "height: " + height + "px;\n";
      styleString += "width: " + width + "px;\n";
      styleString += "top: " + top + "px;\n";
      styleString += "left: " + left + "px;\n";
      //this.canvas.setAttribute("style", styleString);
      
      this.height = height;
      this.width = width;
      this.top = top;
      this.left = left;

      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.canvas.style.left = this.left;
      this.canvas.style.top = this.top;
	  this.camera = new Camera(this);
    } // end setSizePos

    this.setSize = function(width, height){
      //set the width and height of the canvas in pixels
      this.width = width;
      this.height = height;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
	  this.camera = new Camera(this);
    } // end setSize
    
    this.setPos = function(left, top){
      //set the left and top position of the canvas
      //offset from the page
      this.left = left;
      this.top = top;
      this.canvas.style.left = left;
      this.canvas.style.top = top;
    } // end setPos
    
    this.setBG = function(color){
      this.canvas.style.backgroundColor = color;
    } // end this.setBG
    
	this.addState = function(name, ucallb, icallb){ return this.stateMan.addState(name, ucallb, icallb); }
	this.lastState = function(){ return this.stateMan.lastState(); }
	this.setState = function(state){ this.stateMan.setState(state); }
	this.stateUpdate = function(){ return this.stateMan.update(); }
    this.setSize(400, 300);
    this.setPos(10, 100);
    this.setBG("lightgray");
	this.camera = new Camera(this);

} // end Scene class def

function Sound(src){
  //sound effect class
  //builds a sound effect based on a url
  //ogg is preferred.
  this.snd = document.createElement("audio");
  this.snd.src = src;
  
  this.play = function(){
    this.snd.play();
  } // end play function
} // end sound class def

function Joy(){
  //virtual joystick for ipad
  
  //properties
  SENSITIVITY = 50;
  document.diffX = 0;
  document.diffY = 0;
  var touches = [];
  document.startX = 0;
  document.startY = 0;
  
  //getters
  //the dirty little secret (for out at least) is that most of this objects
  //properies will actually be properties of the document
  this.getStartX = function(){return document.startX;}
  this.getStartY = function(){return document.startY;}
  this.getDiffX = function(){return document.diffX;}
  this.getDiffY = function(){return document.diffY;}
  
  
  //define event handlers
  this.onTouchStart = function(event){
    result = "touch: ";
    touches = event.touches;
    document.startX = touches[0].screenX;
    document.startY = touches[0].screenY;
    result += "x: " + startX + ", y: " + startY;
    //define mouse position based on touch position
    document.mouseX = startX;
    document.mouseY = startY;
    //console.log(result);
  } // end onTouchStart
  
  this.onTouchMove = function(event){
    result = "move: "
    event.preventDefault();
    touches = event.touches;
    //map touch position to mouse position
    document.mouseX = touches[0].screenX;
    document.mouseY = touches[0].screenY;
    document.diffX = touches[0].screenX - document.startX;
    document.diffY = touches[0].screenY - document.startY;
    result += "dx: " + this.diffX + ", dy: " + this.diffY;
    //console.log(result);

  } // end onTouchMove
  
  this.onTouchEnd = function(event){
    result = "no touch";
    touches = event.touches;
    diffX = 0;
    diffY = 0;
  } // end onTouchEnd
  
  //add event handlers if appropriate
  touchable = 'createTouch' in document;
  if (touchable){
    document.addEventListener('touchstart', this.onTouchStart, false);
    document.addEventListener('touchmove', this.onTouchMove, false);
    document.addEventListener('touchend', this.onTouchEnd, false);
  } // end if
} // end joy class def

function MouseUpdater(sc){
	this.scene = sc;
	this.canvas = sc.canvas;
	this.camera = sc.camera;
	
	this.canvas.addEventListener( "mousemove", function(cam){ 
		return function(event){
				Mouse["posX"] = event.clientX - Mouse["canvasLeft"];
				Mouse["posY"] = event.clientY - Mouse["canvasTop"];
				Mouse["absoluteX"] = event.clientX;
				Mouse["absoluteY"] = event.clientY;
				Mouse["camX"] = Mouse["posX"] + cam.cameraOffsetX;
				Mouse["camY"] = Mouse["posY"] + cam.cameraOffsetY;
			}; 
	}(this.camera), false );
	
	this.canvas.addEventListener( "mousedown", function(){ 
		return function(event){
			if( Mouse["mouseDown"] ){ Mouse["mouseDown"](); }
			Mouse["mouseIsDown"] = true;
		}; 
	}(), false );
	
	this.canvas.addEventListener( "mouseup", function(s){ 
		return function(event){
			if( Mouse["mouseUp"] ){ Mouse["mouseUp"](); }
				Mouse["mouseIsDown"] = false;
				s.inputMan.clickCheck();
		}; 
	}(this.scene), false );
	
	this.calculateCanvasOffset = function() {
		var canv = this.canvas;
		Mouse["canvasLeft"] = 0;
		Mouse["canvasTop"] = 0;
		if (canv.offsetParent) {
			do {
				Mouse["canvasLeft"] += canv.offsetLeft;
				Mouse["canvasTop"] += canv.offsetTop;
			} while (canv = canv.offsetParent); //if the assignment is successfull the loop will continue
		}
	}
	
}

function localUpdate(){
    //will be called once per frame
    update();
    //put sprite update code here...
} // end localUpdate

//Get Mouse Values From Here
var Mouse = {
	"canvasLeft" : 0,
	"canvasTop" : 0,
	"posX" : 0,
	"posY" : 0,
	"camX" : 0,
	"camY" : 0,
	"absoluteX" : 0,
	"absoluteY" : 0,
	"mouseIsDown" : false,
	"mouseDown" : false,
	"mouseUp" : false
};
//keyboard constants
K_A = 65; K_B = 66; K_C = 67; K_D = 68; K_E = 69; K_F = 70; K_G = 71;
K_H = 72; K_I = 73; K_J = 74; K_K = 75; K_L = 76; K_M = 77; K_N = 78;
K_O = 79; K_P = 80; K_Q = 81; K_R = 82; K_S = 83; K_T = 84; K_U = 85;
K_V = 86; K_W = 87; K_X = 88; K_Y = 89; K_Z = 90;
K_LEFT = 37; K_RIGHT = 39; K_UP = 38;K_DOWN = 40; K_SPACE = 32;K_CTRL = 17;
//Animation Constants
SINGLE_ROW = 1; SINGLE_COLUMN = 2; VARIABLE_LENGTH = 3;
PLAY_ONCE = 1; PLAY_LOOP = 2;
//Collision Constants
NO_COLLISION = 0; COLLISION_TOP = 1; COLLISION_BOTTOM = 2; COLLISION_LEFT = 3; COLLISION_RIGHT = 4;
TILE = 1; PLATFORM_VERTICAL = 2; PLATFORM_HORIZONTAL = 3;
//Boundary Constants
BOUNDARY_NONE = 0; BOUNDARY_WRAP = 1; BOUNDARY_STOP = 2; BOUNDARY_DIE = 3;BOUNDARY_SCROLL = 4;
//Background Constants
WRAP_NONE = 0; WRAP_X = 1; WRAP_Y = 2; WRAP_BOTH = 3;
//GUI Constants
DRAIN_LEFT = 0; DRAIN_RIGHT = 1; DRAIN_UP = 2; DRAIN_DOWN = 3;