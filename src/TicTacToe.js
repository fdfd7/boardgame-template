function isDraw(cells) {
  let i = 0;
  while (i < 9) {
    if (cells[i] == null) {
      return false;
    }
    i = i + 1;
  }
  return true;
}

function isVictory(cells) {
  let i = 0;
  while (i < 3) {
    let a = cells[i];
    if (a !== null && a == cells[i + 3] && a == cells[i + 6]) {
      return a;
    }
    i = i + 1;
  }
  i = 0;
  while (i < 3) {
    let a = cells[i * 3];
    if (a !== null && a == cells[i * 3 + 1] && a == cells[i * 3 + 2]) {
      return a;
    }
    i = i + 1;
  }
  let a = cells[4];
  if (
    (a !== null && a == cells[0] && a == cells[8]) ||
    (a !== null && a == cells[2] && a == cells[6])
  ) {
    return a;
  }
}

import { INVALID_MOVE } from "boardgame.io/core";

export const TicTacToe = {
  setup: function setup() {
    return { cells: [null, null, null, null, null, null, null, null, null] };
  },

  moves: {
    clickCell: function clickCell(move, cellIndex) {
      if (move.G.cells[cellIndex] !== null) {
        return INVALID_MOVE;
      }
      move.G.cells[cellIndex] = move.playerID;
    },
  },
  turn: {
    minMoves: 1,
    maxMoves: 1,
  },
  endIf: function endIf(endIf) {
    const winner = isVictory(endIf.G.cells);
    if (winner != null) {
      return { winner: winner };
    }
    if (isDraw(endIf.G.cells)) {
      return { draw: true };
    }
  },
  ai: {
    enumerate: function enumerate(G) {
      let a = [];
      for (let i = 0; i <= 8; i = i + 1) {
        if (G.cells[i] == null) {
          a.push(i);
        }
      }

      return [{ move: "clickCell", args: a }];
    },
  },
};
