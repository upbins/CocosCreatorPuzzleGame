cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function () {

    },
    start: function () {},
    getNumber: function () {
        var e = cc.winSize,
            t = cc.view.getDesignResolutionSize();
        return e.height / e.width > t.height / t.width ? e.height / t.height : e.width / t.width;
    },
    single_getNumber: function () {
        var e = cc.winSize,
            t = cc.view.getDesignResolutionSize();
        return e.height / e.width > t.height / t.width ? e.width / t.width : 1;
    }
})