//生成数据解决方案
let ToolKits = require("../core/ToolKits");
class Generator {
    generator(){
        while (!this.InternalGenerator()) {
            
        }
        return this.Matrix;
    }
    InternalGenerator(){
        this.Matrix = ToolKits.MatrixTools.MakeMatrix();
        this.Orders = ToolKits.MatrixTools.MakeMatrix().map(row => row.map((v,i) => i)).map(row => ToolKits.MatrixTools.Shuffle(row));
        //入口方法
        for (let n = 1; n <= 9; n++) {
         
            if(!this.FillNumber(n)){
                return false
            }
        }
        return true;
    }
    FillNumber(n){
        return this.FillRow(n,0);
    }
    //当前行 填写N成功。递归调用FillRow()来在下一行中填写n
    FillRow(n,RowIndex){
        if (RowIndex > 8 ){
            return true;
        }
        const row = this.Matrix[RowIndex]
        const orders = this.Orders[RowIndex];
        //TODO 随机选择列
        for (let index = 0; index < 9; index++) {
            const ColIndex = orders[index];
            //如果这个位置已经有值了,跳过
            if(row[ColIndex]){
                continue;
            }
            // 检查这个位置是否可以填入 n，如果不能填，忽略
            if(!ToolKits.MatrixTools.CheckFillable(this.Matrix,n,RowIndex,ColIndex)){
                continue;
            }
            row[ColIndex] = n;
            //去下一行填写n，如果填写失败,赋值为0，继续填写当前行下一个位置
            if (!this.FillRow(n,RowIndex + 1)){
                row[ColIndex] = 0;
                continue;
            }
            return true;
        }
        return false;
    }
}
module.exports = Generator;

