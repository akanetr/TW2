//バトルの中断処理で効果音を鳴らさない
BattleManager.checkAbort = function() {
    if ($gameParty.isEmpty() || this.isAborting()) {
        //SoundManager.playEscape();
        this._escaped = true;
        this.processAbort();
    }
    return false;
};