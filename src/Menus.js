// ******** HP HUD ************
var HUD_Array = new Array ()
var menubool = true;
HUD = function (/*px,py,facing*/player) { 
	
	var hp = Crafty.e("2D, DOM,Color")
	hp.color('rgb(255,0,0)')
	hp.attr({w:player.player_hp*33, h:25,x:0,y:270,alpha:1.0})
	
	var hp_text = Crafty.e('2D, DOM, Color, Text')
	hp_text.attr({x:60,y:260,alpha:1.0})
	hp_text.text('HP')
	
	var item1 = Crafty.e("2D,DOM,spr_door,Mouse")
	.attr({w:16,h:16,x:120,y:270,alpha:1.0})
	item1.bind("Click",function(e){
		console.log(player.direction)
		console.log(player.at().x+" "+player.at().y)
		//if(arrow_spray == true){
			Crafty.e('Arrow').at(player.at().x,player.at().y).direction = player.direction;
		//}
	});
	if(!player.arrow_spray){var item2 = Crafty.e("2D,DOM,spr_door,Mouse")}
	else{var item2 = Crafty.e("2D,DOM,spr_tome,Mouse");}
	//var item2 = Crafty.e("2D,DOM,spr_door,Mouse")
	item2.attr({w:16,h:16,x:140,y:270,alpha:1.0})
	item2.bind("Click",function(e){
		if(player.arrow_spray){
			if(player.arrowTimer == 0){
				var saver = player.direction
				player.direction = 'n'
				Crafty.e('Arrow').at(player.at().x,player.at().y).direction = player.direction;
				player.direction = 'e'
				Crafty.e('Arrow').at(player.at().x,player.at().y).direction = player.direction;	
				player.direction = 's'
				Crafty.e('Arrow').at(player.at().x,player.at().y).direction = player.direction;
				player.direction = 'w'
				Crafty.e('Arrow').at(player.at().x,player.at().y).direction = player.direction;	
				//this.arrowTimer = 30;
				this.direction = saver 
			}
		}
	});
	
	var item3 = Crafty.e("2D,DOM,spr_door,Mouse")
	.attr({w:16,h:16,x:160,y:270,alpha:1.0})
	item3.bind("Click",function(e){
		if(player.arrowTimer==0)
			if(player.direction == 'n'){
				Crafty.e('Sword').at(player.at().x,player.at().y-1)
				player.arrowTimer=40
			}
			if(player.direction == 's'){
				Crafty.e('Sword').at(player.at().x,player.at().y+1)
				player.arrowTimer=40
			}
			if(player.direction == 'e'){
				Crafty.e('Sword').at(player.at().x+1,player.at().y)
				player.arrowTimer=40
			}
			if(player.direction == 'w'){
				Crafty.e('Sword').at(player.at().x-1,player.at().y)
				player.arrowTimer=40
			}
	});

	var exp_bar = Crafty.e('2D,DOM,Color')
	exp_bar.color('rgb(0,0,255)')
	exp_bar.attr({w:(player.exp/player.next_level)*100,h:10,x:0,y:230,alpha:1.0})
	
	var level_display = Crafty.e('2D,DOM,Color,Text')
	level_display.attr({x:5,y:10,alpha:1.0})
	level_display.text(player.level)
	
	
	HUD_Array.push(hp,hp_text,item1,item2,item3,exp_bar,level_display);
}

    

resetHUD = function() {
    while(HUD_Array.length > 0)
    {
    try{HUD_Array[0].destroy();}catch(err){console.log("Destroy failed");};
    try{HUD_Array.splice(0, 1);}catch(err){console.log("Splice failed")};
    }
   
}

