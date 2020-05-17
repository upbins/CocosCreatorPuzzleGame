// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let SudoKuGame = require("../scripts/sudoku/SudokuGameLogic")
let Global = require('../scripts/Global')
cc.Class({
    extends: cc.Component,

    properties: {
        CloseBtn:{
            default:null,
            type:cc.Button
        },
        ShareBtn:{
            default:null,
            type:cc.Button
        },
        AgainBtn:{
            default:null,
            type:cc.Button
        },
        NextBtn:{
            default:null,
            type:cc.Button
        },
        DescLabel:{
            default:null,
            type:cc.Label
        },
        Block:{
            default:null,
            type:cc.Sprite
        },
    },
    ActionFunc(callback){
        let fadeOut = cc.fadeOut(0.3)
        let callFunc = cc.callFunc(callback)
        this.node.runAction(cc.sequence(fadeOut,callFunc))
    },
    ShowInfo(){
        this.DescLabel.string = "本次通关时间为:" + Global.PassTime + "s";
    },
    start () {
        this.ShowInfo();
        this.CloseBtn.node.on("touchend",function () {;
            this.ActionFunc(function () {
                //this.SetBlock(false)
                this.node.removeFromParent();
                cc.director.loadScene("SelectScene");
            }.bind(this))
            
        },this)
        this.ShareBtn.node.on("touchend",function () {
            this.ActionFunc(function () {
                this.node.dispatchEvent( new cc.Event.EventCustom('ShareGame', true));
                this.node.removeFromParent();
            }.bind(this))
         
        },this)
        this.AgainBtn.node.on("touchend",function () {
            this.ActionFunc(function () {
                this.node.dispatchEvent(new cc.Event.EventCustom('AgainGame', true));
                this.node.removeFromParent();
            }.bind(this))
            
        },this)
        this.NextBtn.node.on("touchend",function () {
            this.ActionFunc(function () {
                this.node.dispatchEvent( new cc.Event.EventCustom('nextGame', true));
                this.node.removeFromParent();
            }.bind(this))
        },this)
    },
    

    // update (dt) {},
});
