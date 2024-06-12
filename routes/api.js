'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const coordinate = req.body.coordinate;
      const value = req.body.value;
      const puzzle = req.body.puzzle;
      if (!coordinate || !value || !puzzle) {
        return res.send({ error: "Required field(s) missing" });
      }
      const errorMessage = solver.validate(puzzle);
      if (errorMessage) {
        return res.send({ error: errorMessage });
      }
      if (!solver.checkCoodinate(coordinate)) {
        return res.send({ error: "Invalid coordinate" });
      }
      const regex = /^[1-9]$/;
      if (!regex.test(value)) {
        return res.send({ error: "Invalid value" });
      }
      const row = solver.getRowIndex(coordinate);
      const column = parseInt(coordinate.charAt(1)) - 1;
      const hasRowConflict = solver.checkRowPlacement(puzzle, row, column, value);
      const hasColumnConflict = solver.checkColPlacement(puzzle, row, column, value);
      const hasRegionConflict = solver.checkRegionPlacement(puzzle, row, column, value);
      if (hasRowConflict || hasColumnConflict || hasRegionConflict) {
        let conflict = [];
        if (hasRowConflict) conflict.push("row");
        if (hasColumnConflict) conflict.push("column");
        if (hasRegionConflict) conflict.push("region");
        return res.send({ valid: false, conflict: conflict });
      }
      return res.send({ valid: true });
    });

  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      if (!puzzle) {
        return res.send({ error: "Required field missing" });
      }
      const errorMessage = solver.validate(puzzle);
      if (errorMessage) {
        return res.send({ error: errorMessage });
      }
      const result = solver.solve(puzzle);
      if (!result) {
        return res.send({ error: "Puzzle cannot be solved" });
      }
      return res.send({ solution: result });
    });
};
