river = function(room,x,y,size,ori){
	var x_way = 0
	var y_way = 0
	var x_count = 0
	var y_count = 0
	if(ori==1){x_way++}
	if(ori==2){y_way++}
	if(x_way==1){var x_way2=0}
	else{var x_way2=1}
	if(y_way==1){var y_way2=0}
	else{y_way2=1}
	for(var t=0;t<size;t++){
		var dir = Math.random()
		if(dir<.5 && !room.occupied[x+((x_count+1)*x_way)][y+((y_count+1)*y_way)]){
			Crafty.e('Water').at(x+((x_count+1)*x_way),y+((y_count+1)*y_way))
			room.occupied[x+((x_count+1)*x_way)][y+((y_count+1)*y_way)] = true
			if(x_way==1){x_count++}
			if(y_way==2){y_count++}
		}else if(dir>.5 && dir<.75 && !room.occupied[x+((x_count+1)*x_way2)][y+((y_count+1)*y_way2)]){
			Crafty.e('Water').at(x+((x_count+1)*x_way2),y+((y_count+1)*y_way2))	
			room.occupied[x+((x_count+1)*x_way2)][y+((y_count+1)*y_way2)] = true
			if(x_way==1){y_count++}
			if(y_way==2){x_count++}
		}else if(!room.occupied[x+((x_count-1)*x_way2)][y+((y_count-1)*y_way2)]){
			Crafty.e('Water').at(x+((x_count-1)*x_way2),y+((y_count-1)*y_way2))	
			room.occupied[x+((x_count-1)*x_way2)][y+((y_count-1)*y_way2)] = true
			if(x_way==1){y_count--}
			if(y_way==2){x_count--}
		}
		
	}
}

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
	if(!room.occupied[x][y]){
		Crafty.e('SolidObj',type).at(x,y)
		room.occupied[x][y] = true
	}if(!room.occupied[x+1][y+1]){
		Crafty.e('SolidObj',type).at(x+1,y+1)
		room.occupied[x+1][y+1] = true
	}if(!room.occupied[x-1][y-1]){
		Crafty.e('SolidObj',type).at(x-1,y-1)
		room.occupied[x-1][y-1] = true
	}if(!room.occupied[x+1][y-1]){
		Crafty.e('SolidObj',type).at(x+1,y-1)
		room.occupied[x+1][y-1] = true
	}if(!room.occupied[x-1][y+1]){
		Crafty.e('SolidObj',type).at(x-1,y+1)
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
	for(var t=0; t<size; t++){
		if(x+t<22 && y<15 && !room.occupied[x+t][y]){
			Crafty.e('SolidObj',type).at(x+t,y);
			room.occupied[x+t][y] = true
		}
	}
};
// ********* structures for rooms
y_wall = function (room,x,y,size,type) {
	for(var t=0; t<size; t++){
		if(y+t<15 && x<22 && !room.occupied[x][y+t]){
			Crafty.e('SolidObj',type).at(x,y+t);
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