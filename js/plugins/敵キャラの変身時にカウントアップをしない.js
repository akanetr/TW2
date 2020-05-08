//敵キャラの変身時にカウントアップをしない
// Enemy Transform
Game_Interpreter.prototype.command336 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.transform(this._params[1]);
//        $gameTroop.makeUniqueNames();
    }.bind(this));
    return true;
};