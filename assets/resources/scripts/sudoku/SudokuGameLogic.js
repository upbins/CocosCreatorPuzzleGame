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
        PopNumberNode:{
            default:null,
            type:cc.Node
        },
        audio: {
            default: null,
            type: cc.AudioClip
        },
        Level:1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this._curSelectItem = null
        this._curPopNum = null
        this.PopNumberNode.active = false
        this.BuildSudoku();
        this.BuildPopNumber()
    },
    BuildSudoku()
    {   
     
        const sudoku = new Sudoku();
        this.Level = 6//Global.SelectGameLevel;
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

        cc.tween(this.PopNumberNode).to(0.3, {scale: 0,opacity:0}).start();
        this.UpdateCellItemInfo(this._curPopNum, this._curSelectCustomData.rowIndex,this._curSelectCustomData.colIndex)
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
    CheckBtnClick(event,customData){
        cc.tween(this.PopNumberNode).to(0.3, {scale: 0,opacity:0}).start();
        cc.audioEngine.play(this.audio, false, 1);
        console.log("CheckBtnClick");
        const data =  this.cells.map((rowValues,rowIndex)  => rowValues.map((Info)=>{
            return Info.text
        }));
        //console.log(data)
        const checker = new Checker(data).Check();
        //console.log(checker.Success)
        if(checker.Success) {
            console.log("挑战成功");
            return true;
        }
        //标记错误
        const MatrixMarks = checker.MatrixMarks;
        cc.log(MatrixMarks)
        this.cells.map((rowValues,rowIndex)  => rowValues.map((ColInfo)=>{
            if (ColInfo.colIndex == 8 && rowIndex == 8){
                cc.log(ColInfo.IsInitEmpty)
            }
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
    //重置数独
    ResetBtnClick(event,customData){
        cc.tween(this.PopNumberNode).to(0.3, {scale: 0,opacity:0}).start();
        cc.audioEngine.play(this.audio, false, 1);
        console.log("ResetBtnClick");
        this.cells.map((rowValues,rowIndex)  => rowValues.map((ColInfo)=>{
            if (ColInfo.IsInitEmpty){ 
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
        cc.tween(this.PopNumberNode).to(0.3, {scale: 0,opacity:0}).start();
        cc.audioEngine.play(this.audio, false, 1);
        this.cells.map((rowValues,rowIndex)  => rowValues.map((ColInfo)=>{
            if (ColInfo.IsError){
                ColInfo.IsError = false 
                let SudokuItem = this.cells[rowIndex][ColInfo.colIndex].SudokuItem
                let SudokuLabel = SudokuItem.getChildByName("SudokuLabel").getComponent(cc.Label);
                SudokuLabel.string = "";
            }
        }));
    },
    //重建数独
    ReBuildBtnClick(event,customData){
        cc.tween(this.PopNumberNode).to(0.3, {scale: 0,opacity:0}).start();
        cc.audioEngine.play(this.audio, false, 1);
        console.log("ReBuildBtnClick");
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
        cc.audioEngine.play(this.audio, false, 1);
        cc.director.loadScene("GameScene");
    }

    // update (dt) {},
});
