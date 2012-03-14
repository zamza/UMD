///<reference path = "~/lib/simpleGame.js" />
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
	loadWarehouseMap();
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
    player.setPosition(49, 97);
    player.tileX = 1;
    player.tileY = 2;
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

    player.updateHealth = function (healthChange) {
        player.health += healthChange;
		if (player.health >= 100) {
            player.health == 100;
        }
        guiMeter.add(healthChange);
        if (guiMeter.getCurrent() <= 0) {
			toLoseState();
            //TODO: PLAYER DED
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
        }
        mainState.txtClipSize.text = "Remaining Clip: " + player.clipSize;
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
        document.getElementById("speed").innerHTML = "fire";
    }
    player.meleeAttack = function () {
        //TODO: Player melees tile in front facing with currently equipped weapon
        document.getElementById("speed").innerHTML = "melee";
    }
}

function pistolClick() {
    refundAmmo();
    player.currentWeapon = "pistol";
    player.clipSize = PISTOL_CLIP;
    weaponSwap();
    player.updateClip(0);
    document.getElementById("speed").innerHTML = player.currentWeapon;
    startEnemyTurn();
}

function shotgunClick() {
    if (player.shotgun == true) {
        refundAmmo();
	    player.currentWeapon = "shotgun";
	    player.clipSize = SHOTGUN_CLIP;
	    weaponSwap();
	    player.updateClip(0);
		document.getElementById("speed").innerHTML = player.currentWeapon;
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
		document.getElementById("speed").innerHTML = player.currentWeapon;
		startEnemyTurn();
	}
}

function incendiaryClick() {
    if (player.incendiaryAmmo > 0) {
        player.updateIncendiary(-refundAmmo());
	    player.currentAmmo = "incendiary";
		document.getElementById("speed").innerHTML = player.currentAmmo;
	}
}

function alkiClick() {
    if (player.alkiAmmo > 0) {
        player.updateAlki(-refundAmmo());
	    player.currentAmmo = "alki";
		document.getElementById("speed").innerHTML = player.currentAmmo;
	}
}

function sonicClick() {
    if (player.sonicAmmo > 0) {
        player.updateSonic(-refundAmmo());
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

    mainState.guiMeter = new Meter(scene, player.health, 600, 160, "#FF0000", 30, 120, DRAIN_DOWN, "img/ui/meter.png");

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
	warehouseItems.splice(itemIndex, 1);
}

function pickupStimPack(itemIndex){
	player.updateStimPacks(1);
	warehouseItems.splice(itemIndex, 1);
}

function pickupAlkiAmmo(itemIndex){
	player.updateAlki(AMMO_UPDATE);
	warehouseItems.splice(itemIndex, 1);
}

function pickupSonicAmmo(itemIndex){
	player.updateSonic(AMMO_UPDATE);
	warehouseItems.splice(itemIndex, 1);
}

function pickupIncendiaryAmmo(itemIndex){
	player.updateIncendiary(AMMO_UPDATE);
	warehouseItems.splice(itemIndex, 1);
}

function pickupGrenadeLauncher(itemIndex){
	player.addGrenadeLauncher();
	warehouseItems.splice(itemIndex, 1);
}

function pickupShotgun(itemIndex){
	player.addShotGun();
	warehouseItems.splice(itemIndex, 1);
}

function pickupTrap(itemIndex){
	player.updateTraps(1);
	warehouseItems.splice(itemIndex, 1);
}

function loadWarehouseMap(){
	tileManager.loadMapData(warehouseMaps[warehouseId]);
    tileManager.loadCollisionMap(collisionMap);
	var tw = tileManager.tileWidth;
	var th = tileManager.tileHeight;
	var iter;
	for(iter = 0; iter < warehouseItems.length; iter++){
		var item = warehouseItems[iter];
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
	for(iter = 0; iter < warehouseEnemies.length; iter++){
		var enemy = warehouseEnemies[iter];
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

function generateMap() {
    //Function to generate the map the player is in
	warehouseMaps = new Array();
	warehouseItems = new Array();
	warehouseEnemies = new Array();
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
	
	collisionMap = new Array( new Array("2", tileCollision) );
	
	warehouseMaps[0] = tileMap;
	warehouseItems.push( createItem("healthPack", 10, 11) );
	warehouseItems.push( createItem("grenadeLauncher", 10, 13) );
	warehouseItems.push( createItem("shotgun", 12, 11) );
	warehouseItems.push( createItem("alkiAmmo", 8, 11) );
	warehouseItems.push( createItem("incendiaryAmmo", 10, 9) );
	warehouseItems.push( createItem("sonicAmmo", 8, 8) );
	warehouseItems.push( createItem("stimPack", 12, 12) );
	warehouseItems.push( createItem("trap", 12, 8) );
	warehouseEnemies.push( createEnemy("Spewer", 10, 3) );
	tileManager = new TileMap(scene);
    tileManager.loadTileSheet(32, 32, 320, 320, "img/TileSet.png", tileSymbols);
}

function isSpaceEmpty(_x, _y) {
    //Checks the space in front of the player.  Returns true if the player can step there, false if the space is occupied.  
    for (var i = 0; i < warehouseEnemies.length; i++) {
        //alert(warehouseEnemies[i].tileX + " " + warehouseEnemies[i].tileY + " / " + player.tileX + " " + player.tileY);
        if (warehouseEnemies[i].tileX == _x) {
            if (warehouseEnemies[i].tileY == _y) {
                document.getElementById("speed").innerHTML = "false";
                return false;
            }
        }
    }
    document.getElementById("speed").innerHTML = "true";
    return true;
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
        if (isSpaceEmpty(player.tileX - 1, player.tileY)) {
            //player.setMoveAngle(180);
            player.setChangeX(-4);
            if (!mainState.playerRotate) {
                player.updateX(-1);
            }
        }
    }
    else if (keysDown[K_RIGHT] && mainState.canMove == true) {
        if (!mainState.playerRotate) {
            mainState.canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("right");
        if (isSpaceEmpty(player.tileX + 1, player.tileY)) {
            //player.setMoveAngle(0);
            player.setChangeX(4);
            if (!mainState.playerRotate) {
                player.updateX(1);
            }
        }
    }
    else if (keysDown[K_UP] && mainState.canMove == true) {
        if (!mainState.playerRotate) {
            mainState.canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("up");
        if (isSpaceEmpty(player.tileX, player.tileY - 1)) {
            //player.setMoveAngle(270);
            player.setChangeY(-4);
            if (!mainState.playerRotate) {
                player.updateY(-1);
            }
        }
    }
    else if (keysDown[K_DOWN] && mainState.canMove == true) {
        if (!mainState.playerRotate) {
            mainState.canMove = false;
            player.speed = 4;
        }
        player.setCurrentCycle("down");
        if (isSpaceEmpty(player.tileX, player.tileY + 1)) {
            //player.setMoveAngle(90);
            player.setChangeY(4);
            if (!mainState.playerRotate) {
                player.updateY(1);
            }
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
    player.updateClip(-1);
    }
}

function lockMovement() {//TODO: Tyler - find out what is wrong with movement or collisions
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

function tileCollision(hitTile) {
    //resetSpeedFlag = true;
    //player.setSpeed(0);
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
	var iter;
	for(iter = 0; iter < warehouseItems.length; iter++){ 
		if(player.tileX == warehouseItems[iter].tileX && player.tileY == warehouseItems[iter].tileY )
			{ warehouseItems[iter].collisionCallback(iter); }
		warehouseItems[iter].draw(); 
	}
	for(iter = 0; iter < warehouseEnemies.length; iter++){ warehouseEnemies[iter].update(); }
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