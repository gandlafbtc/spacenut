import Phaser from 'phaser'
import { CashuMint, CashuWallet, getDecodedToken, getEncodedToken } from "@cashu/cashu-ts";
import { keys, mintUrl } from './keys';
import { nuts } from '../stores/nuts';


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
	bullets = 0


	hasGun = false
	isLoaded = true
	squirrelLives = 5



	constructor() {
		super('start')
	}

	preload() {
		this.cursors = this.input.keyboard.createCursorKeys();
		this.load.audio('jump', '/audio/jump.wav')
		this.load.audio('powerUp', '/audio/powerUp.wav')
		this.load.audio('shot', '/audio/shot.wav')
		this.load.audio('explosion', '/audio/explosion.wav')
		this.load.audio('collectCoin', '/audio/collectCoin.wav')
		this.load.image('sky', 'space3.png')
		this.load.image('ground', 'ground.png')
		this.load.aseprite('nut', 'nut.png', 'nut.json')
		this.load.aseprite('bullet', 'bullet.png', 'bullet.json')
		this.load.aseprite('gun', 'gun.png', 'gun.json')
		this.load.aseprite('star', 'star.png', 'star.json')
		this.load.aseprite('coin', 'coin.png', 'coin.json')
		this.load.aseprite('shot', 'shot.png', 'shot.json')
		this.load.aseprite('squirrel', 'squirrel.png', 'squirrel.json')
	}

	create() {
		this.jumpSound = this.sound.add('jump')
		this.powerUpSound = this.sound.add('powerUp')
		this.collectCoinSound = this.sound.add('collectCoin')
		this.explosionSound = this.sound.add('explosion')
		this.shotSound = this.sound.add('shot')
		this.loadNuts()
		this.add.image(400, 200, 'sky')
		this.scoreText = this.add.text(20, 20, 'Score: 0', { font: '20px joystix', color: '#aaaaaa' });

		this.anims.createFromAseprite('coin');
		this.anims.createFromAseprite('gun');
		this.anims.createFromAseprite('bullet');
		this.anims.createFromAseprite('star');
		this.anims.createFromAseprite('nut');
		this.anims.createFromAseprite('squirrel');
		this.anims.createFromAseprite('shot');

		this.bulletSprite = this.add.sprite(20, 60, 'bullet').play({ key: 'bullet_burning', repeat: -1 });
		this.bulletSprite.scale = .3
		this.bulletText = this.add.text(30, 55, `${this.bullets} x`, { font: '10px joystix', color: '#aaaaaa' });

		this.nut = this.physics.add.sprite(200, 360, 'nut').play({ key: 'idle', repeat: -1 });


		this.nut.setInteractive(this.input.makePixelPerfect());
		this.nut.setCollideWorldBounds(true)

		this.coin = this.physics.add.sprite(400, 360, 'coin').play({ key: 'coin_idle', repeat: -1 });

		this.squirrel = this.physics.add.sprite(600, 360, 'squirrel').play({ key: 'squirrel_walking', repeat: -1 }).setCircle(12, 15, 30);

		this.ground = this.physics.add.sprite(400, 500, 'ground')
		this.ground.setDisplaySize(800, 200)
		this.ground.setGravity(0, -400)
		this.ground.setImmovable(true)

		this.physics.add.collider(this.nut, this.ground)
		this.physics.add.collider(this.squirrel, this.ground)
		this.physics.add.collider(this.coin, this.ground)
		this.physics.add.overlap(this.nut, this.coin, this.collectCoin, null, this)
		this.physics.add.overlap(this.nut, this.squirrel, this.endGame, null, this)
		this.spawnBullet()
		this.resetGame()
	}

	endGame() {	
		this.explosionSound?.play()
		window.points = this.points
		this.scene.start('gameover')
	}

	resetGame() {
		this.squirrel.setX(600)
		this.nut.setX(200)
		this.points = 0
		this.timer = 0
		this.speedBoost = 0
		this.hasGun = false
		this.isLoaded = true
		this.bullets = 0
		this.squirrelLives = 5
		this.squirrel.setVelocity(0)
		this.scoreText.setText("Score: 0")
		this.squirrel.setVelocityX(0)
		if (this.timerInterval) {
			clearInterval(this.timerInterval)
		}
		this.timerInterval = setInterval(() => { this.timer = this.timer + 1 }, 1000)
	}
	
	collectCoin(avatar, collectible) {
		if (!collectible.name) {
			collectible.name = 'collected'
			this.collectCoinSound.play()
			collectible.play({ key: 'coin_poof', repeat: 1 })
			this.points = this.points + 1
			this.scoreText.setText("Score: " + this.points)
			setTimeout(() => {
				collectible.destroy()
				this.writeNuts()
				this.loadNuts()
				setTimeout(() => {
					this.doItemSpawning()
					this.spawnCoin()
				}, 300);
			}, 600);
		}
	}
	collectItem(avatar, collectible) {
		if (!collectible.name) {
			collectible.name = "collected"
			this.powerUpSound.play()
			collectible.play({ key: 'coin_poof', repeat: 1 })
			this.speedBoost = this.speedBoost + 10
			setTimeout(() => {
				collectible.destroy()
			}, 600);
		}
	}

	collectGun(avatar, collectible) {
		if (this.hasGun) { return }
		this.nutGun = this.add.sprite(this.nut.x, this.nut.y, 'gun').play({ key: 'gun_rotate', repeat: -1 })
		this.nutGun.scale = .2
		collectible.play({ key: 'coin_poof', repeat: 1 })
		this.powerUpSound.play()
		setTimeout(() => {
			collectible.destroy()
		}, 600);
		this.hasGun = true
	}

	collectBullet(avatar, collectible) {
		if (this.collectedBullet) {
			return
		}
		collectible.play({ key: 'coin_poof', repeat: 1 })
		this.powerUpSound.play()
		setTimeout(() => {
			collectible.destroy()
			this.collectedBullet = false
		}, 600);
		this.collectedBullet = true
		this.bullets++
		this.bulletText.setText(`${this.bullets}x`)
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
		this.physics.add.overlap(this.nut, this.star, this.collectItem, null, this)
	}

	spawnGun() {
		this.gun = this.physics.add.sprite(Math.random() * 400, Math.random() * 360, 'gun').play({ key: 'gun_rotate', repeat: -1 });
		this.gun.scale = .5
		this.gun.setBounceY(.1)
		this.physics.add.collider(this.gun, this.ground)
		this.physics.add.overlap(this.nut, this.gun, this.collectGun, null, this)
	}

	spawnBullet() {
		this.bullet = this.physics.add.sprite(Math.random() * 400, Math.random() * 360, 'bullet').play({ key: 'bullet_burning', repeat: -1 });
		this.bullet.scale = .5
		this.bullet.setBounceY(.1)
		this.physics.add.collider(this.bullet, this.ground)
		this.physics.add.overlap(this.nut, this.bullet, this.collectBullet, null, this)
		setTimeout(() => {
			this.bullet.destroy()
		}, 5000);
	}

	update() {
		if(this.squirrelLives>0){
			let isBack = this.nut.x > this.squirrel.x
			this.squirrel.setVelocityX(isBack ? (this.points + this.timer) : -(this.points + this.timer))
			this.squirrel.flipX = !isBack
		}
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

			this.nut.setVelocityX(100 + this.speedBoost)
		}
		else if (this.cursors.left.isDown) {
			this.nut.flipX = true
			this.nut.setVelocityX(-(100 + this.speedBoost))
		}
		else if (this.cursors.space.isDown) {
			if (this.hasGun && this.isLoaded && this.bullets) {
				this.fireGun()
				this.isLoaded = false
				setTimeout(() => { this.isLoaded = true }, 200)
			}
		}
		else {
			this.nut.setVelocityX(0)
		}
		if (this.hasGun) {
			this.nutGun.y = this.nut.y
			this.nutGun.flipX = this.nut.flipX
			this.nutGun.x = this.nut.x + (this.nut.flipX ? -20 : 20)
		}
	}

	fireGun() {
		this.bullets--
		this.shotSound.play()
		this.shot = this.physics.add.sprite(this.nut.x + (this.nut.flipX ? -33 : 33), this.nut.y - 4, 'shot').play({ key: 'shot_fly', repeat: -1 });
		this.shot.setVelocityX((this.nut.flipX ? -1000 : 1000))
		this.shot.scale = .5
		this.shot.setBounceY(.99)
		this.shot.setGravityY(-400)
		this.physics.add.collider(this.shot, this.ground)
		this.physics.add.overlap(this.squirrel, this.shot, this.hitSquirrel, null, this)
		this.bulletText.setText(`${this.bullets}x`)
	}

	hitSquirrel(squirrel, shot) {
		shot.destroy()
		squirrel.x = squirrel.x + (squirrel.flipX?30:-30)
		this.squirrelLives--
		if (this.squirrelLives<1) {
			this.moneyRain()
			this.squirrel.destroy()
			setTimeout(() => {
				this.endGame()
			}, 10000);
		}
	}

	moneyRain() {
		for (let index = 0; index < 10; index++) {
			this.spawnCoin()			
		}
	}

	loadNuts = async () => {
		const response = await fetch("https://faucet.gandlaf.com")
		const data = await response.json()
		this.nutString = data.token
	}
	writeNuts = async () => {
		const message = await this.receiveNut()

		const list = document.getElementById("coins-list")
		const item = document.createElement('li')

		item.textContent = message
		if (message !== 'empty nut') {
			nuts.update(state => [message, ...state])
			item.classList.add('text-primary')
		}
		list?.prepend(item)
	}
	receiveNut = async () => {
		if (this.squirrelLives<1) {
			return
		}
		const mint = new CashuMint(mintUrl)
		const wallet = new CashuWallet(keys, mint)
		try {
			const { token } = await wallet.receive(this.nutString)
			const proofs = token.token.map(t => t.proofs).flat()
			if (!proofs || proofs.length === 0) {
				return 'empty nut'
			}
			return getEncodedToken({ token: [{ proofs, mint: mintUrl }] })
		} catch (error) {
			console.log(error)
			return 'empty nut'
		}


	}
	doItemSpawning = () => {
		if (this.points % 4 === 0) {
			this.spawnItem()
		}
		if (this.points % 5 === 0) {
			this.spawnBullet()
		}
		if (this.points === 10){
			this.spawnGun()
		}

	}
}
