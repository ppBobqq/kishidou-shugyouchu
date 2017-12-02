// JavaScript Document
/*:
 * @plugindesc このゲーム戦闘のプラグインです。
 * @author あるふぁ
 * @help
 タイトルの通りです。
 他のプラグインとの衝突を全く考慮してません。
特定の挙動が明らかにおかしいときはご一報ください。怖えー！
 
 */

(function() {

//コマンド失敗メッセージカット
//（呼び出しのみのイベントのとき表示されてしまうため）
//コメントアウト部分
Window_BattleLog.prototype.displayFailure = function(target) {
   /* if (target.result().isHit() && !target.result().success) {
        this.push('addText', TextManager.actionFailure.format(target.name()));
    }*/
};



//コマンド選択時効果音演奏
//ドラクエみたいな感じで、〇〇の攻撃！と表示されたときに音が鳴ります

BattleManager.processTurn = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    if (action) {
        action.prepare();
        if (action.isValid()) {
            this.startAction();
			//次行追加部分
			AudioManager.playSe({"name":"Attack1","volume":90,"pitch":100,"pan":0})
        }
        subject.removeCurrentAction();
    } else {
        subject.onAllActionsEnd();
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(subject);
        this._logWindow.displayCurrentState(subject);
        this._logWindow.displayRegeneration(subject);
        this._subject = this.getNextSubject();
    }
};


//コマンドがもたつく原因になっていたので、
//YANFLYのアイコンを非表示にしてます
//以下のコメント部分
//現在解除中。



/*
Window_Base.prototype.drawActorActionIcon = function(actor, wx, wy) {
    
	var icon = Yanfly.Icon.NoAction;
    if (actor.currentAction() && actor.currentAction().item()) {
      icon = actor.currentAction().item().iconIndex || Yanfly.Icon.NoAction;
    }
    this.drawIcon(icon, wx + 2, wy + 2);
	
};

Window_BattleStatus.prototype.drawItemGaugeIcon = function(iconIndex, wx, wy) {
    
	var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    var iconWidth = (Imported.YEP_CoreEngine) ? Yanfly.Param.GaugeHeight : 32;
    var iconHeight = (Imported.YEP_CoreEngine) ? Yanfly.Param.GaugeHeight : 32;
    wy += Window_Base._iconHeight - iconHeight;
    this.contents.blt(bitmap, sx, sy, pw, ph, wx, wy, iconWidth, iconHeight);
    return iconWidth;
	
};

Window_BattleStatus.prototype.drawBasicArea = function(rect, actor) {
    if (Imported.YEP_X_BattleSysATB && Yanfly.Param.ATBGaugeStyle) {
      if (BattleManager.isATB()) {
        this.drawActorAtbGauge(actor, rect.x - 2, rect.y, rect.width + 2);
      }
    }
    var iw = Window_Base._iconWidth;
    this.drawActorActionIcon(actor, rect.x, rect.y);
    this.resetFontSettings();
    this.contents.fontSize = Yanfly.Param.BSWNameFontSize;
    this.drawActorName(actor, rect.x + iw + 4, rect.y, rect.width);
};

*/

})();