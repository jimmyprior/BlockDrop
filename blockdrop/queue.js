

class Queue {
    constructor(pieces) {
        this.pieces = pieces;
        this.queue = [];
        this.addQueue(4);
    }

    addQueue(qty) {
        for (let i = 0; i < qty; i++) {
            this.queue.push(this.getRandomPiece())
        }
    }

    getRandomPiece() {
        return this.pieces[Math.floor(Math.random() * this.pieces.length)];
    }


    getNextPiece() {
        let first = this.queue[0];
        this.queue.shift()
        this.queue.push(this.getRandomPiece());
        return first;
    }

}


export {Queue}