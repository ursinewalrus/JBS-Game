pond = function(room,x,y){
	x_spot(room,x,y,'Water')
	Crafty.e('Water').at(x-1,y)
	room.occupied[x-1][y] = true
	Crafty.e('Water').at(x+1,y)
	room.occupied[x+1][y] = true
	Crafty.e('Water').at(x,y+1)
	room.occupied[x][y+1] = true
	Crafty.e('Water').at(x,y-1)
	room.occupied[x][y-1] = true
}
x_spot = function(room,x,y,type){
	if(type=='Bush'){skin='Bush'}
	if(type=='Grave'){skin='Grave'}
	if(type=='Water'){skin='Water'}
	if(!room.occupied[x][y]){
		Crafty.e(skin).at(x,y)
		room.occupied[x][y] = true
	}if(!room.occupied[x+1][y+1]){
		Crafty.e(skin).at(x+1,y+1)
		room.occupied[x+1][y+1] = true
	}if(!room.occupied[x-1][y-1]){
		Crafty.e(skin).at(x-1,y-1)
		room.occupied[x-1][y-1] = true
	}if(!room.occupied[x+1][y-1]){
		Crafty.e(skin).at(x+1,y-1)
		room.occupied[x+1][y-1] = true
	}if(!room.occupied[x-1][y+1]){
		Crafty.e(skin).at(x-1,y+1)
		room.occupied[x-1][y+1] = true
	}	
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
	if(type=='Bush'){skin = 'Bush'}
	if(type=='Grave'){skin='Grave'}
	for(var t=0; t<size; t++){
		if(x+t<22 && y<15 && !room.occupied[x+t][y]){
			Crafty.e(skin).at(x+t,y);
			room.occupied[x+t][y] = true
		}
	}
};
// ********* structures for rooms
y_wall = function (room,x,y,size,type) {
	var skin = ''
	if(type=='Bush'){skin = 'Bush'}
	if(type=='Grave'){skin='Grave'}
	for(var t=0; t<size; t++){
		if(y+t<15 && x<22 && !room.occupied[x][y+t]){
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