function Robot(){
    this.x = -1;
    this.y = -1;
    this.dirt = new Array();

    var tableFile = new XMLHttpRequest();
    tableFile.open("GET", "http://localhost/table_size.txt", true);
    tableFile.onreadystatechange = function()
    {
      if (tableFile.readyState === 4) {  // document is ready to parse.
        if (tableFile.status === 200) {  // file is found
          allText = tableFile.responseText; 
            words = allText.split(/[ ,]+/);
            this.maxX = parseInt(words[0]);
            this.maxY = parseInt(words[1]);
        }
      }
    }
    tableFile.send(null);

    var dirtFile = new XMLHttpRequest();
    dirtFile.open("GET", "http://localhost/dirt_positions.txt", true);
    dirtFile.onreadystatechange = function()
    {
      if (dirtFile.readyState === 4) {  // document is ready to parse.
        if (dirtFile.status === 200) {  // file is found
            if(this.dirt == null){
                this.dirt = new Array();
            }
            allText = dirtFile.responseText; 
            piles = allText.split("\n");
            for(var i=0; i<piles.length; i++)
            {
                coordinates = piles[i].split(/[ ,]+/);
                this.dirt[i] = {x:coordinates[0], y:coordinates[1]}
            }
        }
      }
    }
    dirtFile.send(null);

    this.direction = 0;

}

Robot.prototype.Place = function(x, y, direction_facing){
    if(0 > x || x > this.maxX)
    {
        return;
    }
    if(0 > y || y > this.maxY)
    {
        return;
    }
    for(i=0;i<this.dirt.length;i++)
    {
        if(this.dirt[i].x==x && this.dirt[i].y==y)
        {
            return;
        }
    }
    switch(direction_facing)
    {
        case "NORTH":
            this.direction = 0;
            break;
        case "EAST":
            this.direction = 90;
            break;
        case "SOUTH":
            this.direction = 180;
            break;
        case "WEST":
            this.direction = 270;
            break;
        default:
            return;
    }
    
    this.x = x;
    this.y = y;
};

Robot.prototype.Rotate = function(degrees){
    if(!this.Initialized())
    {
        return;
    }
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


Robot.prototype.Relocate = function(distance){
    var tempX = clean((distance * Math.cos(this.DirectionInRadians())));
    var tempY = clean((distance * Math.sin(this.DirectionInRadians())));
    return {X: tempX, Y: tempY};
}

Robot.prototype.Move = function(distance){
    if(!this.Initialized())
    {
        return;
    }
    distance= typeof distance !== 'undefined' && !isNaN(distance) ? distance : 1;

    var newLocation = this.Relocate(1);
    var tempX = this.x+newLocation[tempX];
    var tempY = this.y+newLocation[tempY];

    for(i=0;i<this.dirt.length;i++)
    {
        if(this.dirt[i].x==tempX && this.dirt[i].y==tempY)
        {
            return;
        }
    }

    if(tempX > 0 && tempX < this.maxX && tempY > 0 && tempY < this.maxY){
        this.x = tempX;
        this.y = tempY;
    }
    

};

Robot.prototype.Clean = function(distance){
    if(!this.Initialized())
    {
        return;
    }
    distance= typeof distance !== 'undefined' && !isNaN(distance) ? distance : 1;

    var newLocation = this.Relocate(1);
    var tempX = this.x+newLocation[tempX];
    var tempY = this.y+newLocation[tempY];

    for(i=0;i<this.dirt.length;i++)
    {
        if(this.dirt[i].x==tempX && this.dirt[i].y==tempY)
        {
            this.dirt.splice(i,1);
        }
    }

    if(this.dirt.length==0)
    {
        //exit
    }

};

Robot.prototype.Left = function(){
    if(!this.Initialized())
    {
        return;
    }
    this.Rotate(-90);
};

Robot.prototype.Right = function(){
    if(!this.Initialized())
    {
        return;
    }
    this.Rotate(90);
};

Robot.prototype.Report = function(){
    var test = this.Initialized();
    if(!test)
    {
        return display("INVALID ROBOT PLACEMENT");
    }

    switch(this.direction){
        case 0:
            return display("["+ this.x + "," + this.y + "] NORTH");
        case 90:
            return display("["+ this.x + "," + this.y + "] EAST");
        case 180 :
            return display("["+ this.x + "," + this.y + "] SOUTH");
        case 270 :
            return display("["+ this.x + "," + this.y + "] WEST");
    }
};

Robot.prototype.Initialized = function(){
    if(this.x < 0 || this.y < 0)
    {
        return false;
    }
    return true;
}


function clean(number)
{
    return (parseFloat(number.toPrecision(10)));
}

function display(message){
    $("#Test").append("<p>"+ message + "</p>");
}
var robot = new Robot();

var txtFile = new XMLHttpRequest();
txtFile.open("GET", "http://localhost/robot_commands.txt", true);
txtFile.onreadystatechange = function()
{
  if (txtFile.readyState === 4) {  // document is ready to parse.
    if (txtFile.status === 200) {  // file is found
      allText = txtFile.responseText; 
      lines = allText.split("\n");
      for(var i=0; i<lines.length; i++)
      {
        words = lines[i].split(/[ ,]+/);
        if(words[0]=="MOVE")
        {
            robot.Move(parseInt(words[1]));
        }
        if(words[0]=="LEFT")
        {
            robot.Left();
        }
        if(words[0]=="RIGHT")
        {
            robot.Right();
        }
        if(words[0]=="PLACE")
        {
            robot.Place(parseInt(words[1]), parseInt(words[2]), words[3]);
        }
        if(words[0]=="REPORT")
        {
            robot.Report();
        }
      }
    }
  }
}
txtFile.send(null);

