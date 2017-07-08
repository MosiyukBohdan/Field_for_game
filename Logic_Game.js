const COL = 5;
const ROW = 5;
const FIELD_WIDTH = 500;
const FIELD_HEIGHT = 500;

document.addEventListener("DOMContentLoaded", show_field);

function show_field() {
	// body...
	let matrix_of_states = [];
	filling_matrix_of_states(matrix_of_states);

	let field = document.getElementById('field_of_game');
	field_context = field.getContext("2d");

	field.addEventListener("click", function(event) { 
		selecting_circles(event, matrix_of_states, field_context);
	});

	draw_grid();
	draw_circles(matrix_of_states);
}

function draw_grid() {
	let a = 5;
	field_context.beginPath();

	for (let x = 0.5; x < (COL * 100) + 1; x += 100) {
		field_context.moveTo(x, 0);
		field_context.lineTo(x, 500);
	}

	for (var y = 0.5; y < (ROW * 100) + 1; y += 100) {
		field_context.moveTo(0, y);
		field_context.lineTo(500, y);
	}

	field_context.closePath();

	field_context.strokeStyle = "#000";
	field_context.stroke();
}

function draw_circles(matrix_of_states) {
	// body...
	let  radius, x, y;
	let width_of_sqare = (FIELD_WIDTH / COL);
	let height_of_sqare = (FIELD_HEIGHT / ROW);	

	for (let rows = 3; rows < ROW; rows++) {
		for (let cols = 0; cols < COL - 2; cols++) {
			x = (cols * width_of_sqare) + (width_of_sqare / 2);
			y = (rows * height_of_sqare) + (height_of_sqare / 2);
			radius = (width_of_sqare / 2) - 5;

			field_context.beginPath();
			
			field_context.arc(x, y, radius, 0, Math.PI * 2, false);
			field_context.strokeStyle = "#000";
			field_context.stroke();

			matrix_of_states[rows][cols] = 1;
			
			field_context.closePath();
		}
	}
}

function filling_matrix_of_states(matrix_of_states) {
	// body...
	for (let i = 0; i < ROW; i++) {
		matrix_of_states[i] = [];

		for (let j = 0; j < COL; j++) {
			matrix_of_states[i][j] = 0;
		}
	}
}

function selecting_circles(e, matrix_of_states, field_context) {
	// body...
	let RowCol = event_coordinates(e);
	let row = RowCol["row"];
	let col = RowCol["col"];
	
	if (!check_for_select(matrix_of_states)) {
		if (check_for_circle(row, col, matrix_of_states)) {
			matrix_of_states[row][col] = 2;
			paint_circle(row, col, field_context);
		}
	} else {
		console.log("Is selected");
	}
}

function event_coordinates(e) {
	// body...
	let row = Math.floor(e.clientY / (FIELD_HEIGHT / ROW));
	let col = Math.floor(e.clientX / (FIELD_WIDTH / COL));
	return {"row":row, "col":col};
}

function check_for_select(matrix_of_states) {
	// body...
	for (let i = 0; i < ROW; i ++) {
		for (let j = 0; j < COL; j++) {
			if (matrix_of_states[i][j] == 2)
				return true;
		}
	}

	return false;
}

function check_for_circle(row, col, matrix_of_states) {
	// body...
	if (matrix_of_states[row][col] == 1 || matrix_of_states[row][col] == 2)
		return true;
	else
		return false;
}

function paint_circle(row, col, field_context) {
	// body...
	let width_of_sqare = (FIELD_WIDTH / COL);
	let height_of_sqare = (FIELD_HEIGHT / ROW);

	field_context.clearRect((width_of_sqare * col) + 2, (height_of_sqare * row) + 2, width_of_sqare - 2, height_of_sqare - 2);

	field_context.beginPath();

	let  radius, x, y;
	x = (col * width_of_sqare) + (width_of_sqare / 2);
	y = (row * height_of_sqare) + (height_of_sqare / 2);
	radius = (width_of_sqare / 2) - 5;

	field_context.arc(x, y, radius, 0, Math.PI * 2, false);
	field_context.strokeStyle = "red";
	field_context.stroke();

	field_context.closePath();
}