const COL = 5;
const ROW = 5;
const FIELD_WIDTH = 500;
const FIELD_HEIGHT = 500;

document.addEventListener("DOMContentLoaded", show_field);

function show_field() {
	let matrix_of_states;
	localStorage.removeItem('position');
	if (typeof(Storage) !== "undefined") {
		if (localStorage['position']) 
			matrix_of_states = filling_matrix_of_states(localStorage['position']);
		else
			matrix_of_states = filling_matrix_of_states();
	}

	let field = document.getElementById('field_of_game');
	field_context = field.getContext("2d");

	field.addEventListener("click", function(event) { 
		selecting_circles(event, matrix_of_states, field_context);
	});

	draw_grid();
	draw_circles(matrix_of_states);
}

function draw_grid() {
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
	let  radius, x, y;
	let width_of_sqare = (FIELD_WIDTH / COL);
	let height_of_sqare = (FIELD_HEIGHT / ROW);	

	for (let rows = 0; rows < ROW; rows++) {
		for (let cols = 0; cols < COL; cols++) {

			if (matrix_of_states[rows][cols] == 1 || matrix_of_states[rows][cols] == 2) {
				x = (cols * width_of_sqare) + (width_of_sqare / 2);
				y = (rows * height_of_sqare) + (height_of_sqare / 2);
				radius = (width_of_sqare / 2) - 5;

				field_context.beginPath();
				
				field_context.arc(x, y, radius, 0, Math.PI * 2, false);

				if (matrix_of_states[rows][cols] == 1)
					field_context.strokeStyle = "#000";
				else
					field_context.strokeStyle = "#f00";

				field_context.stroke();
				
				field_context.closePath();
			}

		}
	}
}

function filling_matrix_of_states(position) {
	let matrix_of_states = [];
	if (typeof(position) === "undefined") {

		for (let i = 0; i < ROW; i++) {
			matrix_of_states[i] = [];

			for (let j = 0; j < COL; j++) {
				matrix_of_states[i][j] = 0;

				if (i > 2 && j < 3)
					matrix_of_states[i][j] = 1;
			}
		}

	} else {
		matrix_of_states = JSON.parse(position);
	}

	return matrix_of_states;
}

function selecting_circles(e, matrix_of_states, field_context) {
	let RowCol = event_coordinates(e);
	if (typeof(RowCol) === "undefined")
		return;
	let row = RowCol["row"];
	let col = RowCol["col"];
	
	if (!check_for_select(matrix_of_states)) {
		if (check_for_circle(row, col, matrix_of_states)) {
			matrix_of_states[row][col] = 2;
			let width_of_sqare = (FIELD_WIDTH / COL);
			let height_of_sqare = (FIELD_HEIGHT / ROW);

			field_context.clearRect((width_of_sqare * col) + 2, (height_of_sqare * row) + 2, width_of_sqare - 2, height_of_sqare - 2);

			field_context.beginPath();

			let  radius, x, y;
			x = (col * width_of_sqare) + (width_of_sqare / 2);
			y = (row * height_of_sqare) + (height_of_sqare / 2);
			radius = (width_of_sqare / 2) - 5;

			field_context.arc(x, y, radius, 0, Math.PI * 2, false);
			field_context.strokeStyle = "#f00";
			field_context.stroke();

			field_context.closePath(); 
		}
	} else {
		if (!check_for_circle(row, col, matrix_of_states)) {
			matrix_of_states[row][col] = 1;

			let row_remove, col_remove;

			for (let i = 0; i < ROW; i++) {
				for (let j = 0; j < COL; j++) {
					if (matrix_of_states[i][j] == 2) {
						row_remove = i;
						col_remove = j;
						matrix_of_states[i][j] = 0;
					}
				}
			}

			let width_of_sqare = (FIELD_WIDTH / COL);
			let height_of_sqare = (FIELD_HEIGHT / ROW);

			field_context.clearRect((width_of_sqare * col_remove) + 2, (height_of_sqare * row_remove) + 2, width_of_sqare - 2, height_of_sqare - 2);

			field_context.beginPath();

			let  radius, x, y;
			x = (col * width_of_sqare) + (width_of_sqare / 2);
			y = (row * height_of_sqare) + (height_of_sqare / 2);
			radius = (width_of_sqare / 2) - 5;

			field_context.arc(x, y, radius, 0, Math.PI * 2, false);
			field_context.strokeStyle = "#000";
			field_context.stroke();

			field_context.closePath(); 

		}

	}

	let StoragePosition = JSON.stringify(matrix_of_states);
	localStorage.setItem("position", StoragePosition);
}

function event_coordinates(e) {
	let field = document.getElementById('field_of_game');
	let x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - field.offsetLeft;
	let y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - field.offsetTop;

	if (x > 500 || y > 500)
		return;
	let row = Math.floor(y / (FIELD_HEIGHT / ROW));
	let col = Math.floor(x / (FIELD_WIDTH / COL));
	return {"row":row, "col":col};
}

function check_for_select(matrix_of_states) {
	for (let i = 0; i < ROW; i ++) {
		for (let j = 0; j < COL; j++) {
			if (matrix_of_states[i][j] == 2)
				return true;
		}
	}

	return false;
}

function check_for_circle(row, col, matrix_of_states) {
	if (matrix_of_states[row][col] == 1 || matrix_of_states[row][col] == 2)
		return true;
	else
		return false;
}
