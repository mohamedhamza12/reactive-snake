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
  const [freeCells, setFreeCells] = useState((() => {
    const freeCellsArr = [...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => i + 1);
    freeCellsArr.splice(0, 1);
    freeCellsArr.splice(17, 1);

    return freeCellsArr;
  })());

  const [freeCellsMap, setFreeCellsMap] = useState((() => {
    const freeCellsArray = freeCells;
    const obj = {};
    for (let i = 0; i < freeCellsArray.length; i++) {
      obj[freeCellsArray[i]] = i;
    }
    return obj;
  })());

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
    if (isSnakeOutOfBounds(newSnakeHead)) {
      setGameOver(true);
      return;
    }

    snake.head.next = newSnakeHead;
    snake.head = newSnakeHead;


    const newSnakeCells = new Set(snakeCells);
    newSnakeCells.delete(snake.tail.val.cellNumber);
    newSnakeCells.add(snake.head.val.cellNumber);
    
    const headIndex = freeCellsMap[snake.head.val.cellNumber];
    freeCellsMap[snake.head.val.cellNumber] = null;
    freeCellsMap[snake.tail.val.cellNumber] = headIndex;
    freeCells.splice(headIndex, 1, snake.tail.val.cellNumber);

    snake.tail = snake.tail.next;

    if (newSnakeHead.val.cellNumber === foodCell) {
      growSnake(newSnakeCells);
      generateNewFoodCell();
    }
    setSnakeCells(newSnakeCells);
      

  }, 500, gameOver);

  const generateNewFoodCell = () => {
    const freeCellsCount = freeCells.length - 1;
    const newCellIndex = Math.floor((Math.random() * freeCellsCount));
    console.log('cell index: ', newCellIndex);
    const map = freeCellsMap;
    const oldMapValue = map[freeCells[newCellIndex]];
    console.log('old map value: ', oldMapValue);
    map[freeCells[newCellIndex]] = null

    const newCell = freeCells[newCellIndex];
    map[newCell] = oldMapValue;
    freeCells.splice(newCellIndex, 1, foodCell);
    setFreeCellsMap(map);
    //setFreeCells(updatedFreeCells);
    setFoodCell(newCell);
  }

  const isSnakeOutOfBounds = (newSnakeHead) => {
    const row = newSnakeHead.val.r;
    const column = newSnakeHead.val.c;
    const cellNumber = newSnakeHead.val.cellNumber;

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

    const freeCellsIndexToRemove = freeCellsMap[snake.tail.val.cellNumber];
    freeCells.splice(freeCellsIndexToRemove, 1);
    //setFreeCells(freeCells.splice(freeCellsIndexToRemove, 1));
    freeCellsMap[snake.tail.val.cellNumber] = null;
  };

  const restart = () => {
    const newSnake = new LinkedList({
      r: 0,
      c: 0,
      cellNumber: 1,
      direction: DIRECTION.RIGHT
    });
    const newSnakeCells = new Set().add(newSnake.head.val.cellNumber);
    setSnake(newSnake);
    setSnakeCells(newSnakeCells);
    setFoodCell(18);
    setGameOver(false);
  }

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
    <div className="app" onKeyDown={e => {if (e.key === 'Enter') alert('enter')}}>
      {gameOver ? 
      <div className="game-over-wrapper">
        <div className="game-over">Game Over</div>
        <div>
          <button onClick={restart}>Restart</button>
        </div>
      </div> : 
      null}
      <div className="grid">
        {
          rows.map((row, i) =>
            <div key={i} className="row">
              {
                row.map((column, j) =>
                  snakeCells.has(column) ?
                    <div key={i + ',' + j} className="snake-cell"></div> :
                    column === foodCell ?
                    <div key={i + ',' + j} className="food-cell"></div> :
                    <div key={i + ',' + j} className="cell"></div>)
              }
            </div>)
        }
      </div>
    </div>
  );
}

export default App;
