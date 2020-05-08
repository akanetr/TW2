//�X�L���g�p���AMP���R�X�g���㏸������B
//�t���[�������b�����Ă���ꍇ�̂�MP�����炷
Game_BattlerBase.prototype.paySkillCost = function(skill) {
    if(this._actorId === 4 && this.isStateAffected(74)){
        this._mp -= this.skillMpCost(skill);
    } else {
        this._mp += this.skillMpCost(skill);
    }
    this._tp -= this.skillTpCost(skill);
};

//�{���A�X�L�����g�p����ۂ�MP���R�X�g�ȏ㑶�݂��Ȃ��ƑI�ׂȂ����A
//���̃Q�[���ł̓R�X�g�͏���Ȃ��̂ŁA�������ŃX�L�����g�p�ł��邽�߁A
//�g�p�\���ǂ����̔���́A��������true�ɂ���B
//�t���[�������b�����Ă���ꍇ�̂ݏ���������
Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
    if(this._actorId === 4 && this.isStateAffected(74)){
        return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill)
    } else {
        return true;
    }
};