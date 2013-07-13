x_spot = function(room,x,y,type){
	if(type=='bush'){skin="Bush"}
	
}

channel = function(room,x,y,size,type,ori){
	if(ori==1){
		x_wall(room,x,y,size,type)
		x_wall(room,x,y+2,size,type)
	}
	else if(ori==2){
		y_wall(room,x,y,size,type)
		y_wall(room,x+2,y,size,type)
	}
}


x_wall = function (room,x,y,size,type) {
	var skin=''
	if(type=='bush'){skin = 'Bush'}
	for(var t=0; t<size; t++){
		if(x+t<23 && y<16 && !room.occupied[x+t][y]){
			Crafty.e(skin).at(x+t,y);
			room.occupied[x+t][y] = true
		}
	}
};
// ********* structures for rooms
y_wall = function (room,x,y,size,type) {
	var skin = ''
	if(type=='bush'){skin = 'Bush'}
	for(var t=0; t<size; t++){
		if(y+t<15 && x<23 && !room.occupied[x][y+t]){
			Crafty.e(skin).at(x,y+t);
			room.occupied[x][y+t] = true
		}
	}
};

hut = function(room,x,y,size,type){
	var sider = Math.random()
	if(sider<.5){
		x_wall(room,x,y,size/2,type)
		x_wall(room,x+(Math.floor(size/2)),y,Math.floor(size/2),type)
		x_wall(room,x,y+size,size+1,type)
		y_wall(room,x,y,size,type)
		y_wall(room,x+size,y,size,type)
	}else{
		x_wall(room,x,y,size,type);
		x_wall(room,x,y+size,size+1,type)
		y_wall(room,x,y/2,size,type)
		y_wall(room,x,y+(Math.floor(size/2)),Math.floor(size/2),type)
		y_wall(room,x+size,y,size,type)
	}

};