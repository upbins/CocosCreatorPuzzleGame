// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let SudoKuGame = require("../scripts/sudoku/SudokuGameLogic")
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
    SetBlock(IsBlock){
        let BlockBtn = this.Block.getComponent(cc.Button);
        BlockBtn.interactable = IsBlock;
    },
    start () {
        this.CloseBtn.node.on("touchend",function () {;
            this.ActionFunc(function () {
                this.SetBlock(false)
                cc.director.loadScene("SelectScene");
            }.bind(this))
            
        },this)
        this.ShareBtn.node.on("touchend",function () {
            this.ActionFunc(function () {
                this.SetBlock(false)
                this.node.dispatchEvent( new cc.Event.EventCustom('ShareGame', true));
            }.bind(this))
         
        },this)
        this.AgainBtn.node.on("touchend",function () {
            this.ActionFunc(function () {
                this.SetBlock(false)
                this.node.dispatchEvent( new cc.Event.EventCustom('rebuildGame', true));
            }.bind(this))
            
        },this)
        this.NextBtn.node.on("touchend",function () {
            this.ActionFunc(function () {
                this.SetBlock(false)
                this.node.dispatchEvent( new cc.Event.EventCustom('nextGame', true));
            }.bind(this))
            //cc.tween(this.node).to(0.3, {opacity:0}).start();
        },this)
    },
    

    // update (dt) {},
});
