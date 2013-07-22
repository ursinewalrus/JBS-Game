

// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene('Victory', 
	function() {
		// Display some text in celebration of the victory
		var a = Crafty.e('2D, DOM, Text,Keyboard')
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.text('Victory! Press Enter to start again!')
		.css($text_css);
		// Watch for the player to press a key, then restart the game
		// when a key is pressed
		this.restart_game = function() {
			if (a.isDown("ENTER")) {
				Crafty.scene('Start');
            }
		}
		this.bind('KeyDown', this.restart_game );
	}, function() {
		// Remove our event binding from above so that we don't
		// end up having multiple redundant event watchers after
		// multiple restarts of the game
		this.unbind('KeyDown', this.restart_game);
	}
);




// Losing Scene
// -------------
// Tells the player when they've lost and lets them start a new game
Crafty.scene('YouLose', 
	function() {
		// Display some text showing the loss
		var a = Crafty.e('2D, DOM, Text,Keyboard')
		.attr({ x: 0, y: Game.height()/2 -24, w:Game.width() })
		.text("You're so bad! You lose! Press Enter to start again!")
        .css($text_css);
		// Watch for the player to press a key, then restart the game
		// when a key is pressed
		this.restart_game = function() {
            if(a.isDown("ENTER")) {
                Crafty.scene('Start');
            }
		};

		this.bind('KeyDown', this.restart_game);
	}, function() {
		// Remove our event binding from above so that we don't
		// end up having multiple redundant event watchers after
		// multiple restarts of the game
		this.unbind('KeyDown', this.restart_game);
	}
);

//start screen

Crafty.scene('Start', 
    function(){
        var a = Crafty.e('2D,DOM,Text,Keyboard')
        .text('Press Enter to start game! Move with WSAD, Use magic with G, and shoot in the corresponding direction with IJKL, kill the boss to win!')
        .attr({ x:0, y:Game.height()/2 -24, w:Game.width()})
        .css($text_css);
        this.start = function() {
            if (a.isDown("ENTER")) {
            Crafty.scene('Loading');
            }
        }
        this.bind('KeyDown', this.start);
    }, 
    function () {
        this.unbind('KeyDown', this.start);
    });



// Loading scene
// -------------
// Handles the loading of binary assets1 such as images and audio files
Crafty.scene('Loading', 
	function(){
		// Draw some text for the player to see in case the file
		// takes a noticeable amount of time to load
		Crafty.e('2D, DOM, Text')
		.text('Loading...')
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.css($text_css);


		//Builds Level
 
		// Load our sprite map image
		Crafty.load(['assets/16x16_forest_1.gif','assets/16x16_forest_2.gif',
					'assets/Doors.gif','assets/arrows.gif','assets/arrows2.gif',
					'assets/treesv2.gif','assets/wolfy.gif','assets/hero.png',
					'assets/misc1.gif','assets/misc2.gif','assets/stolen2.png'], 
			function(){
				// Once the image is loaded...
				// Define the individual sprites in the image
				// Each one (spr_tree, etc.) becomes a component
				// These components' names are prefixed with "spr_"
				// to remind us that they simply cause the entity
				// to be drawn with a certain sprite
			
				Crafty.sprite(32,'assets/stolen2.png',{
				spr_molsty : [0,0]
				});
				
				Crafty.sprite(16,'assets/misc1.gif',{
					spr_deadguy : [0,0],
					spr_tome : [0,1],
					spr_brokesword : [1,0],
					spr_grave : [1,1]
				});
				
				Crafty.sprite(16,'assets/misc2.gif',{
					spr_rockfloor : [0,0]
				});
				
				Crafty.sprite(16,'assets/misc4.png',{
					spr_tuft : [0,0],
					spr_tree4 : [1,0]
				});
				Crafty.sprite(16,'assets/misc3.png',{
					spr_water : [1,1]				
				});

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
					spr_arrowS : [0,1],
					spr_arrowE : [1,0],
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
					//spr_player: [1, 1]
				});
				Crafty.sprite(16,'assets/hero.png',{
					spr_player : [0,2]
				});

				// Now that our sprites are ready to draw, start the game
				
				initializeScene(10, 10, 10, 30, 'forest');
				//testRoomBuild('forest');
			}
		);
	}
);





