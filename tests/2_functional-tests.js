const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const puzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
const puzzleWithInvalidChar = "1*5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
const puzzleWithInvalidLength = "1..5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
const puzzleImpossible = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37";

suite('Functional Tests', () => {
	suite('tests', function () {
		test('Test case 001: Solve a puzzle with valid puzzle string', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/solve')
				.send({
					"puzzle": puzzle,
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.solution, "135762984946381257728459613694517832812936745357824196473298561581673429269145378");
					done();
				});
		});
		test('Test case 002: Solve a puzzle with missing puzzle string', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/solve')
				.send({
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.error, "Required field missing");
					done();
				});
		});
		test('Test case 003: Solve a puzzle with invalid characters', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/solve')
				.send({
					"puzzle": puzzleWithInvalidChar,
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.error, "Invalid characters in puzzle");
					done();
				});
		});
		test('Test case 004: Solve a puzzle with incorrect length', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/solve')
				.send({
					"puzzle": puzzleWithInvalidLength,
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
					done();
				});
		});
		test('Test case 005: Solve a puzzle that cannot be solved', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/solve')
				.send({
					"puzzle": puzzleImpossible,
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
					done();
				});
		});
		test('Test case 006: Check a puzzle placement with all fields', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/check')
				.send({
					"puzzle": puzzle,
					"coordinate": "A2",
					"value": "3",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.valid, true);
					done();
				});
		});
		test('Test case 007: Check a puzzle placement with single placement conflict', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/check')
				.send({
					"puzzle": puzzle,
					"coordinate": "A2",
					"value": "4",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.valid, false);
					assert.deepEqual(res.body.conflict, ["row"]);
					done();
				});
		});
		test('Test case 008: Check a puzzle placement with multiple placement conflicts', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/check')
				.send({
					"puzzle": puzzle,
					"coordinate": "A2",
					"value": "6",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.valid, false);
					assert.deepEqual(res.body.conflict, ["column", "region"]);
					done();
				});
		});
		test('Test case 009: Check a puzzle placement with all placement conflicts', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/check')
				.send({
					"puzzle": puzzle,
					"coordinate": "A2",
					"value": "2",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.valid, false);
					assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
					done();
				});
		});
		test('Test case 010: Check a puzzle placement with missing required fields', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/check')
				.send({
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.error, "Required field(s) missing");
					done();
				});
		});
		test('Test case 011: Check a puzzle placement with invalid characters', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/check')
				.send({
					"puzzle": puzzleWithInvalidChar,
					"coordinate": "A2",
					"value": "2",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.error, "Invalid characters in puzzle");
					done();
				});
		});
		test('Test case 012: Check a puzzle placement with incorrect length', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/check')
				.send({
					"puzzle": puzzleWithInvalidLength,
					"coordinate": "A2",
					"value": "2",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
					done();
				});
		});
		test('Test case 013: Check a puzzle placement with invalid placement coordinate', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/check')
				.send({
					"puzzle": puzzle,
					"coordinate": "J2",
					"value": "2",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.error, "Invalid coordinate");
					done();
				});
		});
		test('Test case 014: Check a puzzle placement with invalid placement value', function (done) {
			chai
				.request(server)
				.keepOpen()
				.post('/api/check')
				.send({
					"puzzle": puzzle,
					"coordinate": "A2",
					"value": "0",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.error, "Invalid value");
					done();
				});
		});
	});
});

