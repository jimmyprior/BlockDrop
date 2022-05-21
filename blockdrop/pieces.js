
class Block {
    constructor(color, scale = 20) {
        //class that represents information about a block
        this.scale = scale
        this.color = color;
    }

    draw(ctx, x, y, borderWidth = 1, borderColor = "#000000") {
        //real = the actual pixel values not block values
        let [realX, realY] = [x * this.scale, y * this.scale]

        ctx.fillStyle = borderColor;
        ctx.fillRect(realX, realY, this.scale, this.scale);
        ctx.fillStyle = this.color;
        ctx.fillRect(realX + borderWidth, realY + borderWidth, this.scale - borderWidth * 2, this.scale - borderWidth * 2);
    }
}



class Piece {
    constructor(x, y, color, shape, scale = 20) {
        //x and y are NOT scaled. each box is treated as 1
        //pieces are only when falling. turn to blocks when done and store in the game!
        this.x = x
        this.y = y 
        this.block = new Block(color, scale);
        this.shape = shape;
        this.orientation = 0;
    }

    getCoordinates(x, y, rotation) {
        let transformed = [];
        let coordinates = this.shape[rotation];
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

    
    draw(ctx) {
        //pass the canvas to this i think
        let coordinates = this.getCoordinates(this.x, this.y, this.orientation);
        for (let cord of coordinates) {
            this.block.draw(ctx, cord[0], cord[1]);
        }
    }
}


// #EF476F
// #F78C6B
// #FFD166
// #06D6A0
// #118AB2
// #073B4C
// #C853FA or #FA52FA


class Square extends Piece {
    constructor(x, y) {
        let shape = [
            [[0,0], [0,1], [1, 0], [1, 1]]
        ];
        let color = "#EF476F";
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
        let color = "#F78C6B";
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
        let color = "#FFD166";
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
        let color = "#06D6A0";
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
        let color = "#118AB2";
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
        let color = "#073B4C";
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
        let color = "#FA52FA";
        super(x, y, color, shape)
    }
}


export {Block, T, LeftS, RightS, LeftL, RightL, Rectangle, Square}