import drawSquare from "./utils.js"






class BlockDrop {
    constructor() {
        //manage the games. Start new games. pause games etc...
        //this needs to be capable of dumping to local storage and getting from local storage 

        //game settings 
        this.gameWidth = 10;
        this.gameHeight = 24;
        this.gameScale = 20; 
        this.gameCanvas = document.getElementById("game");
        this.gameCtx = this.gameCanvas.getContext("2d");    
        
        
        this.gameCanvas.width = this.gameWidth * this.gameScale;
        this.gameCanvas.height = this.gameHeight * this.gameScale;

    

        //event listers 
        this.pauseButton.addEventListener("click", this.togglePause.bind(this));
        this.restartButton.addEventListener("click", this.restart.bind(this));

        this.game = null
        this.paused = false;

        this.getNewGame()
    }

    getNewGame() {
        this.game = new Game(this.gameCtx, 1000, this.gameOver.bind(this));
    }

    restart() {
        //restart the current game
        this.getNewGame();
    }

    togglePause() {
        //pause the current game
        this.paused = this.game.togglePause();
    }
    
    gameOver(score) {
        console.log("game over!")
        this.game.end()
        this.getNewGame();
    }
}





export {BlockDrop};

class BlockDrop {
    constructor() {
        //manage the games. Start new games. pause games etc...
        //this needs to be capable of dumping to local storage and getting from local storage 

        //game settings 
        this.gameWidth = 10;
        this.gameHeight = 24;
        this.gameScale = 20; 
        this.gameCanvas = document.getElementById("game");
        this.gameCtx = this.gameCanvas.getContext("2d");    
        
        
        this.gameCanvas.width = this.gameWidth * this.gameScale;
        this.gameCanvas.height = this.gameHeight * this.gameScale;

    
        this.pauseButton = document.getElementById("pause");
        this.restartButton = document.getElementById("restart");
        this.highScoreField = document.getElementById("high-score");
        this.scoreField = document.getElementById("score");

        //event listers 
        this.pauseButton.addEventListener("click", this.togglePause.bind(this));
        this.restartButton.addEventListener("click", this.restart.bind(this));

        this.game = null
        this.paused = false;

        this.getNewGame()
    }

    getNewGame() {
        this.game = new Game(this.gameCtx, 1000, this.gameOver.bind(this));
    }

    restart() {
        //restart the current game
        this.getNewGame();
    }

    togglePause() {
        //pause the current game
        this.paused = this.game.togglePause();
    }
    
    gameOver(score) {
        console.log("game over!")
        this.game.end()
        this.getNewGame();
    }
}





export {BlockDrop};




class Game {
    constructor(ctx, updateInterval, onFinish, onScoreUpdate = null) {

        this.onFinish = onFinish;
        this.score = 0;
        this.updateInterval = updateInterval
        this.ctx = ctx;

        this.scale = 20;
        this.width = 10;
        this.height = 20;
        this.endHeight = 2;

        this.startX = 4;
        this.startY = 1;

        this.board = new Board(this.width, this.height, new Block("#000000", this.scale), this.endHeight); //store the placed blocks
        this.queue = new Queue([Square, Rectangle, RightL, LeftL, RightS, LeftS, T]); //get new pieces
        this.storage = new Storage(); //store pieces

        let piece = this.queue.getNextPiece()
        this.active = new piece(this.startX, this.startY);

        //wrap this all into a nice div 
        //move this state up to the function that manages the website integration 
        this.interval = this.run();
    }

    end() {
        clearInterval(this.interval);
        this.interval = null;
        document.removeEventListener("keydown", this.onKeyPress.bind(this));
    }

    run() {
        //run the game 
        document.addEventListener("keypress", this.onKeyPress.bind(this));

        return setInterval(
            function() {
                this.applyGravity()
            }.bind(this),
            this.updateInterval
        )
    }

    togglePause() {
        //returns false if it is paused, true if it is not paused
        if (this.interval !== null) {
            this.end()
            return false; //not running 
        }
        else {
            this.run()
            return true; // running 
        }
    }


    checkOutsideBorder(x, y) {
        //checks x, y on board
        //retruns true when outside of board
        //maybe more this to the board?
        return x < 0 || x >= this.width || y >= this.height;
    }

    checkValid(coordinates) {
        //checks if a coordinate is valid
        for (let coordinate of coordinates) {
            if (this.checkOutsideBorder(coordinate[0], coordinate[1]) || this.board.isOccupied(coordinate[0], coordinate[1])) {
                return false; //invalid
            }
        }
        return true; // valid
    }


    applyGravity() {
        if (!this.move(0, 1, false)) {
            this.setNewActive();
        }
        this.draw();
    }

    drawEndLine() {
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
    
        // draw a red line
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.endHeight * this.scale);
        this.ctx.lineTo(this.width * this.scale, this.endHeight * this.scale);
        this.ctx.stroke();        
    }

    draw() {
        //draw the board (placed blocks)
        //draw the active blocks 
        this.board.draw(this.ctx);
        this.active.draw(this.ctx);
        this.drawEndLine()
    }


    move(xChange = 0, yChange = 0, rotate = false) {
        // xChange, yChange = 1, 0 or -1 , rotate = true or false
        //checks if a move is valid
        if (rotate) {
            var rotate = this.active.getNextRotation();
        }
        else {
            var rotate = this.active.orientation;
        }

        let coords = this.active.getCoordinates(this.active.x + xChange, this.active.y + yChange, rotate);

        if (this.checkValid(coords)) {
            this.active.x += xChange;
            this.active.orientation = rotate;
            this.active.y += yChange;
            return true;
        }
        return false;

    }

    setNewActive() {
        this.gameOver = this.board.addPiece(this.active);
        if (this.gameOver) {
            this.togglePause();
            this.onFinish(this.score);
            return 
        }
        let piece = this.queue.getNextPiece();
        this.active = new piece(this.startX, this.startY);
    }

    onKeyPress(event) {

        if (event.key == "ArrowUp") {
            this.move(0, 0, true);
        }
        else if (event.key == "ArrowRight") {
            this.move(1, 0, false)
        }
        else if (event.key == "ArrowLeft") {
            this.move(-1, 0, false)
        }
        else if (event.key == "ArrowDown") {
            this.move(0, 1, false);
        }
        else if (event.key == " ") {
            let valid = true;
            while (valid) {
                valid = this.move(0, 1, false);
            }
            this.setNewActive();
        }
        
        this.draw();
    }
}


class Game {
    constructor(ctx, updateInterval) {

        this.onFinish = onFinish;
        this.score = 0;
        this.updateInterval = updateInterval
        this.ctx = ctx;

        this.scale = 20;
        this.width = 10;
        this.height = 20;
        this.endHeight = 2;

        this.startX = 4;
        this.startY = 1;

        this.board = new Board(this.width, this.height, new Block("#000000", this.scale), this.endHeight); //store the placed blocks
        this.queue = new Queue([Square, Rectangle, RightL, LeftL, RightS, LeftS, T]); //get new pieces
        this.storage = new Storage(); //store pieces

        let piece = this.queue.getNextPiece()
        this.active = new piece(this.startX, this.startY);

        //wrap this all into a nice div 
        //move this state up to the function that manages the website integration 
        this.interval = this.run();
    }

    end() {
        clearInterval(this.interval);
        this.interval = null;
        document.removeEventListener("keydown", this.onKeyPress.bind(this));
    }

    run() {
        //run the game 
        document.addEventListener("keypress", this.onKeyPress.bind(this));

        return setInterval(
            function() {
                this.applyGravity()
            }.bind(this),
            this.updateInterval
        )
    }




    checkValid(coordinates) {
        //checks if a coordinate is valid
        for (let coordinate of coordinates) {
            if (this.checkOutsideBorder(coordinate[0], coordinate[1]) || this.board.isOccupied(coordinate[0], coordinate[1])) {
                return false; //invalid
            }
        }
        return true; // valid
    }


    applyGravity() {
        if (!this.move(0, 1, false)) {
            this.setNewActive();
        }
        this.draw();
    }

    drawEndLine() {
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
    
        // draw a red line
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.endHeight * this.scale);
        this.ctx.lineTo(this.width * this.scale, this.endHeight * this.scale);
        this.ctx.stroke();        
    }

    draw() {
        //draw the board (placed blocks)
        //draw the active blocks 
        this.board.draw(this.ctx);
        this.active.draw(this.ctx);
        this.drawEndLine()
    }


    move(xChange = 0, yChange = 0, rotate = false) {
        // xChange, yChange = 1, 0 or -1 , rotate = true or false
        //checks if a move is valid
        if (rotate) {
            var rotate = this.active.getNextRotation();
        }
        else {
            var rotate = this.active.orientation;
        }

        let coords = this.active.getCoordinates(this.active.x + xChange, this.active.y + yChange, rotate);

        if (this.checkValid(coords)) {
            this.active.x += xChange;
            this.active.orientation = rotate;
            this.active.y += yChange;
            return true;
        }
        return false;

    }

    setNewActive() {
        this.gameOver = this.board.addPiece(this.active);
        if (this.gameOver) {
            this.togglePause();
            this.onFinish(this.score);
            return 
        }
        let piece = this.queue.getNextPiece();
        this.active = new piece(this.startX, this.startY);
    }

    onKeyPress(event) {

        if (event.key == "ArrowUp") {
            this.move(0, 0, true);
        }
        else if (event.key == "ArrowRight") {
            this.move(1, 0, false)
        }
        else if (event.key == "ArrowLeft") {
            this.move(-1, 0, false)
        }
        else if (event.key == "ArrowDown") {
            this.move(0, 1, false);
        }
        else if (event.key == " ") {
            let valid = true;
            while (valid) {
                valid = this.move(0, 1, false);
            }
            this.setNewActive();
        }
        
        this.draw();
    }
}


class Block {

    constructor(x, y, color, scale = 20) {
        this.x = x;
        this.y = y;
        this.scale = scale
        this.color = color;
    }

    draw(ctx, borderWidth = 1, borderColor = [0, 0, 0]) {
        ctx.fillStyle = borderColor;
        ctx.fillRect(this.x, this.y, this.scale, this.scale);
        ctx.fillStyle = color;
        ctx.fillRect(this.x + borderWidth, this.y + borderWidth, this.scale - borderWidth * 2, this.scale - borderWidth * 2);
    }

    setLocation(x, y) {
        this.x = x;
        this.y = y;
    }

    isAbove(y) {
        //is the block above the y value? 
        return (y > this.y); 
    }

    isInRow(y) {
        //should this block be clearned in the row being cleared? 
        return (y == this.y);
    }

}


class Piece {
    constructor(x, y, color, shape) {
        //x and y are NOT scaled. each box is treated as 1
        this.x = x; 
        this.y = y;
        this.color = color;
        this.shape = shape;
        this.orientation = 0;
    }

    getCoordinates(x, y, rotation) {
        var transformed = [];
        var coordinates = this.shape[rotation];
        for (let coordinate of coordinates) {
            transformed.push([coordinate[0] + x, coordinate[1] + y])
        }
        return transformed;
    }


    getNextRotation() {
        if (this.orientation == this.shape.length-1) {
            return 0;
        }
        else {
            return this.orientation + 1;
        }
    }


    rotate() {
        this.orientation = this.getNextRotation();
    }

    
    draw(ctx, scale) {
        //pass the canvas to this i think
        var coordinates = this.getCoordinates(this.x, this.y, this.orientation);

        for (let coordinate of coordinates) {
            drawSquare(ctx, coordinate[0] * scale, coordinate[1] * scale, scale, scale, this.color, 1, "#000000");
        }

    }

}



class Square extends Piece {
    constructor(x, y) {
        let shape = [
            [[0,0], [0,1], [1, 0], [1, 1]]
        ];
        let color = "#43AA8B";
        super(x, y, color, shape)
    }
}



class Rectangle extends Piece {
    constructor(x, y) {
        let shape = [
            [[-1,0], [0,0],[1,0], [2,0]],
            [[1,-1], [1,0], [1,1], [1,2]],
            [[-1,1],[0,1],[1,1],[2,1]],
            [[0,-1],[0,0],[0,1],[0,2]]
        ]
        let color = "#FF0000";
        super(x, y, color, shape)
    }
}


class RightL extends Piece {
    constructor(x, y) {
        let shape = [
            [[-1,-1], [-1,0], [0,0], [1,0]],
            [[1,-1], [0,-1],[0,0],[0,1]],
            [[-1,0],[0,0],[1,0],[1,1]],
            [[0,-1],[0,0],[0,1],[-1,1]]
        ]
        let color = "#00FF00";
        super(x, y, color, shape)
    }
}

class LeftL extends Piece {
    constructor(x, y) {
        let shape = [
            [[1,-1],[1,0],[0,0],[-1,0]],
            [[0,-1],[0,0],[0,1],[1,1]],
            [[-1,1],[-1,0],[0,0],[1,0]],
            [[-1,-1],[0,-1],[0,0],[0,1]]
        ]
        let color = "#0000FF";
        super(x, y, color, shape)
    }
}


class RightS extends Piece {
    constructor(x, y) {
        let shape = [
            [[-1,0],[0,0],[0,-1],[1,-1]],
            [[0,-1],[0,0],[1,0],[1,1]],
            [[-1,1],[0,1],[0,0],[1,0]],
            [[-1,-1],[-1,0],[0,0],[0,1]],
        ]
        let color = "#0000FF";
        super(x, y, color, shape)
    }
}


class LeftS extends Piece {
    constructor(x, y) {
        let shape = [
            [[-1,-1],[0,-1],[0,0],[1,0]],
            [[0,1],[0,0],[1,0],[1,-1]],
            [[-1,0],[0,0],[0,1],[1,1]],
            [[0,0],[0,-1],[-1,1],[-1,0]]
        ]
        let color = "#FFFF00";
        super(x, y, color, shape)
    }
}


class T extends Piece {
    constructor(x, y) {
        let shape = [
            [[-1,0],[0,0],[0,-1],[1,0]],
            [[0,-1],[0,0],[0,1],[1,0]],
            [[-1,0],[0,0],[1,0],[0,1]],
            [[-1,0],[0,0],[0,1],[0,-1]]
        ]
        let color = "#00FFFF";
        super(x, y, color, shape)
    }
}


export {T, LeftS, RightS, LeftL, RightL, Rectangle, Square}




import drawSquare from "./utils.js";
import {Block, T, LeftS, RightS, LeftL, RightL, Rectangle, Square} from "./pieces.js"




class Board {
    constructor(width, height, emptyBlock) {
        //stores the saved positiosn of the PLACED blocks
        this.width = width ;
        this.height = height;

        this.empty = emptyBlock; //block in the empty spaces
        this.board = [];
        this.setEmptyBoard();

    }


    getEmptyRow() {
        let row = [];
        for (let colIndex = 0; colIndex < this.width; colIndex++) {
            row.append(this.empty);
        }
        return row
    }


    setEmptyBoard() {
        for (let rowIndex = 0; rowIndex < this.height; rowIndex++) {
            this.board.append(this.getEmptyRow());
        }
    }



    isFull(rowIndex) {
        //check if a row is full
        let row = this.board[rowIndex];

        for (let item of row) {
            if ( Object.is(this.empty, item) ) {
                //if it is an empty box
                return false
            }
        }
        return true;
    }


    clearRow(rowIndex) {
        //remove the full row and add a new empty row at the top 
        this.board.splice(rowIndex, 1);
        this.board.splice(0, 0, this.getEmptyRow()) //
    }


    clearFullRows() {
        //clear empty rows and then move the above blocks down one
        for (let rowIndex = 0; rowIndex < this.height; rowIndex++) {
            if (this.isFull(rowIndex)) {
                this.clearRow(rowIndex);
            }
        }
    }


    addPiece(piece) {
        //adds a pieces blocks to the board
        for (let cord of piece.getCoordinates()) {
            this.board[cord[0]][cord[1]] = piece.block
        }
        // clear the full rows
        this.clearFullRows(); 
    }


    draw(ctx) {
        //DO NOT USE BLOCK METHODS!!! THE X AND Y ARE NOT ACCURATE . 
        //KEEP THE DRAW METHOD but just give the positon

        for (let rowIndex = 0; rowIndex < this.height; rowIndex++) {
            for (let colIndex = 0; colIndex < this.width; colIndex++) {
                let block = this.board[rowIndex][colIndex];
                block.draw(ctx, colIndex, rowIndex);
            }
        }
    }
}



class Game {
    constructor(ctx) {
        this.ctx = ctx;

        this.scale = 20;
        this.width = 10;
        this.height = 20;
        this.startX = 4;
        this.startY = 0;
        this.placed = []; // store this as a dict where x, y are the keyss

        this.quene = new Quene([Square, Rectangle, RightL, LeftL, RightS, LeftS, T]);
        this.storage = new Storage();

        let piece = this.quene.getNextPiece()
        this.active = new piece(this.startX, this.startY);


        document.addEventListener("keydown", this.onKeyPress.bind(this))

    }

    checkOverlap(x, y) {

        for (let piece of this.placed) {
            let coords = piece.getCoordinates(piece.x, piece.y, piece.orientation);
            if (coords.find(el => el[0] == x && el[1] == y)) {
                return true;
            }
        }
        return false;
    }

    checkOutsideBorder(x, y) {
        //checks x, y on board
        //retruns true when outside of board
        return x < 0 || x >= this.width || y >= this.height;
    }

    checkValid(coordinates) {
        //checks if a coordinate is valid
        for (let coordinate of coordinates) {
            if (this.checkOutsideBorder(coordinate[0], coordinate[1]) || this.checkOverlap(coordinate[0], coordinate[1])) {
                return false; //invalid
            }
        }
        return true; // valid
    }


    applyGravity() {
        if (!this.move(0, 1, false)) {
            this.setNewActive();
        }
        this.draw();
    }


    drawBackground() {
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 20; y++) {
                drawSquare(this.ctx, x * this.scale, y * this.scale, this.scale, this.scale, "#000000", 1, "#FFFFFF");
            }
        }
    }


    draw() {
        this.ctx.clearRect(0,0, this.width * this.scale, this.height * this.scale);
        this.drawBackground();
        for (let piece of this.placed) {
            piece.draw(this.ctx, this.scale)
        }
        this.active.draw(this.ctx, this.scale);
    }


    clearRow() {
        var storage = {};
        for (let piece of this.placed) {
            let coords = piece.getCoordinates(piece.x, piece.y, piece.orientation)
            for (let coord of coords) {
                let y = coord[1];
                if (y in storage) {
                    storage[y] += 1;
                }
                else {
                    storage[y] = 1;
                }
            }
        }
        for (const [row, info] of Object.entries(storage)) {
            console.log(row);
            console.log(info);
            if (info == this.width) {
                console.log("fun");
                for (let piece of this.placed) {
                    for (let i = 0; i < piece.shape[piece.orientation].length; i++) {
                        let newCoordinates = [];
                        let coordinate = piece.shape[piece.orientation][i];
                        if (coordinate[1] != row) {
                            newCoordinates.push(coordinate);
                        }
                        piece.shape[piece.orientation] = newCoordinates;
                    }                    
                }
            }
        }
    }

    move(xChange = 0, yChange = 0, rotate = false) {
        // xChange, yChange = 1, 0 or -1 , rotate = true or false
        //checks if a move is valid
        if (rotate) {
            var rotate = this.active.getNextRotation();
        }
        else {
            var rotate = this.active.orientation;
        }

        let coords = this.active.getCoordinates(this.active.x + xChange, this.active.y + yChange, rotate);

        if (this.checkValid(coords)) {
            this.active.x += xChange;
            this.active.orientation = rotate;
            this.active.y += yChange;
            return true;
        }
        return false;

    }

    setNewActive() {
        this.placed.push(this.active);
        this.clearRow();
        let piece = this.quene.getNextPiece();
        this.active = new piece(this.startX, this.startY);
    }

    onKeyPress(event) {
        if (event.key == "ArrowUp") {
            this.move(0, 0, true);
        }
        else if (event.key == "ArrowRight") {
            this.move(1, 0, false)
        }
        else if (event.key == "ArrowLeft") {
            this.move(-1, 0, false)
        }
        else if (event.key == "ArrowDown") {
            this.move(0, 1, false);
        }
        else if (event.key == " ") {
            let valid = true;
            while (valid) {
                valid = this.move(0, 1, false);
            }
            this.setNewActive();
        }
        
        this.draw();
    }
}



class Storage {
    constructor() {
        this.storage = null
        this.cooldown = false;
    }

    setPiece(piece) {
        //either returns null, false or a piece
        //null means its in hold but no other piece was set
        //piece means another piece was set and is being returned
        //false means it's in cooldown and can't be held

        if (!this.cooldown) {
            let previous = this.storage;
            this.storage = piece;
            this.cooldown = true;
            return previous;
        }
        return false;
    }

    resetCooldown() {
        this.cooldown = false;
    }
}


class Quene {
    constructor(pieces) {
        this.pieces = pieces;
        this.quene = [];
        this.addQuene(4);
    }

    addQuene(qty) {
        for (let i = 0; i < qty; i++) {
            this.quene.push(this.getRandomPiece())
        }
    }

    getRandomPiece() {
        return this.pieces[Math.floor(Math.random() * this.pieces.length)];
    }


    getNextPiece() {
        let first = this.quene[0];
        this.quene.shift()
        this.quene.push(this.getRandomPiece());
        return first;
    }

}


export {Game};