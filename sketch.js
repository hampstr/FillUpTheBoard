let canvas;
let steps = 10;
let gridSize = 10;
let grid;

function create2DArray(rows, cols, fill) {
	let arr = new Array(rows);
	for (let i = 0; i < rows; i++) {
		arr[i] = new Array(cols).fill(fill);
	}
	return arr;
}

// grid tiles can be: empty, head, type of connecter

function createPuzzle() {
	grid = create2DArray(gridSize, gridSize, "empty");
	let startingPos = [floor(random(1, gridSize)), floor(random(1, gridSize))];
	grid[startingPos[0]][startingPos[1]] = "head";

	for (let i = 0; i < length; i++) {}
}

function drawGrid() {
	let cellSize = width / gridSize;
	for (let i = 0; i < gridSize; i++) {
		for (let j = 0; j < gridSize; j++) {
			if (grid[i][j] == "empty") {
				fill("#778DA9");
			} else if (grid[i][j] == "head") {
				strokeWeight(3);
				fill("rgb(79, 97, 114)");
				circle(
					i * cellSize + cellSize / 2,
					j * cellSize + cellSize / 2,
					cellSize / 1.1
				);
				continue;
			}
			strokeWeight(1);
			rect(i * cellSize, j * cellSize, cellSize, cellSize);
		}
	}
}

function setup() {
	canvas = createCanvas(700, 700);
	createPuzzle();
}

function draw() {
	background("#778DA9");
	drawGrid();
}
