//=============================================================================
// SAN_CleatChoiceWindows.js
//=============================================================================
// Copyright (c) 2015-2016 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 滑り止め選択ウィンドウ ver1.10
 * 選択肢・数値入力・アイテム選択の誤入力を防止
 * @author サンシロ https://twitter.com/rev2nym
 * @version 1.10 2016/07/31 プラグインパラメータ名不一致による不具合を修正。スコープ化。strictモード化。その他リファクタリング。
 * 1.03a 2015/12/20 プラグイン名をSAN_CleatChoiceWindows.jsに変更、MITライセンスに変更。
 * 1.03 2015/11/14 プラグインパラメータ名のスペルミスを修正。
 * 1.02 2015/11/14 選択肢ウィンドウの機能とブザー可否を既存の機能と重複しないよう変更。
 * 1.01 2015/11/14 プラグインパラメータ名をエディタ準拠に変更。
 * 1.00 2015/11/14 公開。
 * 
 * @help
 * 選択肢・数値入力・アイテム選択のウィンドウのキー連打による誤入力を防止します。
 * 各ウィンドウが表示されたとき方向キーを入力することで決定することが可能になります。
 * 
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 * 
 * プラグインコマンドはありません。
 * 
 * @param ShowChoices
 * @desc 選択肢ウィンドウの滑り止め機能有効スイッチです。（ONで有効）
 * @default OFF
 *
 * @param InputNumber
 * @desc 数値入力ウィンドウの滑り止め機能有効スイッチです。（ONで有効）
 * @default OFF
 * 
 * @param SelectItem
 * @desc アイテム選択ウィンドウの滑り止め機能有効スイッチです。（ONで有効）
 * @default OFF
 * 
 * @param Buzzer
 * @desc 選択不能時のブザー音有効スイッチです。（ONで有効）
 * @default OFF
 * 
 */

var Imported = Imported || {};
Imported.SAN_CleatChoiceWindows = true;

var Sanshiro = Sanshiro || {};
Sanshiro.CleatChoiceWindows = Sanshiro.CleatChoiceWindows || {};
Sanshiro.CleatChoiceWindows.version = '1.10';

(function (SAN) {
'use strict';

// プラグインパラメータ
var _pluginParameters = PluginManager.parameters('SAN_CleatChoiceWindows');

//-----------------------------------------------------------------------------
// Window_ChoiceList
//
// 選択肢ウィンドウ (イベントコマンド[選択肢の表示])

// プラグインパラメータ 'ShowChoices' 判定
if (_pluginParameters['ShowChoices'] === 'ON') {

    // プロパティ初期化
    var _Window_ChoiceList_initialize = Window_ChoiceList.prototype.initialize;
    Window_ChoiceList.prototype.initialize = function (messageWindow) {
        _Window_ChoiceList_initialize.call(this, messageWindow);
        this._isCleating = true;
    };

    // 処理開始
    var _Window_ChoiceList_start = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function () {
        _Window_ChoiceList_start.call(this);
        this._isCleating = true;
    };

    // 初期選択
    var _Window_ChoiceList_selectDefault = Window_ChoiceList.prototype.selectDefault;
    Window_ChoiceList.prototype.selectDefault = function () {
        _Window_ChoiceList_selectDefault.call(this);
        this.select($gameMessage.choiceDefaultType() !== -1 ? $gameMessage.choiceDefaultType() : 0);
    };

    // 決定操作時の処理
    var _Window_ChoiceList_processOk = Window_ChoiceList.prototype.processOk;
    Window_ChoiceList.prototype.processOk = function () {
        if (this._isCleating) {
            this.playBuzzerSound();
            return;
        }
        _Window_ChoiceList_processOk.call(this);
    };

    // フレーム更新
    var _Window_ChoiceList_update = Window_ChoiceList.prototype.update;
    Window_ChoiceList.prototype.update = function () {
        _Window_ChoiceList_update.call(this);
        this.updateIsCleating();
    };

    // カーソル移動の更新
    var _Window_ChoiceList_processCursorMove = Window_ChoiceList.prototype.processCursorMove;
    Window_ChoiceList.prototype.processCursorMove = function () {
        if (this._isCleating) {
            return;
        }
        _Window_ChoiceList_processCursorMove.call(this);
    };

    // カーソルスプライトの更新
    var _Window_ChoiceList_updateCursor = Window_ChoiceList.prototype._updateCursor;
    Window_ChoiceList.prototype._updateCursor = function () {
        _Window_ChoiceList_updateCursor.call(this);
        this._windowCursorSprite.visible = this.isOpen() && !this._isCleating;
        if (!this._windowCursorSprite.visible) {
            this._animationCount = 0;
        }
    };

    // 滑り止めフラグの更新
    Window_ChoiceList.prototype.updateIsCleating = function () {
        if (Input.isTriggered('up') ||
            Input.isTriggered('down') ||
            Input.isTriggered('left') ||
            Input.isTriggered('right') ||
            TouchInput.isTriggered())
        {
            this._isCleating = false;
        }
    };

    // プラグインパラメータ 'Buzzer' 判定
    if (_pluginParameters['Buzzer'] !== 'ON') {
        // ブザー音再生
        Window_ChoiceList.prototype.playBuzzerSound = function () {
            return;
        };
    }
}

//-----------------------------------------------------------------------------
// Window_NumberInput
//
// 数値入力ウィンドウ (イベントコマンド[数値入力の処理])

// プラグインパラメータ 'InputNumber' 判定
if (_pluginParameters['InputNumber'] === 'ON') {
    // プロパティ初期化
    var _Window_NumberInput_initialize = Window_NumberInput.prototype.initialize;
    Window_NumberInput.prototype.initialize = function (messageWindow) {
        _Window_NumberInput_initialize.call(this, messageWindow);
        this._isCleating = true;
    };

    // 処理開始
    var _Window_NumberInput_start = Window_NumberInput.prototype.start;
    Window_NumberInput.prototype.start = function () {
        _Window_NumberInput_start.call(this);
        this._isCleating = true;
    };

    // 決定操作時の処理
    var _Window_NumberInput_processOk = Window_NumberInput.prototype.processOk;
    Window_NumberInput.prototype.processOk = function () {
        if (this._isCleating) {
            this.playBuzzerSound();
            return;
        }
        _Window_NumberInput_processOk.call(this);
    };

    // フレーム更新
    var _Window_NumberInput_update = Window_NumberInput.prototype.update;
    Window_NumberInput.prototype.update = function () {
        _Window_NumberInput_update.call(this);
        this.updateIsCleating();
    };

    // カーソル移動の更新
    var _Window_NumberInput_processCursorMove = Window_NumberInput.prototype.processCursorMove;
    Window_NumberInput.prototype.processCursorMove = function () {
        if (this._isCleating) {
            return;
        }
        _Window_NumberInput_processCursorMove.call(this);
    };

    // カーソルスプライトの更新
    var _Window_NumberInput_updateCursor = Window_NumberInput.prototype._updateCursor;
    Window_NumberInput.prototype._updateCursor = function () {
        _Window_NumberInput_updateCursor.call(this);
        this._windowCursorSprite.visible = this.isOpen() && !this._isCleating;
        if (!this._windowCursorSprite.visible) {
            this._animationCount = 0;
        }
    };

    // 滑り止めフラグの更新
    Window_NumberInput.prototype.updateIsCleating = function () {
        if (Input.isTriggered('up') ||
            Input.isTriggered('down') ||
            Input.isTriggered('left') ||
            Input.isTriggered('right') ||
            TouchInput.isTriggered())
        {
            this._isCleating = false;
        }
    };

    // プラグインパラメータ 'Buzzer' 判定
    if (_pluginParameters['Buzzer'] !== 'ON') {
        // ブザー音再生
        Window_NumberInput.prototype.playBuzzerSound = function () {
            return;
        };
    }
}

//-----------------------------------------------------------------------------
// Window_EventItem
//
// アイテム選択ウィンドウ (イベントコマンド[アイテム選択の処理])

// プラグインパラメータ 'SelectItem' 判定
if (_pluginParameters['SelectItem'] === 'ON') {
    // プロパティ初期化
    var _Window_EventItem_initialize = Window_EventItem.prototype.initialize;
    Window_EventItem.prototype.initialize = function (messageWindow) {
        _Window_EventItem_initialize.call(this, messageWindow);
        this._isCleating = true;
    };

    // 処理開始
    var _Window_EventItem_start = Window_EventItem.prototype.start;
    Window_EventItem.prototype.start = function () {
        _Window_EventItem_start.call(this);
        this._isCleating = true;
    };

    // 決定操作時の処理
    var _Window_EventItem_processOk = Window_EventItem.prototype.processOk;
    Window_EventItem.prototype.processOk = function () {
        if (this._isCleating) {
            this.playBuzzerSound();
            return;
        }
        _Window_EventItem_processOk.call(this);
    };

    // フレーム更新
    var _Window_EventItem_update = Window_EventItem.prototype.update;
    Window_EventItem.prototype.update = function () {
        _Window_EventItem_update.call(this);
        this.updateIsCleating();
    };
    
    // カーソル移動の更新
    var _Window_EventItem_processCursorMove = Window_EventItem.prototype.processCursorMove;
    Window_EventItem.prototype.processCursorMove = function () {
        if (this._isCleating) {
            return;
        }
        _Window_EventItem_processCursorMove.call(this);
    };

    // カーソルスプライトの更新
    var _Window_EventItem_updateCursor = Window_EventItem.prototype._updateCursor;
    Window_EventItem.prototype._updateCursor = function () {
        _Window_EventItem_updateCursor.call(this);
        this._windowCursorSprite.visible = this.isOpen() && !this._isCleating;
        if (!this._windowCursorSprite.visible) {
            this._animationCount = 0;
        }
    };

    // 滑り止めフラグの更新
    Window_EventItem.prototype.updateIsCleating = function () {
        if (Input.isTriggered('up') ||
            Input.isTriggered('down') ||
            Input.isTriggered('left') ||
            Input.isTriggered('right') ||
            TouchInput.isTriggered())
        {
            this._isCleating = false;
        }
    };

    // プラグインパラメータ 'Buzzer' 判定
    if (_pluginParameters['Buzzer'] !== 'ON') {
        // ブザー音再生
        Window_EventItem.prototype.playBuzzerSound = function () {
            return;
        };
    }
}

}) (Sanshiro);