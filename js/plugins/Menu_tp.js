//=============================================================================
// rpg_windows.jsから抜き出し
//=============================================================================

/*:
 * @plugindesc キャンプメニューにもＴＰ表示
 * @author ゆわか
 *
 * @help プラグインコマンドはありません。
 *
 * デフォルトのメニューのみ対応。
 * アクターかクラスの特徴で、ＴＰ持ち越しを付加してないと無意味。
 *
 * 使用報告不要・クレジット不要・改変可・商用利用可
 * もし何か問題が起きても、当方は一切責任を負いません。ご了承ください。
 */


//ＴＰを追加（メニュー・スキル）
Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
    var lineHeight = this.lineHeight();
    var x2 = x + 180;
    var width2 = Math.min(200, width - 180 - this.textPadding());
    this.drawActorName(actor, x, y);
    this.drawActorLevel(actor, x, y + lineHeight * 1);
    this.drawActorIcons(actor, x, y + lineHeight * 2);
    this.drawActorClass(actor, x2, y);
    this.drawActorHp(actor, x2, (y + lineHeight * 1)-6, width2);
    this.drawActorMp(actor, x2, (y + lineHeight * 2)-11, width2);
    this.drawActorTp(actor, x2, (y + lineHeight * 3)-16, width2);
};

//ＴＰを追加（ステータス）
Window_Status.prototype.drawBasicInfo = function(x, y) {
    var lineHeight = this.lineHeight();
    this.drawActorLevel(this._actor, x, (y + lineHeight * 0)-16);
    this.drawActorIcons(this._actor, x, (y + lineHeight * 1)-18);
    this.drawActorHp(this._actor, x, (y + lineHeight * 2)-18);
    this.drawActorMp(this._actor, x, (y + lineHeight * 3)-20);
    this.drawActorTp(this._actor, x, (y + lineHeight * 4)-22, 185);
};

//TPゲージを便意ゲージに変更
Window_Base.prototype.drawActorTp = function(actor, x, y, width) {
    width = width || 96;
    var color1 = this.tpGaugeColor1();
    var color2 = this.tpGaugeColor2();
    this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.tpA, x, y, 44);
    //this.changeTextColor(this.tpColor(actor));
    
    if(actor._actorId == 1){
        //this.drawText($gameVariables.value(12), x + width - 64, y, 64, 'right');
        this.drawCurrentAndMax($gameVariables.value(12), $gameVariables.value(18), x, y, width,
                           this.tpColor(actor), this.normalColor());
    } else if(actor._actorId == 2){
        //this.drawText($gameVariables.value(13), x + width - 64, y, 64, 'right');
        this.drawCurrentAndMax($gameVariables.value(13), $gameVariables.value(19), x, y, width,
                           this.tpColor(actor), this.normalColor());
    } else if(actor._actorId == 3){
        //this.drawText($gameVariables.value(14), x + width - 64, y, 64, 'right');
        this.drawCurrentAndMax($gameVariables.value(14), $gameVariables.value(20), x, y, width,
                           this.tpColor(actor), this.normalColor());
    } else {
        //this.drawText($gameVariables.value(15), x + width - 64, y, 64, 'right');
        this.drawCurrentAndMax($gameVariables.value(15), $gameVariables.value(21), x, y, width,
                           this.tpColor(actor), this.normalColor());
    }
};


Game_BattlerBase.prototype.tpRate = function(actor) {
    if(this._actorId == 1){
        return $gameVariables.value(12) / $gameVariables.value(18);
    } else if(this._actorId == 2){
        return $gameVariables.value(13) / $gameVariables.value(19);
    } else if(this._actorId == 3){
        return $gameVariables.value(14) / $gameVariables.value(20);
    } else {
        return $gameVariables.value(15) / $gameVariables.value(21);
    }
};


Window_Base.prototype.hpGaugeColor1 = function() {
    return this.textColor(18);
};

Window_Base.prototype.hpGaugeColor2 = function() {
    return this.textColor(10);
};

Window_Base.prototype.mpGaugeColor1 = function() {
    return this.textColor(20);
};

Window_Base.prototype.mpGaugeColor2 = function() {
    return this.textColor(21);
};

Window_Base.prototype.tpGaugeColor1 = function() {
    return this.textColor(20);
};

Window_Base.prototype.tpGaugeColor2 = function() {
    return this.textColor(25);
};
