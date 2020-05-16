/**
 * @typedef {720} NewType
 */

let LocalStorage = require("LocalStorage")
class Global{
    SelectGameType = 0;
    SelectGameLevel = 0;
    GameLevels = 0;
    LocalStorage = LocalStorage;
    PassTime = 0;
}
let global = new Global()
module.exports = global