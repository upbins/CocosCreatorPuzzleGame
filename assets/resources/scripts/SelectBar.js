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
     
        let KeyTime = Global.SelectGameType + "levelTime_"//
        let KeyTimes = Global.SelectGameType + "times_" //次数
        this.LevelLabel.string = index + "×" + index;
        cc.log("====================>InitBar",Global.GameLevels,Global.SelectGameType,this.Level,cc.sys.localStorage.getItem(KeyTime + this.Level),KeyTime + this.Level)
        if (cc.sys.localStorage.getItem(KeyTime + this.Level))
        {
          this.BestTime = cc.sys.localStorage.getItem(KeyTime + this.Level);
          let t = this.BestTime.toString();
          this.BestLabel.string = "最佳: " + t + "s"
          this.InitStar();
       } else
       {
            this.BestLabel.string = "最佳: --"
       }
        if (cc.sys.localStorage.getItem(KeyTimes + this.Level))
        {
           let timeNum = cc.sys.localStorage.getItem(KeyTimes + this.Level);
           timeNum = Math.round(timeNum),
           this.TimeLabel.string = "次数: " + timeNum;
       } else 
       {
           this.TimeLabel.string = "次数: --"
        }
    },
    InitStar(){
        if (this.BestTime) {
            for (var e = Global.ScoreConfig[this.Level - 3], t = 0, n = Global.ScoreConfig[this.Level - 3].length - 1; n >= 0 && this.BestTime <= e[n]; n--) 
            t++;
            for (var i = 0; i < t; i++) this.StarArray[i].spriteFrame = this.YellowStar;
        }
    },

});