// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
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
var trans = ((y>6 && y<9)&&(x==0 || x == Game.map_grid.width-1)) || ((x>10 && x<13)&&(y==0 || y == Game.map_grid.height-1)) ;
var middle = !at_edge && !trans;

if (at_edge) {
// Place a tree entity at the current tile
Crafty.e('Tree').at(x, y);
this.occupied[x][y] = true;
} else if (Math.random() < 0.06 && !this.occupied[x][y] && middle) {
// Place a bush entity at the current tile
Crafty.e('Bush').at(x, y);
this.occupied[x][y] = true;
}
if (trans) {
Crafty.e('Door').at(x,y);
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
Crafty.scene('Game');
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
 
// Load our sprite map image
Crafty.load(['assets/16x16_forest_1.gif','assets/16x16_forest_2.gif'], function(){
// Once the image is loaded...
 
// Define the individual sprites in the image
// Each one (spr_tree, etc.) becomes a component
// These components' names are prefixed with "spr_"
// to remind us that they simply cause the entity
// to be drawn with a certain sprite
	
Crafty.sprite(16, 'assets/16x16_forest_2.gif', {
spr_door:[1,1]
}),
Crafty.sprite(16, 'assets/16x16_forest_1.gif', {
spr_tree: [0, 0],
spr_bush: [1, 0],
spr_village: [0, 1],
spr_player: [1, 1]
}),

// Now that our sprites are ready to draw, start the game
Crafty.scene('Game');
});

});