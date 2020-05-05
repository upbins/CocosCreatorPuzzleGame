//检查数据解决方案
let ToolKits = require("../core/ToolKits");

//输入:matrix,用户完成的数独数据
//处理：对matrix 行、列、宫、进行检测，并填写marks
//输出：检查是否成功、marks
class Checker{
    constructor(matrix){
        this._matrix = matrix;
    }
    get MatrixMarks(){
        return this._matrixMarks;
    }
    get IsSuccess(){
        return this._success
    }
    static CheckArray(array) {
        const length = array.length
        const marks = new Array(length);
        marks.fill(true);
        for (let i = 0; i < length; i++) {
            if (!marks[i]){
                continue;
            }
            let v = array[i];
            //是否有效 0-无效,1-9有效
            if(!v){
                marks[i] = false;
                continue;
            }
            //是否有重复,i+1 ~9 是否和i位置数据重复
            for (let j = i + 1; j < length; j++) {
                if (v === array[j]){
                    marks[i] = marks[j] = false;
                }
            }
        }
        return marks
    }
    Check(){
        this._matrixMarks = ToolKits.MatrixTools.MakeMatrix(true);
        this.CheckRows();
        this.CheckCols();
        this.CheckBoxes();
        //检查是否成功
        this._success = this._matrixMarks.every(row => row.every(mark => mark))
        return this;
    }
    /**
     * 需要在调用 check() 之后使用，指示检查是否成功(即完全符合数独规则)
     */
    get Success() {
        return this._success;
    }
    get MatrixMarks(){
        return this._matrixMarks
    }
    CheckRows(){
        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            const row =  this._matrix[rowIndex];
            const marks = Checker.CheckArray(row);
            for (let colIndex = 0; colIndex < marks.length; colIndex++) {
              //cc.log("CheckRows",rowIndex,colIndex)
               if(!marks[colIndex]){
                   this._matrixMarks[rowIndex][colIndex] = false;
               }
            }
        }
    }
    CheckCols(){
        for (let colIndex = 0; colIndex < 9; colIndex++) {
            const cols = [];
            for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
                cols[rowIndex] = this._matrix[rowIndex][colIndex];
            }
            const marks = Checker.CheckArray(cols);
            for (let rowIndex = 0; rowIndex < marks.length; rowIndex++) {
                //cc.log("CheckCols",rowIndex,colIndex)
                if(!marks[rowIndex]){
                    this._matrixMarks[rowIndex][colIndex] = false;
                } 
            }
        }
    }
    CheckBoxes(){
        for (let boxIndex = 0; boxIndex < 9; boxIndex++) {
            const boxes = ToolKits.BoxTools.GetBoxCells(this._matrix,boxIndex);
            const marks = Checker.CheckArray(boxes);
            for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
                if(!marks[cellIndex]){
                    const {RowIndex,ColIndex} = ToolKits.BoxTools.ConvertFromBoxIndex(boxIndex,cellIndex);
                    this._matrixMarks[RowIndex][ColIndex] = false;
                }
            }
        }
    }
}
module.exports = Checker
// const Generator = require("../core/Generator")
// const gen = new Generator();
// gen.generator();
// console.log(gen.Matrix)
// let matrix = gen.Matrix
// const Checker1 = new Checker(matrix)
// console.log("check result",Checker1.Check());
// console.log(Checker1.MatrixMarks)

// matrix[1][1] = 0;
// matrix[2][3] = matrix[3][5] = 5;
// const Checker2 = new Checker(matrix)
// console.log("check result2",Checker2.Check());
// console.log(Checker2.MatrixMarks)