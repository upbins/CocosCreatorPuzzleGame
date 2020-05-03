//华容道生成
class Klotski {

    /**
     * 根据内部的数独解决方案，生成一个随机谜盘。
     * level 表示难度等级。
     * level 越大表示越难，但 level 不能超过 8，最好是在 3~7 之间。
     */
    MakeArray(level){
        this.Level = level;
        this.Length = level * level;
        let _array = [];
        for (var index = 1; index <= this.Length; index++) 
        {
            _array.push(index);
        }
        this.Shuffle (_array);
        this.GetNegativeSequence(_array);
        return _array;
    }
    Shuffle (_array) {
        let temp = 0
        for (var i= 0; i < this.Length; i++)
         {
            var randNum = Math.round(Math.random() * (this.Length - 1));
            temp =  _array[randNum],
            _array[randNum] =  _array[i], 
            _array[i] = temp;
        }
    }
    GetNegativeSequence(_array){
        let temp = 0
        let e = 0
        for (var i = 0; i < this.Length - 1; i++){
            if (_array[i] != this.Length)
            {
                for (var j = i + 1; j < this.Length; j++)
                {
                    _array[i] > _array[j] && e++;
                }
                
            }else{
                temp = Math.floor(i / this.Level) + 1;
            }
        }
        return this.Level % 2 ? e % 2 : (e + this.Level - temp) % 2;
    }
}


module.exports = Klotski;