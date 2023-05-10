import Phaser from 'phaser'

export default class GameOverSceene extends Phaser.Scene {
    menu = 'play'
    refresh = true
    cursors: Phaser.Types.Input.Keyboard.CursorKeys

    titleText: Phaser.GameObjects.Text
    pointsText: Phaser.GameObjects.Text
    titleShadowText: Phaser.GameObjects.Text
    playMenuText: Phaser.GameObjects.Text
    highscoreMenuText: Phaser.GameObjects.Text

    constructor() {
        super('gameover')
    }
    preload() {
        this.cursors = this.input?.keyboard?.createCursorKeys();
        this.load.image('sky', 'space3.png')
    }
    create() {
        this.titleText = this.add.text(250, 200, 'GAME OVER', { font: '42px joystix', color: '#9B26B6' });
        this.titleShadowText = this.add.text(253, 203, 'GAME OVER', { font: '42px joystix', color: '#FFA400' });
        this.pointsText = this.add.text(340, 300, 'points:'+ window.points??0, { font: '20px joystix', color: '#9B26B6'});
        this.playMenuText = this.add.text(320, 400, 'play again', { font: '20px joystix', color: this.menu === 'play' ? '#FFA400' : '#aaaaaa' });
        this.highscoreMenuText = this.add.text(330, 450, 'highscore', { font: '20px joystix', color: this.menu === 'highscore' ? '#FFA400' : '#aaaaaa' });
    }


    update() {
        if (this.refresh) {
            if (this.cursors.up.isDown) {
                this.updateMenu()
            }
            else if (this.cursors.down.isDown) {
                this.updateMenu()
            }
            else if (this.cursors.space.isDown) {
                this.scene.start('start')
            }
        }
    }

    updateMenu() {
        this.menu = this.menu === 'play' ? 'highscore' : 'play'
        this.playMenuText.setColor(this.menu === 'play' ? '#FFA400' : '#aaaaaa')
        this.highscoreMenuText.setColor(this.menu === 'highscore' ? '#FFA400' : '#aaaaaa')
        setTimeout(() => {
            this.refresh = true
        }, 200);
        this.refresh=false
        
    }
}

