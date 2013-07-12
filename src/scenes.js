//---------------------------------------------------------------------------------------
//------------------------- PERSISTANT WORLD STUFF --------------------------------------
//---------------------------------------------------------------------------------------


//Data Structure for entity data to create entitys for scene load and saving entity data
//on scene exit

var allRooms;

function RoomLink(nextRoom, direction, locationOnWall) {
	this.nextRoom = nextRoom;
	this.direction = direction;
	this.locationOnWall = locationOnWall;
}

//after name you can add arguments for rooms to conect this to in the form
// (room, direction, locationOnWall)
function Room (name, type) {
	this.name = name;
	this.type = type;
	this.roomLinks = new Array(); //items in form [Room, direction, xoryvalue]
	if (arguments.length === 5) {
		this.linkRooms(arguments[2], arguments[3], arguments[4]);
	} else 
	if (arguments.length > 2) {
		throw 'wrong number of arguments';
	}
	allRooms[this.name] = this;
};

Room.prototype.linkRooms  = function(nextRoom, direction, locationOnWall) {
	this.roomLinks.push(new RoomLink(nextRoom, direction, locationOnWall));
	var linkedRoomDir;
	//console.log(direction);
	if (direction == 'n') {
		linkedRoomDir = 's';
	} else
	if (direction == 's') {
		linkedRoomDir = 'n';
	} else
	if (direction == 'e') {
		linkedRoomDir = 'w';
	} else
	if (direction == 'w') {
		linkedRoomDir = 'e';
	}
	var newRoomLink = new RoomLink(this.name, linkedRoomDir, locationOnWall);
	allRooms[nextRoom].roomLinks.push(newRoomLink);
}

Room.prototype.buildRoom = function() {
	var rm = this
	Crafty.scene(rm.name, function() {
		//console.log(thisRoom.name);
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
		//this.player.setDirection();
		this.occupied[5][5] = true;
		
		//places Doors
		for (var i = 0; i < rm.roomLinks.length; i++) {
			var roomlnk = rm.roomLinks[i];
			var newDoor = new Crafty.e('Door');
			//console.log(roomlnk.direction);
			newDoor.setThisRoom(rm.name);
			newDoor.setLinkedRoom(roomlnk.nextRoom);
			if (roomlnk.direction == 'n') {
				newDoor.at(roomlnk.locationOnWall, 0);
				this.occupied[roomlnk.locationOnWall][0] = true;
			} else 
			if (roomlnk.direction == 's') {
				newDoor.at(roomlnk.locationOnWall, Game.map_grid.height - 1);
				this.occupied[roomlnk.locationOnWall][Game.map_grid.height - 1] = true;
			} else 
			if (roomlnk.direction == 'e') {
				newDoor.at(Game.map_grid.width - 1, roomlnk.locationOnWall);
				this.occupied[Game.map_grid.width - 1][roomlnk.locationOnWall] = true;
			} else 
			if (roomlnk.direction == 'w') {
				newDoor.at(0, roomlnk.locationOnWall);
				this.occupied[0][roomlnk.locationOnWall] = true;
			}
		}
		
		// Place a tree at every edge square on our grid of 16x16 tiles
		if(rm.type=='forest'){
			console.log("forest")
			for (var x = 0; x < Game.map_grid.width; x++) {
				for (var y = 0; y < Game.map_grid.height; y++) {
					var at_edge = ((x==0 || x == Game.map_grid.width-1) || (y==0 || y == Game.map_grid.height-1));
					var buffer_zone = ((x==1 || x == Game.map_grid.width-2) || (y==1 || y == Game.map_grid.height-2));
					if (at_edge && !this.occupied[x][y]) {
						// Place a tree entity at the current tile
						Crafty.e('Tree').at(x, y);
						this.occupied[x][y] = true;
					} 
					if (Math.random() < 0.06 && !this.occupied[x][y] && !buffer_zone) {
						// Place a bush entity at the current tile
						Crafty.e('Bush').at(x, y);
						this.occupied[x][y] = true;
					} 
					if(Math.random()<.03 && !this.occupied[x][y] && !buffer_zone){
						Crafty.e('Wolf').at(x, y);
						this.occupied[x][y] = true;
					}
					if(Math.random()<.01 && !this.occupied[x][y] && !buffer_zone){
						Crafty.e('Full_Heal').at(x,y);
						this.occupied[x][y]
					}
					if(Math.random()<.01 && !this.occupied[x][y] && !buffer_zone){
						Crafty.e('Arrow_Spray').at(x,y);
						this.occupied[x][y]
					}
					if(Math.random()<.01 && !this.occupied[x][y] && !buffer_zone){
						Crafty.e('Shooter').at(x, y);
						this.occupied[x][y] = true;
					}
				
				}
			}
		}
		else if(rm.type=='grid'){
			console.log("grid")
			for (var x = 0; x < Game.map_grid.width; x++) {
				for (var y = 0; y < Game.map_grid.height; y++) {
					var at_edge = ((x==0 || x == Game.map_grid.width-1) || (y==0 || y == Game.map_grid.height-1));
					var buffer_zone = ((x==1 || x == Game.map_grid.width-2) || (y==1 || y == Game.map_grid.height-2));
					if (at_edge && !this.occupied[x][y]) {
						// Place a tree entity at the current tile
						Crafty.e('Tree').at(x, y);
						this.occupied[x][y] = true;
					} 
					if (Math.random() < 0.9 && !this.occupied[x][y] && !buffer_zone) {
						// Place a bush entity at the current tile
						Crafty.e('Bush').at(x, y);
						this.occupied[x][y] = true;
					} 
					if(Math.random()<.03 && !this.occupied[x][y] && !buffer_zone){
						Crafty.e('NPC').at(x, y);
						this.occupied[x][y] = true;
					}
					if(Math.random()<.01 && !this.occupied[x][y] && !buffer_zone){
						Crafty.e('Full_Heal').at(x,y);
						this.occupied[x][y]
					}
					if(Math.random()<.01 && !this.occupied[x][y] && !buffer_zone){
						Crafty.e('Arrow_Spray').at(x,y);
						this.occupied[x][y]
					}
				
				}
			}
		}
	/*
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
	*/
	});
}

Room.prototype.exit = function() {
	var ents = Crafty('DontRemove');
	for (var i = 0; i < ents.length; i++) {
		window.localStorage.setItem(this.name + i, serialize(Crafty(ents[i])));
	};
	var sceneName = this.name
	Crafty.scene(sceneName, function() {
		var patt = new RegExp(sceneName);
		for (var i in window.localStorage) {
			if (patt.test(i)) {
				console.log(window.localStorage.getItem(i));
				unserialize(window.localStorage.getItem(i));
				window.localStorage.removeItem(i);
			}
		}
	});
};

	/*
	 * Processes a retrieved object.
	 * Creates an entity if it is one
	 */
	function process(obj) {
		if (obj.c) {
			var d = Crafty.e(obj.c)
						.attr(obj.attr)
						.trigger('LoadData', obj, process);
			return d;
		}
		else if (typeof obj == 'object') {
			for (var prop in obj) {
				obj[prop] = process(obj[prop]);
			}
		}
		return obj;
	}

	function unserialize(str) {
		if (typeof str != 'string') return null;
		var data = (JSON ? JSON.parse(str) : eval('(' + str + ')'));
		return process(data);
	}

	/* recursive function
	 * searches for entities in an object and processes them for serialization
	 */
	function prep(obj) {
		if (obj.__c) {
			// object is entity
			var data = { c: [], attr: {} };
			obj.trigger("SaveData", data, prep);
			for (var i in obj.__c) {
				data.c.push(i);
			}
			data.c = data.c.join(', ');
			obj = data;
		}
		else if (typeof obj == 'object') {
			// recurse and look for entities
			for (var prop in obj) {
				obj[prop] = prep(obj[prop]);
			}
		}
		return obj;
	}

	function serialize(e) {
		if (JSON) {
			var data = prep(e);
			return JSON.stringify(data);
		}
		else {
			alert("Crafty does not support saving on your browser. Please upgrade to a newer browser.");
			return false;
		}
	}
	
function initializeScene(roomGridX, roomGridY, maxNumOfRooms) {

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	var roomNumber = 1;
	var roomGrid = new Array();
	
	for (var x = 0; x < roomGridX; x++) {
		roomGrid[x] = new Array();
		for (var y = 0; y < roomGridY; y++) {
			roomGrid[x][y] = null;
		}
	}
	
	function roomPlace(rm, x, y) {
		if (x-1 >= 0 && roomGrid[x-1][y] === null && 
				maxNumOfRooms > 0 && Math.random() > .5) {
				
			roomGrid[x-1][y] = new Room(roomNumber + 'room', 'forest');
			rm.linkRooms(roomGrid[x-1][y].name, 'w', Game.map_grid.height/2);
			roomNumber++;
			maxNumOfRooms--;
		}
		if (x+1 < roomGrid.length && roomGrid[x+1][y]  === null && 
				maxNumOfRooms > 0 && Math.random() > .5) {
				
			roomGrid[x+1][y] = new Room(roomNumber + 'room', 'forest');
			rm.linkRooms(roomGrid[x+1][y].name, 'e', Game.map_grid.height/2);
			roomNumber++;
			maxNumOfRooms--;
		}
		if (y-1 >= 0 && roomGrid[x][y-1]  === null && 
				maxNumOfRooms > 0 && Math.random() > .5) {
				
			roomGrid[x][y-1] = new Room(roomNumber + 'room', 'forest');
			rm.linkRooms(roomGrid[x][y-1].name, 'n', Game.map_grid.width/2);
			roomNumber++;
			maxNumOfRooms--;
		}
		if (y+1 < roomGrid[0].length && roomGrid[x][y+1]  === null && 
				maxNumOfRooms > 0 && Math.random() > .5) {
				
			roomGrid[x][y+1] = new Room(roomNumber + 'room', 'forest');
			rm.linkRooms(roomGrid[x][y+1].name, 's', Game.map_grid.width/2);
			roomNumber++;
			maxNumOfRooms--;
		}
		if (x-1 >= 0 && maxNumOfRooms > 0 && 
				!(roomGrid[x-1][y] === null) && Math.random() > .5) {
				
			roomPlace(roomGrid[x-1][y], x-1, y);
		}
		if (x+1 < roomGrid.length && maxNumOfRooms > 0 && 
				!(roomGrid[x+1][y] === null) && Math.random() > .5) {
				
			roomPlace(roomGrid[x+1][y], x+1, y);
		}
		if (y-1 >= 0 && maxNumOfRooms > 0 && 
				!(roomGrid[x][y-1] === null) && Math.random() > .5) {
				
			roomPlace(roomGrid[x][y-1], x, y-1);
		}
		if (y+1 < roomGrid[0].length && maxNumOfRooms > 0 && 
				!(roomGrid[x][y+1] === null) && Math.random() > .5) {
				
			roomPlace(roomGrid[x][y+1], x, y+1);
		}
	}
	
	Crafty.e('PlayerCharacter').at(5,5);
	max_hp = 3;
	player_hp = 3;
	speed = 2;
	exp = 0;
	allRooms = new Object();
	
	var mainroomX = getRandomInt(0, roomGridX-1);
	var mainroomY = getRandomInt(0, roomGridY-1);
	roomGrid[mainroomX][mainroomY] = new Room('mainroom', 'forest');
	roomPlace(roomGrid[mainroomX][mainroomY], mainroomX, mainroomY);

	/*
	new Room('1room', 'mainroom', 'n', Game.map_grid.width/2);
	new Room('2room', 'mainroom', 's', Game.map_grid.width/2);
	new Room('3room', 'mainroom', 'e', Game.map_grid.height/2);
	new Room('4room', 'mainroom', 'w', Game.map_grid.height/2);
	new Room('5room', '4room', 'w', Game.map_grid.height/4);
	*/
	for (var i in allRooms) {
		//console.log(i)
		allRooms[i].buildRoom();
	}
}


 
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
this.restart_game = function() {
Crafty.scene('Loading');
}
this.bind('KeyDown', this.restart_game );
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
this.restart_game = function() {
Crafty.scene('Loading');
};

this.bind('KeyDown', this.restart_game
)}, function() {
// Remove our event binding from above so that we don't
// end up having multiple redundant event watchers after
// multiple restarts of the game
this.unbind('KeyDown', this.restart_game);
});




// Loading scene
// -------------
// Handles the loading of binary assets1 such as images and audio files
Crafty.scene('Loading', function(){
// Draw some text for the player to see in case the file
// takes a noticeable amount of time to load
Crafty.e('2D, DOM, Text')
.text('Loading...')
.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
.css($text_css);

//Builds Level
 
// Load our sprite map image
Crafty.load(['assets1/16x16_forest_1.gif','assets1/16x16_forest_2.gif','assets1/Doors.gif','assets1/arrows.gif','assets1/arrows2.gif','assets1/treesv2.gif','assets1/wolfy.gif','assets1/hero.png'], function(){
// Once the image is loaded...
// Define the individual sprites in the image
// Each one (spr_tree, etc.) becomes a component
// These components' names are prefixed with "spr_"
// to remind us that they simply cause the entity
// to be drawn with a certain sprite
Crafty.sprite(16,'assets1/hero.png',{
	spr_player : [0,2]
});

Crafty.sprite(16,'assets1/wolfy.gif',{
	spr_wolfyback : [0,0],
	spr_wolfyfront :[0,1],
	spr_wolfyleft : [1,1],
	spr_wolfyright : [1,0]
});
Crafty.sprite(16,'assets1/treesv2.gif',{
	spr_tree1 : [0,0],
	spr_tree2 : [0,1],
	spr_tree3 : [1,1],
	spr_bush  : [1,0]
	
});
Crafty.sprite(16,'assets1/arrows.gif', {
	spr_arrowN : [0,0],
	spr_arrowS : [1,0],
	spr_arrowE : [0,1],
	spr_arrowW : [1,1]
}); 
Crafty.sprite(16,'assets1/arrows2.gif', {
	spr_arrow2N : [0,0],
	spr_arrow2S : [1,1],
	spr_arrow2E : [1,0],
	spr_arrow2W : [0,1]
}); 
Crafty.sprite(16,'assets1/Doors.gif',{
spr_door : [0,1],
}),
Crafty.sprite(16, 'assets1/16x16_forest_2.gif', {
//spr_door:[1,1],
spr_npc: [0,0]
}),
Crafty.sprite(16, 'assets1/16x16_forest_1.gif', {
//spr_tree: [0, 0],
//spr_bush: [1, 0],
spr_village: [0, 1],
//spr_player: [1, 1]
});

// Now that our sprites are ready to draw, start the game

var newpat = '(';
for (var x in allRooms) {
	newpat = newpat + x + '|';
}
newpat = newpat + ')';
newpat = new RegExp(newpat);
for (var x in window.localStorage) {
	if (newpat.test(x)) {
		window.localStorage.removeItem(x);
	}
}

initializeScene(10,10,10);
Crafty.scene('mainroom');

});

});







