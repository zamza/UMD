﻿///<reference path = "~/lib/simpleGame.js" />
var scene;

var titleState;
var introState;
var warehouseState;
var mainState;
var clueState;
var bossState;
var winState;
var loseState;

//the only other variables here are what should be accessible in multiple states
var tileManager;
var player;

function toIntroState(){ introState = scene.addState( "Intro", introUpdate, introInit); }
function toTitleState(){ titleState = scene.addState( "Title", titleUpdate, titleInit); }
function toWarehouseState(){ warehouseState = scene.addState( "Warehouse", warehouseUpdate, warehouseInit); }
function toMainState(){ mainState = scene.addState( "Main", mainUpdate, mainInit); }
function toBossState(){ bossState = scene.addState( "Boss", bossUpdate, bossInit); }
function toClueState(){ clueState = scene.addState( "Clue", clueUpdate, clueInit); }
function toWinState(){ winState = scene.addState( "Win", winUpdate, winInit); }
function toLoseState(){ loseState = scene.addState( "Lose", loseUpdate, loseInit); }

function titleInit() {
	//replace this with whatever needs to be initialized for this state.
	titleState.titleBG = new Static(scene, 0, 0, 640, 480, "img/TitleBG.png"); 
	titleState.nextStateBtn = new Button(scene, 300, 200, 32, 32, toIntroState);
}

function introInit() {
	//replace this with whatever needs to be initialized for this state.
	introState.introBG = new Static(scene, 0, 0, 640, 480, "img/IntroBG.png"); 
	introState.nextStateBtn = new Button(scene, 300, 200, 32, 32, toWarehouseState);
	initializePlayer();
	generateMap();
}

function warehouseInit(){
	//replace this with whatever needs to be initialized for this state.
	warehouseState.warehouseBG = new Static(scene, 0, 0, 640, 480, "img/WarehouseDistrictBG.png"); 
	warehouseState.nextStateBtn = new Button(scene, 300, 200, 32, 32, toMainState);
	
}

function mainInit() {
	//replace this with whatever needs to be initialized for this state.
	/*mainState.mainBG = new Static(scene, 0, 0, 640, 480, "img/MainBG.png"); 
	mainState.winStateBtn = new Button(scene, 100, 200, 32, 32, toWinState);
	mainState.loseStateBtn = new Button(scene, 200, 200, 32, 32, toLoseState);
	mainState.bossStateBtn = new Button(scene, 300, 200, 32, 32, toBossState);
	mainState.clueStateBtn = new Button(scene, 400, 200, 32, 32, toClueState);*/
	mainState.canMove = true;
    mainState.moveCounter = 0;
	mainState.playerTurn = true;
	scene.camera.followSprite(player, 0, 0);
	initGUI();
}

function clueInit() {
	//replace this with whatever needs to be initialized for this state.
	clueState.clueBG = new Static(scene, 0, 0, 640, 480, "img/ClueBG.png"); 
	clueState.nextStateBtn = new Button(scene, 300, 200, 32, 32, toMainState);
}

function bossInit() {
	//replace this with whatever needs to be initialized for this state.
	bossState.bossBG = new Static(scene, 0, 0, 640, 480, "img/BossBG.png"); 
	bossState.nextStateBtn = new Button(scene, 300, 200, 32, 32, toMainState);
}

function winInit() {
	//replace this with whatever needs to be initialized for this state.
	winState.winBG = new Static(scene, 0, 0, 640, 480, "img/WinBG.png"); 
	winState.nextStateBtn = new Button(scene, 300, 200, 32, 32, toTitleState);
}

function loseInit() {
	//replace this with whatever needs to be initialized for this state.
	loseState.loseBG = new Static(scene, 0, 0, 640, 480, "img/loseBG.png"); 
	loseState.nextStateBtn = new Button(scene, 300, 200, 32, 32, toTitleState);
}

function init() {
    scene = new Scene("canvasTarget");
    scene.setSize(640, 480);
    scene.setPos(100, 100);
	
	titleState = scene.addState( "Title", titleUpdate, titleInit);
    scene.start();
}

function update() {
    scene.clear();
	
	scene.stateUpdate();
}

function initializePlayer() {
    //Runs when the player is created.  Initializes all values for player
    player = new Sprite(scene, "img/SpriteSheetTemplate.png", 32, 32);
    player.loadAnimation(256, 256, 32, 32);
    player.generateAnimationCycles();
    cycleNames = new Array("right", "left", "down", "up", "downidle", "rightidle", "leftidle", "upidle" );
    player.renameCycles(cycleNames);
    player.setSpeed(0);
    player.setPosition(49, 49);
    player.xTile = 1;
    player.yTile = 1;
    player.health = 100;

    //Equipped Weapon and ammo
    player.currentWeapon = "pistol";
    player.currentAmmo = "incendiary";

    //Inventory
    player.incendiaryAmmo = 0;
    player.alkiAmmo = 0;
    player.sonicAmmo = 0;
    player.clipSize = 0;
    player.healthPacks = 0;
    player.traps = 0;
    player.stimPacks = 0;
    player.pistol = true;
    player.shotgun = false;
    player.grenade = false;

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
		if (player.health >= 100) {
            player.health == 100;
        }
        guiMeter.add(healthChange);
        if (guiMeter.getCurrent() <= 0) {
            //TODO: PLAYER DED
        }
    }

    player.updateStimPacks = function (stimChange) {
        player.stimPacks += stimChange;
        mainState.txtStimQuantity.text = player.stimPacks;
    }

    player.updateHealthPacks = function (packChange) {
        player.healthPacks += packChange;
        mainState.txtHealthQuantity.text = player.healthPacks;
    }

    player.updateTraps = function (trapChange) {
        player.healthPacks += trapChange;
        mainState.txtTrapQuantity.text = player.traps;
    }

    player.updateIncendiary = function (incendiaryChange) {
        player.incendiaryAmmo += incendiaryChange;
        //Update incendiary ammo in UI
    }

    player.updateAlki = function (alkiChange) {
        player.alkiAmmo += alkiChange;
        //Update sonic ammo in UI
    }

    player.updateSonic = function (sonicChange) {
        player.sonicAmmo += sonicChange;
        //Update sonic ammo in UI
    }

    player.updateClip = function (clipChange) {
        player.clipSize += clipChange;
        mainState.txtClipSize.text = player.clipSize;
    }

    player.addShotGun = function () {
        player.shotgun = true;
        //Code UI showing usable shotgun
    }

    player.addGrenadeLauncher = function () {
        player.grenade = true;
        //Code UI showing usable grenade launcher
    }

    player.reloadClip = function () {
        var maxClip;
        if (player.currentWeapon == "pistol") {
            player.clipSize = PISTOL_CLIP;
        }

        if (player.currentWeapon == "shotgun") {
            player.clipSize = SHOTGUN_CLIP;
        }

        if (player.currentWeapon == "grenade") {
            player.clipSize = GRENADE_CLIP;
        }
        mainState.txtClipSize.text = "Remaining Clip: " + player.clipSize;
        startEnemyTurn();
    }
    player.fireWeapon = function () {
        document.getElementById("speed").innerHTML = "fire";
    }
    player.meleeAttack = function () {
        //TODO: Player melees tile in front facing with currently equipped weapon
        document.getElementById("speed").innerHTML = "melee";
    }
}

function pistolClick() {
    player.currentWeapon = "pistol";
    document.getElementById("speed").innerHTML = player.currentWeapon;
    startEnemyTurn();
}

function shotgunClick() {
	if (player.shotgun == true) {
		player.currentWeapon = "shotgun";
		document.getElementById("speed").innerHTML = player.currentWeapon;
		startEnemyTurn();
	}
}

function grenadeClick() {
	if (player.grenade == true) {
		player.currentWeapon = "grenade";
		document.getElementById("speed").innerHTML = player.currentWeapon;
		startEnemyTurn();
	}
}

function incendiaryClick() {
	if (player.incendiary > 0) {
		player.currentAmmo = "incendiary";
		document.getElementById("speed").innerHTML = player.currentAmmo;
	}
}

function alkiClick() {
	if (player.alki > 0) {
		player.currentAmmo = "alki";
		document.getElementById("speed").innerHTML = player.currentAmmo;
	}
}

function sonicClick() {
	if (player.sonic > 0) {
		player.currentAmmo = "sonic";
		document.getElementById("speed").innerHTML = player.currentAmmo;
	}
}

function healthClick() {
    if (player.healthPacks > 0) {
        player.healthPacks--;
        player.updateHealth(50);
        startEnemyTurn();
    }
}

function initGUI() {
    //Initialize all GUI elements
    mainState.guiBG = new Static(scene, 480, 0, 160, 480, "img/ui/guibackground.png");

    mainState.guiPortrait = new Static(scene, 490, 10, 140, 140, "img/ui/portrait.png"); 

    mainState.guiPistol = new Button(scene, 485, 320, 48, 48, pistolClick);
    mainState.guiPistol.setImage("img/ui/pistol.png");

    mainState.guiShotgun = new Button(scene, 585, 320, 48, 48, shotgunClick);
    mainState.guiShotgun.setImage("img/ui/shotgun.png");

    mainState.guiGrenade = new Button(scene, 530, 360, 48, 48, grenadeClick);
    mainState.guiGrenade.setImage("img/ui/grenade.png");

    mainState.guiIncendiary = new Button(scene, 490, 160, 32, 32, incendiaryClick);
    mainState.guiIncendiary.setImage("img/ui/incendiary.png");

    mainState.guiAlki = new Button(scene, 490, 202, 32, 32, alkiClick);
    mainState.guiAlki.setImage("img/ui/alki.png");

    mainState.guiSonic = new Button(scene, 490, 244, 32, 32, sonicClick);
    mainState.guiSonic.setImage("img/ui/sonic.png");

    mainState.guiHealth = new Button(scene, 550, 200, 32, 32, healthClick);
    mainState.guiHealth.setImage("img/ui/health.png");
    //mainState.guiTrap = new Static(scene, 580, 420, 32, 32, "img/ui/trap.png");
    //mainState.guiStim = new Static(scene, 590, 420, 32, 32, "img/ui/stim.png");

    //mainState.guiClip = new Static(scene, 545, 200, 32, 32, "img/ui/clip.png");

    mainState.guiMeter = new Meter(scene, player.health, 600, 160, "#FF0000", 30, 120, DRAIN_DOWN);

    mainState.txtClipSize = new Text(scene, 500, 430, "Remaining Clip: " + player.clipSize, "#000", "bold 15px Arial");
    mainState.txtHealthQuantity = new Text(scene, 560, 235, player.healthPacks, "#000", "bold 15px Arial");
    //mainState.txtTrapQuantity = new Text(scene, 550, 460, player.traps, "#000", "bold 15px Arial");
    //mainState.txtStimQuantity = new Text(scene, 600, 460, player.stimPacks, "#000", "bold 15px Arial");
    mainState.txtIncendiaryQuantity = new Text(scene, 528, 170, player.incendiaryAmmo, "#000", "bold 15px Arial");
    mainState.txtAlkiQuantity = new Text(scene, 528, 212, player.alkiAmmo, "#000", "bold 15px Arial");
    mainState.txtSonicQuantity = new Text(scene, 528, 250, player.sonicAmmo, "#000", "bold 15px Arial");

}

function drawGUI() {
    //Draw all GUI elements to the GUI
    mainState.guiBG.draw();
    mainState.guiPortrait.draw();
	
    mainState.guiPistol.draw();
    if (player.shotgun == true) { mainState.guiShotgun.draw(); }
    if (player.grenade == true) { mainState.guiGrenade.draw(); }
	
    mainState.guiIncendiary.draw();
    mainState.guiAlki.draw();
    mainState.guiSonic.draw();
	
    mainState.guiHealth.draw();
    //mainState.guiTrap.draw();
    //mainState.guiStim.draw();
    //mainState.guiClip.draw();
    mainState.guiMeter.draw();
    mainState.txtClipSize.draw();
    mainState.txtHealthQuantity.draw();
    //mainState.txtTrapQuantity.draw();
    //mainState.txtStimQuantity.draw();
    mainState.txtIncendiaryQuantity.draw();
    mainState.txtAlkiQuantity.draw();
    mainState.txtSonicQuantity.draw();
}

function generateMap() {
    //Function to generate the map the player is in
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
        mainState.playerRotate = true;
    }

    else {
        mainState.playerRotate = false;
    }

    //Check arrow keys for movement.
    if (keysDown[K_LEFT] && mainState.canMove == true) {
        if (!mainState.playerRotate) {
            mainState.canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("left");
        player.setMoveAngle(180);
        if (!mainState.playerRotate) {
            player.updateX(-1);
        }
    }
    else if (keysDown[K_RIGHT] && mainState.canMove == true) {
        if (!mainState.playerRotate) {
            mainState.canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("right");
        player.setMoveAngle(0);
        if (!mainState.playerRotate) {
            player.updateX(1);
        }
    }
    else if (keysDown[K_UP] && mainState.canMove == true) {
        if (!mainState.playerRotate) {
            mainState.canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("up");
        player.setMoveAngle(270);
        if (!mainState.playerRotate) {
            player.updateY(-1);
        }
    }
    else if (keysDown[K_DOWN] && mainState.canMove == true) {
        if (!mainState.playerRotate) {
            mainState.canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("down");
        player.setMoveAngle(90);
        if (!mainState.playerRotate) {
            player.updateY(1);
        }
    }
    //Fire weapon
    else if (keysDown[K_Z]) {
        player.fireWeapon();
    }

    //Melee attack
    else if (keysDown[K_X]) {
        player.meleeAttack();
    }
	
	//Pass player turn
    else if (keysDown[K_SPACE]) {
        startEnemyTurn();
    }

    //Reload currently equipped gun's clip
    else if (keysDown[K_C]) {
        player.reloadClip();
    }

	//TESTING FUNCTION, DEBUG
    else if (keysDown[K_P]) {
        player.updateClip(1);
    }
}

function lockMovement() {
    //Locks the player's movement if he is in motion
    mainState.moveCounter += player.speed;

    //Once the player has moved one tile, stop the player, check the ground under his feet, and start the enenmy's turn
    if (mainState.moveCounter == 36) {
        mainState.moveCounter = 0;
        player.setSpeed(0);
        mainState.canMove = true;
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

function startEnemyTurn() {
    //Controlling all enemies decision making goes here
    mainState.playerTurn = false;
}

function checkGround() {
    //Check player's current tile for events
    //Pick up items on a current tile if item is there
}

function titleUpdate() {
	titleState.titleBG.draw();
	titleState.nextStateBtn.draw();
}

function introUpdate() {
	introState.introBG.draw();
	introState.nextStateBtn.draw();
}

function mainUpdate() {
	/*mainState.mainBG.draw();
	mainState.winStateBtn.draw();
	mainState.loseStateBtn.draw();
	mainState.bossStateBtn.draw();
	mainState.clueStateBtn.draw();*/
	
	checkKeys();
    if (mainState.canMove == false)
        lockMovement();
	
	tileManager.drawMap();

    player.applyPhysics();
    tileManager.checkCollisions(player);
    tileManager.drawMap();
    player.update();
    drawGUI();
}

function warehouseUpdate(){
	warehouseState.warehouseBG.draw();
	warehouseState.nextStateBtn.draw();
}

function clueUpdate() {
	clueState.clueBG.draw();
	clueState.nextStateBtn.draw();
}

function bossUpdate() {
	bossState.bossBG.draw();
	bossState.nextStateBtn.draw();
}

function winUpdate() {
	winState.winBG.draw();
	winState.nextStateBtn.draw();
}

function loseUpdate() {
	loseState.loseBG.draw();
	loseState.nextStateBtn.draw();
}