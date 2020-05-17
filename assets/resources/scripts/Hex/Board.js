//import { DelRules } from 'Config';
let theScore = 0;
let HexUtil = require("../Hex/Util")
let Config = require("../Hex/Config")
let Global = require("../Global")
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
    },
    audio: {
      default: null,
      type: cc.AudioClip
    },
    WinPrefab:{
      default:null,
      type:cc.Prefab
  },
  },

  // LIFE-CYCLE CALLBACKS:
  start() { },
  onLoad() {
    //初始化3种类型属性0是斜方向1是横方向
    this.delRules = []
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
      const boardFrame = boardFrameList[i];
      //let index = boardFrameList[i].index;
      //cc.log("deleteTile---------", boardFrame.isFulled)
      if (boardFrame.isFulled) {
        fulledTilesIndex.push(i);
      }
    }
    for (let i = 0; i < this.delRules.length; i++) {
      const delRules = this.delRules[i]; // 消除规则获取
      for (let index = 0; index < delRules.length; index++) {
        const delRule = delRules[index];
        // 逐一获取规则数组与存在方块格子数组的交集
        cc.log(delRule)
        let intersectArr = this.HexUtil.ArrIntersect(fulledTilesIndex, delRule);
        if (intersectArr.length > 0) {
          // 判断两数组是否相同，相同则将方块添加到待消除数组里
          const isReadyDel = this.HexUtil.CheckArrIsEqual(delRule, intersectArr);
          if (isReadyDel) {
            readyDelTiles.push(delRule);
          }
        }
      }

    }
    //开始消除
    let count = 0;
    for (let i = 0; i < readyDelTiles.length; i++) {
      const readyDelTile = readyDelTiles[i];
      for (let j = 0; j < readyDelTile.length; j++) {
        const delTileIndex = readyDelTile[j];
        const boardFrame = this.boardFrameList[delTileIndex];
        const delNode = boardFrame.getChildByName('fillNode');
        boardFrame.isFulled = false;

        // 这里可以添加相应消除动画
        const finished = cc.callFunc(() => {
          delNode.getComponent(cc.Sprite).spriteFrame = null;
          delNode.opacity = 255;
          count++;
        }, this);
        delNode.runAction(cc.sequence(cc.fadeOut(0.3), finished));
      }
    }

    if (count !== 0) {
      this.addScore(count);
      this.checkLose();
    }

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
    Global.PassTime = theScore;
    let self = this
    self.WinPrefabNode = cc.instantiate(self.WinPrefab)
    self.WinPrefabNode.opacity = 0;
    self.node.addChild(self.WinPrefabNode)
    let fadeIn = cc.fadeIn(0.3)
    self.WinPrefabNode.runAction(fadeIn)
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
    this.setRightObliqueData()
    this.setLeftObliqueData()
    this.setHorizontalRule()
    cc.log(this.delRules)
  },

  hex2pixel(hex, h) {
    // 棋盘六角网格，坐标系转换像素方法
    let size = h / 2;
    let x = size * Math.sqrt(3) * (hex.q + hex.r / 2);
    let y = ((size * 3) / 2) * hex.r;
    return cc.v2(x, y);
  },

  //left方向规则
  setLeftObliqueData() {
    this._leftObliqueData = []
    let Data = []
    let Data2 = []
    let StartNum
    let IsFirst = false
    let CountNum = 0
    let Count = 0
    let Count2 = 1
    let baseData = this._rightObliqueData[0]
    this._rightObliqueData.map((rowValues, rowIndex) => rowValues.map((cellValue, colIndex) => {
      Count = Count + 1
      let MaxNum = baseData.length + this.hexSide
      if (rowIndex <= this.hexSide) {
        if (!IsFirst) {
          IsFirst = true
          StartNum = this.hexSide - rowIndex
        }
        Data.push(StartNum)
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
          StartNum = Data2[Count2]
        }
        Data.push(StartNum)
        let IsMax = (colIndex + 1) < (rowValues.length - (this.hexSide - 1))
        let OffsetNum = 0
        if (!IsMax) //这时候开始减了
        {
          CountNum = CountNum + 1
          OffsetNum = MaxNum - CountNum
        } else {
          OffsetNum = Math.min(baseData.length + this.hexSide, baseData.length + colIndex + 1 + Count2)
        }
        StartNum = StartNum + OffsetNum
      }

      if (Count >= rowValues.length) {
        IsFirst = false
        this._leftObliqueData.push(Data)
        if (rowIndex <= this.hexSide) {
          Data2.push(rowValues[0])
        } else {
          Count2 = Count2 + 1
        }
        Data = []
        Count = 0;
        CountNum = 0;
      }
    }));
    this.delRules.push(this._leftObliqueData)
  },
  //设置right方向规则()
  setRightObliqueData() {
    let Data = []
    let Count = 0
    this._rightObliqueData = []
    this.hexes.map((rowValues, rowIndex) => rowValues.map((cellValue, colIndex) => {
      Count = Count + 1
      let RealIndex = this.boardFrameList.length
      //左斜角
      Data.push(RealIndex)
      if (Count >= rowValues.length) {
        this._rightObliqueData.push(Data)
        Data = []
        Count = 0
      }
      let node = cc.instantiate(this.tileNode);
      let label = node.getChildByName("Label").getComponent(cc.Label);
      node.x = cellValue.x;
      node.y = cellValue.y;
      label.string = RealIndex; //"x:" + Math.floor( node.x)  + "\ny:" + Math.floor(node.y);
      node.parent = this.node;
      node.zIndex = -999;
      this.setShadowNode(node);
      this.setFillNode(node);
      // 保存当前棋盘格子的信息，用于后面落子判定及消除逻辑等。
      this.boardFrameList.push(node);
    }));
    this.delRules.push(this._rightObliqueData)
  },
  //设置水平方向规则
  setHorizontalRule() {
    this._horizontalData = []
    let Temp = 0
    let IsGetCurLength = false
    let Index = 0
    let Data = []
    while (Index < this._rightObliqueData.length) {
      if (!IsGetCurLength) {
        IsGetCurLength = true
        if (Index <= this.hexSide) {
          let RowValues = this._rightObliqueData[Index]
          for (let index = 0; index < RowValues.length; index++) {
            let TempArray = this._rightObliqueData[index]
            let TempNum = TempArray[Temp]
            if (index > this.hexSide) {
              TempNum = TempNum - (index - this.hexSide)
            }
            Data.push(TempNum)
          }
        } else {
          let baseData = this._horizontalData[Index - 1]
          for (let index = 1; index < baseData.length; index++) {
            let TempNum = baseData[index] + 1
            Data.push(TempNum)
          }
        }
        this._horizontalData.push(Data)
        Data = []
        IsGetCurLength = false
        Index = Index + 1
        Temp = Temp + 1
      }
    }
    this.delRules.push(this._horizontalData)

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
  },

  ReturnBtnClick(){
    cc.audioEngine.play(this.audio, false, 1);
    cc.director.loadScene("GameScene");
  }
});
