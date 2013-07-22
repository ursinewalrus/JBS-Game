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
		if (rm.name == 'bossroom') {
			levelTemplate[rm.type]['bossroom'](rm);
		} else 
		if (rm.name == 'mainroom') {
			levelTemplate[rm.type]['mainroom'](rm);
		} else {
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
		}
	});
}

Room.prototype.exit = function() {
	this.saveData = new Object();
	
	this.saveData.background = new Array();
	var ents = Crafty('BackgroundObject');
	for (var i = 0; i < ents.length; i++) {
		this.saveData.background[i] = serialize(Crafty(ents[i]));
	};
	
	this.saveData.foreground = new Array();
	var ents = Crafty('ForegroundObject');
	for (var i = 0; i < ents.length; i++) {
		this.saveData.foreground[i] = serialize(Crafty(ents[i]));
	};
	
	this.saveData.npc = new Array();
	var ents = Crafty('NPC');
	for (var i = 0; i < ents.length; i++) {
		this.saveData.npc[i] = serialize(Crafty(ents[i]));
	};
	var ents = Crafty('PlayerCharacter');
	Game.playerSave = serialize(Crafty(Crafty('PlayerCharacter')[0]));
	
	
	var rm = this
	Crafty.scene(rm.name, function() {
		for (var i = 0; i < rm.saveData.background.length; i++) {
			unserialize(rm.saveData.background[i]);
		}
		for (var i = 0; i < rm.saveData.foreground.length; i++) {
			unserialize(rm.saveData.foreground[i]);
		}
		for (var i = 0; i < rm.saveData.npc.length; i++) {
			unserialize(rm.saveData.npc[i]);
		}
		unserialize(Game.playerSave)
		delete rm.saveData;
		delete Game.playerSave;
	});
}

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
	
function initializeScene(roomGridX, roomGridY, maxNumOfRooms, minNumOfRooms, levelType) {
	
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
			minNumOfRooms--;
			maxNumOfRooms--;
		}
		if (x+1 < roomGrid.length && roomGrid[x+1][y]  === null && 
				maxNumOfRooms > 0 && Math.random() > .5) {
				
			roomGrid[x+1][y] = new Room(roomNumber + 'room', levelType);
			rm.linkRooms(roomGrid[x+1][y].name, 'e', Game.map_grid.height/2);
			roomNumber++;
			minNumOfRooms--;
			maxNumOfRooms--;
		}
		if (y-1 >= 0 && roomGrid[x][y-1]  === null && 
				maxNumOfRooms > 0 && Math.random() > .5) {
				
			roomGrid[x][y-1] = new Room(roomNumber + 'room', levelType);
			rm.linkRooms(roomGrid[x][y-1].name, 'n', Game.map_grid.width/2);
			roomNumber++;
			minNumOfRooms--;
			maxNumOfRooms--;
		}
		if (y+1 < roomGrid[0].length && roomGrid[x][y+1]  === null && 
				maxNumOfRooms > 0 && Math.random() > .5) {
				
			roomGrid[x][y+1] = new Room(roomNumber + 'room', levelType);
			rm.linkRooms(roomGrid[x][y+1].name, 's', Game.map_grid.width/2);
			roomNumber++;
			minNumOfRooms--;
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
	
	//accounting for boss room
	maxNumOfRooms--;
	minNumOfRooms--;
	
	while (minNumOfRooms > 0) {
		roomPlace(roomGrid[mainroomX][mainroomY], mainroomX, mainroomY);
	}
	
	//adding boss room
	for (var x = 0; x < roomGrid.length; x++) {
		var shouldBreak = false;
		for (var y = 0; y < roomGrid[x].length; y++) {
			if ((x - 1) >= 0 && roomGrid[x][y] == null && roomGrid[x-1][y] != null) {
				roomGrid[x][y] = new Room('bossroom', levelType);
				roomGrid[x][y].linkRooms(roomGrid[x-1][y].name, 'w', Game.map_grid.height/2);
				shouldBreak = true;
				break;
			} else 
			if ((x + 1) < roomGrid.length && roomGrid[x][y] == null && roomGrid[x+1][y] != null) {
				roomGrid[x][y] = new Room('bossroom', levelType);
				roomGrid[x][y].linkRooms(roomGrid[x+1][y].name, 'e', Game.map_grid.height/2);
				shouldBreak = true;
				break;
			} else 
			if ((y - 1) >= 0 && roomGrid[x][y] == null && roomGrid[x][y-1] != null) {
				roomGrid[x][y] = new Room('bossroom', levelType);
				roomGrid[x][y].linkRooms(roomGrid[x][y-1].name, 'n', Game.map_grid.width/2);
				shouldBreak = true;
				break;
			} else 
			if ((y + 1) < roomGrid[x].length && roomGrid[x][y] == null && roomGrid[x][y+1] != null) {
				roomGrid[x][y] = new Room('bossroom', levelType);
				roomGrid[x][y].linkRooms(roomGrid[x][y+1].name, 's', Game.map_grid.width/2);
				shouldBreak = true;
				break;
			}
		}
		if (shouldBreak) {
			break;
		}
	}
	
	for (var i in allRooms) {
		allRooms[i].buildRoom();
	}
	Crafty.scene('mainroom');
	Crafty.e('PlayerCharacter').at(5,5);
}

function resetParams() {
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

