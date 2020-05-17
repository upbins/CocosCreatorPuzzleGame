// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let Sudoku = require("../sudoku/core/Sudoku");
let Global = require("../Global")
let Checker = require("../sudoku/core/Checker")
cc.Class({
    extends: cc.Component,
    properties: {
        SudoKuNode:{
            default:null,
            type:cc.Node
        },
        SudokuItemPrefab:{
            default:null,
            type:cc.Prefab
        },
        PopNumberBtnPrefab:{
            default:null,
            type:cc.Prefab
        },
        WinPrefab:{
            default:null,
            type:cc.Prefab
        },
        LosePrefab:{
            default:null,
            type:cc.Prefab
        },
        PopNumberNode:{
            default:null,
            type:cc.Node
        },
        audio: {
            default: null,
            type: cc.AudioClip
        },
        WinPrefab:{
            default:null,
            type:cc.Prefab
        },
        LosePrefab:{
            default:null,
            type:cc.Prefab
        },
        TimeLabel:{
            default:null,
            type:cc.Label,
        },
        StepLabel:{
            default:null,
            type:cc.Label
        },
        Level:1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this._curSelectItem = null
        this._curPopNum = null
		this.PopNumberNode.active = false
        this.StepNum = 0;
        this.Time = 0
        this.TimeLabel.string = "时间:" + this.Time;
        this.BuildSudoku();
        this.BuildPopNumber()
        this.MaxTime = Global.GameMaxTime[Global.SelectGameLevel - 3];
        this.node.on('nextGame', function (event) {
            event.stopPropagation();
            this.BuildNextSudoku();
        }.bind(this));
        this.node.on('ShareGame', function (event) {
            event.stopPropagation();
		}.bind(this));
		this.node.on('AgainGame', function (event) {
			event.stopPropagation();
			this.ReResetSudoku();
			this.ClearOther();
        }.bind(this));
        this.StartTimer()
    },
    StartTimer(){
        if (this.CountTimeLabel){
            this.unschedule(this.CountTimeLabel);
        }
        this.schedule(this.CountTimeLabel,1);
    },
    ClearOther() {
        this.StepNum = 0;
        this.MaxTime = Global.GameMaxTime[Global.SelectGameLevel - 3];
        this.Time = 0
        this.TimeLabel.string = "时间:" + this.Time;
        this.StepLabel.string = '步数:' + this.StepNum;
        this.StartTimer();
    },
    CountTimeLabel() {
        this.Time = this.Time + 1
        this.TimeLabel.string = '时间:' +  this.Time;
        if (this.Time >= this.MaxTime)  {
            this.unschedule(this.CountTimeLabel);
            this.ShowLose();
        }
    },
    BuildNextSudoku(){
        this.SudoKuNode.removeAllChildren()
        console.log("BuildSudoku"+this.Level)
        this.Level = this.Level + 1
        Global.SelectGameLevel = this.Level;
        this.BuildSudoku()
	},
	CountStepNum(){
		this.StepNum = this.StepNum + 1;
		this.StepLabel.string = "步数:" + this.StepNum;
	},
    BuildSudoku()
    {   
        const sudoku = new Sudoku();
        this.Level = Global.SelectGameLevel;
        console.log("BuildSudoku"+Global.SelectGameLevel)
        sudoku.make(this.Level);
        this._matrix = sudoku.puzzleMatrix;
        this.cells = this._matrix.map((rowValues,rowIndex) => rowValues.map((cellValue, colIndex) => {
            let SudokuItem = cc.instantiate(this.SudokuItemPrefab);
            let SudokuLabel = SudokuItem.getChildByName("SudokuLabel").getComponent(cc.Label);
            SudokuLabel.string = cellValue ? cellValue:"";
            let SudokuItemBtn = SudokuItem.getComponent(cc.Button)
            SudokuItemBtn.interactable = false
            let IsInitEmpty = false;
            if (cellValue == "") //已存在数字不增加点击事件
            {   
                IsInitEmpty = true
                SudokuItemBtn.interactable = true
                this.BindClickEvent(SudokuItemBtn,{SudokuLabel:SudokuLabel,colIndex:colIndex,rowIndex:rowIndex},"SudokuItemClick");
            }
            this.SudoKuNode.addChild(SudokuItem);
            return {text:cellValue,colIndex:colIndex,IsInitEmpty:IsInitEmpty,SudokuItem:SudokuItem,IsError:false}
        }));
        console.log(this.cells)
    },
    BuildPopNumber(){
        for (let i = 1; i <= 9; i++) {
            let PopNumberBtnItem = cc.instantiate(this.PopNumberBtnPrefab);
            let PopNumberBtnLabel = PopNumberBtnItem.getChildByName("Num").getComponent(cc.Label);
            PopNumberBtnLabel.string = i;
            let PopNumberBtn = PopNumberBtnItem.getComponent(cc.Button)
            this.BindClickEvent(PopNumberBtn,i,"PopNumberClick");
            this.PopNumberNode.addChild(PopNumberBtnItem);
        }
    },
    PopNumberClick: function(event,customData){
        cc.audioEngine.play(this.audio, false, 1);
        this._curPopNum = customData
        this._curSelectCustomData.SudokuLabel.string = this._curPopNum;
		this.CountStepNum()
        cc.tween(this.PopNumberNode).to(0.3, {scale: 0,opacity:0}).start();
        this.UpdateCellItemInfo(this._curPopNum, this._curSelectCustomData.rowIndex,this._curSelectCustomData.colIndex)
        this.CheckAll();
    },

    UpdateCellItemInfo:function(Num,RowIndex,ColIndex){
        this.cells.map((rowValues,rowIndex)  => rowValues.map((text,colIndex,IsInitEmpty)=>{
            if (rowIndex === RowIndex && colIndex === ColIndex){ 
                this.cells[rowIndex][colIndex].text = Num
            }
        }));
        console.log(this.cells)
    },
    BindClickEvent: function (button,Item,handlerName) {
        let clickEventHandler = new cc.Component.EventHandler();
        //这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.target = this.node; 
        //这个是代码文件名
        clickEventHandler.component = "SudokuGameLogic";
        clickEventHandler.handler = handlerName;
        clickEventHandler.customEventData = Item;
        button.clickEvents.push(clickEventHandler);
    },
 

    //点击事件回调 target ==》node， customEventData ==》 SudokuLabel,colIndex
    SudokuItemClick: function (event, customData) {
        cc.audioEngine.play(this.audio, false, 1);
        let self = this
        let TargetNode = event.target;
        this._curSelectCustomData = customData
        let worldPosition =  self.SudoKuNode.convertToWorldSpaceAR(cc.v2(TargetNode.x,TargetNode.y))
        let localPos = self.node.convertToNodeSpaceAR(cc.v2(worldPosition.x,worldPosition.y));
        let finalX = localPos.x + 20
        if (customData.colIndex == 0){
            finalX = localPos.x + self.PopNumberNode.width/3 + 6
        }else if(customData.colIndex == 8) {
            finalX = localPos.x - self.PopNumberNode.width/3 + 30
        }
        self.PopNumberNode.x = finalX
        self.PopNumberNode.y = localPos.y - 17
        self.PopNumberNode.active = true;
        self.PopNumberNode.scale = 0;
        self.PopNumberNode.opacity = 0
        self.PopNumberNode.stopAllActions();
        let StartCallFunc = cc.callFunc(function(){
            cc.tween(self.PopNumberNode).to(0.3, {scale: 1,opacity:255}).start();
        })
        let DelayTime = cc.delayTime(3);
        let CallFunc = cc.callFunc(function(){
            cc.tween(self.PopNumberNode).to(0.3, {scale: 0,opacity:0}).start();
        })
        let Sequence = cc.sequence(StartCallFunc, DelayTime,CallFunc);
        self.PopNumberNode.runAction(Sequence);
    },

    SudokuCheck(){
    },
    ShowWin()
	{   
        this.unschedule(this.CountTimeLabel)
        Global.PassTime = this.Time;
		let self = this
		self.WinPrefabNode = cc.instantiate(self.WinPrefab)
		self.WinPrefabNode.opacity = 0;
		self.node.addChild(self.WinPrefabNode)
		let fadeIn = cc.fadeIn(0.3)
		self.WinPrefabNode.runAction(fadeIn)
    },
    ShowLose(){
        this.unschedule(this.CountTimeLabel)
		let self = this
		self.LosePrefabNode = cc.instantiate(self.LosePrefab)
		self.LosePrefabNode.opacity = 0;
		self.node.addChild(self.LosePrefabNode)
		let fadeIn = cc.fadeIn(0.3)
		self.LosePrefabNode.runAction(fadeIn)
    },
    CheckAll(){
        const data =  this.cells.map((rowValues,rowIndex)  => rowValues.map((Info)=>{
            return Info.text
        }));
        //console.log(data)
        const checker = new Checker(data).Check();
        console.log(checker.Success)
        if(checker.Success) {
            console.log("挑战成功");
            this.unschedule(this.CountTimeLabel)
            let KeyTime = Global.SelectGameType + "levelTime_"//
            let KeyTimes = Global.SelectGameType + "times_" //次数
            let LastTime = cc.sys.localStorage.getItem(KeyTime + this.Level)
            let LastTimes =cc.sys.localStorage.getItem(KeyTimes + this.level)
            console.log("CheckBtnClick====>",LastTime,LastTimes)
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
            this.ShowWin()
            return true;
        }
        //标记错误
        const MatrixMarks = checker.MatrixMarks;
        cc.log(MatrixMarks)
        this.cells.map((rowValues,rowIndex)  => rowValues.map((ColInfo)=>{
            if (!ColInfo.IsInitEmpty){ 
                return;
            }
            let SudokuItem = this.cells[rowIndex][ColInfo.colIndex].SudokuItem
            let SudokuItemBtn = SudokuItem.getComponent(cc.Button)
            //cc.log("======================>",ColInfo.colIndex,rowIndex,MatrixMarks)
            if(MatrixMarks[rowIndex][ColInfo.colIndex]){
                SudokuItemBtn.interactable = false;
                return;
            }else{
                if (ColInfo.text != 0){
                    ColInfo.IsError = true
                    let Blink = cc.blink(0.5,5);  
                    SudokuItem.runAction(Blink);
                }
            }
        }));
    },
    CheckBtnClick(event,customData){
        cc.tween(this.PopNumberNode).to(0.3, {scale: 0,opacity:0}).start();
        cc.audioEngine.play(this.audio, false, 1);
        this.CheckAll();
    },
    //重置数独
    ResetBtnClick(event,customData){
        cc.audioEngine.play(this.audio, false, 1);
        console.log("ResetBtnClick");
        this.ReResetSudoku();
	},
	ReResetSudoku() {
		cc.tween(this.PopNumberNode).to(0.3, { scale: 0, opacity: 0 }).start();
		this.cells.map((rowValues, rowIndex) => rowValues.map((ColInfo) => {
			if (ColInfo.IsInitEmpty) {
				ColInfo.text = 0
				let SudokuItem = ColInfo.SudokuItem
				let SudokuItemBtn = SudokuItem.getComponent(cc.Button)
				let SudokuLabel = SudokuItem.getChildByName("SudokuLabel").getComponent(cc.Label);
				SudokuLabel.string = ""
				SudokuItemBtn.interactable = true;
			}
		}));
	},
    ClearBtnClick(event,customData){
		cc.audioEngine.play(this.audio, false, 1);
		cc.tween(this.PopNumberNode).to(0.3, { scale: 0, opacity: 0 }).start();
		this.cells.map((rowValues, rowIndex) => rowValues.map((ColInfo) => {
			if (ColInfo.IsError) {
				ColInfo.IsError = false
				let SudokuItem = this.cells[rowIndex][ColInfo.colIndex].SudokuItem
				let SudokuLabel = SudokuItem.getChildByName("SudokuLabel").getComponent(cc.Label);
				SudokuLabel.string = "";
			}
		}));
	},

    //重建数独
    ReBuildBtnClick(event,customData){
        this.ReBuildSudoku()
        console.log("ReBuildBtnClick");
        cc.audioEngine.play(this.audio, false, 1);
    },
    ReBuildSudoku(){
        cc.tween(this.PopNumberNode).to(0.3, {scale: 0,opacity:0}).start();
        const sudoku = new Sudoku();
        sudoku.make(this.Level);
        this._matrix = sudoku.puzzleMatrix;
        this.cells = this._matrix.map((rowValues,rowIndex) => rowValues.map((cellValue, colIndex) => {
            let SudokuItem = this.cells[rowIndex][colIndex].SudokuItem
            let SudokuLabel = SudokuItem.getChildByName("SudokuLabel").getComponent(cc.Label);
            SudokuLabel.string = cellValue ? cellValue:"";
            let SudokuItemBtn = SudokuItem.getComponent(cc.Button)
            SudokuItemBtn.interactable = false
            SudokuItemBtn.clickEvents = []
            let IsInitEmpty = false;
            if (cellValue == "") //已存在数字不增加点击事件
            {  
                IsInitEmpty = true
                SudokuItemBtn.interactable = true
                this.BindClickEvent(SudokuItemBtn,{SudokuLabel:SudokuLabel,colIndex:colIndex,rowIndex:rowIndex},"SudokuItemClick");
            }
            return {text:cellValue,colIndex:colIndex,IsInitEmpty:IsInitEmpty,SudokuItem:SudokuItem}
        }));
        console.log(this.cells)
    },

    //返回主界面
    ReturnBtn(){
        this.unschedule(this.CountTimeLabel);
		cc.audioEngine.play(this.audio, false, 1);
		console.log(Global.SelectGameType, Global.SelectGameType == "SudokuGame")
        cc.director.loadScene("SelectScene");
    }

    // update (dt) {},
});
