//=============================================================================
// new_encount_system.js
// ver1.12  2017/07/13
//=============================================================================

/*:
 * @plugindesc new_encount_system
 * @author KPoal
 *
 * @param RandomDice
 * @desc How many dice use to make encounter.
 * @default 2
 *
 * @param SafetyRate
 * @desc safety range's rate for average encount step. Input number 0 to 1.
 * @default 0.1
 *
 * @param TransEncUpd
 * @desc When transport, update the encounter or not. Input true or false.(default is false)
 * @default false
 *
 * @param EncNoChainLength
 * @desc How many groups record not to encounter the same enemy group.
 * @default 5
 *
 * @param EncNoChainRate
 * @desc How much reduce the recorded enemy group. input number 0 to 1.
 * @default 1.0
 *
 * @help
 *
 */


/*:ja
 * @plugindesc エンカウントシステム変更のプラグインです。
 * @author KPoal
 *
 * @param RandomDice
 * @desc エンカウント歩数の計算に、いくつの独立な乱数を用いるかです。この数値が大きいほど確率の分散が小さくなります。
 * @default 2
 *
 * @param SafetyRate
 * @desc エンカウント直後から、どれだけの間敵が出現しない領域を取るかです。0～1までの間の小数で設定して下さい
 * @default 0.1
 *
 * @param TransEncUpd
 * @desc 場所移動の際に、エンカウント歩数の更新を行うかどうかです。
 * @default false
 *
 * @param EncNoChainLength
 * @desc 同じ敵グループの出現を防ぐために、直前の敵グループをいくつまで記録するかです。
 * @default 5
 *
 * @param EncNoChainRate
 * @desc 直前に出現が記録された敵グループを、どれだけ出現しにくくするかです。0～1の小数で設定してください。
 * @default 1.0
 *
 * @help
 * エンカウントの計算式を、
 * 二つのパラメータを用いて自由に変更できるようにします。
 * また、システムを初期値から一歩ごとに
 * 2520/nの数値を引いて行く形式に変更し、
 * 場所移動コマンド実行時のエンカウント更新を撤廃します。
 * これにより、場所移動を多用する小部屋集合系のダンジョンが作りやすくなります。
 *
 * ver1.10追加
 * 直前に出現した敵グループを記録し、
 * 次のエンカウントでそのグループが選択されにくくなる機能を追加しました。
 * この機能を用いる事で、なるべく毎回違う敵が出現しやすくなるようにできます。
 *
 * ver1.11追加
 * 敵の出現しないマップからの場所移動の場合、
 * エンカ更新が行われるよう修正。
 *
 * ver1.12追加
 * ヘルプが文字化けする問題を修正。
 * SafetyRateを１以上に設定する事で歩数の絶対指定を可能に。
 */

(function() {
    var parameters = PluginManager.parameters('new_encount_system');

Game_Player.prototype.makeEncounterCount = function() {
    var dice =Number(parameters.RandomDice);
    var safety_rate=Number(parameters.SafetyRate);
    var n = $gameMap.encounterStep();
    if (safety_rate>=1){
    safety_rate=Math.min(safety_rate/n,0.99)
    }
    var randrange = 2520;
        randrange *= 1-safety_rate;
    this._encounterCount = 0;
    if (dice >= 1){
    for (var i = 1; i <= dice; i++) {
            this._encounterCount += Math.randomInt(randrange);
        }
    this._encounterCount *= 2;
    this._encounterCount = Math.floor(this._encounterCount / dice);
    this._encounterCount += Math.floor(2520*safety_rate) + 1;
    }
    else{
   this._encounterCount = 2520;
   }

};

Game_Player.prototype.encounterProgressValue = function() {
    var n = $gameMap.encounterStep();
    var value = Math.floor(2520 / n);
    var bush  = $gameMap.isBush(this.x, this.y) ? 2 : 1;
    value *= bush;
    if ($gameParty.hasEncounterHalf()) {
        value *= 0.5;
    }
    if (this.isInShip()) {
        value *= 0.5;
    }
    return value;
};

Game_Player.prototype.locate_new = function(x, y) {
    Game_Character.prototype.locate.call(this, x, y);
    this.center(x, y);
    if ((eval(String(parameters.TransEncUpd)))||(this._encounterCount <=0)) {
    this.makeEncounterCount();
    }
    if (this.isInVehicle()) {
        this.vehicle().refresh();
    }
    this._followers.synchronize(x, y, this.direction());
};

Game_Player.prototype.performTransfer = function() {
    if (this.isTransferring()) {
        this.setDirection(this._newDirection);
        if (this._newMapId !== $gameMap.mapId() || this._needsMapReload) {
            if (this.encCheckNew()==false) {
            this.makeEncounterCount();
            }
            $gameMap.setup(this._newMapId);
            this._needsMapReload = false;
        }
        this.locate_new(this._newX, this._newY);
        this.refresh();
        this.clearTransferInfo();
    }
};

Game_Player.prototype.encCheckNew = function(){
    var weightSum = 0;
   $gameMap.encounterList().forEach(function(encounter) {
            weightSum += encounter.weight;
    }, this);
 if (weightSum > 0) {
 return true
 }
 return false
};

//--------------------------------------------------------------------
//ver1.10 add
//--------------------------------------------------------------------
Game_Player.prototype.clearEnemyEncountArray = function() {
    var maxsize =Number(parameters.EncNoChainLength);
    this._enemyEncountArray = [];
 for (var i = 0; i <= maxsize; i++) {
  this._enemyEncountArray[i]=0;
  }
};


Game_Player.prototype.inputEnemyEncountArray = function(troopid) {
   var maxsize =Number(parameters.EncNoChainLength);
if (troopid>0){
 for (var i = 0; i < maxsize; i++) {
  this._enemyEncountArray[maxsize-i]=this._enemyEncountArray[maxsize-i-1];
  }
 this._enemyEncountArray[1] = troopid;
}
};


Game_Player.prototype.makeEncounterTroopId = function() {
    var maxsize =Number(parameters.EncNoChainLength);
    var new_w_rate = Number(parameters.EncNoChainRate);
    var encounterList = [];
    var weightSum = 0;
    var new_weight = 0
    if (!this._enemyEncountArray) {
            this.clearEnemyEncountArray();
        }
    $gameMap.encounterList().forEach(function(encounter) {
        if (this.meetsEncounterConditions(encounter)) {
            encounterList.push(encounter);
        }
    }, this);
 
      if (maxsize>=encounterList.length){
      maxsize = encounterList.length-1
    }
        for (var i = 0; i < encounterList.length; i++) {
         new_weight=  encounterList[i].weight;
          for (var j = 1;j <=maxsize;j++) {
            if (this._enemyEncountArray[j]==encounterList[i].troopId){
             new_weight*= new_w_rate;
             break;
           }
         }
         weightSum += Math.floor(new_weight);
     }
    if (weightSum > 0) {
        var value = Math.randomInt(weightSum);
        for (var i = 0; i < encounterList.length; i++) {
            new_weight=  encounterList[i].weight;
            for (var jj = 1;jj <=maxsize;jj++) {
              if (this._enemyEncountArray[jj]==encounterList[i].troopId){
                new_weight*= new_w_rate;
                break;
              }
            }
            value -= Math.floor(new_weight);
            if (value < 0) {
                this.inputEnemyEncountArray(encounterList[i].troopId);
                return encounterList[i].troopId;
            }
        }
    }
    this.clearEnemyEncountArray();
    return 0;
};

})();