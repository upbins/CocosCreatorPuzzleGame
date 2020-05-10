module.exports = {
    InitItem: function (e) {
        var t = cc.sys.localStorage.getItem(e.str);
        null != t && 0 != t.length || cc.sys.localStorage.setItem(e.str, e.number);
    },
    init: function () {
        console.log("初始化本地数据"), this.InitItem({
            str: "sound",
            number: 1
        }), this.InitItem({
            str: "music",
            number: 1
        }), this.InitItem({
            str: "score",
            number: 0
        });
    },
    get: function (e) {
        return parseInt(cc.sys.localStorage.getItem(e));
    },
    set: function (e, t) {
        cc.sys.localStorage.setItem(e, t);
    }
}