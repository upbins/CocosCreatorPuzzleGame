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
        WinPrefab:{
            default:null,
            type:cc.Prefab
        },
        LosePrefab:{
            default:null,
            type:cc.Prefab
        },
        TimeLabel: {
            default: null,
            type: cc.Label,
        },
        StepLabel: {
            default: null,
            type: cc.Label
        },
        Level:3,
        Duration: 0.15
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.Time = 0
        this.TimeLabel.string = "时间:" + this.Time;
        this.StepNum = 0
        this.blankIndex = 0;
        this.currentPoint = null;
        this.puzzleLayer.on(cc.Node.EventType.TOUCH_END, this.OnClickTouch, this);
        this.GameStart();
        this.MaxTime = Global.GameMaxTime[Global.SelectGameLevel - 3];
        this.node.on('nextGame', function (event) {
            event.stopPropagation();
            this.BuildNextKlotkiGame();
        }.bind(this));
        this.node.on('ShareGame', function (event) {
            event.stopPropagation();
        }.bind(this));
        this.node.on('AgainGame', function (event) {
            event.stopPropagation();
            this.GameStart();
            this.ClearOther();
        }.bind(this));
        // 以秒为单位的时间间隔
        this.StartTimer()
    },
    BuildNextKlotkiGame(){
        this.puzzleLayer.removeAllChildren()
        console.log("BuildKlotkiGame" + this.Level)
        this.Level = this.Level + 1
        Global.SelectGameLevel = this.Level;
        this.GameStart();
    },
    ClearOther() {
        this.StepNum = 0;
        this.MaxTime = Global.GameMaxTime[Global.SelectGameLevel - 3];
        this.Time = 0
        this.TimeLabel.string = "时间:" + this.Time;
        this.StepLabel.string = '步数:' + this.StepNum;
        this.StartTimer();
    },
    StartTimer() {
        if (this.CountTimeLabel) {
            this.unschedule(this.CountTimeLabel);
        }
        this.schedule(this.CountTimeLabel, 1);
    },
    CountTimeLabel(){
        this.Time = this.Time + 1
        this.TimeLabel.string = '时间:' +  this.Time;
        if ( this.Time >= this.MaxTime)  {
            this.unschedule(this.CountTimeLabel);
            this.ShowLose();
        }
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
        this.CountStepNum();
    },
    CountStepNum() {
        this.StepNum = this.StepNum + 1;
        this.StepLabel.string = "步数:" + this.StepNum;
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
        let IsFinish = true
        // for (t = 0; t < this.Length - 1; t++)
        // {
        //     let string = Chiles[t].getChildByName("NumLabel").getComponent(cc.Label).string 
        //     console.log(string);
        //     if (string != t + 1) {
        //         console.log("还没通关");
        //         IsFinish = false;
        //         break;
        //     }else{
        //         IsFinish = true;
        //     }
           
        // }
        if (IsFinish){
            console.log("通关成功");
            this.unschedule(this.CountTimeLabel)
            let KeyTime = Global.SelectGameType + "levelTime_"//
            let KeyTimes = Global.SelectGameType + "times_" //次数
            let LastTime = cc.sys.localStorage.getItem(KeyTime + this.Level)
            let LastTimes =cc.sys.localStorage.getItem(KeyTimes + this.level)
            console.log("CheckAll====>",LastTime,LastTimes)
            if (!LastTime)//不存在时间
            {
                cc.sys.localStorage.setItem(KeyTime+ this.Level,this.Time)
            }else{
                let IsQuickLastTime = cc.sys.localStorage.getItem(KeyTime + this.Level) > this.Time
                 if (IsQuickLastTime){
                    cc.sys.localStorage.setItem(KeyTime+ this.Level,this.Time);
                }
            }
            if (!LastTimes)//不存在次数
            {
                let n = cc.sys.localStorage.getItem(KeyTimes + this.Level);
                n = Math.round(n) + 1
                cc.sys.localStorage.setItem(KeyTimes + this.Level, n);
            }else{
                cc.sys.localStorage.setItem(KeyTimes+ this.Level, 1);
            }
            this.ShowWin();
        }
    },
    ShowWin() {
        Global.PassTime = this.Time;
        let self = this
        self.WinPrefabNode = cc.instantiate(self.WinPrefab)
        self.WinPrefabNode.opacity = 0;
        self.node.addChild(self.WinPrefabNode)
        let fadeIn = cc.fadeIn(0.3)
        self.WinPrefabNode.runAction(fadeIn)
    },
    ShowLose() {
        let self = this
        self.LosePrefabNode = cc.instantiate(self.LosePrefab)
        self.LosePrefabNode.opacity = 0;
        self.node.addChild(self.LosePrefabNode)
        let fadeIn = cc.fadeIn(0.3)
        self.LosePrefabNode.runAction(fadeIn)
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
        this.unschedule(this.callback);
        cc.audioEngine.play(this.audio, false, 1);
        cc.director.loadScene("SelectScene");
    },
   
    // update (dt) {},
});
