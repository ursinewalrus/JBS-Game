// ******** HP HUD ************
var HUD_Array = new Array ()

HUD = function () { 
	var hp = Crafty.e("2D, DOM,Color")
	hp.color('rgb(255,0,0)')
	hp.attr({w:player_hp*33, h:25,x:0,y:240,alpha:1.0})
	
	var hp_text = Crafty.e('2D, DOM, Color, Text')
	hp_text.attr({x:20,y:230,alpha:1.0})
	hp_text.text('HP')
	
	var Inventory_Button = Crafty.e("2D,DOM,Color,Mouse")
	Inventory_Button.color('rgb(255,216,0)')
	Inventory_Button.attr({w:20,h:20,x:0,y:220,alpha:0.5})
	Inventory_Button.bind("Click",function(e){makeInventory();});
	
	HUD_Array.push(hp,hp_text,Inventory_Button);
}

    

resetHUD = function() {
    while(HUD_Array.length > 0)
    {
    try{HUD_Array[0].destroy();}catch(err){console.log("Destroy failed");};
    try{HUD_Array.splice(0, 1);}catch(err){console.log("Splice failed")};
    }
   
}

// ****** Inventory Menu **************

var inventoryArray = new Array()
var helditems = new Array()
var founditems = new Array ()
makeInventory = function() {
	var inventoryScreen = Crafty.e("2D, DOM, Color, Mouse")
		inventoryScreen.color('rgb(255,255,255)')
		inventoryScreen.attr({w:384, h:256,x:0,y:0,alpha:1.0})
	var inventoryTitle = Crafty.e("2D,DOM,Text")
		inventoryTitle.attr({x:Game.map_grid.width+110, y:Game.map_grid.height,w:70, h:30})
		inventoryTitle.text(player_name+" INVENTORY")
		inventoryTitle.css({"font" : "16pt Arial","color":"0F0","test-align":"center"});
	var n = 0;
	var k = 0 ;

	for(var i=0;i<25;i++){
		if(i % 5 == 0){
			n++;
			k=0;
		}
		if(i==0){
			helditems[i] = Crafty.e('2D,DOM,spr_bush,Mouse')
			helditems[i].attr({w:16,h:16,x:45+(k*20),y:65+(n*20)})
			k++; 
		}else {
			helditems[i]=Crafty.e('2D,DOM,spr_village,Mouse')
			helditems[i].attr({w:16,h:16,x:45+(k*20),y:65+(n*20)})
			k++;		
		}
		
	}
	
		
	//char slots
	var headslot = Crafty.e('2D,DOM,spr_bush,Mouse')
		headslot.attr({w:16,h:16,x:275,y:65})	
		
	inventoryArray.push(inventoryScreen,inventoryTitle,
	helditems[1],helditems[2],helditems[3],helditems[4],helditems[5],
	helditems[6],helditems[7],helditems[8],helditems[9],helditems[10],
	helditems[11],helditems[12],helditems[13],helditems[14],helditems[15],
	helditems[16],helditems[17],helditems[18],helditems[19],helditems[20],
	helditems[21],helditems[22],helditems[23],helditems[24],helditems[0],
	headslot);
};



deleteInventory = function() {
    while(inventoryArray.length > 0)
    {
    try{inventoryArray[0].destroy();}catch(err){console.log("Destroy failed");};
    try{inventoryArray.splice(0, 1);}catch(err){console.log("Splice failed")};//remove the first entity
    }
}

// *************************** STATS ***************************************

player_name = "Face_Guy";

player_hp = 3;

beard_power = 1;

speed = 2; 

exp = 0;

level = 1; 

