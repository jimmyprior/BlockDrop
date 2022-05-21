class Board {
    constructor(width, height, emptyBlock, endHeight) {
        //stores the saved positiosn of the PLACED blocks
        this.width = width ;
        this.height = height;

        this.endHeight = endHeight;
        this.empty = emptyBlock; //block in the empty spaces
        this.board = [];
        this.setEmptyBoard();

        this.breaks = 0;
    }


    getEmptyRow() {
        let row = [];
        for (let colIndex = 0; colIndex < this.width; colIndex++) {
            row.push(this.empty);
        }
        return row
    }


    setEmptyBoard() {
        for (let rowIndex = 0; rowIndex < this.height; rowIndex++) {
            this.board.push(this.getEmptyRow());
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
                this.breaks += 1;
                this.clearRow(rowIndex);
            }
        }
    }


    addPiece(piece) {
        //adds a pieces blocks to the board
        let gameOver = false;
        for (let cord of piece.getCoordinates(piece.x, piece.y, piece.orientation)) {
            if (cord[1] < this.endHeight) {
                gameOver = true
            }
            this.board[cord[1]][cord[0]] = piece.block;
        }
        // clear the full rows
        if (!gameOver) {
            this.clearFullRows(); 
        }
        return gameOver;
        
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


    isOccupied(x, y) {
        //returns true if space if occupied, false if not 
        return !Object.is(this.empty, this.board[y][x]);
    }
}

export {Board}