// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        CloseBtn:{
            default:null,
            type:cc.Button
        },
        AgainBtn:{
            default:null,
            type:cc.Button
        },
        Block:{
            default:null,
            type:cc.Sprite
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

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
        this.CloseBtn.node.on("touchend",function () {
            this.ActionFunc(function () {
                this.SetBlock(false)
                cc.director.loadScene("SelectScene");
            }.bind(this))
        },this)
        this.AgainBtn.node.on("touchend",function () {
            this.ActionFunc(function () {
                this.SetBlock(false)
                this.node.dispatchEvent( new cc.Event.EventCustom('rebuildGame', true));
            }.bind(this))
            //this.node.dispatchEvent( new cc.Event.EventCustom('rebuildGame', true));
        },this)
    },

    // update (dt) {},
});
