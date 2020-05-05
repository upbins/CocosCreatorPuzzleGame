// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let Klotski = require("../klotski/core/Klotski")
let Global = require("../Global")
cc.Class({
    extends: cc.Component,

    properties: {
        puzzleLayer:{
            default:null,
            type:cc.Node
        },
        numPrefab:{
            default:null,
            type:cc.Prefab
        },
        audio: {
            default: null,
            type: cc.AudioClip
        },
        HelpLayer:{
            default: null,
            type: cc.Node
        },
        TipsNode:{
            default: null,
            type: cc.Node
        },
        Level:3,
        Duration: 0.15
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.blankIndex = 0;
        this.currentPoint = null;
        this.puzzleLayer.on(cc.Node.EventType.TOUCH_END, this.OnClickTouch, this);
        this.GameStart()
    },
    GameStart(){
        const klotski = new Klotski();
        this.Level = Global.SelectGameLevel;
        console.log("GameStart"+Global.SelectGameLevel)
        this.klotskiArray = klotski.MakeArray(this.Level);
        this.Length = klotski.Length;
        this.puzzleLayer.removeAllChildren();
        this.InitUI();
        this.InitHelpLayer();
    },
    InitHelpLayer(){
        let CurScale = 1
        let Cell = this.TipsNode.width / this.Level * CurScale;
        for (var Index = 0; Index < this.Length; Index++){
            let tipsNumPrefab = cc.instantiate(this.numPrefab);
            //let curIndex = Index-1
            tipsNumPrefab.scale = CurScale
            tipsNumPrefab.width = Cell * CurScale;
            tipsNumPrefab.height = Cell * CurScale;
            tipsNumPrefab.getChildByName("NumLabel").getComponent(cc.Label).string = Index;
            tipsNumPrefab.getChildByName("NumLabel").getComponent(cc.Label).fontSize = tipsNumPrefab.height / 2;
            this.TipsNode.addChild(tipsNumPrefab);
            tipsNumPrefab.x = Index % this.Level * Cell + 0.5 * Cell, 
            tipsNumPrefab.y = -Math.floor(Index / this.Level) * Cell - 0.5 * Cell;
        }
    },
    InitUI(){
        this.Cell = this.puzzleLayer.width / this.Level;
        for (var Index = 0; Index < this.Length; Index++){
            let numPrefab = cc.instantiate(this.numPrefab);
            //let curIndex = Index-1
            numPrefab.width = this.Cell;
            numPrefab.height = this.Cell;
            if (this.Length == this.klotskiArray[Index]){
                numPrefab.getChildByName("NumLabel").getComponent(cc.Label).string = "";
                numPrefab.getComponent(cc.Sprite).spriteFrame = null;
                this.blankIndex = Index;
            }else{
                numPrefab.getChildByName("NumLabel").getComponent(cc.Label).string = this.klotskiArray[Index];
            }
            numPrefab.getChildByName("NumLabel").getComponent(cc.Label).fontSize = numPrefab.height / 2;
            this.puzzleLayer.addChild(numPrefab);
            numPrefab.x = Index % this.Level * this.Cell + 0.5 * this.Cell, 
            numPrefab.y = -Math.floor(Index / this.Level) * this.Cell - 0.5 * this.Cell;
        }
    },
    OnClickTouch(event){
        cc.audioEngine.play(this.audio, false, 1);
        this.currentPoint = this.puzzleLayer.convertToNodeSpaceAR(event.touch._point) 
        if (this.IsNeighboring()){
            this.Exchange()
     
        }else{
            this.IsNeighboring()
        }
    },
    IsNeighboring(){
        //找出第几行第几列当前点击
        this.currentRow = Math.floor(Math.abs(this.currentPoint.y) / this.Cell)
        this.currentCol = Math.floor(this.currentPoint.x / this.Cell)
        this.currentIndex = this.currentRow * this.Level + this.currentCol
        // console.log("点击了第" + this.currentRow + "行"), 
        // console.log("点击了第" + this.currentCol + "列")
        // console.log("this.currentIndex " + this.currentIndex)
        // console.log("this.blankIndex " + this.blankIndex)
        if (this.currentIndex != this.blankIndex)
        {
            this.blankRow = Math.floor(this.blankIndex / this.Level)
            this.blankCol = Math.floor(this.blankIndex % this.Level)
            // console.log("this.blankRow " + this.blankRow)
            // console.log("this.blankCol " + this.blankCol)
            // console.log("this.currentIndex " + this.currentIndex) 
            return this.currentRow == this.blankRow || this.currentCol == this.blankCol
        }else
        {
            return this.currentIndex != this.blankIndex
        }
    },
    Exchange(){
        let Chiles = this.puzzleLayer.getChildren()
        if (this.currentRow == this.blankRow)
            if (this.currentCol < this.blankCol) {
                for (let index = this.currentIndex; index < this.blankIndex; index++) 
                {
                    let action = cc.moveBy(this.Duration, cc.v2(this.Cell, 0));
                    //console.log("move_right"), console.log("i is " + t), 
                    //console.log(e[t]), 
                    Chiles[index].runAction(action);
                }
                let action = cc.moveBy(this.Duration, cc.v2(-this.Cell * (this.blankCol - this.currentCol), 0))
                Chiles[this.blankIndex].runAction(action),
                Chiles[this.blankIndex].setSiblingIndex(this.currentIndex);
            } else {
                for (let index = this.currentIndex; index > this.blankIndex; index--) {
                    let action = cc.moveBy(this.Duration, cc.v2(-this.Cell, 0));
                    //console.log("move_left"), console.log("i is " + o), 
                    Chiles[index].runAction(action);
                }
                let action = cc.moveBy(this.Duration, cc.v2(this.Cell * (this.currentCol - this.blankCol), 0))
                Chiles[this.blankIndex].runAction(action),
                Chiles[this.blankIndex].setSiblingIndex(this.currentIndex);
            }
        else if (this.currentRow > this.blankRow) {
            for (let index = this.blankIndex + this.Level; index <= this.currentIndex; index += this.Level) {
                let action = cc.moveBy(this.Duration, cc.v2(0, this.Cell));
                //console.log("move_up"), console.log("i is " + s), 
                Chiles[index].runAction(action), 
                Chiles[index].setSiblingIndex(index - this.Level),
                Chiles[this.blankIndex + 1].setSiblingIndex(index), 
                this.blankIndex = index;
            }
            let action = cc.moveBy(this.Duration, cc.v2(0, -this.Cell * (this.currentRow - this.blankRow)))
            Chiles[this.blankIndex].runAction(action);
        } else {
            for (let index = this.blankIndex - this.Level; index >= this.currentIndex; index -= this.Level) {
                let action = cc.moveBy(this.Duration, cc.v2(0, -this.Cell))
                //console.log("move_down"), console.log("i is " + r), 
                Chiles[index].runAction(action)
                Chiles[index].setSiblingIndex(index + this.Level)
                Chiles[this.blankIndex - 1].setSiblingIndex(index), 
                this.blankIndex = index
            }
            let action = cc.moveBy(this.Duration, cc.v2(0, this.Cell * (this.blankRow - this.currentRow)))
            Chiles[this.blankIndex].runAction(action);
        }
        this.blankIndex = this.currentIndex, console.log(this.blankIndex)
        this.CheckAll()
    },
    CheckAll(){
        let Chiles = this.puzzleLayer.getChildren()
        let IsFinish = false
        for (t = 0; t < this.Length - 1; t++)
        {
            let string = Chiles[t].getChildByName("NumLabel").getComponent(cc.Label).string 
            console.log(string);
            if (string != t + 1) {
                console.log("还没通关");
                IsFinish = false;
                break;
            }else{
                IsFinish = true;
            }
           
        }
        if (IsFinish){
            console.log("通关成功");
        }
    },
    OnHelpBtnClick(){
        var self = this
        cc.audioEngine.play(self.audio, false, 1);
        self.HelpLayer.active = true
        self.HelpLayer.scale = 0;
        self.HelpLayer.opacity = 0
        self.HelpLayer.stopAllActions();
        let StartCallFunc = cc.callFunc(function(){
            cc.tween(self.HelpLayer).to(0.3, {scale: 1,opacity:255}).start();
        })
        self.HelpLayer.runAction(StartCallFunc);
        //this.HelpLayer.active = true
    },
    CloseHelpClick(){
        var self = this
        cc.audioEngine.play(self.audio, false, 1);
        //this.HelpLayer.active = false
        let StartCallFunc = cc.callFunc(function(){
            cc.tween(self.HelpLayer).to(0.3, {scale: 0,opacity:0}).start();
        })
        self.HelpLayer.runAction(StartCallFunc);
    },
    OnRefreshBtnClick()
    {
        cc.audioEngine.play(this.audio, false, 1);
        this.GameStart()
    },
    OnReturnBtnClick(){
        cc.audioEngine.play(this.audio, false, 1);
        cc.director.loadScene("GameScene");
    }
    // update (dt) {},
});
