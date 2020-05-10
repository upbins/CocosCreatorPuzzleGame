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
        }
    },


    start () {
     
    },
    GameButtonClick(Event,CustomData){
        switch (CustomData) {
            case "SudokuGame":
                Global.SelectGameType = "SudokuGame";
                Global.GameLevels = 5;
                cc.director.loadScene("SelectScene");
                break;
            case "KlotskiGame":
                Global.SelectGameType ="KlotskiGame";
                Global.GameLevels = 5;
                cc.director.loadScene("SelectScene");
                break;
            case "HexGame":
                Global.SelectGameType ="HexGame";
                Global.GameLevels = 3;
                cc.director.loadScene("HexScene");
                break;
            case "MoreGame":
                    break;
            default:
                break;
        }
        cc.audioEngine.play(this.audio, false, 1);
    },
    // SelectButtonClick(Event,CustomData){
    //     let Level = 1
    //     switch (CustomData) {
    //         case "Easy":
    //             Level = 3;
    //             Global.SelectGameLevel = Level; 
    //             break;
    //         case "Normal":
    //             Level = this.RandNum(4,7)
    //             Global.SelectGameLevel = Level; 
    //             break;
    //         case "Difficult":
    //             Level = this.RandNum(8,9)
    //             Global.SelectGameLevel = Level; 
    //             break;
    //         default:
    //             break;
    //     }
    //     cc.audioEngine.play(this.audio, false, 1);
    //     this.LoadScene();
    // },
    // RandNum(n,m){
    //     var c = m-n+1;  
    //     return Math.floor(Math.random() * c + n);
    // },
    // LoadScene(){
    //     console.log(Global.SelectGameType,Global.SelectGameType == "SudokuGame")
    //     if (Global.SelectGameType == "SudokuGame" ){
    //         cc.director.loadScene("SudokuScene");
    //     }
    //     else if(Global.SelectGameType == "KlotskiGame"){
    //         cc.director.loadScene("KlotskiScene");
    //     }
    // },
    // ReturnBtnClick(){
    //     Global.SelectGameLevel = 0;
    //     cc.director.loadScene("GameScene");
    //     cc.audioEngine.play(this.audio, false, 1);
    // }
});

