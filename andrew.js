function Robot(x, y, direction_facing){
    this.x = x;
    this.y = y;
    switch(direction_facing)
    {
        case "North":
            this.direction = 0;
            break;
        case "East":
            this.direction = 90;
            break;
        case "South":
            this.direction = 180;
            break;
        case "West":
            this.direction = 270;
            break;
    }
}

Robot.prototype.Place = function(x, y, direction_facing){
    this.x = x;
    this.y = y;
    switch(direction_facing)
    {
        case "North":
            this.direction = 0;
            break;
        case "East":
            this.direction = 90;
            break;
        case "South":
            this.direction = 180;
            break;
        case "West":
            this.direction = 270;
            break;
    }
};

Robot.prototype.Rotate = function(degrees){
    this.direction += degrees;
    while(this.direction >=360)
    {
        this.direction -= 360;
    }
    while(this.direction < 0)
    {
        this.direction += 360;
    }
};

Robot.prototype.DirectionInRadians = function(){
    return this.direction * Math.PI / 180;
};


Robot.prototype.Move = function(distance){
    this.x = clean(this.x+(distance * Math.cos(this.DirectionInRadians())));
    this.y = clean(this.y+(distance * Math.sin(this.DirectionInRadians())));
};

Robot.prototype.Left = function(){
    this.Rotate(-90);
};

Robot.prototype.Right = function(){
    this.Rotate(90);
};

Robot.prototype.Report = function(){
    switch(this.direction){
        case 0:
            return "X:"+ this.x + " Y:" + this.y + " North";
        case 90:
            return "X:"+ this.x + " Y:" + this.y + " East";
        case 180 :
            return "X:"+ this.x + " Y:" + this.y + " South";
        case 270 :
            return "X:"+ this.x + " Y:" + this.y + " West";
    }
};

function clean(number)
{
    return (parseFloat(number.toPrecision(10)));
}