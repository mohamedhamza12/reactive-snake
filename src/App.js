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
  const [snakeCells, setSnakeCells] = useState(new Set().add(snake.head.val.cellNumber));
  const [foodCell, setFoodCell] = useState(18);

  useEffect(() => {
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' && snake.head.val.direction !== DIRECTION.UP)
        snake.head.val.direction = DIRECTION.DOWN;
      else if (e.key === 'ArrowUp' && snake.head.val.direction !== DIRECTION.DOWN)
        snake.head.val.direction = DIRECTION.UP;
        else if (e.key === 'ArrowLeft' && snake.head.val.direction !== DIRECTION.RIGHT)
        snake.head.val.direction = DIRECTION.LEFT;
        else if (e.key === 'ArrowRight' && snake.head.val.direction !== DIRECTION.LEFT)
        snake.head.val.direction = DIRECTION.RIGHT;
    })
  }, [snake]);

  useInterval(() => {
    const newSnakeHead = getNewSnakeCoords();
    snake.head.next = newSnakeHead;
    snake.head = newSnakeHead;

    const newSnakeCells = new Set(snakeCells);
    newSnakeCells.delete(snake.tail.val.cellNumber);
    newSnakeCells.add(snake.head.val.cellNumber);
    snake.tail = snake.tail.next;

    if (newSnakeHead.val.cellNumber === foodCell) {
      growSnake(newSnakeCells);
      generateNewFoodCell();
    }

    setSnakeCells(newSnakeCells);

    if (isSnakeOutOfBounds()) {
      console.log('game over')
      setGameOver(true);
    }
      

  }, 200, gameOver);

  const generateNewFoodCell = () => {
    const newCell = Math.floor((Math.random() * (GRID_SIZE * GRID_SIZE)) + 1);
    setFoodCell(newCell);
  }

  const isSnakeOutOfBounds = () => {
    const row = snake.head.val.r;
    const column = snake.head.val.c;
    const cellNumber = snake.head.val.cellNumber;

    if (row < 0 || column < 0 || row >= GRID_SIZE || column >= GRID_SIZE || snakeCells.has(cellNumber))
      return true;

    return false;
  }

  const getNewSnakeCoords = () => {
    let newSnakeHead;
    const headRow = snake.head.val.r;
    const headColumn = snake.head.val.c;
    const headDirection = snake.head.val.direction;

    switch (headDirection) {
      case DIRECTION.UP: {
        newSnakeHead = new ListNode({
          r: headRow - 1,
          c: headColumn,
          cellNumber: ((headRow - 1) * GRID_SIZE) + headColumn + 1,
          direction: headDirection
        });
        break;
      }
      case DIRECTION.DOWN: {
        newSnakeHead = new ListNode({
          r: headRow + 1,
          c: headColumn,
          cellNumber: ((headRow + 1) * GRID_SIZE) + headColumn + 1,
          direction: headDirection
        });
        break;
      }
      case DIRECTION.LEFT: {
        newSnakeHead = new ListNode({
          r: headRow,
          c: headColumn - 1,
          cellNumber: (headRow * GRID_SIZE) + (headColumn - 1) + 1,
          direction: headDirection
        });
        break;
      }
      case DIRECTION.RIGHT: {
        newSnakeHead = new ListNode({
          r: headRow,
          c: headColumn + 1,
          cellNumber: (headRow * GRID_SIZE) + (headColumn + 1) + 1,
          direction: headDirection
        });
        break;
      }
      default: newSnakeHead = null;
    }

    return newSnakeHead;
  }

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
    <div className="App" onKeyDown={e => {if (e.key === 'Enter') alert('enter')}}>
      {gameOver ? 
      <div className="game-over">Game Over</div> : 
      null}
      <div className="Grid">
        {
          rows.map((row, i) =>
            <div key={i} className="Row">
              {
                row.map((column, j) =>
                  snakeCells.has(column) ?
                    <div key={i + ',' + j} className="SnakeCell"></div> :
                    column === foodCell ?
                    <div key={i + ',' + j} className="FoodCell"></div> :
                    <div key={i + ',' + j} className="Cell"></div>)
              }
            </div>)
        }
      </div>
    </div>
  );
}

export default App;
