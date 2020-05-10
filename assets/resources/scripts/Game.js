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
                Global.SelectGameType = "KlotskiGame";
                Global.GameLevels = 5;
                cc.director.loadScene("SelectScene");
                break;
            case "HexGame":
                Global.SelectGameType = "HexGame";
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
});

