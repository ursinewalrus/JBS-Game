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
},
});
 
// A Tree is just an Actor with a certain sprite
Crafty.c('Tree', {
init: function() {
this.requires('Actor, Solid, spr_tree');
},
});

Crafty.c('Door',{
init:function(){
this.requires('Actor,Solid, spr_door');
}
});

// A Bush is just an Actor with a certain sprite
Crafty.c('Bush', {
init: function() {
this.requires('Actor, Solid, spr_bush');
},
});

 
// This is the player-controlled character
Crafty.c('PlayerCharacter', {
init: function() {
this.requires('Actor, Fourway, Collision, spr_player, SpriteAnimation')
.fourway(4)
.stopOnSolids()
.onHit('Village', this.visitVillage)
.onHit('Door', this.move)

.animate('Pup',0,0,2)
.animate('Pr',0,1,2)
.animate('Pd',0,2,2)
.animate('Pl',0,3,2);

var animation_speed = 8;
this.bind('NewDirection',function(data){
 if (data.x > 0) {
this.animate('PlayerMovingRight', animation_speed, -1);
} else if (data.x < 0) {
this.animate('PlayerMovingLeft', animation_speed, -1);
} else if (data.y > 0) {
this.animate('PlayerMovingDown', animation_speed, -1);
} else if (data.y < 0) {
this.animate('PlayerMovingUp', animation_speed, -1);
} else {
this.stop();
}
});

},
 
// Registers a stop-movement function to be called when
// this entity hits an entity with the "Solid" component
stopOnSolids: function() {
this.onHit('Solid', this.stopMovement);
 
return this;
},
 
// Stops the movement
stopMovement: function() {
this._speed = 0;
if (this._movement) {
this.x -= this._movement.x;
this.y -= this._movement.y;
}
},


// Respond to this player visiting a village
visitVillage: function(data) {
villlage = data[0].obj;
villlage.visit();
}
});


// A village is a tile on the grid that the PC must visit in order to win the game
Crafty.c('Village', {
init: function() {
this.requires('Actor, spr_village');
},
 
// Process a visitation with this village
visit: function() {
this.destroy();
Crafty.trigger('VillageVisited', this);
}
});



