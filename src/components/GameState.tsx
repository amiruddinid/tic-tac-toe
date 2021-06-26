import { useState, useCallback, useEffect } from "react";

export type Value = "X" | "O" | null;
export type BoardState = Value[];

const createBoardState = () => Array<Value>(9).fill(null);

function calculateWinner(boardState: BoardState) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      return boardState[a];
    }
  }
  return null;
}

export type GameState = {
  history: BoardState[];
  step: number;
  xIsNext: boolean;
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    history: [createBoardState()],
    step: 0,
    xIsNext: true,
  });

  const current = gameState.history[gameState.step];
  const xIsNext = gameState.step % 2 === 0;
  const winner = calculateWinner(current);

  const makeMove = useCallback((square: number) => {
    const history = gameState.history.slice(0, gameState.step + 1);
    const boardState = history[history.length - 1];
    if (calculateWinner(boardState) || boardState[square]) {
      return;
    }
    const newBoardState = boardState.slice();
    newBoardState[square] = (gameState.step % 2) === 0 ? 'X' : 'O';
    history.push(newBoardState);

    setGameState({
      history: history,
      step: history.length - 1,
      xIsNext: !gameState.xIsNext,
    });
    console.log(gameState)
  }, [gameState]);

  useEffect(() => {
    function findBestSquare(squares: BoardState, player: Value) {
      const opponent = player === "X" ? "O" : "X";

      const minimax = (squares: BoardState, isMax: boolean) => {
        const winner = calculateWinner(squares);

        if (winner === player) return { square: -1, score: 1 };

        if (winner === opponent) return { square: -1, score: -1 };

        if (isBoardFilled(squares)) return { square: -1, score: 0 };

        const best = { square: -1, score: isMax ? -1000 : 1000 };

        for (let i = 0; i < squares.length; i++) {
          if (squares[i]) {
            continue;
          }

          squares[i] = isMax ? player : opponent;
          const score = minimax(squares, !isMax).score;
          squares[i] = null;

          if (isMax) {
            if (score > best.score) {
              best.score = score;
              best.square = i;
            }
          } else {
            if (score < best.score) {
              best.score = score;
              best.square = i;
            }
          }
        }

        return best;
      };

      return minimax(squares, true).square;
    }

    if(!gameState.xIsNext){
      const squares = gameState.history[gameState.step].slice();
      const bestSquare = findBestSquare(squares, gameState.xIsNext ? "X" : "O");
      makeMove(bestSquare);
    }
  }, [gameState, makeMove]);

  function handleClick(square: number) {
    makeMove(square);
  }

  function isBoardFilled(squares: BoardState) {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        return false;
      }
    }
    return true;
  }

  function reset(){
    setGameState({
      history: [createBoardState()],
      step: 0,
      xIsNext: true,
    });
  }

  return {
    gameState,
    current,
    xIsNext,
    winner,
    reset,
    handleClick,
  };
}
