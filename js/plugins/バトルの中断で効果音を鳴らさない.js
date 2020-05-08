//ƒoƒgƒ‹‚Ì’†’fˆ—‚ÅŒø‰Ê‰¹‚ğ–Â‚ç‚³‚È‚¢
BattleManager.checkAbort = function() {
    if ($gameParty.isEmpty() || this.isAborting()) {
        //SoundManager.playEscape();
        this._escaped = true;
        this.processAbort();
    }
    return false;
};