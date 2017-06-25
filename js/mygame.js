var WIDTH = 800;
var HEIGHT = 600;
var Gravity = 1;
var Influx = 1;
var ShapesCounter = 0;
var SahpesArea = 0;
var ShapeMaxSize = 100;
var ShapeMinSize = 50;

function myGame (width, height, container_id, callback) {
	WIDTH = width;
	HEIGHT = height;
	this.callback = callback;

	this.GravityMax = 10.0;
	this.GravityMin = 0.5;
	this.GravityStep = 0.5;

	this.InfluxMax = 10;
	this.InfluxMin = 1;
	this.InfluxStep = 1;

	var app = new PIXI.Application(WIDTH, HEIGHT, {backgroundColor : 0x1099bb});
	//document.body.appendChild(app.view);
	document.getElementById(container_id).appendChild(app.view);

	//background
	var background = new PIXI.extras.TilingSprite(
	    PIXI.Texture.fromImage('images/background.png'),
	    WIDTH,
	    HEIGHT);
	app.stage.addChild(background);
	background.interactive = true;
	//call creation of random shape when click on background
	background.on('click', function(e){
		var mouseData = e.data.getLocalPosition(background);
		shapeWorld.addChild(randomShape(mouseData.x, mouseData.y, onClickShape));
	});

	//make container for shapes
	var shapeWorld = new PIXI.Container();
	app.stage.addChild(shapeWorld);

	//animate update
	var last_time = Date.now();
	app.ticker.add(function(delta) {
		//count shapes counts and calculation of shapes area
		var ShapesCounter_prev = ShapesCounter;
		ShapesCounter = 0;
		SahpesArea = 0;
		shapeWorld.children.forEach(function(shape) {
			ShapesCounter++;
			SahpesArea += shape.area;
			// update shape
			shape.y += shape.speed;
			shape.speed += delta * Gravity / 100;
			if (shape.y > HEIGHT + shape.height/2)
				shape.destroy();
		});
		//if need call callback function to update data on HTML		
		if (ShapesCounter != ShapesCounter_prev)
			callback();

		var new_time = Date.now();
		//if it a time to create new shape
		if (new_time - last_time > 1000/Influx) {
			var newshape = randomShape(0, 0, onClickShape);
			newshape.x=(WIDTH-newshape.width)*Math.random();
			newshape.y = -newshape.height;
			shapeWorld.addChild(newshape);
			last_time = new_time;
		}
	});

	//this function called when click on shape
	function onClickShape(obj) {
		//change the color of all shapes of the same type 		
		shapeWorld.children.forEach(function(shape) {
			if ((shape != obj) & (shape.type == obj.type)) {
				redrawShape(shape, obj);
			}
		});
		// destroy shape
		obj.destroy();
	}

	// "timer"
	/*
	last_time = Date.now();
	app.ticker.add(function(delta) {
		var new_time = Date.now();
		if (new_time - last_time > 1000/Influx) {
			var newshape = randomShape(WIDTH*Math.random(), 0)
			newshape.y = -newshape.height;
			shapeWorld.addChild(newshape);
			last_time = new_time;
		}
	});
	*/
}

myGame.prototype.GravityInc = function() {
	if (Gravity < this.GravityMax) {
		Gravity += this.GravityStep;
		this.callback();
	}
};

myGame.prototype.GravityDec = function() {
	if (Gravity > this.GravityMin) {
		Gravity -=  this.GravityStep;
		this.callback();
	}
};

myGame.prototype.getGravity = function() {
	return Gravity;
};

myGame.prototype.InfluxInc = function() {
	if (Influx < this.InfluxMax) {
		Influx += this.InfluxStep;
		this.callback();
	}
};

myGame.prototype.InfluxDec = function() {
	if (Influx > this.InfluxMin) {
		Influx -= this.InfluxStep;
		this.callback();
	}
};

myGame.prototype.getInflux = function() {
	return Influx;
};

myGame.prototype.getShapesCounter = function() {
	return ShapesCounter;
};

myGame.prototype.getSahpesArea = function() {
	return Math.round(SahpesArea);
};

//create random shape
function randomShape(x, y, callbackOnClick) {
	var shape = new PIXI.Graphics();
	
	//set a fill and line style
	shape.FillColor = 0xFFFFFF * Math.random();
	shape.BorderColor = 0xFFFFFF * Math.random();
	shape.beginFill(shape.FillColor);
	shape.lineStyle(2, shape.BorderColor, 1);

	shape.interactive = true;
	shape.on('click', function(delta) {callbackOnClick(this);});

	shape.speed = 0;
	shape.area = 0;

	//cenerate random type. 0-triangle; 1-quadrilateral; 2-circle;
	shape.type = Math.round(Math.random()*2);

	//triangle
	if (shape.type == 0) {
		var x1=0, y1=0;
		var x2=ShapeMinSize+(ShapeMaxSize-ShapeMinSize)*Math.random(), y2=0;
		var x3=(ShapeMaxSize-ShapeMinSize)*Math.random(), y3=ShapeMinSize+ShapeMaxSize*Math.random();

		shape.poligon = new PIXI.Polygon(x1,y1, x2,y2, x3,y3, x1,y1);
		shape.drawShape(shape.poligon);

		shape.pivot.set(0.5,0.5);
		shape.rotation = Math.random()*Math.PI/8;

		shape.position.x = -shape.width/2;
		shape.position.y = -shape.height/2;

		shape.area = (x2-x1)*y3 - (x3-x1)*y3/2 - (x2-x3)*y3/2;
	}

	//quadrilateral
	if (shape.type == 1) {
		var x1=ShapeMaxSize*Math.random()/2, y1=0;
		var x2=ShapeMaxSize/2+ShapeMaxSize*Math.random()/2, y2=0;
		var x3=(x2-x1)*Math.random(), y3=ShapeMinSize+(ShapeMaxSize-ShapeMinSize)*Math.random();
		var x4=0, y4=y3*Math.random();

		shape.poligon = new PIXI.Polygon(x1,y1, x2,y2, x3,y3, x4,y4, x1,y1);
		shape.drawShape(shape.poligon);

		shape.pivot.set(0.5,0.5);
		shape.rotation = Math.random()*Math.PI/8;

		shape.position.x = -shape.width/2;
		shape.position.y = -shape.height/2; 

		shape.area = (x2-x4)*(y3-y1) - x1*y4/2 - (x2-x3)*y3/2 - (x3-x4)*(y3-y4)/2;
	}

	//circle
	if (shape.type == 2) {
		shape.radius=(ShapeMinSize+(ShapeMaxSize-ShapeMinSize)*Math.random())/2;
		shape.drawCircle(0, 0, shape.radius);
		shape.area = Math.PI*Math.pow(shape.radius,2);
	}

	shape.x+=x;
	shape.y+=y;

	return shape;
}

//this function redraw shape by new colors
function redrawShape(shape, src) {
	shape.FillColor = src.FillColor;
	shape.BorderColor = src.BorderColor;
	shape.beginFill(shape.FillColor);
	shape.lineStyle(2, shape.BorderColor, 1);

	if (shape.type < 2) { 
		//polyhedron
		shape.drawShape(shape.poligon);
	}
	else {
		//circle
		shape.drawCircle(0, 0, shape.radius);
	}
}

