//生成数独游戏
const Generator = require("../core/Generator");
class Sudoku {
    constructor() {
        const gen = new Generator();
        gen.generator();
        this.matrix = gen.Matrix;
        console.log(this.matrix)
    }

    /**
     * 根据内部的数独解决方案，生成一个随机谜盘。
     * level 表示难度等级。
     * level 越大表示越难，但 level 不能超过 8，最好是在 3~7 之间。
     */
    make(level) {
        if(level>=8){
            level = 8
        }else if (level<=1){
            level = 1
        }
        console.log(level)
        this.puzzleMatrix = this.matrix.map(row => {
            return row.map(v => Math.random() * 9 < level ? 0 : v);
        });
        return this.puzzleMatrix;
    }
}
module.exports = Sudoku;
