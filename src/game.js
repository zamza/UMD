﻿///<reference path = "~/lib/simpleGame.js" />
///<reference path = "gamevariables.js" />
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
var warehouseMaps;
var warehouseEnemies;
var warehouseItems;
var collisionMap;
var warehouseId;
var tMap;
var doors;

function toIntroState(){ 
	if(!introState){ introState = scene.addState( "Intro", introUpdate, introInit); } 
	else{ scene.setState(introState); }
}
function toTitleState(){ 
	if(!titleState){ titleState = scene.addState( "Title", titleUpdate, titleInit); }
	else{ scene.setState(titleState); }
}
function toWarehouseState(){ 
	if(!warehouseState){ warehouseState = scene.addState( "Warehouse", warehouseUpdate, warehouseInit); }
	else{ scene.setState(warehouseState); }
}
function toMainState(){ 
	if(!mainState){ mainState = scene.addState( "Main", mainUpdate, mainInit); } 
	else{ scene.setState(mainState); }
}
function toBossState(){ 
	if(!bossState){ bossState = scene.addState( "Boss", bossUpdate, bossInit); }
	else{ scene.setState(bossState); }
}
function toClueState(){ 
	if(!clueState){ clueState = scene.addState( "Clue", clueUpdate, clueInit); }
	else{ scene.setState(clueState); }
}
function toWinState(){ 
	if(!winState){ winState = scene.addState( "Win", winUpdate, winInit); }
	else{ scene.setState(winState); }
}
function toLoseState(){ 
	if(!loseState){ loseState = scene.addState( "Lose", loseUpdate, loseInit); }
	else{ scene.setState(loseState); }
}

function warehouseClick(clicked){
	warehouseId = clicked.warehouseId;
	loadWarehouseMap();
	player.placeAt(doors[warehouseId][0], doors[warehouseId][1]);
	toMainState();
}

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
	generateMaps(25);
}

function warehouseInit(){
	//replace this with whatever needs to be initialized for this state.
	warehouseState.warehouseBG = new Static(scene, 0, 0, 640, 480, "img/WarehouseDistrictBG.png"); 
	//warehouseState.nextStateBtn = new Button(scene, 300, 200, 32, 32, toMainState);
	
	warehouseState.warehouse0 = new Button(scene, 64, 19, 49, 40, warehouseClick);//topleft purple
	warehouseState.warehouse0.warehouseId = 0;
	warehouseState.warehouse0.setClickArea();
	warehouseState.warehouse1 = new Button(scene, 204, 21, 49, 40, warehouseClick);//topright purple
	warehouseState.warehouse1.warehouseId = 1;
	warehouseState.warehouse1.setClickArea();
	warehouseState.warehouse2 = new Button(scene, 136, 54, 49, 40, warehouseClick);//center purple
	warehouseState.warehouse2.warehouseId = 2;
	warehouseState.warehouse2.setClickArea();
	warehouseState.warehouse3 = new Button(scene, 38, 92, 49, 40, warehouseClick);//bottomleft purple
	warehouseState.warehouse3.warehouseId = 3;
	warehouseState.warehouse3.setClickArea();
	warehouseState.warehouse4 = new Button(scene, 248, 89, 49, 40, warehouseClick);//bottomright purple
	warehouseState.warehouse4.warehouseId = 4;
	warehouseState.warehouse4.setClickArea();
	warehouseState.warehouse5 = new Button(scene, 440, 19, 49, 40, warehouseClick);//topleft green
	warehouseState.warehouse5.warehouseId = 5;
	warehouseState.warehouse5.setClickArea();
	warehouseState.warehouse6 = new Button(scene, 574, 19, 49, 40, warehouseClick);//topright green
	warehouseState.warehouse6.warehouseId = 6;
	warehouseState.warehouse6.setClickArea();
	warehouseState.warehouse7 = new Button(scene, 347, 63, 49, 40, warehouseClick);//middle green
	warehouseState.warehouse7.warehouseId = 7;
	warehouseState.warehouse7.setClickArea();
	warehouseState.warehouse8 = new Button(scene, 393, 106, 49, 40, warehouseClick);//bottomleft green
	warehouseState.warehouse8.warehouseId = 8;
	warehouseState.warehouse8.setClickArea();
	warehouseState.warehouse9 = new Button(scene, 510, 107, 49, 40, warehouseClick);//bottomright green
	warehouseState.warehouse9.warehouseId = 9;
	warehouseState.warehouse9.setClickArea();
	warehouseState.warehouse10 = new Button(scene, 108, 174, 49, 40, warehouseClick);//topleft pink
	warehouseState.warehouse10.warehouseId = 10;
	warehouseState.warehouse10.setClickArea();
	warehouseState.warehouse11 = new Button(scene, 202, 174, 49, 40, warehouseClick);//topright pink
	warehouseState.warehouse11.warehouseId = 11;
	warehouseState.warehouse11.setClickArea();
	warehouseState.warehouse12 = new Button(scene, 17, 237, 49, 40, warehouseClick);//middle pink
	warehouseState.warehouse12.warehouseId = 12;
	warehouseState.warehouse12.setClickArea();
	warehouseState.warehouse13 = new Button(scene, 137, 270, 49, 40, warehouseClick);//bottomleft pink
	warehouseState.warehouse13.warehouseId = 13;
	warehouseState.warehouse13.setClickArea();
	warehouseState.warehouse14 = new Button(scene, 272, 262, 49, 40, warehouseClick);//bottomright pink
	warehouseState.warehouse14.warehouseId = 14;
	warehouseState.warehouse14.setClickArea();
	warehouseState.warehouse15 = new Button(scene, 397, 176, 49, 40, warehouseClick);//topleft blue
	warehouseState.warehouse15.warehouseId = 15;
	warehouseState.warehouse15.setClickArea();
	warehouseState.warehouse16 = new Button(scene, 551, 189, 49, 40, warehouseClick);//topright blue
	warehouseState.warehouse16.warehouseId = 16;
	warehouseState.warehouse16.setClickArea();
	warehouseState.warehouse17 = new Button(scene, 396, 219, 49, 40, warehouseClick);//middleleft blue
	warehouseState.warehouse17.warehouseId = 17;
	warehouseState.warehouse17.setClickArea();
	warehouseState.warehouse18 = new Button(scene, 551, 245, 49, 40, warehouseClick);//bottomright blue
	warehouseState.warehouse18.warehouseId = 18;
	warehouseState.warehouse18.setClickArea();
	warehouseState.warehouse19 = new Button(scene, 396, 263, 49, 40, warehouseClick);//bottomleft blue
	warehouseState.warehouse19.warehouseId = 19;
	warehouseState.warehouse19.setClickArea();
	warehouseState.warehouse20 = new Button(scene, 211, 334, 49, 40, warehouseClick);//topleft yellow
	warehouseState.warehouse20.warehouseId = 20;
	warehouseState.warehouse20.setClickArea();
	warehouseState.warehouse21 = new Button(scene, 410, 335, 49, 40, warehouseClick);//topright yellow
	warehouseState.warehouse21.warehouseId = 21;
	warehouseState.warehouse21.setClickArea();
	warehouseState.warehouse22 = new Button(scene, 248, 385, 49, 40, warehouseClick);//middleleft yellow
	warehouseState.warehouse22.warehouseId = 22;
	warehouseState.warehouse22.setClickArea();
	warehouseState.warehouse23 = new Button(scene, 359, 386, 49, 40, warehouseClick);//middleright yellow
	warehouseState.warehouse23.warehouseId = 23;
	warehouseState.warehouse23.setClickArea();
	warehouseState.warehouse24 = new Button(scene, 304, 425, 49, 40, warehouseClick);//bottom yellow
	warehouseState.warehouse24.warehouseId = 24;
	warehouseState.warehouse24.setClickArea();
	
	warehouseId = 0;
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
    player = new Sprite(scene, "img/PlayerSpriteSheet1.png", 32, 64);
    player.loadAnimation( 4 * 32, 8 * 64, 32, 64);
    player.generateAnimationCycles();
    cycleNames = new Array("down", "up", "right", "left", "downidle", "upidle", "rightidle", "leftidle" );
	player.setAnimationSpeed(450);
    player.renameCycles(cycleNames);
    player.setSpeed(0);
    player.setPosition(81, 97);
    player.tileX = 2;
    player.tileY = 3;
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
        player.tileX += _x;
    }

    player.updateY = function (_y) {
        //Track player's location, updates y axis tiles
        player.tileY += _y;
    }

	player.placeAt = function (_x, _y) {
		player.tileX = _x;
		player.tileY = _y+1;
		player.setPosition( (_x*tileManager.tileWidth)+1+(player.width/2), (_y*tileManager.tileHeight)+1+(player.height/2) );
	}
	
    player.updateHealth = function (healthChange) {
        player.health += healthChange;
		if (player.health >= 100) {
            player.health == 100;
			mainState.guiMeter.subtract(healthChange + healhChange/2);
        }
        mainState.guiMeter.add(healthChange);
        if (mainState.guiMeter.getCurrent() <= 0) {
			toLoseState();
        }
    }

    player.updateStimPacks = function (stimChange) {
        player.stimPacks += stimChange;
        //mainState.txtStimQuantity.text = player.stimPacks;
    }

    player.updateHealthPacks = function (packChange) {
        player.healthPacks += packChange;
        if (player.healthPacks < 0) {
            player.healthPacks = 0;
        }
        mainState.txtHealthQuantity.text = player.healthPacks;
    }

    player.updateTraps = function (trapChange) {
        player.healthPacks += trapChange;
        //mainState.txtTrapQuantity.text = player.traps;
    }

    player.updateIncendiary = function (incendiaryChange) {
        player.incendiaryAmmo += incendiaryChange;
        if (player.incendiaryAmmo < 0) {
            player.incendiaryAmmo = 0;
        }
        mainState.txtIncendiaryQuantity.text = player.incendiaryAmmo;
    }

    player.updateAlki = function (alkiChange) {
        player.alkiAmmo += alkiChange;
        if (player.alkiAmmo < 0) {
            player.alkiAmmo = 0;
        }
        mainState.txtAlkiQuantity.text = player.alkiAmmo;
    }

    player.updateSonic = function (sonicChange) {
        player.sonicAmmo += sonicChange;
        if (player.sonicAmmo < 0) {
            player.sonicAmmo = 0;
        }
        mainState.txtSonicQuantity.text = player.sonicAmmo;
    }

    player.updateClip = function (clipChange) {
        player.clipSize += clipChange;
        if (player.clipSize < 0) {
            player.clipSize = 0;
            return false;
        }
        mainState.txtClipSize.text = "Remaining Clip: " + player.clipSize;
        return true;
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

        //Get players currently equipped weapon.  If current clip size is equal to the maximum clip, do nothing
        if (player.currentWeapon == "pistol") {
            maxClip = PISTOL_CLIP - player.clipSize;
        }
        else if (player.currentWeapon == "shotgun") {
            maxClip = SHOTGUN_CLIP - player.clipSize;
        }
        else if (player.currentWeapon == "grenade") {
            maxClip = GRENADE_CLIP - player.clipSize;
        }

        if (maxClip == 0) {
            return;
        }

        //Get the currently equipped ammo.  Do nothing if the player has no ammo of that type left.  
        //Otherwise, subtract the amount to give the player the maximum clip size.
        if (player.currentAmmo == "incendiary") {
            if (player.incendiaryAmmo <= 0) {
                return;
            }
            if (maxClip > player.incendiaryAmmo) {
                maxClip = player.incendiaryAmmo;
            }
            player.updateIncendiary(-maxClip);
        }

        if (player.currentAmmo == "alki") {
            if (player.alkiAmmo <= 0) {
                return;
            }
            if (maxClip > player.alkiAmmo) {
                maxClip = player.alkiAmmo;
            }
            player.updateAlki(-maxClip);
        }
        if (player.currentAmmo == "sonic") {
            if (player.sonicAmmo <= 0) {
                return;
            }
            if (maxClip > player.sonicAmmo) {
                maxClip = player.sonicAmmo;
            }
            player.updateSonic(-maxClip);
        }
        //Finally, update the new clip, and pass turn
        player.updateClip(maxClip);
        startEnemyTurn();
    }
    player.fireWeapon = function () {
        if (player.updateClip(-1)) {
        var collisionLocation;
        var range = getRange();
            if (player.currentAmmo == "sonic") {
                var nearTiles = getAdjTiles(player.tileX, player.tileY);
                for (var i = 0; i < nearTiles.length; i++) {
                    if (isSpaceEmpty(nearTiles[i][0], nearTiles[i][1]) != "environment") {
                        //DEAL DAMAGE TO ENEMIES
                    }
                }
            }
        if (player.animation.currentCycleName == "leftidle") {
            if (player.currentWeapon != "shotgun") {
                collisionLocation = fireGun(player.tileX, player.tileY, -1, 0, range);
                if (collisionLocation != null) {

    }
            }
            else if (player.currentWeapon == "shotgun") {
                    spreadShot(player.tileX, player.tileY, -1, 0, range);
            }
        }
        if (player.animation.currentCycleName == "rightidle") {
            if (player.currentWeapon != "shotgun") {
                collisionLocation = fireGun(player.tileX, player.tileY, 1, 0, range);
                if (collisionLocation != null) {

                }
            }
            else if (player.currentWeapon == "shotgun") {
                    spreadShot(player.tileX, player.tileY, 1, 0, range);
            }
        }
        if (player.animation.currentCycleName == "downidle") {
            if (player.currentWeapon != "shotgun") {
                collisionLocation = fireGun(player.tileX, player.tileY, 0, 1, range);
                if (collisionLocation != null) {
                    document.getElementById("speed").innerHTML = player.tileX + " " + collisionLocation;
                }
            }
            else if (player.currentWeapon == "shotgun") {
                    spreadShot(player.tileX, player.tileY, 0, 1, range);
            }
        }
        if (player.animation.currentCycleName == "upidle") {
            if (player.currentWeapon != "shotgun") {
                collisionLocation = fireGun(player.tileX, player.tileY, 0, -1, range);
                if (collisionLocation != null) {
                    document.getElementById("speed").innerHTML = player.tileX + " " + collisionLocation;
                }
            }
            else if (player.currentWeapon == "shotgun") {
                    spreadShot(player.tileX, player.tileY, 0, -1, range);
            }
        }
    }
    }
    player.meleeAttack = function () {
        if (player.animation.currentCycleName == "leftidle") {
            meleeEnemy(player.tileX - 1, player.tileY);
    }
        if (player.animation.currentCycleName == "rightidle") {
            meleeEnemy(player.tileX + 1, player.tileY);
        }
        if (player.animation.currentCycleName == "downidle") {
            meleeEnemy(player.tileX, player.tileY + 1);
        }
        if (player.animation.currentCycleName == "upidle") {
            meleeEnemy(player.tileX, player.tileY - 1);
        }
    }
}

function pistolClick() {
    refundAmmo();
    player.currentWeapon = "pistol";
    player.clipSize = PISTOL_CLIP;
    weaponSwap();
    player.updateClip(0);
    startEnemyTurn();
}

function shotgunClick() {
    if (player.shotgun == true) {
        refundAmmo();
	    player.currentWeapon = "shotgun";
	    player.clipSize = SHOTGUN_CLIP;
	    weaponSwap();
	    player.updateClip(0);
		startEnemyTurn();
	}
}

function grenadeClick() {
    if (player.grenade == true) {
        refundAmmo();
        player.currentWeapon = "grenade";
        player.clipSize = GRENADE_CLIP;
        weaponSwap();
        player.updateClip(0);
		startEnemyTurn();
	}
}

function incendiaryClick() {
    if (player.incendiaryAmmo > 0) {
        player.updateIncendiary(-refundAmmo());
	    player.currentAmmo = "incendiary";
	}
}

function alkiClick() {
    if (player.alkiAmmo > 0) {
        player.updateAlki(-refundAmmo());
	    player.currentAmmo = "alki";
	}
}

function sonicClick() {
    if (player.sonicAmmo > 0) {
        player.updateSonic(-refundAmmo());
        player.currentAmmo = "sonic";
	}
}

function healthClick() {
    if (player.healthPacks > 0) {
        player.healthPacks--;
        player.updateHealth(50);
        startEnemyTurn();
    }
}

function weaponSwap() {
    //When the player swaps weapons, subtract the new clip size
    if (player.currentAmmo == "incendiary") {
        player.updateIncendiary(-player.clipSize);
    }
    if (player.currentAmmo == "alki") {
        player.updateAlki(-player.clipSize);
    }
    if (player.currentAmmo == "sonic") {
        player.updateSonic(-player.clipSize);
    }
}

function refundAmmo() {
    //Refunds the player ammo, used for swapping ammo and weapons
    var newClipSize = player.clipSize;
    if (player.currentAmmo == "incendiary") {
        player.updateIncendiary(newClipSize);
    }
    if (player.currentAmmo == "alki") {
        player.updateAlki(newClipSize);
    }
    if (player.currentAmmo == "sonic") {
        player.updateSonic(newClipSize);
    }
    return newClipSize;
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
	mainState.guiMeter.setFancyMeter("img/ui/Life.png", "img/ui/Tube.png");

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


    if (player.currentWeapon == "pistol") {
        mainState.guiPistol.setImage("img/ui/pistol.png");
    }
    else {
        mainState.guiPistol.setImage("img/ui/pistolOff.png");
    }
    mainState.guiPistol.draw();
    if (player.shotgun == true) {
        if (player.currentWeapon == "shotgun") {
            mainState.guiShotgun.setImage("img/ui/shotgun.png");
        }
        else {
            mainState.guiShotgun.setImage("img/ui/shotgunOff.png");
        }   
        mainState.guiShotgun.draw();
    }

    if (player.grenade == true) {
        if (player.currentWeapon == "grenade") {
            mainState.guiGrenade.setImage("img/ui/grenade.png");
        }
        else {
            mainState.guiGrenade.setImage("img/ui/grenadeOff.png");
        }
        mainState.guiGrenade.draw();
    }
	
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

function pickupHealthPack(itemIndex){
	player.updateHealthPacks(1);
	warehouseItems[warehouseId].splice(itemIndex, 1);
}

function pickupStimPack(itemIndex){
	player.updateStimPacks(1);
	warehouseItems[warehouseId].splice(itemIndex, 1);
}

function pickupAlkiAmmo(itemIndex){
	player.updateAlki(AMMO_UPDATE);
	warehouseItems[warehouseId].splice(itemIndex, 1);
}

function pickupSonicAmmo(itemIndex){
	player.updateSonic(AMMO_UPDATE);
	warehouseItems[warehouseId].splice(itemIndex, 1);
}

function pickupIncendiaryAmmo(itemIndex){
	player.updateIncendiary(AMMO_UPDATE);
	warehouseItems[warehouseId].splice(itemIndex, 1);
}

function pickupGrenadeLauncher(itemIndex){
	player.addGrenadeLauncher();
	warehouseItems[warehouseId].splice(itemIndex, 1);
}

function pickupShotgun(itemIndex){
	player.addShotGun();
	warehouseItems[warehouseId].splice(itemIndex, 1);
}

function pickupTrap(itemIndex){
	player.updateTraps(1);
	warehouseItems[warehouseId].splice(itemIndex, 1);
}

function loadWarehouseMap(){
	tileManager.loadMapData(warehouseMaps[warehouseId]);
    tileManager.loadCollisionMap(collisionMap);
	var tw = tileManager.tileWidth;
	var th = tileManager.tileHeight;
	var iter;
	for(iter = 0; iter < warehouseItems[warehouseId].length; iter++){
		var item = warehouseItems[warehouseId][iter];
		item.setPosition( (item.tileX * tw), (item.tileY * th) );
		if( item.itemName == "stimPack" ){ item.collisionCallback = pickupStimPack; }
		else if( item.itemName == "healthPack" ){ item.collisionCallback = pickupHealthPack; }
		else if( item.itemName == "alkiAmmo" ){ item.collisionCallback = pickupAlkiAmmo; }
		else if( item.itemName == "incendiaryAmmo" ){ item.collisionCallback = pickupIncendiaryAmmo; }
		else if( item.itemName == "sonicAmmo" ){ item.collisionCallback = pickupSonicAmmo; }
		else if( item.itemName == "grenadeLauncher" ){ item.collisionCallback = pickupGrenadeLauncher; }
		else if( item.itemName == "shotgun" ){ item.collisionCallback = pickupShotgun; }
		else if( item.itemName == "trap" ){ item.collisionCallback = pickupTrap; }
	}
	for(iter = 0; iter < warehouseEnemies[warehouseId].length; iter++){
		var enemy = warehouseEnemies[warehouseId][iter];
		enemy.setPosition( (enemy.tileX * tw) - enemy.width/2 + 32, (enemy.tileY * th) - enemy.height/2 + 32);
	}
}

function createEnemy(enemyName, tileX, tileY){
	// "Spewer" "Swarmer" "Psych" "Pyro" "Bruser" "Sharptooth" "Boss"
	var imgsrc = "";
	if( enemyName == "Spewer" ){ imgsrc = "img/Enemies/spewer.png"; }
	else if( enemyName == "Swarmer" ){ imgsrc = "img/Enemies/swarmer.png"; }
	else if( enemyName == "Psych" ){ imgsrc = "img/Enemies/psych.png"; }
	else if( enemyName == "Pyro" ){ imgsrc = "img/Enemies/pyro.png"; }
	else if( enemyName == "Bruser" ){ imgsrc = "img/Enemies/bruser.png"; }
	else if( enemyName == "Sharptooth" ){ imgsrc = "img/Enemies/sharptooth.png"; }
	else if( enemyName == "Boss" ){ imgsrc = "img/Enemies/boss.png"; }
	var tEnemy = new Sprite(scene, imgsrc, 32, 32);
    tEnemy.loadAnimation(256, 256, 32, 32);
    tEnemy.generateAnimationCycles();
    cycleNames = new Array("right", "left", "down", "up", "downidle", "rightidle", "leftidle", "upidle" );
    tEnemy.renameCycles(cycleNames);
	
	tEnemy.tileX = tileX;
	tEnemy.tileY = tileY;
	tEnemy.enemyName = enemyName;
	
	//arbitrary variable values for now
	tEnemy.visibilityRadius = 8;
	tEnemy.intelligence = 1;
	tEnemy.health = 5;
	tEnemy.damage = 1;
	tEnemy.range  = 2;
	
	tEnemy.checkVisibility = function(){
		//grab the information of the area he can see
	}
	
	tEnemy.moveUp = function(){
		//move enemy up
	}
	
	tEnemy.moveDown = function(){
		//move enemy down
	}
	
	tEnemy.moveLeft = function(){
		//move enemy left
	}
	
	tEnemy.moveRight = function(){
		//move enemy right
	}
	
	tEnemy.takeDamage = function(damage){
		tEnemy.health -= damage;
	}
	
	tEnemy.attack = function(){
		//use attack in whatever direction he is facing
	}
	
	tEnemy.chooseMove = function(){
		//here goes the logic for choosing moves
	}
	
	return tEnemy;
}

function createItem(itemName, tileX, tileY){
	// "stimPack" "healthPack" "alkiAmmo" "incendiaryAmmo" "sonicAmmo" "grenadeLauncher" "shotgun" "trap"
	var imgsrc = "";
	if( itemName == "stimPack" ){ imgsrc = "img/Pickups/stim.png"; }
	else if( itemName == "healthPack" ){ imgsrc = "img/Pickups/health.png"; }
	else if( itemName == "alkiAmmo" ){ imgsrc = "img/Pickups/alki.png"; }
	else if( itemName == "incendiaryAmmo" ){ imgsrc = "img/Pickups/incendiary.png"; }
	else if( itemName == "sonicAmmo" ){ imgsrc = "img/Pickups/sonic.png"; }
	else if( itemName == "grenadeLauncher" ){ imgsrc = "img/Pickups/grenade.png"; }
	else if( itemName == "shotgun" ){ imgsrc = "img/Pickups/shotgun.png"; }
	else if( itemName == "trap" ){ imgsrc = "img/Pickups/trap.png"; }
	var tItem = new Static(scene, 0, 0, 32, 32, imgsrc);
	tItem.setCameraRelative();
	tItem.tileX = tileX;
	tItem.tileY = tileY;
	tItem.itemName = itemName;
	return tItem;
}

function placeItem(x, y){
	// "stimPack" "healthPack" "alkiAmmo" "incendiaryAmmo" "sonicAmmo" "grenadeLauncher" "shotgun" "trap"
	var stimChance;
	var healthChance;
	var alkiChance;
	var incendiaryChance;
	var sonicChance;
	var grenadeChance;
	var shotgunChance;
	var trapChance;
	if(warehouseId < 5){
		stimChance = 1/8;
		healthChance = 1/8;
		alkiChance = 1/8;
		incendiaryChance = 1/8;
		sonicChance = 1/8;
		grenadeChance = 1/8;
		shotgunChance = 1/8;
		trapChance = 1/8;
	}//purple
	else if(warehouseId > 4 && warehouseId < 10){
		stimChance = 1/8;
		healthChance = 1/8;
		alkiChance = 1/8;
		incendiaryChance = 1/8;
		sonicChance = 1/8;
		grenadeChance = 1/8;
		shotgunChance = 1/8;
		trapChance = 1/8;
	}//green
	else if(warehouseId > 9 && warehouseId < 15){
		stimChance = 1/8;
		healthChance = 1/8;
		alkiChance = 1/8;
		incendiaryChance = 1/8;
		sonicChance = 1/8;
		grenadeChance = 1/8;
		shotgunChance = 1/8;
		trapChance = 1/8;
	}//pink
	else if(warehouseId > 14 && warehouseId < 20){
		stimChance = 1/8;
		healthChance = 1/8;
		alkiChance = 1/8;
		incendiaryChance = 1/8;
		sonicChance = 1/8;
		grenadeChance = 1/8;
		shotgunChance = 1/8;
		trapChance = 1/8;
	}//blue
	else if(warehouseId > 19 && warehouseId < 25){
		stimChance = 1/8;
		healthChance = 1/8;
		alkiChance = 1/8;
		incendiaryChance = 1/8;
		sonicChance = 1/8;
		grenadeChance = 1/8;
		shotgunChance = 1/8;
		trapChance = 1/8;
	}//yellow
	var thisChance = 0;
	var lastChance = 0;
	var rnd = Math.random();
	thisChance += stimChance;
	if(rnd < thisChance){ warehouseItems[warehouseId].push( createItem("stimPack", x, y) ); }
	lastChance += stimChance;
	thisChance += healthChance;
	if(rnd < thisChance && rnd > lastChance){ warehouseItems[warehouseId].push( createItem("healthPack", x, y) ); }
	lastChance += healthChance;
	thisChance += alkiChance;
	if(rnd < thisChance && rnd > lastChance){ warehouseItems[warehouseId].push( createItem("alkiAmmo", x, y) ); }
	lastChance += alkiChance;
	thisChance += incendiaryChance;
	if(rnd < thisChance && rnd > lastChance){ warehouseItems[warehouseId].push( createItem("incendiaryAmmo", x, y) ); }
	lastChance += incendiaryChance;
	thisChance += sonicChance;
	if(rnd < thisChance && rnd > lastChance){ warehouseItems[warehouseId].push( createItem("sonicAmmo", x, y) ); }
	lastChance += sonicChance;
	thisChance += grenadeChance;
	if(rnd < thisChance && rnd > lastChance){ warehouseItems[warehouseId].push( createItem("grenadeLauncher", x, y) ); }
	lastChance += grenadeChance;
	thisChance += shotgunChance;
	if(rnd < thisChance && rnd > lastChance){ warehouseItems[warehouseId].push( createItem("shotgun", x, y) ); }
	lastChance += shotgunChance;
	thisChance += trapChance;
	if(rnd < thisChance && rnd > lastChance){ warehouseItems[warehouseId].push( createItem("trap", x, y) ); }
}

function placeEnemy(x, y){
	// "Spewer" "Swarmer" "Psych" "Pyro" "Bruser" "Sharptooth" "Boss"
	if(warehouseId < 5){}//purple
	else if(warehouseId > 4 && warehouseId < 10){}//green
	else if(warehouseId > 9 && warehouseId < 15){}//pink
	else if(warehouseId > 14 && warehouseId < 20){}//blue
	else if(warehouseId > 19 && warehouseId < 25){}//yellow
	warehouseEnemies[warehouseId].push( createEnemy("Spewer", x, y) );
}

function placeRackWall(direction, topLeftX, topLeftY, tileLength, numBreaks){
	leftRack = new Array( new Array("rack49", "rack50"), new Array("rack61", "rack62") );
	middleRack = new Array( new Array("rack51", "rack52"), new Array("rack63", "rack64") );
	rightRack = new Array( new Array("rack53", "rack54"), new Array("rack65", "rack66") );
	streightRack = new Array( new Array("rack55", "rack56"), new Array("rack67", "rack68") );
	breaks = new Array();
	for(var c = 0; c < numBreaks; c++){ breaks.push(Math.floor(Math.random()*( tileLength > 6 ? tileLength-6 : tileLength))); }
	breaks.sort(function sortNumber(a,b){	return a - b; } )
	for(var c = 0; c < breaks.length-1; c++){ if( Math.abs(breaks[c] - breaks[c+1]) < 6 ){ breaks.splice(c, 1); } }
	var palletLoc = -1;
	if( Math.random() < 0.25 ){//decide if you should place a pallet, and if so where
		palletLoc = Math.floor(Math.random()*tileLength);
	}
	if(direction == "horizontal"){
		if(top){}
		tMap[topLeftY][topLeftX] = leftRack[0][0];
		tMap[topLeftY+1][topLeftX] = leftRack[1][0];
		tMap[topLeftY][topLeftX+1] = leftRack[0][1];
		tMap[topLeftY+1][topLeftX+1] = leftRack[1][1];
		for(var cnt=2; cnt < tileLength-2; cnt += 2){
			tMap[topLeftY][topLeftX+cnt] = middleRack[0][0];
			tMap[topLeftY+1][topLeftX+cnt] = middleRack[1][0];
			tMap[topLeftY][topLeftX+cnt+1] = middleRack[0][1];
			tMap[topLeftY+1][topLeftX+cnt+1] = middleRack[1][1];
			var r = Math.random();
			if( r < 0.05 ){
				if( r < 0.025 ){ tMap[topLeftY+2][topLeftX+i] = "crate"; }
				else{ tMap[topLeftY+3][topLeftX+i] = "crate"; }
			}
		}
		tMap[topLeftY][topLeftX+tileLength-2] = rightRack[0][0];
		tMap[topLeftY+1][topLeftX+tileLength-2] = rightRack[1][0];
		tMap[topLeftY][topLeftX+tileLength-1] = rightRack[0][1];
		tMap[topLeftY+1][topLeftX+tileLength-1] = rightRack[1][1];
		if(palletLoc != -1){ placePallet(topLeftX + palletLoc, topLeftY+2); }
		for(var c = 0; c < breaks.length; c++){
			tMap[topLeftY][topLeftX+breaks[c]] = rightRack[0][0];
			tMap[topLeftY+1][topLeftX+breaks[c]] = rightRack[1][0];
			tMap[topLeftY][topLeftX+breaks[c]+1] = rightRack[0][1];
			tMap[topLeftY+1][topLeftX+breaks[c]+1] = rightRack[1][1];
			
			tMap[topLeftY][topLeftX+breaks[c]+2] = "cement";
			tMap[topLeftY+1][topLeftX+breaks[c]+2] = "cement";
			tMap[topLeftY][topLeftX+breaks[c]+3] = "cement";
			tMap[topLeftY+1][topLeftX+breaks[c]+3] = "cement";
			
			tMap[topLeftY][topLeftX+breaks[c]+4] = leftRack[0][0];
			tMap[topLeftY+1][topLeftX+breaks[c]+4] = leftRack[1][0];
			tMap[topLeftY][topLeftX+breaks[c]+5] = leftRack[0][1];
			tMap[topLeftY+1][topLeftX+breaks[c]+5] = leftRack[1][1];
		}
	}
	else{//vertical racks
		for(var i=0; i < tileLength; i += 2){
			tMap[topLeftY+i][topLeftX] = streightRack[0][0];
			tMap[topLeftY+i+1][topLeftX] = streightRack[1][0];
			tMap[topLeftY+i][topLeftX+1] = streightRack[0][1];
			tMap[topLeftY+i+1][topLeftX+1] = streightRack[1][1];
			var r2 = Math.random();
			if( r2 < 0.05 ){
				if( r2 < 0.025 ){ tMap[topLeftY+i][topLeftX+2] = "crate"; }
				else{ tMap[topLeftY+i][topLeftX+3] = "crate"; }
			}
		}
		if(palletLoc != -1){ placePallet(topLeftX+2, topLeftY + palletLoc); }
		for(var c = 0; c < breaks.length; c++){
			tMap[topLeftY+breaks[c]][topLeftX] = "cement";
			tMap[topLeftY+1+breaks[c]][topLeftX] = "cement";
			tMap[topLeftY+breaks[c]][topLeftX+1] = "cement";
			tMap[topLeftY+1+breaks[c]][topLeftX+1] = "cement";
		}
	}
}

function placePallet(topLeftX, topLeftY){
	var pallet = new Array( new Array("pallet11", "pallet12"), new Array("pallet23", "pallet24") );
	tMap[topLeftY][topLeftX] = pallet[0][0];
	tMap[topLeftY+1][topLeftX] = pallet[1][0];
	tMap[topLeftY][topLeftX+1] = pallet[0][1];
	tMap[topLeftY+1][topLeftX+1] = pallet[1][1];
}

function makeScatter(rect){
	var barrelChance = 0.4;
	var crateChance = 0.4;
	var acidChance = 0.2;
	var somethingChance = 1/10;
	for(var i = rect.topY; i < rect.topY + rect.height; i++){
		for(var j = rect.leftX; j < rect.leftX + rect.width; j++){
			var tRnd = Math.random();
			if( tRnd < somethingChance){
				tRnd = Math.random();
				if( tRnd <= barrelChance ){tMap[i][j] = "oil";}
				else if( tRnd > barrelChance && tRnd <= barrelChance+crateChance){tMap[i][j] = "crate";}
				else if(tRnd > barrelChance+crateChance){tMap[i][j] = "acid";}
			}
		}
	}
	var tAcidChance = acidChance;
	var aroundAcid = false;
	for(var i = rect.topY+1; i < rect.topY + rect.height-1; i++){//make acid pool together
		for(var j = rect.leftX+1; j < rect.leftX + rect.width-1; j++){
			aroundAcid = false;
			tAcidChance = acidChance;
			if(tMap[i][j+1] == "acid"){ tAcidChance += 0.3; aroundAcid = true; }		
			if(tMap[i][j-1] == "acid"){ tAcidChance += 0.3; aroundAcid = true; }	
			if(tMap[i+1][j] == "acid"){ tAcidChance += 0.3; aroundAcid = true; }	
			if(tMap[i-1][j] == "acid"){ tAcidChance += 0.3; aroundAcid = true; }
			if(aroundAcid){ var tRnd = Math.random();
				if( tRnd < acidChance ){ tMap[i][j] = "acid"; }
			}
		}
	}
}

function makeAisles( rect ){
	var dir = Math.random() < 0.5 ? "vertical" : "horizontal";
	var offset = Math.floor(Math.random()*4);
	if( dir == "horizontal" ){
		for(var i = rect.topY; i < rect.topY + rect.height; i++){
			var numBreaks = 1 + Math.floor( Math.random()*(tMap[0].length/20) );
			if( ((i+offset)-rect.topY)%4 == 0 && i < tMap.length - 5){ placeRackWall("horizontal", rect.leftX, i, rect.width-1, numBreaks); }
		}
	}
	else{
		var numBreaks = Math.floor( Math.random()*(tMap.length/20) );
		for(var j = rect.leftX; j < rect.leftX + rect.width; j++){
			var numBreaks = 1 + Math.floor( Math.random()*(tMap.length/40) );
			var  mod = 1;
			if( rect.topY + rect.height > tMap.length - 4){ mod = 3; }
			if( ((j+offset)-rect.leftX)%4 == 0 ){ placeRackWall("vertical", j, rect.topY, rect.height-mod, numBreaks); }
		}
	}
}

function placeWalls(){
	topLeftCorner = new Array( new Array( "wall3", "wall4" ), new Array( "wall1", "wall16" ) );
	topMiddlePiece = new Array( new Array("wall5"), new Array("wall18") );
	topRightCorner = new Array( new Array("wall7", "wall8"), new Array("wall19","wall20") );
	leftMiddlePiece = new Array( "wall1", "wall2" );
	bottomLeftCorner = new Array( new Array("wall25", "wall26"), new Array("wall37", "wall38") );
	bottomMiddlePiece = new Array( new Array("wall26"), new Array("wall39") );
	bottomRightCorner = new Array( new Array("wall33","wall34"), new Array("wall45","wall46") );
	rightMiddlePiece = new Array( "wall9", "wall10" );
	doorPiece = new Array( new Array("door27", "door28", "door29", "door30"), new Array("wall39", "door40", "door41", "door42") );
	
	doorX = 2 + Math.floor( Math.random()*( tMap[0].length - 3) )
		
	for(var i = 0; i < topLeftCorner.length; i++){
		for(j = 0; j < topLeftCorner[0].length; j++){
			tMap[i][j] = topLeftCorner[i][j];
			tMap[(tMap.length - 2) +j ][i] = bottomLeftCorner[j][i];
		}
	}
	for(var i = 2; i < (tMap[0].length - 2); i++){	
		//gen topMiddle
		tMap[0][i] = topMiddlePiece[0][0];
		tMap[1][i] = topMiddlePiece[1][0];
		tMap[tMap.length - 2][i] = bottomMiddlePiece[0][0];
		tMap[tMap.length - 1][i] = bottomMiddlePiece[1][0];
		if(i-doorX >= 0 && i-doorX < 4){
			doors[warehouseId] = new Array(i-1, tMap.length - 4);
			tMap[tMap.length - 2][i] = doorPiece[0][i-doorX];
			tMap[tMap.length - 1][i] = doorPiece[1][i-doorX];
		}
	}
	for(var i = 2; i < (tMap.length - 2); i++){	
		//gen leftPiece
		tMap[i][0] = leftMiddlePiece[0];
		tMap[i][1] = leftMiddlePiece[1];
		//gen rightPiece
		tMap[i][(tMap[0].length - 3)] = rightMiddlePiece[0];
		tMap[i][(tMap[0].length - 2)] = rightMiddlePiece[1];
	}
	for(var i = (tMap[0].length - 2); i < tMap[0].length; i++){
		tMap[0][i] = topRightCorner[0][i - (tMap[0].length - 2)];
		tMap[1][i] = topRightCorner[1][i - (tMap[0].length - 2)];
		tMap[(tMap.length - 2)][i] = bottomRightCorner[0][i - (tMap[0].length - 2)];
		tMap[(tMap.length - 1)][i] = bottomRightCorner[1][i - (tMap[0].length - 2)];
	}
}

function testWarehouse(){
var tileMap = new Array( new Array( "wall3", "wall4", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall5", "wall7", "wall8"), 
new Array( "wall1", "wall16", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall18", "wall19", "wall20"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "crate", "cement", "cement", "cement", "cement", "acid", "acid", "acid", "cement", "acid", "acid", "acid", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "acid", "oil", "acid", "cement", "acid", "oil", "acid", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "rack49", "rack50", "rack51", "rack52", "rack53", "rack54", "cement", "cement", "cement", "cement", "cement", "oil", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "acid", "acid", "cement", "cement", "cement", "acid", "acid", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "rack61", "rack62", "rack63", "rack64", "rack65", "rack66", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "acid", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "crate", "cement", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "rack55", "rack56", "cement", "cement", "cement", "cement", "cement", "cement", "acid", "acid", "acid", "cement", "cement", "cement", "cement", "cement", "acid", "acid", "cement", "cement", "cement", "acid", "acid", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "rack67", "rack68", "cement", "cement", "cement", "cement", "cement", "cement", "acid", "acid", "acid", "cement", "cement", "cement", "cement", "cement", "acid", "oil", "acid", "cement", "acid", "oil", "acid", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "rack55", "rack56", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "acid", "cement", "cement", "cement", "cement", "cement", "cement", "acid", "acid", "acid", "cement", "acid", "acid", "acid", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "rack67", "rack68", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "pallet11", "pallet12", "cement", "cement", "cement", "cement", "oil", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "pallet23", "pallet24", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "rack49", "rack50", "rack51", "rack52", "rack51", "rack52", "rack51", "rack52", "rack51", "rack52", "rack53", "rack54", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "acid", "acid", "cement", "cement", "cement", "crate", "crate", "wall9", "wall10"), 
new Array( "wall1", "wall2", "rack61", "rack62", "rack63", "rack64", "rack63", "rack64", "rack63", "rack64", "rack63", "rack64", "rack65", "rack66", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "acid", "acid", "acid", "acid", "acid", "acid", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "acid", "acid", "acid", "acid", "acid", "acid", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "acid", "acid", "cement", "acid", "acid", "cement", "crate", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "rack49", "rack50", "rack51", "rack52", "rack53", "rack54", "cement", "cement", "rack49", "rack50", "rack53", "rack54", "cement", "cement", "crate", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "rack61", "rack62", "rack63", "rack64", "rack65", "rack66", "cement", "cement", "rack61", "rack62", "rack65", "rack66", "crate", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "crate", "crate", "cement", "crate", "cement", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "oil", "cement", "cement", "cement", "crate", "cement", "cement", "cement", "cement", "cement", "cement", "oil", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "oil", "cement", "crate", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "oil", "oil", "oil", "oil", "oil", "cement", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "oil", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "crate", "cement", "cement", "cement", "oil", "oil", "cement", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "crate", "crate", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "crate", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "pallet11", "pallet12", "cement", "cement", "wall9", "wall10"), 
new Array( "wall1", "wall2", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "cement", "pallet23", "pallet24", "cement", "cement", "wall9", "wall10"), 
new Array( "wall25", "wall26", "wall26", "wall26", "wall26", "wall26", "wall26", "wall26", "wall26", "wall26", "wall26", "wall26", "wall26", "wall26", "wall33", "wall33", "wall33", "door27", "door28", "door29", "door30", "wall33", "wall33", "wall33", "wall33", "wall33", "wall33", "wall33", "wall33", "wall33", "wall33", "wall34"), 
new Array( "wall37", "wall38", "wall39", "wall39", "wall39", "wall39", "wall39", "wall39", "wall39", "wall39", "wall39", "wall39", "wall39", "wall39", "wall39", "wall39", "wall39", "wall39", "door40", "door41", "door42", "wall39", "wall39", "wall39", "wall39", "wall39", "wall39", "wall39", "wall39", "wall39", "wall45", "wall46") );
	
	collisionMap = new Array( );
	warehouseItems[0] = new Array();
	warehouseEnemies[0] = new Array();
	warehouseMaps[0] = tileMap;
	warehouseItems[0].push( createItem("healthPack", 10, 11) );
	warehouseItems[0].push( createItem("grenadeLauncher", 10, 13) );
	warehouseItems[0].push( createItem("shotgun", 12, 11) );
	warehouseItems[0].push( createItem("alkiAmmo", 8, 11) );
	warehouseItems[0].push( createItem("incendiaryAmmo", 10, 9) );
	warehouseItems[0].push( createItem("sonicAmmo", 8, 8) );
	warehouseItems[0].push( createItem("stimPack", 13, 12) );
	warehouseItems[0].push( createItem("trap", 12, 8) );
	warehouseEnemies[0].push( createEnemy("Spewer", 10, 3) );
	doors[0] = new Array(18, 29);
}

function breakSpace(){
	var avgDivDistance = 50;
	var verticalDivs =  Math.floor( (tMap[0].length)/avgDivDistance );
	var horizontalDivs = Math.floor( (tMap.length)/avgDivDistance );
	var xValues = new Array();
	var yValues = new Array();
	for(var i = 0; i < verticalDivs; i++){ xValues[i] = 2 + Math.floor(Math.random()*(tMap[0].length-4)); }
	for(var i = 0; i < horizontalDivs; i++){ yValues[i] = 2 + Math.floor(Math.random()*(tMap.length-4)); }
	var xlen = xValues.length;
	var ylen = yValues.length;
	xValues.push(tMap[0].length-2);
	yValues.push(tMap.length-2);
	for(var i = 0; i < xlen; i++){ for(j = i+1; j < xlen; j++){ if(Math.abs(xValues[i] - xValues[j]) < 6){xValues.splice(i, 1);} } }
	for(var i = 0; i < ylen; i++){ for(j = i+1; j < ylen; j++){ if(Math.abs(yValues[i] - yValues[j]) < 6){yValues.splice(i, 1); } } }
	xValues.sort(function sortNumber(a,b){	return a - b; } )
	yValues.sort(function sortNumber(a,b){	return a - b; } )
	var rects = new Array();
	var tl = 2; var tr = 2;
	for(var i = 0; i < yValues.length; i++){
		tl = 2;
		var mod2 = 0;
		for(var j = 0; j < xValues.length; j++){
			var mod1 = 0;
			if(j == xValues.length-1){mod1 = 2;}
			if(j == yValues.length-1){mod2 = 2;}
			rects.push(new Rectangle(tl, tr, xValues[j]-tl-mod1, yValues[i]-tr-mod2));
			tl = xValues[j];
		}
		tr = yValues[i];
	}
	rects.sort(function sortRectangles(r1,r2){	return r1.width*r1.height - r2.width*r2.height; });
	return rects;
}

function generateItemsAndEnemies(){
	var percentOccupied = 0.01;
	var percentEnemies = 0.2;
	var percentItems = 0.8;
	for(var i = 0; i < tMap.length; i++){
		for(var l = 0; l < tMap[0].length; l++){
			var abbrv = tMap[i][l].substring(0, 2);
			if( abbrv == "ce" || abbrv == "ac"){
				var rnd = Math.random();
				if( rnd < percentOccupied ){
					rnd = Math.random();
					if( rnd < percentEnemies ){ placeEnemy(l, i); }
					else{ placeItem(l, i); }
				}
			}
		}
	}
}

function generateWarehouse(){
	tMap = new Array();
	
	// min/max width and height of each warehouse in tiles
	var min = 50;
	var max = 150;
	
	var width = min + Math.floor(Math.random()*( (max-min)+1 ));
	var height = min + Math.floor(Math.random()*( (max-min)+1 ));
	
	for(var j = 0; j < height; j++){
		tMap.push( new Array() );
		for(var k = 0; k < width; k++){
			tMap[j][k] = "cement";
		}
	}
	placeWalls();
	var areas = breakSpace();
	//makeAisles(new Rectangle(2, 2, tMap[0].length-4, tMap.length-4));
	for(var poop=0; poop < areas.length; poop++){
		if( Math.random() > 0.6 ){ makeScatter(areas[poop]); }
		else{ makeAisles(areas[poop]); }
	}
	generateItemsAndEnemies();
	warehouseMaps[warehouseId] = tMap;
}

function generateMaps(numWarehouses) {
    //Function to generate the map the player is in
	warehouseMaps = new Array();
	warehouseItems = new Array();
	warehouseEnemies = new Array();
	doors = new Array();
	tileSymbols = new Array(
		"wall1", "wall2", "wall3", "wall4", "wall5", "6", "wall7", "wall8", "wall9", "wall10", "pallet11", "pallet12", "13", "14", "15", "wall16", "17", "wall18", "wall19", "wall20",
		"21", "22", "pallet23", "pallet24", "wall25", "wall26", "door27", "door28", "door29", "door30", "31", "32", "wall33", "wall34", "crate", "acid", "wall37", "wall38", "wall39", "door40",
		"door41", "door42", "43", "44", "wall45", "wall46", "oil", "cement", "rack49", "rack50", "rack51", "rack52", "rack53", "rack54", "rack55", "rack56", "57", "58", "59", "60",
		"rack61", "rack62", "rack63", "rack64", "rack65", "rack66", "rack67", "rack68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80"
	);
	tileManager = new TileMap(scene);
    tileManager.loadTileSheet(32, 32, 384, 384, "img/EnvironmentTiles.png", tileSymbols);
	for(var i = 0; i < numWarehouses; i++){
		warehouseId = i;
		warehouseItems[i] = new Array();
		warehouseEnemies[i] = new Array();
		if(i == 0){ testWarehouse(); }
		else{ generateWarehouse(); }
	}
	warehouseId = 0;
}

function meleeEnemy(_x, _y) {
    for (var i = 0; i < warehouseEnemies.length; i++) {
        if (warehouseEnemies[i].tileX == _x) {
            if (warehouseEnemies[i].tileY == _y) {
                warehouseEnemies[i].health -= PLAYER_MELEE_DAMAGE;
                if (warehouseEnemies[i].health <= 0) {
                    document.getElementById("speed").innerHTML = "DED";
                }
            }
        }
    }
}

function getAdjTiles(_x, _y) {
    var adjTiles = new Array(8);
    var iter = 0;
    for (var i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) {
                continue;
            }
            adjTiles[iter] = new Array(2);
            adjTiles[iter][0] = (_x + i);
            adjTiles[iter][1] = (_y + j);
            iter++;
        }
    }
    return adjTiles;
}

function getRange() {
    if (player.currentWeapon == "pistol") {
        return PISTOL_RANGE;
    }
    else if (player.currentWeapon == "shotgun") {
        return SHOTGUN_RANGE;
    }
    else if (player.currentWeapon == "grenade") {
        return GRENADE_RANGE;
    }
}

function fireGun(_x, _y, xdir, ydir, maxRange) {
    if (xdir != 0) {
        while (maxRange > 0) {
            _x += xdir;
            maxRange--;
            var checkSpace = isSpaceEmpty(_x, _y);
            if (checkSpace) {
                if (player.currentAmmo == "incendiary") {
                    if (checkSpace == "environment") {
                        _x -= xdir;
                    }
                    //TODO: CHANGE TO FIRE
                    tileManager.changeTileType(_x, _y, "acid");
                }
                if (player.currentWeapon == "grenade") {
                    var nearTiles = getAdjTiles(_x, _y);
                    for (var i = 0; i < nearTiles.length; i++) {
                        if (!isSpaceEmpty(nearTiles[i][0], nearTiles[i][1])) {
                            tileManager.changeTileType(nearTiles[i][0], nearTiles[i][1], "acid");
                        }
                    }
                }
                        return _x;
                    }
            
            if (player.currentAmmo == "alki") {
                tileManager.changeTileType(_x, _y, "acid");
                }
            }
        if (player.currentAmmo == "incendiary") {
            //TODO: CHANGE TO FIRE
            tileManager.changeTileType(_x, _y, "acid");
        }
        if (player.currentWeapon == "grenade") {
            var nearTiles = getAdjTiles(_x, _y);
            for (var i = 0; i < nearTiles.length; i++) {
                if (!isSpaceEmpty(nearTiles[i][0], nearTiles[i][1])) {
                    //CHECK FOR ENEMY, DAMAGE THEM
                }
            }
        }
        return _x;
    }

    else if (ydir != 0) {
        while (maxRange > 0) {
            _y += ydir;
            maxRange--;
            var checkSpace = isSpaceEmpty(_x, _y);
            if (checkSpace) {
                if (player.currentAmmo == "incendiary") {
                    if (checkSpace == "environment") {
                        _y -= ydir;
                    }
                    //TODO: CHANGE TO FIRE
                    tileManager.changeTileType(_x, _y, "acid");
                }
                if (player.currentWeapon == "grenade") {
                    var nearTiles = getAdjTiles(_x, _y);
                    for (var i = 0; i < nearTiles.length; i++) {
                        if (!isSpaceEmpty(nearTiles[i][0], nearTiles[i][1])) {
                            tileManager.changeTileType(nearTiles[i][0], nearTiles[i][1], "acid");
                        }
                    }
                }
                        return _y;
                    }
            if (player.currentAmmo == "alki") {
                tileManager.changeTileType(_x, _y, "acid");
                }
            }
        if (player.currentAmmo == "incendiary") {
        //TODO: CHANGE TO FIRE
            tileManager.changeTileType(_x, _y, "acid");
        }
        if (player.currentWeapon == "grenade") {
            var nearTiles = getAdjTiles(_x, _y);
            for (var i = 0; i < nearTiles.length; i++) {
                if (!isSpaceEmpty(nearTiles[i][0], nearTiles[i][1])) {
                    //CHECK FOR ENEMY, DAMAGE THEM
                }
            }
        }
        return _y;
    }
}

function spreadShot(_x, _y, xdir, ydir, maxRange) {
    if (xdir != 0) {
        for (i = 1; i <= maxRange; i++) {
            for (j = -i; j <= i; j++) {
                var checkX = _x + (i * xdir);
                var checkY = _y + j;
                var checkSpace = isSpaceEmpty(checkX, checkY);
                if (checkSpace == "enemy")
                {
                        //TODO: FIND ENEMY AND DAMAGE HIM
                }
                if (checkSpace != "environment") {
                    if (player.currentAmmo == "alki") {
                        tileManager.changeTileType(checkX, checkY, "acid");
                    }
                    if (player.currentAmmo == "incendiary") {
                        //TODO: LEAVE FIRE
                    }        
                }  
                //DON"T LET BULLETS THROUGH WALLS
            }
        }
    }

    else if (ydir != 0) {
        for (i = 1; i <= maxRange; i++) {
            for (j = -i; j <= i; j++) {
                var checkX = _x + j;
                var checkY = _y + (i * ydir);
                var checkSpace = isSpaceEmpty(checkX, checkY);
                if (checkSpace == "enemy")
                {
                    //TODO: FIND ENEMY AND DAMAGE HIM
                }
                if (checkSpace != "environment") {
                    if (player.currentAmmo == "alki") {
                        tileManager.changeTileType(checkX, checkY, "acid");
                    }
                    if (player.currentAmmo == "indendiary") {
                        //TODO: LEAVE FIRE
                    }      
                }
                //DON"T LET BULLETS THROUGH WALLS
            }
        }
    }
}

function getEnemyAt(_x, _y) {
    for (var i = 0; i < warehouseEnemies.length; i++) {
        if (warehouseEnemies[i].tileX == _x) {
            if (warehouseEnemies[i].tileY == _y) {
                return "enemy";
            }
        }
    }
}

function isSpaceEmpty(_x, _y) {
    //Checks the space in front of the player.  Returns true if the player can step there, false if the space is occupied.

    //Check for enemy.  If true, return the position in the array where the enemy is
    for (var i = 0; i < warehouseEnemies[warehouseId].length; i++) {
        if (warehouseEnemies[warehouseId][i].tileX == _x) {
            if (warehouseEnemies[warehouseId][i].tileY == _y) {
                return "enemy";
            }
        }
    }
	var tileType = tileManager.getTileSymbol( _x, _y );
	var superType = tileType.substring(0, 4);// can be wall, door, rack, or pall
	//document.getElementById("speed").innerHTML = tileType;
	if( tileType != "cement" && tileType != "acid" && superType != "door" ){
		return "environment";
	}

    if (tileType == "acid") {
        return "acid";
	}
	
	if( superType == "door" ){
		toWarehouseState();
	}
	
    return false;
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
        var checkSpace = isSpaceEmpty(player.tileX - 1, player.tileY);

        if (!mainState.playerRotate) {
            mainState.canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("left");

        if (checkSpace != "environment" && checkSpace != "enemy") {
            //player.setMoveAngle(180);
            player.setChangeX(-4);
            if (!mainState.playerRotate) {
                player.updateX(-1);
            }
        }
        if (checkSpace == "acid")
            player.updateHealth(-ACID_DAMAGE);
    }
    else if (keysDown[K_RIGHT] && mainState.canMove == true) {
        var checkSpace = isSpaceEmpty(player.tileX + 1, player.tileY);
        if (!mainState.playerRotate) {
            mainState.canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("right");
        if (checkSpace != "environment" && checkSpace != "enemy") {
            //player.setMoveAngle(0);
            player.setChangeX(4);
            if (!mainState.playerRotate) {
                player.updateX(1);
            }
        }
        if (checkSpace == "acid")
            player.updateHealth(-ACID_DAMAGE);
    }
    else if (keysDown[K_UP] && mainState.canMove == true) {
        var checkSpace = isSpaceEmpty(player.tileX, player.tileY - 1);
        if (!mainState.playerRotate) {
            mainState.canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("up");
        if (checkSpace != "environment" && checkSpace != "enemy") {
            //player.setMoveAngle(270);
            player.setChangeY(-4);
            if (!mainState.playerRotate) {
                player.updateY(-1);
            }
        }
        if (checkSpace == "acid")
            player.updateHealth(-ACID_DAMAGE);
    }
    else if (keysDown[K_DOWN] && mainState.canMove == true) {
        var checkSpace = isSpaceEmpty(player.tileX, player.tileY + 1);
        if (!mainState.playerRotate) {
            mainState.canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("down");
        if (checkSpace != "environment" && checkSpace != "enemy") {
            //player.setMoveAngle(90);
            player.setChangeY(4);
            if (!mainState.playerRotate) {
                player.updateY(1);
            }
        }
        if (checkSpace == "acid")
            player.updateHealth(-ACID_DAMAGE);
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
    player.updateClip(-1);
    }
}

function lockMovement() {
    //Locks the player's movement if he is in motion
    mainState.moveCounter += player.speed;

    //Once the player has moved one tile, stop the player, check the ground under his feet, and start the enenmy's turn
    if (mainState.moveCounter == 36	) {
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
    //tileManager.checkCollisions(player);
	var iter;
	for(iter = 0; iter < warehouseItems[warehouseId].length; iter++){ 
		warehouseItems[warehouseId][iter].draw(); 
		if(player.tileX == warehouseItems[warehouseId][iter].tileX && player.tileY == warehouseItems[warehouseId][iter].tileY )
			{ warehouseItems[warehouseId][iter].collisionCallback(iter); }
	}
	for(iter = 0; iter < warehouseEnemies[warehouseId].length; iter++){ warehouseEnemies[warehouseId][iter].update(); }
	player.update();
	//player.updateHealth(-1);
    drawGUI();
	//document.getElementById("speed").innerHTML = "X: " + player.tileX + " Y: " + player.tileY;
}

function warehouseUpdate(){
	warehouseState.warehouseBG.draw();
	//warehouseState.nextStateBtn.draw();
	
	warehouseState.warehouse0.draw();
	warehouseState.warehouse1.draw();
	warehouseState.warehouse2.draw();
	warehouseState.warehouse3.draw();
	warehouseState.warehouse4.draw();
	warehouseState.warehouse5.draw();
	warehouseState.warehouse6.draw();
	warehouseState.warehouse7.draw();
	warehouseState.warehouse8.draw();
	warehouseState.warehouse9.draw();
	warehouseState.warehouse10.draw();
	warehouseState.warehouse11.draw();
	warehouseState.warehouse12.draw();
	warehouseState.warehouse13.draw();
	warehouseState.warehouse14.draw();
	warehouseState.warehouse15.draw();
	warehouseState.warehouse16.draw();
	warehouseState.warehouse17.draw();
	warehouseState.warehouse18.draw();
	warehouseState.warehouse19.draw();
	warehouseState.warehouse20.draw();
	warehouseState.warehouse21.draw();
	warehouseState.warehouse22.draw();
	warehouseState.warehouse23.draw();
	warehouseState.warehouse24.draw();
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