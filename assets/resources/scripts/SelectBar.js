let Global = require("../scripts/Global")
cc.Class({
    extends: cc.Component,

    properties: {
        audio: {
            default: null,
            type: cc.AudioClip
        },
        Level: 0,
        YellowStar: {
            default: null,
            type: cc.SpriteFrame
        },
        LevelLabel: {
            default: null,
            type:cc.Label,
        },
        BestLabel: {
            default: null,
            type:cc.Label,
        },
        TimeLabel:{
            default: null,
            type:cc.Label,
        },
        StarArray: {
            default: [],
            type: cc.Sprite
        },
    },

    start () {
     
    },
    InitBar(index){
        this.Level = index;
        cc.log("====================>",Global.GameLevels,Global.SelectGameType,this.Level)
      
        this.LevelLabel.string = index + "×" + index;
        if (cc.sys.localStorage.getItem("times_" + this.level))
        {
           let timeNum = cc.sys.localStorage.getItem("times_" + this.level);
           timeNum = Math.round(timeNum),
           this.TimeLabel.string = "次数: " + timeNum;
       } else 
       {
           this.TimeLabel.string = "次数: --"
        }
    },
    InitStar(){

    },

});