//=============================================================================
// RestoreMenuAfterCommon.js
//=============================================================================

/*:
 * @plugindesc Back to the same menu scene after common events caused by items.
 * @author terunon (AliasAche)
 *
 * @help
 * ���j���[��ŃR�����C�x���g���ĂԃA�C�e�����g�p���ă��j���[������ꂽ�Ƃ��A
 * ���̉�ʂɖ߂�������񋟂��܂��B
 * �Ē�`���s���Ă���̂ŏ�̕��ɔz�u���Ă��������B
 *
 * �ΏۃR�����C�x���g�̖����ɃX�N���v�g�Fthis.sceneRestore()�Ɠ���邱�ƂŎg�p�ł��܂��B
 *
 * �N���W�b�g�Ƃ��āA�uterunon�i�G�C���A�X�G�C�N�j�v�̑f�ނ��g�p�����|��
 * ReadMe�܂��̓u���E�U���̎��F�ł���ꏊ�ɋL�ڂ��Ă���������΁A
 * �c����c����킸�A������c�N�[��MV��i�Ŏg�p�E���ς��������܂��B
 *
 * Copyright (c) 2016 terunon (AliasAche)
 * You can use and modify it for every your commercial/non-commercial RPG Maker MV game
 * if you credit "terunon (AliasAche)"
 */

//Global variables
    var aliasAcheCommon = false;
    var aliasAcheSelectRestore = false;

(function() {

Scene_Item.prototype.popScene = function() {
    if (aliasAcheCommon){
        aliasAcheCommon = false;
        aliasAcheSelectRestore = false;
        SceneManager.goto(Scene_Menu);
    }else{
    SceneManager.pop();
    }
};

Game_Interpreter.prototype.sceneRestore = function(){
    if (!$gameParty.inBattle()){
           aliasAcheCommon = true;
           aliasAcheSelectRestore = true;
       if(DataManager.isItem){
            SceneManager.push(Scene_Item);
       } else {
            SceneManager.push(Scene_Skill);
       }
    }
};

Scene_Item.prototype.update = function() {
    if (aliasAcheSelectRestore) {
       aliasAcheSelectRestore = false;
       this.onCategoryOk();
       this._categoryWindow.deactivate();
//       if ($gameParty.numItems($gameParty.lastItem()) > 0 && DataManager.isItem){
if ($gameParty.numItems($gameParty.lastItem()) != 0 && DataManager.isItem){
          this.onItemOk();
          this._itemWindow.deactivate();
       } else if ($gameParty.numSkill($gameParty.lastMenuSkill()) > 0){
          this.onSkillOk();
          this._skillWindow.deactivate();
       }
    }
    Scene_Base.prototype.update.call(this);
};

})();
