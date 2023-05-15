import Phaser from 'phaser'

import StartGameScene from './StartGameScene'
import TitleScene from './TitleScene'
import GameOverSceene from './GameOverScene'


export default new Phaser.Game({
	type: Phaser.AUTO,
	parent: 'app',
	pixelArt: true,
	width: 800,
	height: 600,
	antialias:false,
	antialiasGL:false,
	fps:{
		target:30,
		smoothStep: true
	},
	roundPixels: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 400 },
		},
	},
	scene: [ TitleScene, StartGameScene, GameOverSceene,],
})
