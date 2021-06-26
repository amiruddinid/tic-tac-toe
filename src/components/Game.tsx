import * as React from 'react';
import { useGameState } from './GameState';
import { Board } from './Board';
import { Container, Row, Column } from './Layout';

function Game() {
  const {
    current,
    xIsNext,
    winner,
    handleClick,
    reset,
  } = useGameState();

  return (
    <Container>
      <Row gap={20}>
        <Column gap={20}>
          <div>{
            winner
              ? `Winner ${winner}`
              : `Next Player ${xIsNext ? 'X' : 'O'}`
          }</div>
          <button onClick={reset}>Reset</button>
          <Board board={current} onClick={handleClick} />
        </Column>
      </Row>
    </Container>
  );
}
export default Game;
