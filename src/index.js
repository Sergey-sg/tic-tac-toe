import React from "react";
import ReactDOM from "react-dom/client";
import './style.css';


function Square(props) {
    return (
      <button
          className="square"
          onClick={() => props.onClick()}
      >
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i} //prevent warning
        value={this.props.squares[i]}
        onClick={()=>this.props.onClick(i)}
      />
    );
  }

  render() {
    let rows = [];
    let valueForSquares = 0;
    for (let r = 0; r < 3; r++){
        let row = [];
        for (let s = 0; s < 3; s++) {
            row.push(this.renderSquare(valueForSquares));
            valueForSquares++;
        }
        rows.push(<div key={valueForSquares} className="board-row">{row}</div>);
    }
    return (<div>{rows}</div>)
  }
}

class Game extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          history: [{
              squares: Array(9).fill(null),
          }],
          stepNumber: 0,
          coordinates: [''],
          xIsNext: true,
          sortSteps: true,
      };
  }

  handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
          return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      let oldSquares = this.state.history[history.length - 1].squares
      this.setState({
          history: history.concat([{
              squares: squares,
          }]),
          stepNumber: history.length,
          coordinates: this.state.coordinates.concat(
              this.getCoordinates(oldSquares, squares)
          ),
          xIsNext: !this.state.xIsNext,
      });
  }

  getCoordinates (oldSquares, newSquares) {
      for (let i = 0; i < newSquares.length; i++) {
          if (newSquares[i] !== oldSquares[i]) {
              let row, col;
              if (i < 3) {
                  row = 1;
              } else if (i < 6) {
                  row = 2;
              } else {
                  row = 3;
              }
              if (i === 0 || i === 3 || i === 6) {
                  col = 1;
              }  else if (i === 1 || i === 4 || i === 7) {
                  col = 2;
              } else {
                  col = 3;
              }
              return {row: row, col: col};
          }
      }
  }

  jumpTo(step) {
      this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0
      });
  }

  sortListSteps() {
      this.setState({
          sortSteps: !this.state.sortSteps
      });
    }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
        const desc = move ? `move to step #${move} coordinates: row: ${this.state.coordinates[move].row} col: ${this.state.coordinates[move].col}` : 'to start game';
        return (
            <li key={move} className="steps">
                <button
                    onClick={() => this.jumpTo(move)}
                    onMouseOver={() => {
                        if (this.state.coordinates[move]) {
                            let currentRow = document.querySelectorAll('.board-row')[this.state.coordinates[move].row - 1];
                            let currentCol = currentRow.childNodes;
                            currentCol[this.state.coordinates[move].col - 1].style = 'background: #f4fc03';
                        }
                    }}
                    onMouseOut={() => {
                        if (this.state.coordinates[move]) {
                            let currentRow = document.querySelectorAll('.board-row')[this.state.coordinates[move].row - 1];
                            let currentCol = currentRow.childNodes;
                            currentCol[this.state.coordinates[move].col - 1].style = 'background: null';
                        }
                    }}
                >{desc}</button>
            </li>
        );
    });

    let status;
    if (winner) {
        status = 'Winner ' + winner.textContent;
    } else if (!current.squares.includes(null)) {
        status = "moves over, draw";
    } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.sortSteps ? moves : moves.reverse()}</ol>
          <button onClick={() => this.sortListSteps()}>
            Sort by: {this.state.sortSteps ? "Descending" : "Ascending"}
          </button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            let squares = document.querySelectorAll(".square")
            squares[lines[i][0]].style = 'background: #4ceb34';
            squares[lines[i][1]].style = 'background: #4ceb34';
            squares[lines[i][2]].style = 'background: #4ceb34';
            return squares[a];
        }
    }
    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
