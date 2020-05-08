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
 * @plugindesc �G���J�E���g�V�X�e���ύX�̃v���O�C���ł��B
 * @author KPoal
 *
 * @param RandomDice
 * @desc �G���J�E���g�����̌v�Z�ɁA�����̓Ɨ��ȗ�����p���邩�ł��B���̐��l���傫���قǊm���̕��U���������Ȃ�܂��B
 * @default 2
 *
 * @param SafetyRate
 * @desc �G���J�E���g���ォ��A�ǂꂾ���̊ԓG���o�����Ȃ��̈����邩�ł��B0�`1�܂ł̊Ԃ̏����Őݒ肵�ĉ�����
 * @default 0.1
 *
 * @param TransEncUpd
 * @desc �ꏊ�ړ��̍ۂɁA�G���J�E���g�����̍X�V���s�����ǂ����ł��B
 * @default false
 *
 * @param EncNoChainLength
 * @desc �����G�O���[�v�̏o����h�����߂ɁA���O�̓G�O���[�v�������܂ŋL�^���邩�ł��B
 * @default 5
 *
 * @param EncNoChainRate
 * @desc ���O�ɏo�����L�^���ꂽ�G�O���[�v���A�ǂꂾ���o�����ɂ������邩�ł��B0�`1�̏����Őݒ肵�Ă��������B
 * @default 1.0
 *
 * @help
 * �G���J�E���g�̌v�Z�����A
 * ��̃p�����[�^��p���Ď��R�ɕύX�ł���悤�ɂ��܂��B
 * �܂��A�V�X�e���������l���������Ƃ�
 * 2520/n�̐��l�������čs���`���ɕύX���A
 * �ꏊ�ړ��R�}���h���s���̃G���J�E���g�X�V��P�p���܂��B
 * ����ɂ��A�ꏊ�ړ��𑽗p���鏬�����W���n�̃_���W���������₷���Ȃ�܂��B
 *
 * ver1.10�ǉ�
 * ���O�ɏo�������G�O���[�v���L�^���A
 * ���̃G���J�E���g�ł��̃O���[�v���I������ɂ����Ȃ�@�\��ǉ����܂����B
 * ���̋@�\��p���鎖�ŁA�Ȃ�ׂ�����Ⴄ�G���o�����₷���Ȃ�悤�ɂł��܂��B
 *
 * ver1.11�ǉ�
 * �G�̏o�����Ȃ��}�b�v����̏ꏊ�ړ��̏ꍇ�A
 * �G���J�X�V���s����悤�C���B
 *
 * ver1.12�ǉ�
 * �w���v������������������C���B
 * SafetyRate���P�ȏ�ɐݒ肷�鎖�ŕ����̐�Ύw����\�ɁB
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