//import { DelRules } from 'Config';
let theScore = 0;
let HexUtil = require("../Hex/Util")
let Config = require("../Hex/Config")
cc.Class({
  extends: cc.Component,

  properties: {
    hexSide: 5, // 需要生成的六边形布局的边界个数
    tileH: 83, // 六边形高度
    tilePic: {
      // 棋盘背景
      default: null,
      type: cc.SpriteFrame
    },
    tileNode: {
      default: null,
      type: cc.Prefab
    },
    fillTilesList: {
      default: [],
      type: cc.Node
    }
  },

  // LIFE-CYCLE CALLBACKS:
  start() { },
  onLoad() {
    //初始化2种类型属性0是斜方向1是横方向
    this.delRules = []
    //cc.log("===========onload",this.delRules)
    this.HexUtil = new HexUtil();
    this.setHexagonGrid();
    this.node.on('dropSuccess', this.deleteTile, this);
    this.getOldScore();
  },
  // Methods
  getOldScore() {
    const oldScore = cc.sys.localStorage.getItem('score');
    let node = cc.find('Canvas/OldScore');
    let label = node.getComponent(cc.Label);
    label.string = Number(oldScore);
  },
  deleteTile() {
    let fulledTilesIndex = []; // 存储棋盘内有方块的的索引
    let readyDelTiles = []; // 存储待消除方块
    const boardFrameList = this.boardFrameList;
    this.isDeleting = true; // 方块正在消除的标识，用于后期添加动画时，充当异步状态锁
    this.addScore(this.curTileLength, true);
    // 首先获取棋盘内存在方块的格子信息
    for (let i = 0; i < boardFrameList.length; i++) {
      const boardFrame = boardFrameList[i].node;
      let index = boardFrameList[i].index;
      cc.log("deleteTile---------", boardFrame.isFulled)
      if (boardFrame.isFulled) {
        fulledTilesIndex.push(index);
      }
    }
    cc.log("deleteTile---------2", fulledTilesIndex, this.delRules)
    // for (let i = 0; i < Config.DelRules.length; i++) {
    //   const delRule = Config.DelRules[i]; // 消除规则获取
    //   // 逐一获取规则数组与存在方块格子数组的交集
    //   let intersectArr = this.HexUtil.ArrIntersect(fulledTilesIndex, delRule);
    //   if (intersectArr.length > 0) {
    //     // 判断两数组是否相同，相同则将方块添加到待消除数组里
    //     const isReadyDel = this.HexUtil.CheckArrIsEqual(delRule, intersectArr);
    //     if (isReadyDel) {
    //       readyDelTiles.push(delRule);
    //     }
    //   }
    // }
    //cc.log("deleteTile---------3",readyDelTiles.length)
    // 开始消除
    // let count = 0;
    // for (let i = 0; i < readyDelTiles.length; i++) {
    //   const readyDelTile = readyDelTiles[i];
    //   for (let j = 0; j < readyDelTile.length; j++) {
    //     const delTileIndex = readyDelTile[j];
    //     const boardFrame = this.boardFrameList[delTileIndex];
    //     const delNode = boardFrame.getChildByName('fillNode');
    //     boardFrame.isFulled = false;

    //     // 这里可以添加相应消除动画
    //     const finished = cc.callFunc(() => {
    //       delNode.getComponent(cc.Sprite).spriteFrame = null;
    //       delNode.opacity = 255;
    //       count++;
    //     }, this);
    //     delNode.runAction(cc.sequence(cc.fadeOut(0.3), finished));
    //   }
    // }

    // if (count !== 0) {
    //   this.addScore(count);
    //   this.checkLose();
    // }

    this.isDeleting = false;
  },

  addScore(count, isDropAdd) {
    let addScoreCount = this.scoreRule(count, isDropAdd);
    let node = cc.find('Canvas/Score');
    let label = node.getComponent(cc.Label);
    label.string = addScoreCount + Number(label.string);
    theScore = Number(label.string);
  },
  scoreRule(count, isDropAdd) {
    // 规则你定!
    let x = count + 1;
    let addScoreCount = isDropAdd ? x : 2 * x * x;
    return addScoreCount;
  },
  checkLose() {
    if (this.isDeleting) return;

    const fillTiles = this.fillTilesList //this.node.parent.getChildByName('TileContainer').children;
    const fillTilesLength = fillTiles.length;
    let count = 0;

    for (let i = 0; i < fillTilesLength; i++) {
      const fillTile = fillTiles[i];
      const fillTileScript = fillTile.getComponent('Shape'); // 直接获取方块节点下的脚本组件
      if (fillTileScript.checkLose()) {
        count++;
        fillTile.opacity = 125;
      } else {
        fillTile.opacity = 255;
      }
    }
    if (count === 3) {
      const oldScore = cc.sys.localStorage.getItem('score');
      if (oldScore < theScore) {
        cc.sys.localStorage.setItem('score', theScore);
      }
      this.gameOver();
    }
  },
  gameOver() {
    cc.log("============>>游戏结束")
  },
  setHexagonGrid() {
    this.hexes = [];
    this.boardFrameList = [];
    this.hexSide--;
    // 棋盘六角网格布局，坐标系存储方法
    for (let q = -this.hexSide; q <= this.hexSide; q++) {
      let r1 = Math.max(-this.hexSide, -q - this.hexSide);
      let r2 = Math.min(this.hexSide, -q + this.hexSide);
      for (let r = r1; r <= r2; r++) {
        let col = q + this.hexSide;
        let row = r - r1;
        if (!this.hexes[col]) {
          this.hexes[col] = [];
        }
        this.hexes[col][row] = this.hex2pixel({ q, r }, this.tileH);
      }
    }
    //cc.log("==========>",this.hexes)
    this._data = []
    this._data2 = []
    this._horData = []
    this._leftObliqueData = []
    this._rightObliqueData = []
    this._horizontalData = []
    this.baseData2 = []
    let StartNum
    let IsFirst = false
    let CountNum = 0
    let Count = 0
    let Count2 = 0
    let Count3 = 1
    //let Count4 = 0
    this.hexes.map((rowValues, rowIndex) => rowValues.map((cellValue, colIndex) => {
      Count = Count + 1
      //Count2 = Count2 + 1
      let RealIndex = this.boardFrameList.length
      let CurColIndex
      //左斜角
      this._data.push(RealIndex)
      // cc.log("=======", colIndex, rowIndex, this.hexSide, RealIndex)
      //this._data.push(colIndex)
      if (Count >= rowValues.length) {
        // if (this._obliqueData.length <= this.hexSide)
        // {
        this._rightObliqueData.push(this._data)
        //}
        this._data = []
        Count = 0
      }
      // if (rowIndex <= this.hexSide) {
      //   //斜的公式
      //   CurColIndex = Math.min(colIndex, rowValues.length - 1 - this.hexSide)
      // } else {
      //   let Temp = Math.max(colIndex - (rowValues.length - 1 - this.hexSide), 0)
      //   CurColIndex = rowIndex - Temp
      // }
      // this._horData.push(CurColIndex)
      // this._horData.sort();
      // if (Count2 >= rowValues.length) {
      //   this._horizontalData.push(this._horData)
      //   //cc.log("========>", this._horData)
      //   this._horData = []
      //   Count2 = 0;
      // }
      let node = cc.instantiate(this.tileNode);
      let label = node.getChildByName("Label").getComponent(cc.Label);
      node.x = cellValue.x;
      node.y = cellValue.y;
      label.string = RealIndex; //"x:" + Math.floor( node.x)  + "\ny:" + Math.floor(node.y);
      node.parent = this.node;
      node.zIndex = -999;
      this.setShadowNode(node);
      this.setFillNode(node);
      let infodata = {
        node: node,
        index: RealIndex,
      };
      // 保存当前棋盘格子的信息，用于后面落子判定及消除逻辑等。
      this.boardFrameList.push(infodata);
    }));
    this.delRules.push(this._rightObliqueData)
    cc.log(this._rightObliqueData)
    let baseData = this._rightObliqueData[0]
    //第二组
    Count = 0
    this._rightObliqueData.map((rowValues, rowIndex) => rowValues.map((cellValue, colIndex) => {
      //cc.log("=======2", colIndex, rowIndex, this.hexSide, baseData)
      Count = Count + 1
      let MaxNum = baseData.length + this.hexSide
      if (rowIndex <= this.hexSide) {
        if (!IsFirst) {
          IsFirst = true
          StartNum = this.hexSide - rowIndex
        }
        this._data2.push(StartNum)
        let IsMax = (baseData.length + colIndex) <= MaxNum;
        let OffsetNum = 0
        if (!IsMax) //这时候开始减了
        {
          CountNum = CountNum + 1
          OffsetNum = MaxNum - CountNum
        } else {
          OffsetNum = Math.min(baseData.length + this.hexSide, baseData.length + colIndex + 1)
        }
        StartNum = StartNum + OffsetNum
      } else {
        if (!IsFirst) {
          IsFirst = true
          StartNum = this.baseData2[Count3]
        }
        this._data2.push(StartNum)
        let IsMax = (colIndex + 1) < (rowValues.length - (this.hexSide - 1))
        let OffsetNum = 0
        //cc.log("============>0", (colIndex + 1), IsMax, StartNum, MaxNum, rowValues.length - this.hexSide, (rowValues.length - Math.ceil(rowValues.length / this.hexSide)))
        if (!IsMax) //这时候开始减了
        {
          CountNum = CountNum + 1
          OffsetNum = MaxNum - CountNum
        } else {
          OffsetNum = Math.min(baseData.length + this.hexSide, baseData.length + colIndex + 1 + Count3)
        }

        StartNum = StartNum + OffsetNum
      }

      if (Count >= rowValues.length) {
        IsFirst = false
        this._leftObliqueData.push(this._data2)
        if (rowIndex <= this.hexSide) {
          this.baseData2.push(rowValues[0])
        } else {
          Count3 = Count3 + 1
        }
        this._data2 = []
        Count = 0;
        CountNum = 0;
      }
    }));
    this.delRules.push(this._leftObliqueData)
    cc.log(this._leftObliqueData)
    let lenght = this._leftObliqueData.length - 1
    Count = 0
    Count3 = 0
    baseData = this._leftObliqueData[lenght]
    cc.log(baseData)
    //最后一组
    this._rightObliqueData.map((rowValues, rowIndex) => rowValues.map((cellValue, colIndex) => {
    
      Count = Count + 1
      // let MaxNum = baseData.length + this.hexSide 
      // let IsMax = Count3 < (baseData.length - (this.hexSide - 1))
      // if (Count3 < baseData.length){
      //   if (!IsFirst) {
      //     IsFirst = true
      //     StartNum = baseData[Count3]
      //   }
      //   if (IsMax) {//

      //   } else {

      //   }
      //   cc.log(MaxNum, IsMax, StartNum)
      // }else{
      //   StartNum = StartNum + 1
      //   cc.log("=======>", StartNum, this.hexSide, rowIndex, colIndex, Count3, Count)
      // }
     

    
      //if (Count <= this.hexSide) {//this.hexSide
        // if (!IsFirst) {
        //   IsFirst = true
        //   StartNum = baseData[Count3]
        // }
        // //cc.log("========>", rowIndex, this.hexSide, rowValues.length, baseData.length, colIndex,StartNum)
        // this._data2.push(StartNum)
        // let IsMax = (colIndex + 1) < (rowValues.length - (this.hexSide - 1))
        // CountNum = CountNum + 1
        // OffsetNum = MaxNum - CountNum
        // //let OffsetNum = 0
        // // if (!IsMax) //这时候开始减了
        // // {
        // //   // CountNum = CountNum + 1
        // //   // OffsetNum = MaxNum - CountNum
        // // } else {
        // //   OffsetNum = 0
        // //   //baseData.length + colIndex + 1
        // //   //cc.log("========>",this.hexSide, rowValues.length, baseData.length, colIndex, StartNum)
        // //   //baseData.length - colIndex - 1//Math.min(baseData.length + this.hexSide, baseData.length + colIndex - 1)
        // // }
        // //OffsetNum = Math.min(baseData.length + this.hexSide, baseData.length + colIndex - 1)
        // cc.log(IsMax, OffsetNum, rowIndex,colIndex,this.hexSide, rowValues.length)
        // StartNum = StartNum - OffsetNum
      //} else {
        // cc.log("========>2", rowIndex)
        // if (!IsFirst) {
        //   IsFirst = true
        //   StartNum = 0 //this.baseData2[Count3]
        // }
        // this._data2.push(StartNum)
        // let IsMax = (colIndex + 1) < (rowValues.length - (this.hexSide - 1))
        // let OffsetNum = 0
        // //cc.log("============>0", (colIndex + 1), IsMax, StartNum, MaxNum, rowValues.length - this.hexSide, (rowValues.length - Math.ceil(rowValues.length / this.hexSide)))
        // if (!IsMax) //这时候开始减了
        // {
        //   CountNum = CountNum + 1
        //   OffsetNum = MaxNum - CountNum
        // } else {
        //   OffsetNum = Math.min(baseData.length + this.hexSide, baseData.length + colIndex + 1 + Count3)
        // }

        // StartNum = StartNum + OffsetNum
      //}

      if (Count >= rowValues.length) {
        IsFirst = false
        Count3 = Count3 + 1
        cc.log("=======2", colIndex, rowIndex, this.hexSide, cellValue, rowValues)
        // this._leftObliqueData.push(this._data2,)
        //cc.log("======>1", this._data2)
        // if (rowIndex >= this.hexSide) {
        //   //cc.log("=====2", rowValues[0])
        //   //this.baseData2.push(rowValues[0])
        // } else {
        //   
        // }
        this._data2 = []
        Count = 0;
        CountNum = 0;
      }
    }));

  },
  hex2pixel(hex, h) {
    // 棋盘六角网格，坐标系转换像素方法
    let size = h / 2;
    let x = size * Math.sqrt(3) * (hex.q + hex.r / 2);
    let y = ((size * 3) / 2) * hex.r;
    return cc.v2(x, y);
  },
  setSpriteFrame(hexes) {

    //let CurDelRules = this.delRules[0]
    for (let index = 0; index < hexes.length; index++) {
      let node = cc.instantiate(this.tileNode);
      let label = node.getChildByName("Label").getComponent(cc.Label);
      node.x = hexes[index].x;
      node.y = hexes[index].y;
      this._data.push(index)
      // if ((index + 1) >= hexes.length)
      // {
      //   let intersectArr = this.HexUtil.CheckArrIsEqual(this.delRules[0], this._data);
      //   cc.log("setsprtframe0", this._data, intersectArr.length)
      //   this.delRules[0].push(this._data)
      //   this._data = []
      // }
      //cc.log("setsprtframe",hexes.length,index)
      label.string = this.boardFrameList.length + 1; //"x:" + Math.floor( node.x)  + "\ny:" + Math.floor(node.y);
      node.parent = this.node;
      node.zIndex = -999;
      this.setShadowNode(node);
      this.setFillNode(node);
      let infodata = {
        node: node,
        index: index,
      };
      // 保存当前棋盘格子的信息，用于后面落子判定及消除逻辑等。
      this.boardFrameList.push(infodata);
    }
    cc.log("setsprtframe2", this.delRules[0])
  },
  setShadowNode(node) {
    const newNode = new cc.Node('frame');
    newNode.addComponent(cc.Sprite);
    newNode.name = 'shadowNode';
    newNode.opacity = 150;
    newNode.parent = node;
  },
  setFillNode(node) {
    const newNode = new cc.Node('frame');
    newNode.addComponent(cc.Sprite);
    newNode.name = 'fillNode';
    newNode.parent = node;
  }

  // update (dt) {},
});
