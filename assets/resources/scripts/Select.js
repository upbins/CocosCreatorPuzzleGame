// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let Global = require("../scripts/Global")
cc.Class({
    extends: cc.Component,

    properties: {
        audio: {
            default: null,
            type: cc.AudioClip
        },
        Levels: 0,
        SelectBarPrefab: {
            default: null,
            type: cc.Prefab
        },
        Content: {
            default: null,
            type:cc.Node,
        },
        ReturnBtn: {
            default: null,
            type:cc.Node,
        },
    },

    start () {
        this.Levels = Global.GameLevels != 0 ? Global.GameLevels:this.Levels;
        this.ReturnBtn.on("touchstart", this.ReturnBtnClick, this);
        this.InitUI();
    },
    InitUI(){
        cc.log("================>", Global.GameLevels,this.Levels);
        for (let Index = 0; Index < this.Levels; Index++) 
        {
            let SelectNode = cc.instantiate(this.SelectBarPrefab);
            SelectNode.getComponent("SelectBar").InitBar(Index + 3), 
            this.Content.addChild(SelectNode);
            SelectNode.on("touchend",function (event) {
                cc.log( event.target.getComponent("SelectBar").Level)
                Global.SelectGameLevel = event.target.getComponent("SelectBar").Level
                this.LoadScene()
            }, this);
        }
    },
    LoadScene(){
        console.log(Global.SelectGameType,Global.SelectGameType == "SudokuGame")
        if (Global.SelectGameType == "SudokuGame" ){
            cc.director.loadScene("SudokuScene");
        }
        else if(Global.SelectGameType == "KlotskiGame"){
            cc.director.loadScene("KlotskiScene");
        }
    },
    ReturnBtnClick(){
        Global.SelectGameLevel = 0;
        cc.director.loadScene("GameScene");
        cc.audioEngine.play(this.audio, false, 1);
    }
    // update (dt) {},
});
