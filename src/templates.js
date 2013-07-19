var allRooms;
var levelTemplate = new Object();
levelTemplate['forest'] = new Object();
//------------------------------------------------------------
//is forest template
levelTemplate['forest']['forest'] = function (rm) {
	roomSharedInital(rm,'spr_tree2');
	river(rm,12,8,14,1)
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if (Math.random() < 0.06 && !rm.occupied[x][y]) {
				// Place a bush entity at the current tile
				Crafty.e('SolidObj','spr_bush').at(x, y);
				rm.occupied[x][y] = true;
			} 
			if (Math.random()<.03 && !rm.occupied[x][y]){
				Crafty.e('Wolf').at(x, y);
				rm.occupied[x][y] = true;
			}
			if (Math.random()<.01 && !rm.occupied[x][y]){
				Crafty.e('Full_Heal').at(x,y);
				rm.occupied[x][y] = true
			}
			if (Math.random()<.01 && !rm.occupied[x][y]){
				Crafty.e('Arrow_Spray').at(x,y);
				rm.occupied[x][y] = true
			}
			if (Math.random()<.01 && !rm.occupied[x][y]){
				Crafty.e('Shooter').at(x, y);
				rm.occupied[x][y] = true;
			}
		}
	}
	roomSharedEnd(rm);
}

levelTemplate['forest']['forest'].genChance = .7;
levelTemplate['forest']['forest'].isBossRoom = false;

//------------------------------------------------------------
//is grid template
levelTemplate['forest']['grid'] = function (rm) {
	roomSharedInital(rm,'spr_tree2');
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if (Math.random() < 0.01 && !rm.occupied[x][y]) {
				// Place a bush entity at the current tile
				x_wall(rm,x,y,4,'spr_grave')
			} 
			if (Math.random() < 0.01 && !rm.occupied[x][y]) {
				// Place a bush entity at the current tile
				y_wall(rm,x,y,3,'spr_grave')
			} 
			if (Math.random() < 0.01 && !rm.occupied[x][y]) {
				// Place a bush entity at the current tile
				hut(rm,x,y,4,'spr_bush')
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
	roomSharedEnd(rm);
}

levelTemplate['forest']['grid'].genChance = .7;
levelTemplate['forest']['grid'].isBossRoom = false;
//------------------------------------------------------------
//is rocky template
levelTemplate['forest']['rock'] = function (rm) {
	roomSharedInital(rm,'spr_tree2');
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			x_spot(rm,12,8,'spr_grave')
			if(((x>0 && x<5)||(x>18 && x<23))&&((y>0 && y<5)||(y>10 && y<15))){
				Crafty.e('TileObj','spr_rockfloor').at(x,y)
				rm.occupied[x][y]=true;
			}
			if (Math.random() < 0.024 && !rm.occupied[x][y]) {
				// Place a bush entity at the current tile
				Crafty.e('Dead_Guy').at(x, y);
				rm.occupied[x][y] = true;
			} 
			if (Math.random()<.015 && !rm.occupied[x][y]){
				Crafty.e('SolidObj','spr_brokesword').at(x, y);
				rm.occupied[x][y] = true;
			}
			if(Math.random()<.01 && !rm.occupied[x][y]){
				Crafty.e('Tower').at(x,y);
				rm.occupied[x][y]=true
			}
		}
	}
	roomSharedEnd(rm);
}
levelTemplate['forest']['rock'].genChance = .7;
levelTemplate['forest']['rock'].isBossRoom = false;
//------------------------------------------------------------
//should be loaded in first, is not slotted in yet, just the starter room
levelTemplate['forest']['start'] = function (rm) {
	roomSharedInital(rm,'spr_tree2');
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if (Math.random()<.013 && !rm.occupied[x][y]){
				Crafty.e('Dead_Guy').at(x,y);
				rm.occupied[x][y] = true;
			}	
		}
	}
	roomSharedEnd(rm);
}

levelTemplate['forest']['start'].isBossRoom = false;
//--------------------------------------------------------
levelTemplate['forest']['mob_room'] = function (rm){
	roomSharedInital(rm,'spr_tree2');
	var foe_count = 0
		for (var x = 0; x < Game.map_grid.width; x++) {
			for (var y = 0; y < Game.map_grid.height; y++) {
				if(x>10 && x<14 && y>6 && y<10 && Math.random()>.75 && !rm.occupied[x][y]){
					Crafty.e('Full_Heal').at(x,y)
					rm.occupied[x][y] = true
				}
				if((x>8 && x<16)&&(y>4 && y<12) && Math.random()>.7&&!rm.occupied[x][y]){
					Crafty.e('Dead_Guy').at(x,y)
					rm.occupied[x][y] = true
				}
				if(x>4 && x<20 && y>2 && y<14 && Math.random()>.95&&!rm.occupied[x][y] && foe_count<5){
					Crafty.e('Shooter').at(x,y);
					rm.occupied[x][y] = true;
					foe_count++
				}
			}
		}
		roomSharedEnd(rm)
},
levelTemplate['forest']['mob_room'].isBossRoom  = false;
levelTemplate['forest']['mob_room'].genChance = .7;
//-----------------------------------------------------------
levelTemplate['forest']['overgrown'] = function(rm){
	roomSharedInital(rm,'spr_tree4');
	var foe_count = 0
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if(Math.random()>.83 && !rm.occupied[x][y]){
				Crafty.e('SolidObj','spr_tree4').at(x,y)
				rm.occupied[x][y] = true
			}
			if(Math.random()>.88 && !rm.occupied[x][y]){
				Crafty.e('Wolf').at(x,y)
				rm.occupied[x][y]=true
			}
			
		}
	}
	roomSharedEnd(rm)
},
levelTemplate['forest']['overgrown'].genChance = .7;
levelTemplate['forest']['overgrown'].isBossRoom = false
//------------------------------------------------------------
levelTemplate['forest']['crags'] = function(rm){//new enemy type in it? MOLESTICON????
	roomSharedInital(rm,'spr_tree2');
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if(x>0 && x<23 && y>0 && y<15 && Math.random()>.5){
				Crafty.e('TileObj','spr_rockfloor').at(x,y)
			}
		}
	}
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if(Math.random()>.95 && !rm.occupied[x][y]){
				Crafty.e('Wolf').at(x,y)
				rm.occupied[x][y]=true
			}
			if(Math.random()>.99 && !rm.occupied[x][y]){
				Crafty.e('Full_Heal').at(x,y)
				rm.occupied[x][y]=true
			}
		}
	}
	roomSharedEnd(rm)
}
levelTemplate['forest']['crags'].genChance = .7
levelTemplate['forest']['crags'].isBossRoom = false;
//---------------------------------------------------------
levelTemplate['forest']['graveyard'] = function(rm){
	roomSharedInital(rm,'spr_grave');
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if(x>0 && x<23 && y>0 && y<15 && Math.random()>.77){
				Crafty.e('TileObj','spr_rockfloor').at(x,y)
				rm.occupied[x][y]=true
			}
		}
	}
	for (var x = 0; x < Game.map_grid.width; x++) {//sexy ghosts???
		for (var y = 0; y < Game.map_grid.height; y++) {
			if(x%2==0 && y%2==0 && !rm.occupied[x][y]&&Math.random()>.45){
				Crafty.e('SolidObj','spr_brokesword').at(x,y)
				rm.occupied[x][y]=true
			}
			if(Math.random()>.94 && !rm.occupied[x][y]){
				Crafty.e('Shooter').at(x,y)
				rm.occupied[x][y]=true
			}
		}
	}
	roomSharedEnd(rm);
}
levelTemplate['forest']['graveyard'].genChance = .7
levelTemplate['forest']['graveyard'].isBossRoom = false;
/*

levelTemplate['forst']['mob_room']=function (rm){
	roomSharedInital(rm)
		for (var x = 0; x < Game.map_grid.width; x++) {
			for (var y = 0; y < Game.map_grid.height; y++) {
				if((x>8 && x<16)&&(y>4 && y<12) && Math.random()>.7){
					Crafty.e('Dead_Guy').at(x,y)
				}
				if(x>4 && x<20 && y>2 && y<14 && Math.random()>.)
			}
		}
}
//***** shared stuff
*/

function roomSharedInital(rm,skin,door_type) {
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
		var newDoor = new Crafty.e('Door', door_type);
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
				Crafty.e('SolidObj',skin).at(x, y);
				rm.occupied[x][y] = true;
			} 
			if (buffer_zone && !rm.occupied[x][y]) {
				rm.occupied[x][y] = true;
			}
		}
	}
}

function roomSharedEnd(rm) {
	if (Game.playerSave) {
		unserialize(Game.playerSave);
		delete Game.playerSave;
	}
	delete rm.occupied;
}