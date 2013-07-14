//---------------------------------------------------------------------------------------
//------------------------- PERSISTANT WORLD STUFF --------------------------------------
//---------------------------------------------------------------------------------------


//Data Structure for entity data to create entitys for scene load and saving entity data
//on scene exit

var allRooms;
var levelTemplate = new Object();
levelTemplate['forest'] = new Object();

//is forest template
levelTemplate['forest']['forest'] = function (rm) {
	roomInital(rm);
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if (Math.random() < 0.06 && !rm.occupied[x][y]) {
				// Place a bush entity at the current tile
				Crafty.e('Bush').at(x, y);
				rm.occupied[x][y] = true;
			} 
			if (Math.random()<.03 && !rm.occupied[x][y]){
				Crafty.e('Wolf').at(x, y);
				rm.occupied[x][y] = true;
			}
			if (Math.random()<.01 && !rm.occupied[x][y]){
				Crafty.e('Full_Heal').at(x,y);
				rm.occupied[x][y]
			}
			if (Math.random()<.01 && !rm.occupied[x][y]){
				Crafty.e('Arrow_Spray').at(x,y);
				rm.occupied[x][y]
			}
			if (Math.random()<.01 && !rm.occupied[x][y]){
				Crafty.e('Shooter').at(x, y);
				rm.occupied[x][y] = true;
			}
		}
	}
}

levelTemplate['forest']['forest'].genChance = .7;
levelTemplate['forest']['forest'].isBossRoom = false;


//is grid template
levelTemplate['forest']['grid'] = function (rm) {
	roomInital(rm);
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if (Math.random() < 0.01 && !rm.occupied[x][y]) {
				// Place a bush entity at the current tile
				x_wall(rm,x,y,4,'bush')
			} 
			if (Math.random() < 0.01 && !rm.occupied[x][y]) {
				// Place a bush entity at the current tile
				y_wall(rm,x,y,3,'bush')
			} 
			if (Math.random() < 0.01 && !rm.occupied[x][y]) {
				// Place a bush entity at the current tile
				hut(rm,x,y,4,'bush')
			} 
			if (Math.random()<.03 && !rm.occupied[x][y]){
				Crafty.e('Wolf').at(x,y);
				rm.occupied[x][y] = true;
			}
			if (Math.random()<.01 && !rm.occupied[x][y]){
				Crafty.e('Full_Heal').at(x,y);
				rm.occupied[x][y] = true;
			}
			if (Math.random()<.01 && !rm.occupied[x][y]){
				Crafty.e('Arrow_Spray').at(x,y);
				rm.occupied[x][y] = true;
			}
				
		}
	}
}

levelTemplate['forest']['grid'].genChance = .7;
levelTemplate['forest']['grid'].isBossRoom = false;


function roomInital(rm) {
	// A 2D array to keep track of all occupied tiles
	rm.occupied = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		rm.occupied[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			rm.occupied[i][y] = false;
		}
	}
 
	// Player character, placed at 5, 5 on our grid
	// Player character, placed at 5, 5 on our grid
	//this.player.setDirection();
	if (rm.name == 'mainroom') {
		rm.occupied[5][5] = true;
	}
	
	//places Doors
	for (var i = 0; i < rm.roomLinks.length; i++) {
		var roomlnk = rm.roomLinks[i];
		var newDoor = new Crafty.e('Door');
		newDoor.setThisRoom(rm.name);
		newDoor.setLinkedRoom(roomlnk.nextRoom);
		if (roomlnk.direction == 'n') {
			newDoor.at(roomlnk.locationOnWall, 0);
			rm.occupied[roomlnk.locationOnWall][0] = true;
		} else 
		if (roomlnk.direction == 's') {
			newDoor.at(roomlnk.locationOnWall, Game.map_grid.height - 1);
			rm.occupied[roomlnk.locationOnWall][Game.map_grid.height - 1] = true;
		} else 
		if (roomlnk.direction == 'e') {
			newDoor.at(Game.map_grid.width - 1, roomlnk.locationOnWall);
			rm.occupied[Game.map_grid.width - 1][roomlnk.locationOnWall] = true;
		} else 
		if (roomlnk.direction == 'w') {
			newDoor.at(0, roomlnk.locationOnWall);
			rm.occupied[0][roomlnk.locationOnWall] = true;
		}
	}
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			var at_edge = ((x==0 || x == Game.map_grid.width-1) || (y==0 || y == Game.map_grid.height-1));
			var buffer_zone = ((x==1 || x == Game.map_grid.width-2) || (y==1 || y == Game.map_grid.height-2));
			if (at_edge && !rm.occupied[x][y]) {
				// Place a tree entity at the current tile
				Crafty.e('Tree').at(x, y);
				rm.occupied[x][y] = true;
			} 
			if (buffer_zone && !rm.occupied[x][y]) {
				rm.occupied[x][y] = true;
			}
		}
	}
}


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
		// Place a tree at every edge square on our grid of 16x16 tiles
		var chance = -1;
		var buildFunc;
		for (rmType in levelTemplate[rm.type]) {
			var genChance = levelTemplate[rm.type][rmType].genChance - Math.random();
			if (genChance > chance) {
				chance = genChance;
				buildFunc = levelTemplate[rm.type][rmType];
			}
		}
		buildFunc(rm);
		delete this.occupied;
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
	
function initializeScene(roomGridX, roomGridY, maxNumOfRooms, levelType) {
	
	resetParams();
	
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	var roomNumber = 0;
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
				
			roomGrid[x-1][y] = new Room(roomNumber + 'room', levelType);
			rm.linkRooms(roomGrid[x-1][y].name, 'w', Game.map_grid.height/2);
			roomNumber++;
			maxNumOfRooms--;
		}
		if (x+1 < roomGrid.length && roomGrid[x+1][y]  === null && 
				maxNumOfRooms > 0 && Math.random() > .5) {
				
			roomGrid[x+1][y] = new Room(roomNumber + 'room', levelType);
			rm.linkRooms(roomGrid[x+1][y].name, 'e', Game.map_grid.height/2);
			roomNumber++;
			maxNumOfRooms--;
		}
		if (y-1 >= 0 && roomGrid[x][y-1]  === null && 
				maxNumOfRooms > 0 && Math.random() > .5) {
				
			roomGrid[x][y-1] = new Room(roomNumber + 'room', levelType);
			rm.linkRooms(roomGrid[x][y-1].name, 'n', Game.map_grid.width/2);
			roomNumber++;
			maxNumOfRooms--;
		}
		if (y+1 < roomGrid[0].length && roomGrid[x][y+1]  === null && 
				maxNumOfRooms > 0 && Math.random() > .5) {
				
			roomGrid[x][y+1] = new Room(roomNumber + 'room', levelType);
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
	
	var mainroomX = getRandomInt(0, roomGridX-1);
	var mainroomY = getRandomInt(0, roomGridY-1);
	roomGrid[mainroomX][mainroomY] = new Room('mainroom', levelType);
	roomPlace(roomGrid[mainroomX][mainroomY], mainroomX, mainroomY);

	/*
	new Room('1room', 'mainroom', 'n', Game.map_grid.width/2);
	new Room('2room', 'mainroom', 's', Game.map_grid.width/2);
	new Room('3room', 'mainroom', 'e', Game.map_grid.height/2);
	new Room('4room', 'mainroom', 'w', Game.map_grid.height/2);
	new Room('5room', '4room', 'w', Game.map_grid.height/4);
	*/
	for (var i in allRooms) {
		allRooms[i].buildRoom();
	}
}

function resetParams() {
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
	Crafty.e('PlayerCharacter').at(5,5);
	max_hp = 3;
	player_hp = 3;
	speed = 2;
	exp = 0;
	allRooms = new Object();
}

function testRoomBuild(type) {
	Crafty.e('PlayerCharacter').at(5,5);
	max_hp = 3;
	player_hp = 3;
	speed = 2;
	exp = 0;
	allRooms = new Object();
	var coolroom = new Room('mainroom', type);
	coolroom.buildRoom();
}

