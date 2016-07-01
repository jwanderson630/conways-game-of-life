"use strict";

var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var MenuItem = ReactBootstrap.MenuItem;
var NavDropdown = ReactBootstrap.NavDropdown;
var Col = ReactBootstrap.Col;
var Row = ReactBootstrap.Row;
var Grid = ReactBootstrap.Grid;
var ButtonGroup = ReactBootstrap.ButtonGroup;

var Game = React.createClass({
  displayName: "Game",

  getInitialState: function getInitialState() {
    return {
      length: 100,
      height: 50,
      speed: 100,
      board: [],
      playPause: "Pause",
      menuCollapse: "collapse navbar-collapse",
      generationCount: 0,
      color: "red",
      showModal: true
    };
  },
  componentDidMount: function componentDidMount() {
    this.setState({
      board: this.createRandomBoard()
    });
    this.play();
  },

  plusGeneration: function plusGeneration() {
    var nextGen = this.state.generationCount + 1;
    return nextGen;
  },

  createRandomBoard: function createRandomBoard() {
    var board = [];
    for (var i = 0; i < this.state.height; i++) {
      var row = [];
      for (var x = 0; x < this.state.length; x++) {
        row.push(Math.floor(Math.random() * 2));
      }
      board.push(row);
    }
    return board;
  },
  clearBoard: function clearBoard() {
    var board = [];
    for (var i = 0; i < this.state.height; i++) {
      var row = [];
      for (var x = 0; x < this.state.length; x++) {
        row.push(0);
      }
      board.push(row);
    }
    return board;
  },
  handleClearBoard: function handleClearBoard() {
    this.setState({
      board: this.clearBoard(),
      generationCount: 0
    });
  },
  handleRandom: function handleRandom() {
    this.setState({
      board: this.createRandomBoard(),
      generationCount: 0
    });
  },
  nextBoard: function nextBoard() {
    var nextBoard = [];
    for (var i = 0; i < this.state.height; i++) {
      var nextRow = [];
      for (var x = 0; x < this.state.length; x++) {
        var nextCell = this.nextCell(this.state.board[i][x], i, x);
        nextRow.push(nextCell);
      }
      nextBoard.push(nextRow);
    }
    return nextBoard;
  },
  nextCell: function nextCell(state, i, x) {
    var neighborCount = this.neighborCount(i, x);
    var num = 0;
    if (state > 0 && (neighborCount === 2 || neighborCount === 3)) {
      num = 2;
    } else if (state === 0 && neighborCount === 3) {
      num = 1;
    } else {
      num = 0;
    }
    return num;
  },

  neighborCount: function neighborCount(i, x) {
    var score = 0;
    if (this.state.board[i][this.fix(x + 1, this.state.length)] > 0) score++;
    if (this.state.board[i][this.fix(x - 1, this.state.length)] > 0) score++;
    if (this.state.board[this.fix(i + 1, this.state.height)][x] > 0) score++;
    if (this.state.board[this.fix(i + 1, this.state.height)][this.fix(x + 1, this.state.length)] > 0) score++;
    if (this.state.board[this.fix(i + 1, this.state.height)][this.fix(x - 1, this.state.length)] > 0) score++;
    if (this.state.board[this.fix(i - 1, this.state.height)][x] > 0) score++;
    if (this.state.board[this.fix(i - 1, this.state.height)][this.fix(x + 1, this.state.length)] > 0) score++;
    if (this.state.board[this.fix(i - 1, this.state.height)][this.fix(x - 1, this.state.length)] > 0) score++;
    return score;
  },
  fix: function fix(num, roc) {
    var fixed = (num % roc + roc) % roc;
    return fixed;
  },
  advanceBoard: function advanceBoard() {
    this.setState({
      board: this.nextBoard(),
      generationCount: this.plusGeneration()
    });
  },
  pause: function pause() {
    clearInterval(this.state.timer);
  },
  play: function play() {
    this.setState({
      timer: setInterval(this.advanceBoard, this.state.speed)
    });
  },
  speedChange: function speedChange(speed) {
    clearInterval(this.state.timer);
    if (this.state.playPause === "Pause") {
      this.setState({
        timer: setInterval(this.advanceBoard, speed),
        speed: speed
      });
    } else {
      this.setState({
        speed: speed
      });
    }
  },
  menuOpenClose: function menuOpenClose() {
    if (this.state.menuCollapse === "collapse navbar-collapse") {
      this.setState({
        menuCollapse: "navbar-collapse"
      });
    } else {
      this.setState({
        menuCollapse: "collapse navbar-collapse"
      });
    }
  },
  sizeChange: function sizeChange(width, height) {
    this.setState({
      length: width,
      height: height
    });
    setTimeout(this.handleRandom);
  },
  handlePlayPause: function handlePlayPause() {
    if (this.state.playPause === "Play") {
      this.play();
      this.setState({
        playPause: "Pause"
      });
    } else {
      this.pause();
      this.setState({
        playPause: "Play"
      });
    }
  },
  boardChange: function boardChange(newBoard) {
    this.setState({
      board: newBoard
    });
  },
  closeModal: function closeModal() {
    this.setState({
      showModal: false
    });
  },
  showModal: function showModal() {
    this.setState({
      showModal: true
    });
  },
  render: function render() {
    var _this = this;

    return React.createElement(
      Col,
      { xs: 12 },
      React.createElement(
        Modal,
        { show: this.state.showModal, onHide: this.closeModal },
        React.createElement(
          Modal.Header,
          { closeButton: true },
          React.createElement(
            Modal.Title,
            null,
            "Conway's Game of Life"
          )
        ),
        React.createElement(
          Modal.Body,
          null,
          React.createElement(
            "p",
            null,
            "Welcome to the Game of Life! Light colored cells are new, dark cells are old. Click the board at anytime to add an alive cell. For more Information on Conway's Game of Life please click The link below. Enjoy!"
          )
        ),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            "a",
            { href: "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life", target: "_blank" },
            React.createElement(
              Button,
              { bsStyle: "info", bsSize: "large" },
              "More Info"
            )
          ),
          React.createElement(
            Button,
            { bsStyle: "primary", bsSize: "large", onClick: this.closeModal },
            "Continue!"
          )
        )
      ),
      React.createElement(
        Navbar,
        null,
        React.createElement(
          Navbar.Header,
          null,
          React.createElement(
            Navbar.Brand,
            null,
            React.createElement(
              "a",
              { href: "#" },
              "Generation: ",
              this.state.generationCount
            )
          ),
          React.createElement(Navbar.Toggle, null)
        ),
        React.createElement(
          Navbar.Collapse,
          null,
          React.createElement(
            Nav,
            { pullRight: true },
            React.createElement(
              NavItem,
              { onClick: this.handlePlayPause },
              this.state.playPause
            ),
            React.createElement(
              NavItem,
              { onClick: this.handleRandom },
              "Random"
            ),
            React.createElement(
              NavItem,
              { onClick: this.handleClearBoard },
              "Clear"
            ),
            React.createElement(
              NavDropdown,
              { title: "Speed" },
              React.createElement(
                MenuItem,
                { onClick: function onClick() {
                    return _this.speedChange(50);
                  }, href: "#" },
                "Fast"
              ),
              React.createElement(
                MenuItem,
                { onClick: function onClick() {
                    return _this.speedChange(100);
                  }, href: "#" },
                "Medium"
              ),
              React.createElement(
                MenuItem,
                { onClick: function onClick() {
                    return _this.speedChange(500);
                  }, href: "#" },
                "Slow"
              )
            ),
            React.createElement(
              NavDropdown,
              { title: "Size" },
              React.createElement(
                MenuItem,
                { onClick: function onClick() {
                    return _this.sizeChange(120, 70);
                  }, href: "#" },
                "Large"
              ),
              React.createElement(
                MenuItem,
                { onClick: function onClick() {
                    return _this.sizeChange(100, 50);
                  }, href: "#" },
                "Medium"
              ),
              React.createElement(
                MenuItem,
                { onClick: function onClick() {
                    return _this.sizeChange(50, 30);
                  }, href: "#" },
                "Small"
              )
            ),
            React.createElement(
              NavItem,
              { onClick: this.showModal, "data-target": "#infoModal" },
              "Info"
            )
          )
        )
      ),
      React.createElement(
        Grid,
        null,
        React.createElement(
          Row,
          null,
          React.createElement(
            Col,
            { xs: 12 },
            React.createElement(
              "h1",
              null,
              "Game of Life"
            )
          )
        ),
        React.createElement(
          Row,
          null,
          React.createElement(
            Col,
            { className: "board", xs: 12 },
            React.createElement(GameBoard, { onClick: this.boardChange, xs: 12, board: this.state.board })
          )
        ),
        React.createElement(
          Row,
          { xs: 12, className: "Btn-Group" },
          React.createElement(
            ButtonGroup,
            null,
            React.createElement(
              Button,
              { onClick: this.handlePlayPause, bsStyle: "primary" },
              this.state.playPause
            ),
            React.createElement(
              Button,
              { onClick: this.handleRandom, bsStyle: "danger" },
              "Random"
            ),
            React.createElement(
              Button,
              { onClick: this.handleClearBoard, bsStyle: "warning" },
              "Clear"
            )
          )
        )
      ),
      React.createElement(
        Col,
        { className: "footer" },
        React.createElement(
          "p",
          null,
          "Page designed and coded by Joe Anderson"
        )
      )
    );
  }
});

var GameBoard = React.createClass({
  displayName: "GameBoard",

  handleClick: function handleClick(row, col, event) {
    var ChangedBoard = this.props.board;
    ChangedBoard[row][col] = 1;
    this.props.onClick(ChangedBoard);
  },
  render: function render() {
    var rows = this.props.board.map(function (rowStats, index) {
      return React.createElement(GameRow, { onClick: this.handleClick.bind(null), row: index, rowStats: rowStats });
    }.bind(this));
    return React.createElement(
      "div",
      { className: "rows" },
      rows
    );
  }
});

var GameRow = React.createClass({
  displayName: "GameRow",

  handleClick: function handleClick(col, event) {
    this.props.onClick(this.props.row, col);
  },
  render: function render() {
    var cells = this.props.rowStats.map(function (cellStat, index) {
      return React.createElement(Cell, { onClick: this.handleClick.bind(null, index), col: index, cellStat: cellStat });
    }.bind(this));
    return React.createElement(
      "div",
      { className: "rows" },
      cells
    );
  }
});

var Cell = React.createClass({
  displayName: "Cell",

  render: function render() {
    if (this.props.cellStat === 0) return React.createElement("div", { onClick: this.props.onClick, className: "cell dead" });
    if (this.props.cellStat === 1) return React.createElement("div", { onClick: this.props.onClick, className: "cell young" });
    if (this.props.cellStat === 2) return React.createElement("div", { onClick: this.props.onClick, className: "cell old" });
  }
});

React.render(React.createElement(Game, null), document.getElementById("myDiv"));