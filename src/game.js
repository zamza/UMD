﻿///<reference path = "~/lib/simpleGame.js" />

// "Constants.  Change the values of the game here
var PISTOL_CLIP = 12;
var SHOTGUN_CLIP = 6;
var GRENADE_CLIP = 1;

//Globals
var scene;
var tileManager;
var player;

//Booleans
var canMove;
var moveCounter;
var playerRotate;
var playerTurn;

//Game states
var titleState;
var introState;
var mainState;
var clueState;
var bossState;
var winState;

//GUI Image Elements
var guiBG;
var guiPistol;
var guiShotgun;
var guiGrenade;
var guiPortrait;
var guiIncendiary;
var guiAlki;
var guiSonic;
var guiHealth;
var guiStim;
var guiTrap;
var guiMeter;
var guiClip;

//GUI Text Elements
var txtClipSize;
var txtHealthAmount;
var txtHealthQuantity;
var txtTrapQuantity;
var txtStimQuantity;
var txtIncendiaryQuantity;
var txtAlkiQuantity;
var txtSonicQuantity;

function init() {

    canMove = true;
    moveCounter = 0;
    playerTurn = true;

    scene = new Scene();
    scene.setSize(640, 480);
    scene.setPos(100, 100);

    //Add game states
    /*titleState = scene.addState("TitleScreen", titleUpdate);
    introState = scene.addState("IntroScreen", introUpdate);
    mainState = scene.addState("MainGame", mainUpdate);
    clueState = scene.addState("ClueScreen", clueUpdate);
    bossState = scene.addState("BossStoryScreen", bossUpdate);
    winState = scene.addState("WinScreen", winUpdate);*/

    initializePlayer();

    generateMap();

    initGUI();

    scene.camera.followSprite(player, 0, 0);
    scene.start();


}

function update() {
    checkKeys();
    if (canMove == false)
        lockMovement();

    scene.clear();

    tileManager.drawMap();

    player.applyPhysics();
    tileManager.checkCollisions(player);
    tileManager.drawMap();
    player.update();
    drawGUI();
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
        txtStimQuantity.text = player.stimPacks;
    }

    player.updateHealthPacks = function (packChange) {
        player.healthPacks += packChange;
        txtHealthQuantity.text = player.healthPacks;
    }

    player.updateTraps = function (trapChange) {
        player.healthPacks += trapChange;
        txtTrapQuantity.text = player.traps;
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
        txtClipSize.text = player.clipSize;
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
        txtClipSize.text = "Remaining Clip: " + player.clipSize;
        startEnemyTurn();
    }
    player.fireWeapon = function () {
        bullet = new spri
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
    guiBG = new Static(scene, 480, 0, 160, 480, "img/ui/guibackground.png");

    guiPortrait = new Static(scene, 490, 10, 140, 140, "img/ui/portrait.png"); 

    guiPistol = new Button(scene, 485, 320, 48, 48, pistolClick);
    guiPistol.setImage("img/ui/pistol.png");

    guiShotgun = new Button(scene, 585, 320, 48, 48, shotgunClick);
    guiShotgun.setImage("img/ui/shotgun.png");

    guiGrenade = new Button(scene, 530, 360, 48, 48, grenadeClick);
    guiGrenade.setImage("img/ui/grenade.png");

    guiIncendiary = new Button(scene, 490, 160, 32, 32, incendiaryClick);
    guiIncendiary.setImage("img/ui/incendiary.png");

    guiAlki = new Button(scene, 490, 202, 32, 32, alkiClick);
    guiAlki.setImage("img/ui/alki.png");

    guiSonic = new Button(scene, 490, 244, 32, 32, sonicClick);
    guiSonic.setImage("img/ui/sonic.png");

    guiHealth = new Button(scene, 550, 200, 32, 32, healthClick);
    guiHealth.setImage("img/ui/health.png");
    //guiTrap = new Static(scene, 580, 420, 32, 32, "img/ui/trap.png");

    guiMeter = new Meter(scene, player.health, 600, 160, "#FF0000", 30, 120, DRAIN_DOWN);

    txtClipSize = new Text(scene, 500, 430, "Remaining Clip: " + player.clipSize, "#000", "bold 15px Arial");
    txtHealthQuantity = new Text(scene, 560, 235, player.healthPacks, "#000", "bold 15px Arial");
    //txtTrapQuantity = new Text(scene, 550, 460, player.traps, "#000", "bold 15px Arial");
    txtIncendiaryQuantity = new Text(scene, 528, 170, player.incendiaryAmmo, "#000", "bold 15px Arial");
    txtAlkiQuantity = new Text(scene, 528, 212, player.alkiAmmo, "#000", "bold 15px Arial");
    txtSonicQuantity = new Text(scene, 528, 250, player.sonicAmmo, "#000", "bold 15px Arial");

}

function drawGUI() {
    //Draw all GUI elements to the GUI
    guiBG.draw();
    guiPortrait.draw();

    guiPistol.draw();
    if (player.shotgun == true) {
        guiShotgun.draw();
    }
    if (player.grenade == true) {
        guiGrenade.draw();
    }

    guiIncendiary.draw();
    guiAlki.draw();
    guiSonic.draw();
    guiHealth.draw();
    //guiTrap.draw();
    guiMeter.draw();
    txtClipSize.draw();
    txtHealthQuantity.draw();
    //txtTrapQuantity.draw();
    txtIncendiaryQuantity.draw();
    txtAlkiQuantity.draw();
    txtSonicQuantity.draw();
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
        }
    }
    else if (keysDown[K_UP] && canMove == true) {
        if (!playerRotate) {
            canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("up");
        player.setMoveAngle(270);
        if (!playerRotate) {
            player.updateY(-1);
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
    playerTurn = false;
}

function checkGround() {
    //Check player's current tile for events
    //Pick up items on a current tile if item is there
}

function titleUpdate() {

}

function introUpdate() {

}

function mainUpdate() {

}

function clueUpdate() {

}

function bossUpdate() {

}

function winUpdate() {

}