// Defining the snake as a variable.
var snake;
var food;
var menu;
var gridsize = window.innerWidth/50;
var gameon = 1;

function setup() {
	createCanvas(windowWidth, Math.floor(windowHeight/(gridsize))*(gridsize));
	frameRate(10);
	// Declaring the existance of the snake function.
	snake = new snake();
	// Make food at a random place.
	pickFoodLocation();
}

function draw() {
	console.log('moved %i', frameRate());
	// Clears the canvas before drawing next frame. It wouldn't be needed if the background wasn't transparent.
	clear();
	// Setting the background to transparent, so I can place it above a webpage using index-z in CSS.
	background(255, 0);
	// When the snake dies show menu, but if it's alive continue game.
	if (snake.death() == true) {
		frameRate(1);
		gamemenu();
	} else {
		snake.update();
	}
	// Defines how the snake is drawn.
	snake.show();
	// What happens when the snake eats food.
	if (snake.eat(food)) {
		pickFoodLocation();
	}
	// Color all undefined elements blue.
	fill('#4bb6f5');
	// Make all element strokes transparent.
	stroke(255, 0);
	// Draw the food.
	rect(food.x, food.y, gridsize, gridsize);
	// Clear the game when ESC is pressed after the snake dies.
	if (gameon == 0) {
		clear();
	}
}

// Defining wht the snake can do.
function snake() {
	this.x = 0;
	this.y = 0;
	this.xspeed = gridsize;
	this.yspeed = 0;
	this.segments = 0;
	this.tail = [];

	// Showing how the direction of the snake is calculated. The if statement ensures that the snake cannot reverse. (For example, if the snake is going down, it can't start going up after it is longer than one segment.)
	this.direction = function(x, y) {
		// If the snake is one segment it can go every way.
		if (this.segments == 0) {
			this.xspeed = x*gridsize;
			this.yspeed = y*gridsize;
		// If it is longer than one segment it can only go where its tale isn't in the way.
		} else {
			if (x*gridsize == -this.xspeed || y*gridsize == -this.yspeed) {} else {
				this.xspeed = x*gridsize;
				this.yspeed = y*gridsize;
			}
		}
	}	

	// Snake movement (or placement)
	this.update = function() {
		for (var i = 0; i < this.tail.length-1; i++) {
			this.tail[i] = this.tail[i+1];
		}
		this.tail[this.segments-1] = createVector(this.x, this.y);

		this.x = this.x + this.xspeed;
		this.y = this.y + this.yspeed;

		this.x = constrain(this.x, 0, width-(gridsize));
		this.y = constrain(this.y, 0, height-(gridsize));
	}

	this.eat = function(pos) {
		var d = dist(this.x, this.y, pos.x, pos.y);
		if (d < 1) { 
			this.segments++;
			return true;
		} else {
			return false;
		}
	}

	this.death = function(pos) {
		for (var i = 0; i < this.tail.length; i++) {
			var pos = this.tail[i];
			var d = dist(this.x, this.y, pos.x, pos.y);
			if (d < 1) {
				return true;
			}
		}
	}

	this.resurect = function() {
		this.segments = 0;
		this.x = 0;
		this.y = 0;
		this.xspeed = gridsize;
		this.yspeed = 0;
		this.tail = [];
	}

	// Defining the color and size of the snake segment.
	this.show = function() {
		fill(102);
		for (var i = 0; i < this.segments; i++) {
			rect(this.tail[i].x, this.tail[i].y, gridsize, gridsize);
		}
		rect(this.x, this.y, gridsize, gridsize);
	}
}

// Setting a function for changing the direction of the snake after keypresses.
function keyPressed() {
	switch(keyCode) {
		case UP_ARROW:
			snake.direction(0, -1);
			break;
		case LEFT_ARROW:
			snake.direction(-1, 0);
			break;
		case DOWN_ARROW:
			snake.direction(0, 1);
			break;
		case RIGHT_ARROW:
			snake.direction(1, 0);
			break;
	}

}

// Picking a random food location after the snake eats one.
function pickFoodLocation() {
	var cols = floor(width/(gridsize));
	var rows = floor(height/(gridsize));
	food = createVector(floor(random(cols)), floor(random(rows)));
	food.mult(gridsize);
}

// Halt game and show game menu
function gamemenu() {
	fill(102);
	textSize(50);
	textAlign(CENTER);
	text("GAME OVER!", windowWidth/2, (windowHeight/2)-50);
	textSize(32);
	text("If you want to restart, press [Enter].", windowWidth/2, windowHeight/2);
	text("If you want to terminate game, press [Esc].", windowWidth/2, (windowHeight/2)+32);

	switch(keyCode) {
		case ENTER:
			snake.resurect();
			pickFoodLocation();
			frameRate(10);
			break;
		case ESCAPE:
			frameRate(0);
			gameon = 0;
			break;
	}
}

// A function to update the size of the canvas if the browser window is resized.
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}