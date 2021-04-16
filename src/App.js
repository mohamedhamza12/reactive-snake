import { useEffect, useState } from 'react';
import './App.css';
import { LinkedList, ListNode } from './LinkedList';
import { useInterval } from './utils';

const GRID_SIZE = 10;
const DIRECTION = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};

function App() {
  const [snake, setSnake] = useState(new LinkedList({
    r: 0,
    c: 0,
    cellNumber: 1,
    direction: DIRECTION.RIGHT
  }));
  const [gameOver, setGameOver] = useState(false);

  let growSnakeFlag = false;

  const [snakeCells, setSnakeCells] = useState(new Set().add(snake.head.val.cellNumber));

  useEffect(() => {
    if (snake.head.val.cellNumber >= 10)
      setGameOver(true);
  }, [snake]);

  useInterval(() => {
    const newSnakeHead = new ListNode({
      r: 0,
      c: snake.head.val.c + 1,
      cellNumber: snake.head.val.cellNumber + 1,
      direction: snake.head.val.direction
    });
    snake.head.next = newSnakeHead;
    snake.head = newSnakeHead;

    const newSnakeCells = new Set(snakeCells);
    newSnakeCells.delete(snake.tail.val.cellNumber);
    newSnakeCells.add(snake.head.val.cellNumber);
    snake.tail = snake.tail.next;

    if (growSnakeFlag) {
      growSnake(newSnakeCells);
    }

    setSnakeCells(newSnakeCells);
    if (snake.head.val.cellNumber >= 10)
      setGameOver(true);
  }, 700, gameOver);

  const growSnake = (newSnakeCells) => {
    const tailDirection = snake.tail.val.direction;
    const tailRow = snake.tail.val.r;
    const tailColumn = snake.tail.val.c;
    let newTail;
    switch (tailDirection) {
      case DIRECTION.UP: {
        newTail = new ListNode({
          r: tailRow + 1,
          c: tailColumn,
          cellNumber: ((tailRow + 1) * GRID_SIZE) + tailColumn + 1,
          direction: tailDirection
        });
        break;
      }
      case DIRECTION.DOWN: {
        newTail = new ListNode({
          r: tailRow - 1,
          c: tailColumn,
          cellNumber: ((tailRow - 1) * GRID_SIZE) + tailColumn + 1,
          direction: tailDirection
        });
        break;
      }
      case DIRECTION.LEFT: {
        newTail = new ListNode({
          r: tailRow,
          c: tailColumn + 1,
          cellNumber: (tailRow * GRID_SIZE) + (tailColumn + 1) + 1,
          direction: tailDirection
        });
        break;
      }
      case DIRECTION.RIGHT: {
        newTail = new ListNode({
          r: tailRow,
          c: tailColumn - 1,
          cellNumber: (tailRow * GRID_SIZE) + (tailColumn - 1) + 1,
          direction: tailDirection
        });
        break;
      }
      default: newTail = null;
    }

    newTail.next = snake.tail;
    snake.tail = newTail;
    newSnakeCells.add(snake.tail.val.cellNumber);

    growSnakeFlag = false;
  };


  let rows = [];
  let counter = 0;
  for (let i = 0; i < GRID_SIZE; i++) {
    let columns = new Array(GRID_SIZE);
    for (let j = 0; j < GRID_SIZE; j++) {
      columns[j] = ++counter;
    }
    rows.push(columns);
  }

  return (
    <div className="App">
      <button onClick={() => growSnakeFlag = true}>Add tail</button>
      <div className="Grid">
        {
          rows.map((row, i) =>
            <div key={i} className="Row">
              {
                row.map((column, j) =>
                  snakeCells.has(column) ?
                    <div key={i + ',' + j} className="SnakeCell"></div> :
                    <div key={i + ',' + j} className="Cell"></div>)
              }
            </div>)
        }
      </div>
    </div>
  );
}

export default App;
