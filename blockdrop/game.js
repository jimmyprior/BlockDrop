import {Block, T, LeftS, RightS, LeftL, RightL, Rectangle, Square} from "./pieces.js"
import {Board} from "./board.js"
import {Queue} from "./queue.js"
import {Storage} from "./storage.js"



class Game {
    constructor() {
        //starting positions of the piece
        this.start = {x : 4, y : 1}

        this.score = 0;
    
        this.scale = 20;
        this.width = 10;
        this.height = 23;
        this.endHeight = 3;

        this.board = new Board(this.width, this.height, new Block("#000000", this.scale), this.endHeight);
        this.queue = new Queue([Square, Rectangle, RightL, LeftL, RightS, LeftS, T]);
        this.storage = new Storage();

        this.active = this.getRandomPiece();
        this.isOver = false;
    }


    onKeyPress(key, ctx) {
        if (key == "ArrowRight") {
            this.move(1, 0, false)
        }

        else if (key == "ArrowLeft") {
            this.move(-1, 0, false)
        }

        else if (key == "ArrowUp") {
            this.move(0, 0, true)
        }

        else if (key == "ArrowDown") {
            this.score += 1;
            this.move(0, 1, false)
        }

        else if (key == " ") {
            let move = true;
            while (move) {
                move = this.move(0, 1, false)
            }
            this.setNewActive()
        }

        this.draw(ctx)
    }


    getScore() {
        return this.score + this.board.breaks * 10;
    }


    getRandomPiece() {
        //get a random piece
        let piece = this.queue.getNextPiece()
        return new piece(this.start.x, this.start.y)
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


    update(ctx) {
        //move down and or set new 
        if (!this.move(0, 1, false)) {
            this.setNewActive();
        }
        this.draw(ctx);
    }


    drawEndLine(ctx) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
    
        // draw a red line
        ctx.beginPath();
        ctx.moveTo(0, this.endHeight * this.scale);
        ctx.lineTo(this.width * this.scale, this.endHeight * this.scale);
        ctx.stroke();        
    }

    draw(ctx) {
        //draw the board (placed blocks)
        //draw the active blocks 
        this.board.draw(ctx);
        this.active.draw(ctx);
        this.drawEndLine(ctx)
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
        this.isOver = this.board.addPiece(this.active);
        if (!this.isOver) {
            this.active = this.getRandomPiece();
        }
    }
}


export {Game}