import Phaser from 'phaser'
import { CashuMint, CashuWallet, getDecodedToken, getEncodedToken } from "@cashu/cashu-ts";
import { keys, mintUrl } from './keys';


export default class StartGameScene extends Phaser.Scene {
	nut;
	cursors;
	timer = 0
	ground
	squirrel
	scoreText
	speedBoost = 0
	points = 0
	jumpCooldown = true
	collected = false
	nutString = ''
	
	

	constructor() {
		super('start')
	}

	preload() {
		this.cursors = this.input.keyboard.createCursorKeys();
		this.load.audio('jump', '/audio/jump.wav')
		this.load.audio('powerUp', '/audio/powerUp.wav')
		this.load.audio('explosion', '/audio/explosion.wav')
		this.load.audio('collectCoin', '/audio/collectCoin.wav')
		this.load.image('sky', 'space3.png')
		this.load.image('ground', 'ground.png')
		this.load.aseprite('nut', 'nut.png', 'nut.json')
		this.load.aseprite('star', 'star.png', 'star.json')
		this.load.aseprite('coin', 'coin.png', 'coin.json')
		this.load.aseprite('squirrel', 'squirrel.png', 'squirrel.json')
	}

	create() {
		this.jumpSound = this.sound.add('jump')
		this.powerUpSound = this.sound.add('powerUp')
		this.collectCoinSound =this.sound.add('collectCoin')
		this.explosionSound =this.sound.add('explosion')
		this.loadNuts()
		setInterval(()=>{this.timer = this.timer +1},1000)
		this.add.image(400, 200, 'sky')
		this.scoreText = this.add.text(20, 20, 'Score: 0', { font: '20px joystix', color: '#aaaaaa' });
		this.anims.createFromAseprite('coin');
		this.anims.createFromAseprite('star');
		this.anims.createFromAseprite('nut');
		this.anims.createFromAseprite('squirrel');
		
		this.nut = this.physics.add.sprite(200, 360, 'nut').play({ key: 'idle', repeat: -1 });
		
		this.nut.setInteractive(this.input.makePixelPerfect());	
		this.nut.setCollideWorldBounds(true)
		
		this.coin = this.physics.add.sprite(400, 360, 'coin').play({ key: 'coin_idle', repeat: -1 });
		
		this.squirrel = this.physics.add.sprite(600, 360, 'squirrel').play({ key: 'squirrel_walking', repeat: -1 }).setCircle(12,15,30);

		this.ground = this.physics.add.sprite(400, 500, 'ground')
		this.ground.setDisplaySize(800, 200)
		this.ground.setGravity(0, -400)
		this.ground.setImmovable(true)
		
		this.physics.add.collider(this.nut, this.ground)
		this.physics.add.collider(this.squirrel, this.ground)
		this.physics.add.collider(this.coin, this.ground)
		this.physics.add.overlap(this.nut, this.coin, this.collectCoin, null, this)
		this.physics.add.overlap(this.nut, this.squirrel, this.endGame, null, this)
		this.spawnItem() 
	}

	endGame(){
		this.explosionSound?.play()
		window.points = this.points
		this.squirrel.setX(600)
		this.nut.setX(200)
		this.points = 0 
		this.timer = 0
		this.speedBoost = 0
		this.scoreText.setText("Score: 0")
		this.squirrel.setVelocityX(0)
		this.scene.start('gameover')
	}

	collectCoin(avatar, collectible) {
		if (!this.collected) {
			this.collectCoinSound.play()
			collectible.play({ key: 'coin_poof', repeat: 1 })
			this.collected = true
			this.points = this.points + 1
			this.scoreText.setText("Score: " + this.points)
			setTimeout(() => {
				collectible.destroy()
				this.writeNuts()
				this.loadNuts()
				setTimeout(() => {
					this.collected = false
					this.spawnCoin()
				}, 300);
			}, 600);
		}
	}
	collectStar(avatar, collectible) {
		if (!this.collectedPowerUp) {
			this.powerUpSound.play()
			collectible.play({ key: 'coin_poof', repeat: 1 })
			this.collectedPowerUp = true
			this.speedBoost = this.speedBoost+10
			setTimeout(() => {
				collectible.destroy()
				setTimeout(() => {
					this.collectedPowerUp = false
					this.spawnItem()
				}, 13000);
			}, 600);
		}
	}

	spawnCoin() {
		this.coin = this.physics.add.sprite(Math.random() * 400, Math.random() * 360, 'coin').play({ key: 'coin_idle', repeat: -1 });
		this.coin.setBounceY(.5)
		this.physics.add.collider(this.coin, this.ground)
		this.physics.add.overlap(this.nut, this.coin, this.collectCoin, null, this)
	}

	spawnItem() {
		this.star = this.physics.add.sprite(Math.random() * 400, Math.random() * 360, 'star').play({ key: 'star_blink', repeat: -1 });
		this.star.scale = .5
		this.star.setBounceY(.1)
		this.physics.add.collider(this.star, this.ground)
		this.physics.add.overlap(this.nut, this.star, this.collectStar, null, this)
	}

	update() {
		let isBack = this.nut.x>this.squirrel.x
		this.squirrel.setVelocityX(isBack?(this.points+this.timer):-(this.points+this.timer))
		this.squirrel.flipX=!isBack

		if (this.cursors.up.isDown) {
			if (this.jumpCooldown) {
				this.jumpSound.play()
				this.nut.setVelocityY(-200)
				this.jumpCooldown = false
				setTimeout(() => { this.jumpCooldown = true }, 1000)
			}
		}
		else if (this.cursors.right.isDown) {
			this.nut.flipX = false

			this.nut.setVelocityX(100+this.speedBoost)
		}
		else if (this.cursors.left.isDown) {
			this.nut.flipX = true
			this.nut.setVelocityX(-(100+this.speedBoost))
		}
		else {
			this.nut.setVelocityX(0)
		}

	}

	loadNuts = async () => {
		const response  =await fetch("https://faucet.gandlaf.com")
		const data = await response.json()
		this.nutString = data.token
	}
	writeNuts = async () => {
		const message = await this.receiveNut()
		
		const list = document.getElementById("coins-list")
		const item = document.createElement('li')
		
		item.textContent = message
		if(message !== 'empty nut'){
			item.classList.add('text-primary')
		}
		list?.prepend(item)
	}
	receiveNut = async () => {
		const mint = new CashuMint(mintUrl)
		const wallet = new CashuWallet(keys, mint)

		try {
			const {token} = await wallet.receive(this.nutString)
			const proofs = token.token.map(t=> t.proofs).flat()
			if (!proofs || proofs.length === 0){
				return 'empty nut'
			}
			return getEncodedToken({token:[{proofs, mint:mintUrl}]})
		} catch (error) {
			console.log(error)
			return 'empty nut'
		}
		
		
	}
}
