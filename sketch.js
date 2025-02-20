let canvas;
let steps = 20;
let gridSize = 7;
let grid;
let colors = {
	viewed: "rgb(218, 218, 218)",
	headBG: "rgb(211, 4, 4)",
	head: "rgb(136, 34, 34)",
	empty: "rgb(20, 20, 20)",
};
let headPosition;
let ogGrid;
let ogHeadPosition;
let resetButton;

function create2DArray(rows, cols, fill) {
	let arr = new Array(rows);
	for (let i = 0; i < rows; i++) {
		arr[i] = new Array(cols).fill(fill);
	}
	return arr;
}

// grid tiles can be: empty, head, viewed, path

function createPuzzle() {
	grid = create2DArray(gridSize, gridSize, "empty");
	let startingPos = [floor(random(1, gridSize)), floor(random(1, gridSize))];
	headPosition = [...startingPos];
	grid[startingPos[0]][startingPos[1]] = "head";

	let lastPos = startingPos;
	let stepsRemaining = steps;

	while (stepsRemaining > 0) {
		let direction = ["left", "right", "up", "down"][floor(random(4))];
		let newPos = [...lastPos];

		if (direction == "left") {
			newPos[0] -= 1;
		} else if (direction == "right") {
			newPos[0] += 1;
		} else if (direction == "up") {
			newPos[1] -= 1;
		} else if (direction == "down") {
			newPos[1] += 1;
		}

		if (
			newPos[0] >= 0 &&
			newPos[0] < gridSize &&
			newPos[1] >= 0 &&
			newPos[1] < gridSize &&
			grid[newPos[0]][newPos[1]] == "empty"
		) {
			grid[newPos[0]][newPos[1]] = "viewed";
			lastPos = newPos;
			stepsRemaining--;
		}

		let validMoves = false;
		for (let dir of ["left", "right", "up", "down"]) {
			let testPos = [...lastPos];
			if (dir == "left") testPos[0] -= 1;
			if (dir == "right") testPos[0] += 1;
			if (dir == "up") testPos[1] -= 1;
			if (dir == "down") testPos[1] += 1;

			if (
				testPos[0] >= 0 &&
				testPos[0] < gridSize &&
				testPos[1] >= 0 &&
				testPos[1] < gridSize &&
				grid[testPos[0]][testPos[1]] == "empty"
			) {
				validMoves = true;
				break;
			}
		}

		if (!validMoves) {
			break;
		}
	}
	ogGrid = JSON.parse(JSON.stringify(grid));
	ogHeadPosition = [...headPosition];
}

function drawTile(x, y, type) {
	let cellSize = width / gridSize;
	if (type == "viewed") {
		fill(colors["viewed"]);
		strokeWeight(1);
		rect(x * cellSize, y * cellSize, cellSize / 1.05, cellSize / 1.05, 13);
		return;
	}
	if (type == "head") {
		fill(colors["headBG"]);
		strokeWeight(1);
		rect(x * cellSize, y * cellSize, cellSize / 1.05, cellSize / 1.05, 13);

		strokeWeight(3);
		fill(colors["head"]);

		circle(
			x * cellSize + cellSize / 2 - 2,
			y * cellSize + cellSize / 2 - 2,
			cellSize / 1.5
		);
		return;
	}
	if (type == "path") {
		fill(colors["headBG"]);
		strokeWeight(1);
		rect(x * cellSize, y * cellSize, cellSize / 1.05, cellSize / 1.05, 13);
		return;
	}
	if (type == "empty") {
		fill(colors["empty"]);
		strokeWeight(1);
		rect(x * cellSize, y * cellSize, cellSize / 1.05, cellSize / 1.05, 13);
		return;
	}
}

function drawGrid() {
	let cellSize = width / gridSize;
	for (let i = 0; i < gridSize; i++) {
		for (let j = 0; j < gridSize; j++) {
			drawTile(i, j, grid[i][j]);
		}
	}
}

function setup() {
	let size = 700;
	if (windowWidth < 700) {
		size = 500;
	}
	if (windowWidth < 500) {
		size = 300;
	}

	canvas = createCanvas(size, size);

	resetButton = createButton("Reset");
	resetButton.style("font-size", "20px");
	resetButton.mousePressed(reset);
	createPuzzle();

	if (!localStorage.getItem("entered")) {
		alert("Use arrow keys, WASD, or swipe to turn all the white tiles red");
		localStorage.setItem("entered", "true");
	}
}

function draw() {
	if (windowWidth < 700) {
		resizeCanvas(500, 500);
	}
	if (windowWidth < 500) {
		resizeCanvas(300, 300);
	}

	drawGrid();
}

function up() {
	if (grid[headPosition[0]][headPosition[1] - 1] == "viewed") {
		grid[headPosition[0]][headPosition[1]] = "path";
		headPosition[1] -= 1;
		grid[headPosition[0]][headPosition[1]] = "head";
	}
	setTimeout(function () {
		winCheck();
	}, 500);
}

function down() {
	if (grid[headPosition[0]][headPosition[1] + 1] == "viewed") {
		grid[headPosition[0]][headPosition[1]] = "path";
		headPosition[1] += 1;
		grid[headPosition[0]][headPosition[1]] = "head";
	}
	setTimeout(function () {
		winCheck();
	}, 500);
}

function left() {
	if (grid[headPosition[0] - 1][headPosition[1]] == "viewed") {
		grid[headPosition[0]][headPosition[1]] = "path";
		headPosition[0] -= 1;
		grid[headPosition[0]][headPosition[1]] = "head";
	}
	setTimeout(function () {
		winCheck();
	}, 500);
}

function right() {
	if (grid[headPosition[0] + 1][headPosition[1]] == "viewed") {
		grid[headPosition[0]][headPosition[1]] = "path";
		headPosition[0] += 1;
		grid[headPosition[0]][headPosition[1]] = "head";
	}
	setTimeout(function () {
		winCheck();
	}, 500);
}

function reset() {
	grid = JSON.parse(JSON.stringify(ogGrid)); // Deep copy
	headPosition = [...ogHeadPosition]; // Reset head position

	// Ensure only one "head" exists
	for (let i = 0; i < gridSize; i++) {
		for (let j = 0; j < gridSize; j++) {
			if (
				grid[i][j] == "head" &&
				(i !== headPosition[0] || j !== headPosition[1])
			) {
				grid[i][j] = "empty"; // Remove duplicate heads
			}
		}
	}
}

function keyPressed() {
	if (keyCode == 32) {
		// SPACE key
		reset();
	}

	if (keyCode == 87 || keyCode == 38) {
		up();
	}

	if (keyCode == 65 || keyCode == 37) {
		left();
	}

	if (keyCode == 83 || keyCode == 40) {
		down();
	}

	if (keyCode == 68 || keyCode == 39) {
		right();
	}
}

function touchStarted() {
	startX = mouseX;
	startY = mouseY;
}

function touchEnded() {
	endX = mouseX;
	endY = mouseY;
	let cellSize = width / gridSize;
	let x = floor(endX / cellSize);
	let y = floor(endY / cellSize);
	if (grid[x][y] == "head") {
		reset();
	}
	interpretSwipe();
}

function interpretSwipe() {
	let dx = endX - startX;
	let dy = endY - startY;

	if (abs(dx) > abs(dy)) {
		if (dx > 0) {
			right();
		} else {
			left();
		}
	} else {
		if (dy > 0) {
			down();
		} else {
			up();
		}
	}
}

function winCheck() {
	for (let i = 0; i < gridSize; i++) {
		for (let j = 0; j < gridSize; j++) {
			if (grid[i][j] == "viewed") {
				return;
			}
		}
	}
	alert("You win!");
	location.reload();
}
