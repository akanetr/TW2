//スキル使用時、MPをコスト分上昇させる。
//フローラが魔獣化している場合のみMPを減らす
Game_BattlerBase.prototype.paySkillCost = function(skill) {
    if(this._actorId === 4 && this.isStateAffected(74)){
        this._mp -= this.skillMpCost(skill);
    } else {
        this._mp += this.skillMpCost(skill);
    }
    this._tp -= this.skillTpCost(skill);
};

//本来、スキルを使用する際はMPがコスト以上存在しないと選べないが、
//このゲームではコストは消費しないので、無条件でスキルを使用できるため、
//使用可能かどうかの判定は、無条件でtrueにする。
//フローラが魔獣化している場合のみ条件を入れる
Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
    if(this._actorId === 4 && this.isStateAffected(74)){
        return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill)
    } else {
        return true;
    }
};