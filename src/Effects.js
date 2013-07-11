shoot = function(data){
if(this.isDown('G')&& arrow_spray == true){
	if(this.arrowTimer == 0){
		console.log("hh")
		saver = this.direction
		this.direction = 'n'
		Crafty.e('Arrow').at(this.at().x,this.at().y).direction = this.direction;
		this.direction = 'e'
		Crafty.e('Arrow').at(this.at().x,this.at().y).direction = this.direction;	
		this.direction = 's'
		Crafty.e('Arrow').at(this.at().x,this.at().y).direction = this.direction;
		this.direction = 'w'
		Crafty.e('Arrow').at(this.at().x,this.at().y).direction = this.direction;	
		this.arrowTimer = 30;
		this.direction = saver 
	}
}
};