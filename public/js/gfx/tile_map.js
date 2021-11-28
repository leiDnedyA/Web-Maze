
class TileMap {
    constructor(tileMap, tileSheet) {
        this.tiles = tileMap.tiles;
        this.rows = tileMap.rows;
        this.cols = tileMap.cols;
        this.tsize = tileMap.tsize;

        this.tileSheet = tileSheet;


        this.getTile = this.getTile.bind(this);
        this.getTileFromSheet = this.getTileFromSheet.bind(this);
        this.setTileSheet = this.setTileSheet.bind(this);
    }

    getTile(row, col) {
        let index = this.tiles[row * this.cols + col];

        return this.getTileFromSheet(index);
    }

    getTileFromSheet(i) {
        let width = this.tileSheet.width / this.tsize;

        return {
            x: (i % width) * this.tsize,
            y: Math.floor(i / width) * this.tsize,
            width: this.tsize,
            height: this.tsize
        };
    }

    setTileSheet(tileSheet) {
        this.tileSheet = tileSheet;
    }

}