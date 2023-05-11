import Phaser from 'phaser'

import StartGameScene from './StartGameScene'
import TitleScene from './TitleScene'
import GameOverSceene from './GameOverScene'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	pixelArt: true,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 400 },
		},
	},
	scene: [ TitleScene, StartGameScene, GameOverSceene,],
}

export default new Phaser.Game(config)
