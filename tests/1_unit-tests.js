const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
const puzzleWithInvalidChar = '5*.91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
const puzzleWithInvalidLength = '591372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
const puzzleImpossible = '54.91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';

suite('Unit Tests', () => {
	test('Test 001: Logic handles a valid puzzle string of 81 characters', function () {
		assert.equal(solver.validate(puzzle), false);
	});
	test('Test 002: Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
		assert.equal(solver.validate(puzzleWithInvalidChar), "Invalid characters in puzzle");
	});
	test('Test 003: Logic handles a puzzle string that is not 81 characters in length', function () {
		assert.equal(solver.validate(puzzleWithInvalidLength), "Expected puzzle to be 81 characters long");
	});
	test('Test 004: Logic handles a valid row placement', function () {
		assert.equal(solver.checkRowPlacement(puzzle, 0, 1, "4"), false);
	});
	test('Test 005: Logic handles an invalid row placement', function () {
		assert.equal(solver.checkRowPlacement(puzzle, 0, 1, "7"), true);
	});
	test('Test 006: Logic handles a valid column placement', function () {
		assert.equal(solver.checkColPlacement(puzzle, 0, 1, "4"), false);
	});
	test('Test 007: Logic handles an invalid column placement', function () {
		assert.equal(solver.checkColPlacement(puzzle, 0, 1, "8"), true);
	});
	test('Test 008: Logic handles a valid region (3x3 grid) placement', function () {
		assert.equal(solver.checkRegionPlacement(puzzle, 0, 1, "4"), false);
	});
	test('Test 009: Logic handles an invalid region (3x3 grid) placement', function () {
		assert.equal(solver.checkRegionPlacement(puzzle, 0, 1, "3"), true);
	});
	test('Test 010: Valid puzzle strings pass the solver', function () {
		assert.equal(solver.solve(puzzle), "568913724342687519197254386685479231219538467734162895926345178473891652851726943");
	});
	test('Test 011: Invalid puzzle strings fail the solver', function () {
		assert.equal(solver.validate(puzzleWithInvalidChar), "Invalid characters in puzzle");
	});
	test('Test 012: Solver returns the expected solution for an incomplete puzzle', function () {
		assert.equal(solver.solve(puzzleImpossible), false);
	});
});
