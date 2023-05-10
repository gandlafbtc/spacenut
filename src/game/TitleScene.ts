import Phaser from 'phaser'

export default class TitleScene extends Phaser.Scene {
    menu = 'play'
    refresh = true
    cursors: Phaser.Types.Input.Keyboard.CursorKeys

    titleText: Phaser.GameObjects.Text
    titleShadowText: Phaser.GameObjects.Text
    playMenuText: Phaser.GameObjects.Text
    highscoreMenuText: Phaser.GameObjects.Text
    theme: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound
    spaceToStartText: Phaser.GameObjects.Text
    loadingText: Phaser.GameObjects.Text
    constructor() {
        super('title')
    }
    preload() {
        this.loadingText = this.add.text(300, 300, 'Loading...', { font: '20px joystix', color: '#9B26B6' });
		this.load.audio('theme', 'audio/theme.mp3')
        this.cursors = this.input?.keyboard?.createCursorKeys();
        this.load.image('sky', 'space3.png')
    }
    create() {
        this.loadingText.destroy()
		this.theme = this.sound.add('theme')
        this.theme.loop = true
        this.theme.volume = .7 
        this.theme.play()
        this.titleText = this.add.text(200, 100, 'SpaceNut', { font: '65px joystix', color: '#9B26B6' });
        this.titleShadowText = this.add.text(203, 103, 'SpaceNut', { font: '65px joystix', color: '#FFA400' });
        this.spaceToStartText = this.add.text(290, 250, 'space to start', { font: '20px joystix', color: '#9B26B6' });
        this.playMenuText = this.add.text(365, 400, 'play', { font: '20px joystix', color: this.menu === 'play' ? '#FFA400' : '#aaaaaa' });
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

