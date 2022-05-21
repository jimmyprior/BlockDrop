

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


export {Storage}