/**
 * 矩阵和数组相关工具集
 */
 const MatrixTools = {
    MakeRow(v = 0){
        const _array = new Array(9);
        _array.fill(v);
        return _array;
    },
    //生成矩阵
    MakeMatrix(v = 0){
        return Array.from({ length : 9 },() => this.MakeRow(v));
    },
    //Fisher-Yates洗牌算法
    Shuffle(_array){
        const EndIndex = _array.length -2;
        for (let index = 0; index < EndIndex; index++) {
            const j = index + Math.floor(Math.random() * (_array.length - index));
            [_array[index],_array[j]] = [_array[j],_array[index]];
        }
        return _array; 
    },
    //检测指定位置可以填写数字n
    CheckFillable(Matrix,n,RowIndex,ColIndex){
        const row = Matrix[RowIndex];
        const column = this.MakeRow().map((v,i) => Matrix[i][ColIndex]);
        const {BoxIndex}  = BoxTools.ConvertToBoxIndex(RowIndex,ColIndex);
        const box = BoxTools.GetBoxCells(Matrix,BoxIndex);
        for (let i = 0; i < 9; i++) {
            if (row[i] === n || column[i] === n || box[i] === n){
                return false;
            }
        }
        return true
    }
 }
 /**
  * 宫坐标系工具相关
  */
const BoxTools = {
   
    GetBoxCells(Matrix,BoxIndex){
        const startRowIndex = Math.floor(BoxIndex / 3) * 3;
        const startColIndex = BoxIndex % 3 *3;
        const results = [];
        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
            const rowIndex = startRowIndex + Math.floor(cellIndex /3);
            const colIndex =  startColIndex + cellIndex % 3;
            results.push(Matrix[rowIndex][colIndex]);
        }
        return results;
    },
    ConvertToBoxIndex(RowIndex,ColIndex){ 
        return {
            BoxIndex:Math.floor(RowIndex / 3) * 3 + Math.floor(ColIndex / 3),
            CellIndex:RowIndex % 3 * 3 + ColIndex % 3
        };
    },
    ConvertFromBoxIndex(BoxIndex,CellIndex){
        return {
            RowIndex:Math.floor(BoxIndex / 3) * 3 + Math.floor(CellIndex / 3),
            ColIndex:BoxIndex % 3 * 3 + CellIndex % 3
        }
    }
}
module.exports = class ToolKits {
    /**
     * 矩阵和数据相关的工具
     */
    static get MatrixTools(){
        return MatrixTools;
    }
    /**
     * 宫坐标系工具相关
     */
    static get BoxTools(){
        return BoxTools;
    }
}