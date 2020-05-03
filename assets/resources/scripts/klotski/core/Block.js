cc.Class({
    extends: cc.Component,
    properties: {
        Bg: {
            default: [],
            type: cc.SpriteFrame
        }
    },
    isRight: function () {
        this.node.getComponent(cc.Sprite).spriteFrame = this.Bg[1];
    },
    isWrong: function () {
        this.node.getComponent(cc.Sprite).spriteFrame = this.Bg[0];
    }
})