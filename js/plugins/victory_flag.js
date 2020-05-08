//=============================================================================
// RTK_Test.js	2016/07/27
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc 戦闘勝利時に演出を追加する
 * @author Toshio Yamashita (yamachan)
 *
 */

(function(_global) {
	var _BattleManager_processVictory = BattleManager.processVictory;
	BattleManager.processVictory = function() {
		$gameSwitches.setValue(34,true)

		_BattleManager_processVictory.call(this);
	};
})(this);
