//=============================================================================
// TestPlugin.js
//=============================================================================

/*:
 * @plugindesc テスト
 * @author myog
 * 
 * @help hogehoge
 * 
 * 
 * 
 * @param AttackNum
 * @desc Number of Attacks in one action
 * @default 5
 * 
 * @param AllFrame
 * @desc All
 * @default 60
 * 
 * @param ChainAttackFrame
 * @desc CAF
 * @default 30
 * 
 * @param 
 * @desc 
 * @default 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

(function () {

    var param = PluginManager.parameters('TestPlugin');
    var attackNum = parseInt(param['AttackNum']);
    
    var maxHogeFrame = parseInt(param['AllFrame']);
    var chainHogeFrame = parseInt(param['ChainAttackFrame']);
    var hogeFrameCenter = maxHogeFrame / 2;
    var minChainHogeFrame = hogeFrameCenter - ((chainHogeFrame) / 2);
    var maxChainHogeFrame = hogeFrameCenter + ((chainHogeFrame) / 2);
    
    console.log('attackNum:' + attackNum);
    console.log('maxFrame :' + maxHogeFrame);
    console.log('minChain :' + minChainHogeFrame);
    console.log('maxChain :' + maxChainHogeFrame);
    

    var hookToBattleLoad = Scene_Battle.prototype.create;
    Scene_Battle.prototype.create = function () {
        hookToBattleLoad.call(this);
        console.log('attackNum:' + attackNum);
    }

    var hookToBattle = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        
        //console.log('_phase:' + BattleManager._phase);
        hookToBattle.call(this);

    }

    //might be using



    //-----------------------------
    // BattleManager
    //

    var _action;
    var _subject;
    var _nowChainCount;

    var hogeNowFrame = 0;
    var chainEndFrag = false;
    
    var hookBattleManagerStartAction = BattleManager.startAction;
    BattleManager.startAction = function () {
        
        _nowChainCount++;
        _subject = this._subject;
        _action = _subject.currentAction();
        _targets = _action.makeTargets();
        _nowChainCount = 0;
        
        chainEndFrag = false;
        
        if((!this._subject.isEnemy()) && (_action.isAttack()) ) {
            this.startHoge();
        }
        
        else{
            hookBattleManagerStartAction.call(this);
        }
    }
    
    
    var hookBattleManagerEndAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        if((!this._subject.isEnemy()) && (this._action.isAttack())) {
            if (_nowChainCount < attackNum && !chainEndFrag) {
                this.startHoge();
            }
            else{
                hookBattleManagerEndAction.call(this);
            }
        }
        else{
            hookBattleManagerEndAction.call(this);
        }
    };
    
    
    
    var hogehoge_BattleManager_Update = BattleManager.update;
    BattleManager.update = function(){
        hogehoge_BattleManager_Update.call(this);
        if (!this.isBusy() && !this.updateEvent()) {
            if(this._phase === 'hoge'){
                this.updateHoge();
            }
        }
    }
    
    BattleManager.startChainAction = function () {
        _nowChainCount++;
        var subject = this._subject;
        var action = new Game_Action(subject);
        action.setAttack();
        var targets = [_targets[0]];
        
        this._action = action;
        this._targets = targets;
        
        if (this._targets.length > 0 && !targets[0].isDead()) {
            
            this._phase = 'action';
            this._action.applyGlobal();
            this.refreshStatus();
            this._logWindow.startAction(subject, action, this._targets);
        }
        
    }

    BattleManager.startHoge = function(){
        if(_targets[0].isDead()){
            hookBattleManagerEndAction.call(this);
        }
        else{
            this._phase = 'hoge';
            hogeNowFrame = 0;
        }
    }
    
    BattleManager.updateHoge = function(){
        
        hogeNowFrame++;
        
        updateTimingSprite(500,100);
        
        if(Input.isTriggered('ok')){
            if(hogeNowFrame <= maxChainHogeFrame && hogeNowFrame >= minChainHogeFrame){
                console.log('chain success');
                chainEndFrag = false;
            }
            else{
                console.log('chain failue');
                chainEndFrag = true;
            }
            
            this._phase = 'action';
            this.startChainAction();
        }
        
        if(hogeNowFrame>maxHogeFrame){
            chainEndFrag = true;
            this._phase = 'action';
            this.startChainAction();
        }
        console.log(hogeNowFrame + '' + chainEndFrag);
        
    }
    //-----------------------------
    // Sprite_BattleTimingGage
    //
    

    //-----------------------------
    // SpriteSet_Battle
    //
    
    var timingGageSprite = new Sprite();
    var timingNoteSprite = new Sprite();
    
    var offsetX = -50;
    var offsetY = -50;
    var noteGapY = 10;
    var noteGapX = -15;
    
    var hoge_spriteset_Battle_createUpperLayer = Spriteset_Battle.prototype.createUpperLayer;
    Spriteset_Battle.prototype.createUpperLayer = function(){
        
        hoge_spriteset_Battle_createUpperLayer.call(this);
        
        timingGageSprite = new Sprite();
        timingNoteSprite = new Sprite();
        
        timingGageSprite.bitmap = new Bitmap(100,10);
        timingNoteSprite.bitmap = new Bitmap(100,20);
        
        timingGageSprite.bitmap.drawText('------|------------|------',0,0,100,10,'centor');
        timingNoteSprite.bitmap.drawText('↑',0,0,100,20,'centor');
        
        timingNoteSprite.y = 0;
        
        timingGageSprite.visible = true;
        timingNoteSprite.visible = true;
        
        this.addChild(timingGageSprite);
        this.addChild(timingNoteSprite);
    }
    
    updateTimingSprite = function(x,y){
        x += offsetX;
        y += offsetY;
        
        timingGageSprite.x = x;
        timingGageSprite.y = y;
        
        timingNoteSprite.y = y + noteGapY;
        timingNoteSprite.x = x + noteGapX + ((hogeNowFrame/maxHogeFrame) * timingGageSprite.width);
    }
    
})();