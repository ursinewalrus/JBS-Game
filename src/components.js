
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

Crafty.c('Consumeable', {
init: function () {
	this.requires('Saveable, Solid')
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
	this.hurtTimer = 0;
	this.direction = 'n';
	var arrow_damage = 2;
	var animation_speed = 12;
	this.requires('Actor, Fourway, Collision, Keyboard, spr_player, SpriteAnimation')
		.fourway(speed)
		.onHit('Village', this.visitVillage)
		.onHit('Door', this.enterRoom)
		.onHit('Wolf', this.hurt_wolf)
		.onHit('FoeArrow',this.hurt_wolf)
		.onHit('Consumeable',this.feast)
		.animate('Pu',0,0,2)
		.animate('Pr',0,1,2)
		.animate('Pd',0,2,2)
		.animate('Pl',0,3,2)
		.stopOnSolids()
		.bind('NewDirection', function(data){
			if (data.x > 0) {
				this.animate('Pr', animation_speed, -1);
			} else if (data.x < 0) {
				this.animate('Pl', animation_speed, -1);
			} else if (data.y > 0) {
				this.animate('Pd', animation_speed, -1);
			} else if (data.y < 0) {
				this.animate('Pu', animation_speed, -1);
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
			} if (this.isDown('SPACE') && this.arrowTimer == 0 ) {
				if(this.direction=='n'){
					Crafty.e('ArrowN').at(this.at().x,this.at().y).direction = this.direction;
					this.arrowTimer = 30
				}if(this.direction=='s'){
					Crafty.e('ArrowS').at(this.at().x,this.at().y).direction = this.direction;
					this.arrowTimer = 30
				}if(this.direction=='e'){
					Crafty.e('ArrowE').at(this.at().x,this.at().y).direction = this.direction;
					this.arrowTimer = 30
				}if(this.direction=='w'){
					Crafty.e('ArrowW').at(this.at().x,this.at().y).direction = this.direction;
					this.arrowTimer = 30
				}
		
			} 
			// *** arrow spray spell, activates on pickup at the moment
			if(this.isDown('G')&& this.arrow_spray == true && this.arrowTimer == 0){
				saver = this.direction
				this.direction = 'n'
				Crafty.e('ArrowN').at(this.at().x,this.at().y).direction = this.direction;
				this.direction = 's'
				Crafty.e('ArrowS').at(this.at().x,this.at().y).direction = this.direction;	
				this.direction = 'e'
				Crafty.e('ArrowE').at(this.at().x,this.at().y).direction = this.direction;
				this.direction = 'w'
				Crafty.e('ArrowW').at(this.at().x,this.at().y).direction = this.direction;	
				this.arrowTimer = 30;
				this.direction = saver 
			}
			if(this.isDown('H')&& this.arrowTimer==0){
				if(this.direction == 'n'){
					Crafty.e('Sword').at(this.at().x,this.at().y-1)
					this.arrowTimer=40
				}
				if(this.direction == 's'){
					Crafty.e('Sword').at(this.at().x,this.at().y+1)
					this.arrowTimer=40
				}
				if(this.direction == 'e'){
					Crafty.e('Sword').at(this.at().x+1,this.at().y)
					this.arrowTimer=40
				}
				if(this.direction == 'w'){
					Crafty.e('Sword').at(this.at().x-1,this.at().y)
					this.arrowTimer=40
				}
			}

			if (this.arrowTimer > 0) {
				this.arrowTimer = this.arrowTimer - 1;
			}
			if (this.hurtTimer > 0) {
				this.hurtTimer -= 1;
			}
			//level up skeleton stuff
			if(exp>=next_level){
				//var level_up_array = new Array ()
				var ding = Crafty.e('2D, DOM, Color, Text')
				ding.attr({x:50,y:100,w:200,alpha:1.0})
				//ding.text('Press J to boost HP, K to boost speed and L to boost the D')
				if(this.isDown('J')&& exp>=next_level){
					level++;
					max_hp=+max_hp*1.2
					player_hp+=max_hp/2
					var rollOver = exp-next_level
					exp=rollOver
					next_level=next_level*1.33
					ding.destroy()
				}else if(this.isDown('K') && exp>=next_level){
					level++;
					speed+=50
					var rollOver = exp-next_level
					exp=rollOver
					next_level=next_level*1.33
					ding.destroy()
				}
		
			}
			if (player_hp <= 0) {
				this.destroy();
				Crafty.scene("YouLose");
			}
    
    
			resetHUD();
			//HUD(this.at().x,this.at().y,this.direction);
			HUD(this);
	
		})
		.bind("SaveData", function (data, prepare) {
			data.attr.x = this.x;
			data.attr.y = this.y;
			data.attr.arrow_spray = this.arrow_spray;
		});
},
stopOnSolids: function() {
	this.onHit('Solid', this.stopMovement);
	this.onHit('NPC', this.stopMovement);
	return this;
},
stopMovement: function () {
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
ouch : function (damage_amount) {
	this.hp-=damage_amount;
},
hurt_wolf:function() {
    if (this.hurtTimer == 0) {
        player_hp -= 1;
    }
    this.hurtTimer = 20;
},
hurt_shooter:function(){
	if(this.hurtTimer==0){
		player_hp-=2
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
	foood = data[0].obj;
	foood.feast(this);
	return data[0];
},
});

//----------------------------------------------------------
//-------------- NPC Components ----------------------------
//----------------------------------------------------------

Crafty.c('NPC', {
init: function() {
	this.direction = 'n'
	this.requires('Saveable, Collision')
		.onHit('PlayerCharacter', this.hurtPlayer)
		.stopOnSolids()
},
stopOnSolids: function() {
	this.onHit('PlayerCharacter', this.stopMovenment);
	this.onHit('Solid', this.stopMovement);
	return this;
},
stopMovement: function () {
	while( this.hit('PlayerCharacter') || this.hit('Solid') ) {
		this.move(this.direction, -1);
	}
},
ouch : function (damage_amount) {
	this.hp-=damage_amount;
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
					this.reverseDirection = 's'
				}
				else if (newDirection > .25 && newDirection < .5) {
					this.direction = 's'
					this.reverseDirection = 'n'
				}
				else if (newDirection >.5 && newDirection < .75) {
					this.direction = 'e'
					this.reverseDirection = 'w'
				}
				else if (newDirection > .76) {
					this.direction = 'w'
					this.reverseDirection = 'e'
				}
			}
			this.move(this.direction, 1);
		});
}
});

Crafty.c('Wolf',{
init : function () {
	this.hp = 2;
	this.requires('RandomMovement, spr_wolfyfront')
		.bind('EnterFrame' , function() {
			if(this.hp<=0){
				this.destroy();
				exp+=10;
			}
		});
},
hurtPlayer : function (data) {
	plaayer = data[0].obj;
	plaayer.hurt_wolf();
	this.move(this.reverseDirection, 1);
},
});

Crafty.c('Shooter',{
init : function () {
	this.hp = 5;
	this.requires('RandomMovement, spr_wolfyback')
		.bind('EnterFrame' , function() {
			if(this.hp<=0){
				this.destroy();
				exp+=25;
			}
			if(Math.random()>.84){
				Crafty.e('FoeArrow').at(this.at().x,this.at().y).direction = this.direction;
			}
		});
},
hurtPlayer : function (data) {
	plaayer = data[0].obj;
	plaayer.hurt_shooter();
	this.move(this.reverseDirection, 1);
},
});

//----------------------------------------------------------
//-------------- Weapon Components -------------------------
//----------------------------------------------------------

Crafty.c('FoeArrow',{
init: function() {
	this.direction = ''
	this.requires('Actor, Collision, spr_arrowN')
		.onHit('PlayerCharacter',this.hurt)
		.onHit('Solid',this.destroy)
		.bind('EnterFrame', function() {
			this.move(this.direction, 2);
		});
},
hurt: function(data) {
	var damage_amount = 1
	damage = data[0].obj;
	damage.ouch(damage_amount);
	this.destroy();
	return data[0];
},	
});

Crafty.c('Arrow', {
init: function() {
	this.direction = ''
	this.requires('Actor, Collision')
		.onHit('NPC',this.hurt)
		.onHit('Solid',this.destroy)
		.bind('EnterFrame', function() {
			this.move(this.direction, 6);
	});
},
hurt: function(data) {
	var damage_amount = 1
	damage = data[0].obj;
	damage.ouch(damage_amount);
	this.destroy();
	return data[0];
	},
});

Crafty.c('ArrowN',{
	init: function () {
		this.requires('Arrow, spr_arrow2N')
}
});

Crafty.c('ArrowS',{
	init: function () {
		this.requires('Arrow, spr_arrow2S')
}
});

Crafty.c('ArrowE',{
	init: function () {
		this.requires('Arrow, spr_arrow2E')
}
});

Crafty.c('ArrowW',{
	init: function () {
		this.requires('Arrow, spr_arrow2W')
}
});

Crafty.c('Sword',{
init: function () {
	this.duration = 8
	this.direction = ''
	this.requires('Actor, spr_arrowN, Collision')
		.onHit('NPC',this.hurt)	
		.bind('EnterFrame',function(){
			this.duration--;
			if(this.duration==0){
				this.destroy()
			}
		});
},
hurt: function(data){
	var damage_amount = 2
	damage = data[0].obj;
	damage.ouch(damage_amount);
	return data[0];
},
});

//----------------------------------------------------------
//---------------- Consumbable Components ------------------
//----------------------------------------------------------

Crafty.c('Full_Heal',{
init: function () {
	this.requires('Consumeable, spr_village')
},
feast: function(player) {
	this.destroy()
	player_hp = max_hp;
},
});

Crafty.c('Arrow_Spray',{
init: function () {
	this.requires('Consumeable, spr_tome')
},
feast: function(player) {
	this.destroy()
	player.arrow_spray = true;
},
});

//----------------------------------------------------------
//---------------- Level Components ------------------------
//----------------------------------------------------------

// A Tree is just an Actor with a certain sprite
Crafty.c('Tree', {
init: function() {
	this.requires('Solid, Saveable, spr_tree2');
}
});

Crafty.c('Door',{
init:function(){
	this.thisRoom;
	this.linkedRoom;
	this.requires('Solid, Saveable, spr_door')
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

// A Bush is just an Actor with a certain sprite
Crafty.c('Bush', {
init: function() {
	this.requires('Solid, Saveable, spr_bush');
}
});

//----------------------------------------------------------
//---------------- Misc. Components ------------------------
//----------------------------------------------------------

Crafty.c('Dead_Guy',{
init: function() {
	this.requires('Saveable, spr_deadguy')
},
});

Crafty.c('Rock_Tile',{
	init: function() {
		this.requires('Saveable, spr_rockfloor')
			.bind("SaveData",function(data,prepare){
				data.attr.x = this.x;
				data.attr.y = this.y;
			});
	},
	});

Crafty.c('Grave',{
init: function() {
	this.requires('Saveable, Solid, spr_grave')
},
});

Crafty.c('Broke_Sword',{
init: function() {
	this.requires('Saveable, Solid, spr_brokesword')
},
});

