import { useEffect, useState } from 'react';
import './App.css';
import { LinkedList, ListNode } from './LinkedList';

const GRID_SIZE = 10;

function App() {
  const [snake, setSnake] = useState(new LinkedList({
    r: 0,
    c: 1,
    cellNumber: 2
  }));
  
  

  const [snakeCells, setSnakeCells] = useState(new Set().add(snake.head.val.cellNumber));
  useEffect(() => {
    if (snake.head.val.cellNumber < 10) {
      setTimeout(() => {
        const newSnakeHead = new ListNode({
          r: 0,
          c: snake.head.val.c + 1,
          cellNumber: snake.head.val.cellNumber + 1
        });
        snake.head.next = newSnakeHead;
        snake.head = newSnakeHead;
        
        const newSnakeCells = new Set(snakeCells);
        newSnakeCells.delete(snake.tail.val.cellNumber);
        newSnakeCells.add(snake.head.val.cellNumber);
        snake.tail = snake.tail.next;

        setSnakeCells(newSnakeCells);
        
      }, 1000);
    }
  }, [snakeCells, snake]);

  const growSnake = () => {

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
    <div className="App">
      <button onClick={() => {

      }}>Add tail</button>
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
