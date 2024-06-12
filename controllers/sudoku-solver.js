const { puzzlesAndSolutions } = require("./puzzle-strings");

class SudokuSolver {

  validate(puzzleString) {
    const regex = /^[1-9.]*$/;
    if (!regex.test(puzzleString)) {
      return "Invalid characters in puzzle";
    }
    if (puzzleString.length != 81) {
      return "Expected puzzle to be 81 characters long";
    }
    return false;
  }

  checkCoodinate(coordinate) {
    const regex = /^[A-I][1-9]$/;
    return regex.test(coordinate);
  }

  getRowIndex(coordinate) {
    const alphabet = "ABCDEFGHI";
    return alphabet.indexOf(coordinate.charAt(0));
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rowNumbers = puzzleString.substring(row * 9, row * 9 + 9);
    rowNumbers = rowNumbers.slice(0, column) + rowNumbers.slice(column + 1);
    return rowNumbers.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    let columnNumbers = "";
    for (let i = 0; i < 9; i++) {
      columnNumbers = columnNumbers + puzzleString.charAt(column + (9 * i));
    }
    columnNumbers = columnNumbers.slice(0, row) + columnNumbers.slice(row + 1);
    return columnNumbers.includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowRegion = parseInt(row / 3);
    const columnRegion = parseInt(column / 3);
    let regionNumbers = "";
    for (let i = 0; i < 3; i++) {
      regionNumbers = regionNumbers + puzzleString.substring(rowRegion * 27 + columnRegion * 3 + (9 * i), rowRegion * 27 + columnRegion * 3 + 3 + (9 * i));
    }
    regionNumbers = regionNumbers.slice(0, row % 3 * 3 + column % 3) + regionNumbers.slice(row % 3 * 3 + column % 3 + 1);
    return regionNumbers.includes(value);
  }

  solve(puzzleString) {
    const puzzle = this.convertToGrid(puzzleString);
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] !== '.') {
          continue;
        }
        for (let num = 1; num <= 9; num++) {
          if (!this.checkRowPlacement(puzzleString, row, col, num.toString())
            && !this.checkColPlacement(puzzleString, row, col, num.toString())
            && !this.checkRegionPlacement(puzzleString, row, col, num.toString())) {
            puzzle[row][col] = num.toString();
            const newPuzzleString = this.solve(this.convertToString(puzzle));
            if (newPuzzleString) {
              return newPuzzleString;
            }
            puzzle[row][col] = '.';
          }
        }
        return false;
      }
    }
    return puzzleString;
  }

  convertToGrid(puzzleString) {
    const puzzle = [];
    for (let i = 0; i < 9; i++) {
      puzzle.push(puzzleString.slice(i * 9, (i + 1) * 9).split(''));
    }
    return puzzle;
  }
  convertToString(puzzle) {
    return puzzle.map(row => row.join('')).join('');
  }
}

module.exports = SudokuSolver;

