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
