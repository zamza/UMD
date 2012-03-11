var scene;
var tileManager;
var player;

var canMove;
var moveCounter;
var playerRotate;
var staticTest;
var fontTest;
var meter;

function init() {

    canMove = true;
    moveCounter = 0;

    scene = new Scene();
    scene.setSize(640, 480);
    scene.setPos(100, 100);
	
	staticTest = new Static(scene, 0, 0, 32, 32, "img/Gold.png");
	var tText  = "Hey, fonts work!";
	fontTest = new Text(scene, 40, 40, tText, "#FF0000");
	meter = new Meter(scene, 100, 300, 300, "#FF0000", 10, 100, DRAIN_DOWN);
	
    initializePlayer();
	
    generateMap();

    scene.camera.followSprite(player, 0, 0);
    scene.start();

}

function update() {
    checkKeys();
    if (canMove == false)
        lockMovement();

    scene.clear();

    tileManager.drawMap();

    document.getElementById("speed").innerHTML = playerRotate;

    player.applyPhysics();
    player.update();
	meter.draw();
	staticTest.draw();
	fontTest.draw();
}

function initializePlayer() {
    //Runs when the player is created.  Initalizes all starting variables.
    player = new Sprite(scene, "img/SpriteSheetTemplate.png", 32, 32);
    player.loadAnimation(256, 256, 32, 32);
    player.generateAnimationCycles();
    cycleNames = new Array("right", "left", "down", "up", "downidle", "rightidle", "leftidle", "upidle" );
    player.renameCycles(cycleNames);
    player.setSpeed(0);
    player.setPosition(48, 48);
    player.xTile = 1;
    player.yTile = 1;
    player.health = 100;

    player.handgun = false;
    player.shotgun = false;
    player.grenadeLauncher = false;

    player.updateX = function (_x) {
        //Track player's location, updates x axis tiles
        player.xTile += _x;
    }

    player.updateY = function (_y) {
        //Track player's location, updates y axis tiles
        player.yTile += _y;
    }
    player.updateHealth = function (healthChange) {
        player.health += healthChange;
        //TODO: Update gui's health meter
        //TODO: Check to see if player is dead
    }
    player.reloadClip = function () {
        //TODO: Reload the player's clip of the currently equipped gun to maximum
    }
    player.fireWeapon = function () {
        //TODO: Player fires currently equipped weapon 
    }
    player.meleeAttack = function () {
        //TODO: Player melees tile in front facing with currently equipped weapon
    }
}

function generateMap() {
    tileSymbols = new Array("1", "2", "3");
    var tileMap = new Array(
        new Array("2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "3", "3", "3", "3", "3", "3", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "3", "3", "3", "3", "3", "3", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "3", "3", "3", "3", "3", "3", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "3", "3", "3", "3", "3", "3", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "3", "3", "3", "3", "3", "3", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "3", "3", "3", "3", "3", "3", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2"),
        new Array("2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2"));

    collisionMap = new Array();
    var collisionMap = new Array(new Array("2", tileCollision));
    tileManager = new TileMap(scene);
    tileManager.loadTileSheet(32, 32, 320, 320, "img/TileSet.png", tileSymbols);
    tileManager.loadMapData(tileMap);
    tileManager.loadCollisionMap(collisionMap);
}

function checkKeys() {
    //Checks the player's inputs.  Once the player hits an arrow key, they follow a straight path until they get to the next tile.

    //Check to see if the ctrl key is down.  If it is, allow the user to rotate without moving when hitting the arrow keys
    if (keysDown[K_CTRL]) {
        playerRotate = true;
    }

    else {
        playerRotate = false;
    }

    //Check arrow keys for movement.
    if (keysDown[K_LEFT] && canMove == true) {
        if (!playerRotate) {
            canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("left");
        player.setMoveAngle(180);
        if (!playerRotate) {
            player.updateX(-1);
            if (resetSpeedFlag) { player.setSpeed(4); }
        }
    }
    else if (keysDown[K_RIGHT] && canMove == true) {
        if (!playerRotate) {
            canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("right");
        player.setMoveAngle(0);
        if (!playerRotate) {
            player.updateX(1);
            if (resetSpeedFlag) { player.setSpeed(4); }
        }
    }
    else if (keysDown[K_UP] && canMove == true) {
        if (!playerRotate) {
            canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("up");
        player.setMoveAngle(270);
        {
            player.updateY(-1);
            if (resetSpeedFlag) { player.setSpeed(4); }
        }
    }
    else if (keysDown[K_DOWN] && canMove == true) {
        if (!playerRotate) {
            canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("down");
        player.setMoveAngle(90);
        if (!playerRotate) {
            player.updateY(1);
            if (resetSpeedFlag) { player.setSpeed(4); }
        }
    }
    //Pass player turn
    else if (keysDown[K_SPACE]) {
        startEnemyTurn();
    }

    //Reload currently equipped gun's clip
    else if (keysDown[K_C]) {
        player.reloadClip();
    }
}

function lockMovement() {
    //Locks the player's movement if he is in motion
    moveCounter += player.speed;

    //Once the player has moved one tile, stop the player, check the ground under his feet, and start the enenmy's turn
    if (moveCounter == 36) {
        moveCounter = 0;
        player.setSpeed(0);
        canMove = true;
        if (player.animation.currentCycleName == "left") {
            player.setCurrentCycle("leftidle");
        }
        if (player.animation.currentCycleName == "right") {
            player.setCurrentCycle("rightidle");
        }
        if (player.animation.currentCycleName == "down") {
            player.setCurrentCycle("downidle");
        }
        if (player.animation.currentCycleName == "up") {
            player.setCurrentCycle("upidle");
        }


        checkGround();

        startEnemyTurn();
    }
}

function tileCollision(hitTile) {
    //resetSpeedFlag = true;
    //player.setSpeed(0);
}

function startEnemyTurn() {
    //Controlling all enemies decision making goes here
}

function checkGround() {
    //Check player's current tile for events
    //Pick up items on a current tile if item is there
}