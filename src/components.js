
//----------------------------------------------------------
//--------------Basic Components----------------------------
//----------------------------------------------------------

// The Grid component allows an element to be located
// on a grid of tiles
Crafty.c('Grid', {
init: function() {
	this.attr({
		w: Game.map_grid.tile.width,
		h: Game.map_grid.tile.height
	})
},
// Locate this entity at the given position on the grid
at: function(x, y) {
	if (x === undefined && y === undefined) {
		return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
	} else {
		this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
		return this;
	}
}
});

// An "Actor" is an entity that is drawn in 2D on canvas
// via our logical coordinate grid
Crafty.c('Actor', {
init: function() {
	this.requires('2D, Canvas, Grid');
}
});

// Saveable is any entity that should be saved on room exit
Crafty.c('Saveable', {
init: function() {
	this.requires('Actor')
		.bind("SaveData", function (data, prepare) {
			data.attr.x = this.x;
			data.attr.y = this.y;
		});
}
});

Crafty.c('ForegroundObject', {
init: function() {
	this.requires('Saveable')
}
});

Crafty.c('BackgroundObject', {
init: function() {
	this.requires('Saveable')
}
});

Crafty.c('Consumeable', {
init: function () {
	this.requires('ForegroundObject, Solid');
}
});

//----------------------------------------------------------
//--------------Player Component----------------------------
//----------------------------------------------------------

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
init: function() {
	this.arrow_spray = false;
	this.arrowTimer = 0;
	this.swordTimer = 0
	this.hurtTimer = 0;
	this.direction = 'n';
	this.exp = 0;
	this.next_level = 100;
	this.max_hp = 3;
	this.player_hp = 3;
	this.beard_power = 1;
	this.speed = 2; 
	this.level = 1; 
	this.arrow_damage = 2;
	this.sword_damage = 4;
	this.animation_speed = 12;
	this.requires('Actor, Fourway, Collision, Keyboard, spr_player, SpriteAnimation')
		.fourway(speed)
		.onHit('Village', this.visitVillage)
		.onHit('Door', this.enterRoom)
		.onHit('Consumeable',this.feast)
		.animate('Pu',0,0,2)
		.animate('Pr',0,1,2)
		.animate('Pd',0,2,2)
		.animate('Pl',0,3,2)
		.stopOnSolids()
		.bind('NewDirection', function(data){
			if (data.x > 0) {
				this.animate('Pr', this.animation_speed, -1);
			} else if (data.x < 0) {
				this.animate('Pl', this.animation_speed, -1);
			} else if (data.y > 0) {
				this.animate('Pd', this.animation_speed, -1);
			} else if (data.y < 0) {
				this.animate('Pu', this.animation_speed, -1);
			} else {
				this.stop();
			}
		})
		.bind('EnterFrame', function() {
			if (this.isDown('W')) {
				this.direction = 'n'
			} else if (this.isDown('S')) {
				this.direction = 's'
			} else if (this.isDown('A')) {
				this.direction = 'w'
			} else if (this.isDown('D')) {
				this.direction = 'e'
			} if (this.isDown('I') && this.arrowTimer == 0 ) {
				var arrow = Crafty.e('Arrow, spr_arrow2N').at(this.at().x,this.at().y)
				arrow.direction = 'n';
				arrow.player = this;
				this.arrowTimer = 30;
			}
			if (this.isDown('K') && this.arrowTimer == 0 ) {
				var arrow = Crafty.e('Arrow, spr_arrow2S').at(this.at().x,this.at().y)
				arrow.direction = 's';
				arrow.player = this;
				this.arrowTimer = 30;
			}
			if (this.isDown('J') && this.arrowTimer == 0 ) {
				var arrow = Crafty.e('Arrow, spr_arrow2W').at(this.at().x,this.at().y)
				arrow.direction = 'w';
				arrow.player = this;
				this.arrowTimer = 30;
			}
			if (this.isDown('L') && this.arrowTimer == 0 ) {
				var arrow = Crafty.e('Arrow, spr_arrow2E').at(this.at().x,this.at().y)
				arrow.direction = 'e';
				arrow.player = this;
				this.arrowTimer = 30;
				this.swordTimer = 30;
			}
			// *** arrow spray spell, activates on pickup at the moment
			if(this.isDown('G')&& this.arrow_spray == true && this.arrowTimer == 0){
				var arrow = Crafty.e('Arrow, spr_arrow2N').at(this.at().x,this.at().y)
				arrow.direction = 'n';
				arrow.player = this;
				var arrow = Crafty.e('Arrow, spr_arrow2S').at(this.at().x,this.at().y)
				arrow.direction = 's';
				arrow.player = this;
				var arrow = Crafty.e('Arrow, spr_arrow2E').at(this.at().x,this.at().y)
				arrow.direction = 'e';
				arrow.player = this;
				var arrow = Crafty.e('Arrow, spr_arrow2W').at(this.at().x,this.at().y)
				arrow.direction = 'w';
				arrow.player = this;
				this.arrowTimer = 30;
			}
			if(this.isDown('SPACE')&& this.swordTimer==0){
				if(this.direction == 'n'){
					Crafty.e('Sword').at(this.at().x,this.at().y-1)
					this.swordTimer=30;
				}
				if(this.direction == 's'){
					Crafty.e('Sword').at(this.at().x,this.at().y+1)
					this.swordTimer=30;
				}
				if(this.direction == 'e'){
					Crafty.e('Sword').at(this.at().x+1,this.at().y)
					this.swordTimer=30;
				}
				if(this.direction == 'w'){
					Crafty.e('Sword').at(this.at().x-1,this.at().y)
					this.swordTimer=30;
				}
			}
			if (this.arrowTimer > 0) {
				this.arrowTimer = this.arrowTimer - 1;
			}
			if (this.swordTimer > 0) {
                this.swordTimer = this.swordTimer - 1;
            }
			if (this.hurtTimer > 0) {
				this.hurtTimer -= 1;
			}
			//level up skeleton stuff
			if(this.exp >= this.next_level){
				//var level_up_array = new Array ()
				var ding = Crafty.e('2D, DOM, Color, Text')
				ding.attr({x:50,y:100,w:200,alpha:1.0})
				//ding.text('Press J to boost HP, K to boost speed and L to boost the D')
				if(this.isDown('J')&& exp>=next_level){
					this.level++;
					this.max_hp =+ this.max_hp*1.2
					this.player_hp += this.max_hp/2
					var rollOver = this.exp - this.next_level
					this.exp = rollOver
					this.next_level = this.next_level*1.33
					ding.destroy()
				}else if(this.isDown('K') && exp>=next_level){
					this.level++;
					this.speed+=50
					var rollOver = exp-next_level
					this.exp = rollOver
					this.next_level = this.next_level*1.33
					ding.destroy()
				}
		
			}
			
			resetHUD();
			HUD(this);
			if (this.player_hp <= 0 || this.player_hp == NaN) {
				this.destroy();
				
				Crafty.scene("YouLose");
			}
			//HUD(this.at().x,this.at().y,this.direction);
	
		})
		.bind("SaveData", function (data, prepare) {
			data.attr.x = this.x;
			data.attr.y = this.y;
			data.attr.direction = this.direction;
			data.attr.arrow_spray = this.arrow_spray;
			data.attr.arrowTimer = this.arrowTimer;
			data.attr.swordTimer = this.swordTimer;
			data.attr.hurtTimer = this.hurtTimer;
			data.attr.exp = this.exp;
			data.attr.next_level = this.next_level;
			data.attr.max_hp = this.max_hp;
			data.attr.player_hp = this.player_hp;
			data.attr.beard_power = this.beard_power;
			data.attr.speed = this.speed; 
			data.attr.level = this.level; 
			data.attr.arrow_damage = this.arrow_damage;
			data.attr.sword_damage = this.sword_damage;
			data.attr.animation_speed = this.animation_speed;
		});
		Game.player = this;
},
stopOnSolids: function() {
	this.onHit('Solid', this.stopMovementAndDamage);
	this.onHit('NPC', this.stopMovementAndDamage);
	return this;
},
stopMovementAndDamage: function (data) {
	if (this.hit('NPC')) {
		var nppc = data[0].obj;
		this.ouch(nppc.damage);
	}
	if (this._movement) {
		this.x -= this._movement.x;
		if (this.hit('Solid') || this.hit('NPC')) {
			this.x += this._movement.x;
			this.y -= this._movement.y;
			if (this.hit('Solid') || this.hit('NPC')) {
				this.x -= this._movement.x;
				this.y -= this._movement.y;
			}
		}
	} else {
		this._speed = 0;
	}
},
ouch: function(damage) {
    if (this.hurtTimer == 0) {
        this.player_hp -= damage;
    }
    this.hurtTimer = 20;
},
enterRoom: function(data) {
	dooor = data[0].obj;
	var player_X;
	var player_Y;
	var roundedX =  Math.round(this.at().x);
	if ((dooor.at().x == Game.map_grid.width - 1) ||
		(dooor.at().x == 0)) {
		player_X = Game.map_grid.width - roundedX - 1;
	} else {
		player_X = roundedX;
	}
	var roundedY = Math.round(this.at().y);
	if ((dooor.at().y == Game.map_grid.height - 1) ||
		(dooor.at().y == 0)) {
		player_Y = Game.map_grid.height - roundedY - 1;
	} else {
		player_Y = roundedY;
	}
	this.at(player_X, player_Y);
	allRooms[dooor.thisRoom].exit();
	//console.log(dooor.linkedRoom);
	Crafty.scene(dooor.linkedRoom);
},
feast : function (data){
	var foood = data[0].obj;
	foood.feast(this);
	return data[0];
},
});

//----------------------------------------------------------
//-------------- NPC Components ----------------------------
//----------------------------------------------------------

Crafty.c('NPC', {
init: function() {
	this.direction = 'n';
	this.damage;
	this.hp;
	this.exp;
	this.requires('Saveable, Collision')
		.onHit('PlayerCharacter', this.hurtPlayer);
},
hurtPlayer : function (data) {
	var plaayer = data[0].obj;
	plaayer.ouch(this.damage);
	this.move(this.direction, -1);
},
ouch : function (player, damage_amount) {
	this.hp -= damage_amount;
	if(this.hp <= 0){
		player.exp += exp;
		if (this.__c['Boss']) {
			Crafty.scene('Victory');
		}
		this.destroy();
	}
},
});

Crafty.c('RandomMovement', {
init: function() {
	this.requires('NPC')
		.bind('EnterFrame' , function() {
			if (Math.random() > .9) {
				var newDirection = Math.random();
				if (newDirection < .25) {
					this.direction = 'n'
				}
				else if (newDirection > .25 && newDirection < .5) {
					this.direction = 's'
				}
				else if (newDirection >.5 && newDirection < .75) {
					this.direction = 'e'
				}
				else if (newDirection > .76) {
					this.direction = 'w'
				}
			}
			this.move(this.direction, 1);
		})
		.stopOnSolids();
},
stopOnSolids: function() {
	this.onHit('Solid', this.stopMovement);
	this.onHit('PlayerCharacter', this.stopMovement);
	return this;
},
stopMovement: function (data) {
	while( this.hit('PlayerCharacter') || this.hit('Solid') ) {
		this.move(this.direction, -1);
	}
},
});

Crafty.c('Wolf',{
init : function () {
	this.hp = 3;
	this.damage = 1;
	this.exp = 10;
	this.requires('RandomMovement, spr_wolfyfront');
},
});

Crafty.c('Tower',{
	init : function () {
		this.hp = 5;
		this.damage = 2;
		this.exp = 30;
		this.arrowtimer = 60;
		this.requires('NPC,spr_door')
			.bind('EnterFrame' , function() {
				if(this.arrowtimer <= 0){
						Crafty.e('FoeArrow, spr_arrowN').at(this.at().x,this.at().y).direction = 'n';
						Crafty.e('FoeArrow, spr_arrowS').at(this.at().x,this.at().y).direction = 's';
						Crafty.e('FoeArrow, spr_arrowE').at(this.at().x,this.at().y).direction = 'e';
						Crafty.e('FoeArrow, spr_arrowW').at(this.at().x,this.at().y).direction = 'w';
					this.arrowtimer = 60;
				}
				this.arrowtimer--;
			});
	},
	});

Crafty.c('Shooter',{
init : function () {
	this.hp = 1;
	this.damage = 1;
	this.exp = 25;
	this.arrowtimer = 30;
	this.requires('RandomMovement, spr_wolfyback')
		.bind('EnterFrame' , function() {
			if(this.arrowtimer <= 0){
				if (this.direction == 'n') {
					Crafty.e('FoeArrow, spr_arrowN').at(this.at().x,this.at().y).direction = 'n';
				} else 
				if (this.direction == 's') {
					Crafty.e('FoeArrow, spr_arrowS').at(this.at().x,this.at().y).direction = 's';
				} else 
				if (this.direction == 'e') {
					Crafty.e('FoeArrow, spr_arrowE').at(this.at().x,this.at().y).direction = 'e';
				} else 
				if (this.direction == 'w') {
					Crafty.e('FoeArrow, spr_arrowW').at(this.at().x,this.at().y).direction = 'w';
				} 
				this.arrowtimer = 30;
			}
			this.arrowtimer--;
		});
},
});
//************BOSS*****************************
Crafty.c('Boss',{
	init:function() {
		this.hp = 1;
		this.damage = 3;
		this.exp = 150;
		this.attackCycle = 0
		this.x_counter = 0
		this.y_counter = 0
		this.pewpewpew = true
		this.laser = false
		this.vomit = false 
		this.arrowTimer = 20
		this.requires('NPC,spr_molsty')
		.attr({w:32,l:32})
		.collision()
		.bind('EnterFrame',function(){//x-5 x+5 y-1 y+2
			
			//****** pewpew attack pattern
			
			if(this.arrowTimer<=0 && this.pewpewpew){
				Crafty.e('FoeArrow, spr_arrowN').at(this.at().x,this.at().y).direction = 'n';
				Crafty.e('FoeArrow, spr_arrowS').at(this.at().x,this.at().y).direction = 's';
				Crafty.e('FoeArrow, spr_arrowE').at(this.at().x,this.at().y).direction = 'e';
				Crafty.e('FoeArrow, spr_arrowW').at(this.at().x,this.at().y).direction = 'w';
				
				Crafty.e('FoeArrow, spr_arrowN').at(this.at().x+1,this.at().y).direction = 'n';
				Crafty.e('FoeArrow, spr_arrowS').at(this.at().x+1,this.at().y).direction = 's';
				Crafty.e('FoeArrow, spr_arrowE').at(this.at().x+1,this.at().y).direction = 'e';
				Crafty.e('FoeArrow, spr_arrowW').at(this.at().x+1,this.at().y).direction = 'w';
				
				Crafty.e('FoeArrow, spr_arrowN').at(this.at().x,this.at().y+1).direction = 'n';
				Crafty.e('FoeArrow, spr_arrowS').at(this.at().x,this.at().y+1).direction = 's';
				Crafty.e('FoeArrow, spr_arrowE').at(this.at().x,this.at().y+1).direction = 'e';
				Crafty.e('FoeArrow, spr_arrowW').at(this.at().x,this.at().y+1).direction = 'w';
				
				Crafty.e('FoeArrow, spr_arrowN').at(this.at().x+1,this.at().y+1).direction = 'n';
				Crafty.e('FoeArrow, spr_arrowS').at(this.at().x+1,this.at().y+1).direction = 's';
				Crafty.e('FoeArrow, spr_arrowE').at(this.at().x+1,this.at().y+1).direction = 'e';
				Crafty.e('FoeArrow, spr_arrowW').at(this.at().x+1,this.at().y+1).direction = 'w';
				
				this.arrowTimer = 63
				this.attackCycle++;
					var go = Math.random()
					if(go<.25 && this.y_counter<32){
						this.move('n',8)
						this.y_counter+=8
					}
					else if(go>.25 && go<.5 && this.y_counter>-32){
						this.move('s',8)
						this.y_counter-=8
					}
					else if(go>.5 && go<.75 && this.x_counter<160){
						this.move('e',8)
						this.x_counter+=8
					}
					else if(this.x_counter>-160){
						this.move('w',8)
						this.x_counter-=8
					}
				console.log(this.attackCycle)
			}
// ********************************************************************************
//************************************LASER ***************************
			this.arrowTimer--;
			if(this.attackCycle>15){
				this.pewpewpew=false
				this.laser=true	
			}
			if(this.attackCycle>600){
				this.laser=false
				this.vomit=true
			}
			if(this.laser==true){
				this.attackCycle++;
				console.log(this.laser)
				if(Math.random()>.77){
					var laserdir = Math.random()
					if(laserdir<.25){
						Crafty.e('FoeArrow, spr_arrowN').at(this.at().x,this.at().y).direction = 'n';
						Crafty.e('FoeArrow, spr_arrowN').at(this.at().x+1,this.at().y).direction = 'n';
						Crafty.e('FoeArrow, spr_arrowN').at(this.at().x,this.at().y+1).direction = 'n';
						Crafty.e('FoeArrow, spr_arrowN').at(this.at().x+1,this.at().y+1).direction = 'n';
						this.attackCycle++
					}
					else if(laserdir>.25 && laserdir<.5){
						Crafty.e('FoeArrow, spr_arrowS').at(this.at().x,this.at().y).direction = 's';
						Crafty.e('FoeArrow, spr_arrowS').at(this.at().x+1,this.at().y).direction = 's';
						Crafty.e('FoeArrow, spr_arrowS').at(this.at().x,this.at().y+1).direction = 's';
						Crafty.e('FoeArrow, spr_arrowS').at(this.at().x+1,this.at().y+1).direction = 's';
						this.attackCycle++
					}
					else if(laserdir<.75&&laserdir>.5){
						Crafty.e('FoeArrow, spr_arrowE').at(this.at().x,this.at().y).direction = 'e';
						Crafty.e('FoeArrow, spr_arrowE').at(this.at().x+1,this.at().y).direction = 'e';
						Crafty.e('FoeArrow, spr_arrowE').at(this.at().x,this.at().y+1).direction = 'e';
						Crafty.e('FoeArrow, spr_arrowE').at(this.at().x+1,this.at().y+1).direction = 'e';
						this.attackCycle++
					}
					else{
						Crafty.e('FoeArrow, spr_arrowW').at(this.at().x,this.at().y).direction = 'w';
						Crafty.e('FoeArrow, spr_arrowW').at(this.at().x+1,this.at().y).direction = 'w';
						Crafty.e('FoeArrow, spr_arrowW').at(this.at().x,this.at().y+1).direction = 'w';
						Crafty.e('FoeArrow, spr_arrowW').at(this.at().x+1,this.at().y+1).direction = 'w';
						this.attackCycle++
					}
				}
			}
			if(this.vomit==true){
				for(var i=0;i<10;i++){
					var yer = Math.floor(Math.random()*(14-2+1))+2;
					var xer= Math.floor(Math.random()*(22-2+1))+2;
					Crafty.e('Shooter').at(xer,yer)
				}
				this.attackCycle=0;
				this.vomit=false
				this.pewpewpew=true
				this.arrowTimer = 0;
				
			}
		});
},	
});

//----------------------------------------------------------
//-------------- Weapon Components -------------------------
//----------------------------------------------------------

Crafty.c('FoeArrow',{
init: function() {
	this.direction = ''
	this.requires('Actor, Collision')
		.onHit('PlayerCharacter', this.hurt)
		.onHit('tall', this.destroy)
		.bind('EnterFrame', function() {
			this.move(this.direction, 2);
		});
},
hurt: function(data) {
	var damage_amount = 1
	var damage = data[0].obj;
	damage.ouch(damage_amount);
	this.destroy();
	return data[0];
},	
});

Crafty.c('Arrow', {
init: function() {
	this.direction = ''
	this.player;
	this.requires('Actor, Collision')
		.onHit('NPC',this.hurtArrow)
		.onHit('tall',this.destroy)
		.bind('EnterFrame', function() {
			this.move(this.direction, 6);
	});
},
hurtArrow: function(data) {
	var damage = data[0].obj;
	damage.ouch(this.player, this.player.arrow_damage);
	this.destroy();
	return data[0];
	},
});

Crafty.c('Sword',{
init: function () {
	this.duration = 8
	this.direction = ''
	this.requires('Actor, spr_arrowN, Collision')
		.onHit('NPC',this.hurtSword)	
		.bind('EnterFrame',function(){
			this.duration--;
			if(this.duration==0){
				this.destroy()
			}
		});
},
hurtSword: function(data){
	var damage = data[0].obj;
	damage.ouch(Game.player, Game.player.sword_damage);
	return data[0];
},
});

//----------------------------------------------------------
//---------------- Consumbable Components ------------------
//----------------------------------------------------------

Crafty.c('Full_Heal',{
init: function () {
	this.requires('Consumeable, spr_village,short')
},
feast: function(player) {
	this.destroy();
	player.player_hp = player.max_hp;
},
});

Crafty.c('Arrow_Spray',{
init: function () {
	this.requires('Consumeable, spr_tome,short')
},
feast: function(player) {
	this.destroy()
	player.arrow_spray = true;
},
});

//----------------------------------------------------------
//---------------- Level Components ------------------------
//----------------------------------------------------------

Crafty.c('Door',{
init:function(){
	this.thisRoom;
	this.linkedRoom;
	this.requires('ForegroundObject, Solid, tall')
	.bind("SaveData", function (data, prepare) {
		data.attr.thisRoom = this.thisRoom;
		data.attr.linkedRoom = this.linkedRoom;
	});
},
setThisRoom:function(room) {
	this.thisRoom = room;
},
setLinkedRoom:function(room) {
	this.linkedRoom = room;
}
});

//----------------------------------------------------------
//---------------- Misc. Components ------------------------
//----------------------------------------------------------
//Crafty.e('SolidObj','spr_tree4').at(x,y)
//Crafty.c(SolidObj,{
//init: function () {
//this.requires('ForegroundObject,Solid)
Crafty.c('SolidObj',{
	init: function () {
		this.requires('ForegroundObject,Solid,tall');
}
});
Crafty.c('TileObj',{
	init: function () {
		this.requires('BackgroundObject,short')
}
});
Crafty.c('Dead_Guy',{
	init: function() {
		this.requires('ForegroundObject, spr_deadguy,short')//stuff like this and water might be made into broader 
	},														//catagories later if we add more similar types
});
Crafty.c('Water',{
	init: function () {
		this.requires('ForegroundObject, Solid, spr_water,short')	
},
});
//old crafty.c's, here just in case/for reference
/*
Crafty.c('Tree', {
	init: function() {
		this.requires('ForegroundObject, Solid, spr_tree2,tall');
}
});
Crafty.c('Bush', {
	init: function() {
		this.requires('ForegroundObject, Solid, spr_bush,tall');
}
});
Crafty.c('Green_Tree',{
init: function () {
	this.requires('ForegroundObject,Solid,spr_tree4,tall')
},
});

Crafty.c('Rock_Tile',{
init: function() {
	this.requires('BackgroundObject, spr_rockfloor,short')
},
});

Crafty.c('Grave',{
init: function() {
	this.requires('ForegroundObject, Solid, spr_grave,tall')
},
});

Crafty.c('Broke_Sword',{
init: function() {
	this.requires('ForegroundObject, Solid, spr_brokesword,tall')
},
});*/
