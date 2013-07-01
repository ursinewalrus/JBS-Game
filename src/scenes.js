//---------------------------------------------------------------------------------------
//------------------------- PERSISTANT WORLD STUFF --------------------------------------
//---------------------------------------------------------------------------------------


//Data Structure for entity data to create entitys for scene load and saving entity data
//on scene exit
function EntityData(ent, x, y) {
	if (arguments.length === 1) {
		this.name = ent.enttype;
		this.x = ent.at().x;
		this.y = ent.at().y;
	} else {
		this.name = ent;
		this.x = x;
		this.y = y;
	}
};

/*

//Data Structure to save all entity data in a Scene for load and exit
function Room(name) {
	this.name = name;
	this.entities = new Array();
	this.northRoom;
	this.southRoom;
	this.eastRoom;
	this.westRoom;

};

Room.prototype.createScene = function () {
	var rm = this;
	Crafty.scene(rm.name, function() {
		for (var i = 0; i < rm.entities.length; i++) {
			Crafty.e(rm.entities[i].name).at(rm.entities[i].x, rm.entities[i].y);
		}
	});
};

Room.prototype.saveScene = function () {
	this.entities = new Array();
	var actors = Crafty('Actor');
	for (var i = 0; i < actors.length; i++) {
		this.entities[i] = new EntityData(actors[i]);
	}
	this.createScene();
};



function occupiedArray() {
	var occupied = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		occupied[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			occupied[i][y] = false;
		}
	}
	return occupied;
}


function initializeScenes() {
	//this.occupied = new occupiedArray();
	
		var room1 = new Room('room1');
	for (var x = 0; x < Game.map_grid.width; x++) {
		room1.entities.push(new EntityData('Tree', x, 0));
		room1.entities.push(new EntityData('Tree', x, Game.map_grid.height - 1));
	}
	for (var y = 0; y < Game.map_grid.height; y++) {
		room1.entities.push(new EntityData('Tree', 0, y));
		room1.entities.push(new EntityData('Tree', Game.map_grid.width - 1, y));
	}
	room1.createScene();
};

*/

// Game scene
// -------------
// Runs the core gameplay loop
function mainRoom (name) {
	this.name = name;
	Crafty.scene(name, function() {
	// A 2D array to keep track of all occupied tiles
	player_hp = 3;
	this.occupied = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		this.occupied[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			this.occupied[i][y] = false;
		}
	}
 
	// Player character, placed at 5, 5 on our grid
	// Player character, placed at 5, 5 on our grid
	this.player = Crafty.e('PlayerCharacter').at(5, 5);
	//this.player.setDirection();
	this.occupied[5][5] = true;
 
	// Place a tree at every edge square on our grid of 16x16 tiles
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			var at_edge = ((y<7 || y>8)&&(x==0 || x == Game.map_grid.width-1)) || ((x<11 || x>12)&&(y==0 || y == Game.map_grid.height-1));
			var buffer_zone = ((y>7 || y<8)&&(x==1 || x == Game.map_grid.width-2)) || ((x>11 || x<12)&&(y==1 || y == Game.map_grid.height-2));
			var trans = ((y>6 && y<9)&&(x==0 || x == Game.map_grid.width-1)) || ((x>10 && x<13)&&(y==0 || y == Game.map_grid.height-1)) ;
			var middle = !at_edge && !trans && !buffer_zone;

			if (at_edge) {
				// Place a tree entity at the current tile
				Crafty.e('Tree').at(x, y);
				this.occupied[x][y] = true;
			} 
			if (Math.random() < 0.06 && !this.occupied[x][y] && middle) {
				// Place a bush entity at the current tile
				Crafty.e('Bush').at(x, y);
				this.occupied[x][y] = true;
			} 
			if (trans && !this.occupied[x][y]) {
				Crafty.e('Door').at(x,y);
				this.occupied[x][y] = true;
			}
			if(Math.random()<.03 && !this.occupied[x][y] && middle){
				Crafty.e('NPC').at(x,y);
				this.occupied[x][y] = true;
			}
		}
	}
 
	// Generate up to five villages on the map in random locations
	var max_villages = 5;
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if (Math.random() < 0.02) {
				if (Crafty('Village').length < max_villages && !this.occupied[x][y]) {
				Crafty.e('Village').at(x, y);
				}
			}
		}
	}
 
	// Show the victory screen once all villages are visisted
	this.show_victory = this.bind('VillageVisited', function() {
	if (!Crafty('Village').length) {
		Crafty(Crafty('PlayerCharacter')[0]).destroy();
		Crafty.scene('Victory');
	}
	});
	}, function() {
	// Remove our event binding from above so that we don't
	// end up having multiple redundant event watchers after
	// multiple restarts of the game
	this.unbind('VillageVisited', this.show_victory);
	});
};

mainRoom.prototype.exit = function() {
	var ents = Crafty('DontRemove');
	tempstore = new Array();
	//Crafty.storage.open('coolGame');
	for (var i = 0; i < ents.length; i++) {
		var entsave = new EntityData(Crafty(ents[i]));
		tempstore[i] = entsave;
	};
	saveRooms.save({lastRoom: tempstore}, {
		error: function(object) {
			alert("save didn't work");
		}
	});
	Crafty.scene(this.name, function() {
		for (var i = 0; i < tempstore.length; i++) {
			Crafty.e(tempstore[i].name).at(tempstore[i].x, tempstore[i].y);
		}
	});
};

/*
// Alternate Game Scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game2', function() {
// A 2D array to keep track of all occupied tiles
this.occupied = new Array(Game.map_grid.width);
for (var i = 0; i < Game.map_grid.width; i++) {
this.occupied[i] = new Array(Game.map_grid.height);
for (var y = 0; y < Game.map_grid.height; y++) {
this.occupied[i][y] = false;
}
}
 
// Player character, placed at 5, 5 on our grid
// Player character, placed at 5, 5 on our grid
this.player = Crafty.e('PlayerCharacter').at(player_X, player_Y);
//this.player.setDirection();
this.occupied[this.player.at().x][this.player.at().y] = true;
 
// Place a tree at every edge square on our grid of 16x16 tiles
for (var x = 0; x < Game.map_grid.width; x++) {
for (var y = 0; y < Game.map_grid.height; y++) {
var at_edge = ((y<7 || y>8)&&(x==0 || x == Game.map_grid.width-1)) || ((x<11 || x>12)&&(y==0 || y == Game.map_grid.height-1));
var buffer_zone = ((y>7 || y<8)&&(x==1 || x == Game.map_grid.width-2)) || ((x>11 || x<12)&&(y==1 || y == Game.map_grid.height-2));
var trans = ((y>6 && y<9)&&(x==0 || x == Game.map_grid.width-1)) || ((x>10 && x<13)&&(y==0 || y == Game.map_grid.height-1)) ;
var middle = !at_edge && !trans && !buffer_zone;

if (at_edge) {
	// Place a tree entity at the current tile
	Crafty.e('Tree').at(x, y);
	this.occupied[x][y] = true;
} 
if ((Math.random()>.5 && x%2==1 && y%2==1) && !this.occupied[x][y] && middle) {
	// Place a bush entity at the current tile
	Crafty.e('Bush').at(x, y);
	this.occupied[x][y] = true;
} 
if (trans && !this.occupied[x][y]) {
	Crafty.e('Door').at(x,y);
	this.occupied[x][y] = true;
}
if(Math.random()<.06 && !this.occupied[x][y] && middle){
	Crafty.e('NPC').at(x,y);
	this.occupied[x][y] = true;
}
}
}
 
// Generate up to five villages on the map in random locations
var max_villages = 5;
for (var x = 0; x < Game.map_grid.width; x++) {
for (var y = 0; y < Game.map_grid.height; y++) {
if (Math.random() < 0.02) {
if (Crafty('Village').length < max_villages && !this.occupied[x][y]) {
Crafty.e('Village').at(x, y);
}
}
}
}
 
// Show the victory screen once all villages are visisted
this.show_victory = this.bind('VillageVisited', function() {
if (!Crafty('Village').length) {
Crafty.scene('Victory');
}
});
}, function() {
// Remove our event binding from above so that we don't
// end up having multiple redundant event watchers after
// multiple restarts of the game
this.unbind('VillageVisited', this.show_victory);
});

*/


 
// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene('Victory', function() {
// Display some text in celebration of the victory
Crafty.e('2D, DOM, Text')
.attr({ x: 0, y: 0 })
.text('Victory!');
 
// Watch for the player to press a key, then restart the game
// when a key is pressed
this.restart_game = this.bind('KeyDown', function() {
Game.room1 = new mainRoom('room1');
Crafty.scene('room1');
});
}, function() {
// Remove our event binding from above so that we don't
// end up having multiple redundant event watchers after
// multiple restarts of the game
this.unbind('KeyDown', this.restart_game);
});




// Losing Scene
// -------------
// Tells the player when they've lost and lets them start a new game
Crafty.scene('YouLose', function() {
// Display some text showing the loss
Crafty.e('2D, DOM, Text')
.attr({ x: 0, y: 0 })
.text('kk fix this');
 
// Watch for the player to press a key, then restart the game
// when a key is pressed
this.restart_game = this.bind('KeyDown', function() {
Game.room1 = new mainRoom('room1');
Crafty.scene('room1');
});
}, function() {
// Remove our event binding from above so that we don't
// end up having multiple redundant event watchers after
// multiple restarts of the game
this.unbind('KeyDown', this.restart_game);
});




// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
// Draw some text for the player to see in case the file
// takes a noticeable amount of time to load
Crafty.e('2D, DOM, Text')
.text('Loading...')
.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
.css($text_css);

//Builds Level
 
// Load our sprite map image
Crafty.load(['assets/16x16_forest_1.gif','assets/16x16_forest_2.gif','assets/Doors.gif','assets/arrows.gif','assets/arrows2.gif','assets/treesv2.gif','assets/wolfy.gif'], function(){
// Once the image is loaded...
// Define the individual sprites in the image
// Each one (spr_tree, etc.) becomes a component
// These components' names are prefixed with "spr_"
// to remind us that they simply cause the entity
// to be drawn with a certain sprite
Crafty.sprite(16,'assets/wolfy.gif',{
	spr_wolfyback : [0,0],
	spr_wolfyfront :[0,1],
	spr_wolfyleft : [1,1],
	spr_wolfyright : [1,0]
});
Crafty.sprite(16,'assets/treesv2.gif',{
	spr_tree1 : [0,0],
	spr_tree2 : [0,1],
	spr_tree3 : [1,1],
	spr_bush  : [1,0]
	
});
Crafty.sprite(16,'assets/arrows.gif', {
	spr_arrowN : [0,0],
	spr_arrowS : [1,0],
	spr_arrowE : [0,1],
	spr_arrowW : [1,1]
}); 
Crafty.sprite(16,'assets/arrows2.gif', {
	spr_arrow2N : [0,0],
	spr_arrow2S : [1,1],
	spr_arrow2E : [1,0],
	spr_arrow2W : [0,1]
}); 
Crafty.sprite(16,'assets/Doors.gif',{
spr_door : [0,1],
}),
Crafty.sprite(16, 'assets/16x16_forest_2.gif', {
//spr_door:[1,1],
spr_npc: [0,0]
}),
Crafty.sprite(16, 'assets/16x16_forest_1.gif', {
//spr_tree: [0, 0],
//spr_bush: [1, 0],
spr_village: [0, 1],
spr_player: [1, 1]
}),

// Now that our sprites are ready to draw, start the game
Game.room1 = new mainRoom('room1');
Crafty.scene('room1');

});

});







