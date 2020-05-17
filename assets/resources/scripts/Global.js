/**
 * @typedef {720} NewType
 */

let LocalStorage = require("LocalStorage")
//时间评分配置
const ScoreConfig = [
    [5, 8, 10, 15, 20, 25,30],
    [35, 30, 40, 50, 70, 80,90],
    [100, 120, 140, 160, 180, 200,220]
    [220, 250, 280, 310, 340, 370,410],
    [350, 380, 420, 450, 500, 520,550]
]
//每关最大时间
const GameMaxTime = [
    [60,120, 180, 240, 320, 480],
]
class Global{
    SelectGameType = 0;
    SelectGameLevel = 0;
    GameLevels = 0;
    LocalStorage = LocalStorage;
    ScoreConfig = ScoreConfig;
    GameMaxTime = GameMaxTime;
    PassTime = 0;
}
let global = new Global()
module.exports = global