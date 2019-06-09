class Character {
    constructor(name) {
        this.name = name;
        this.speed = 100;
        this.dmg = 20;
        this.isMoving = false;
        this.destination = {
            x: Constants.PLAYER_SPAWN_X,
            y: Constants.PLAYER_SPAWN_Y
        };
        this.prevPosition = null;  // initialized with Sprite
        this.blocked = null;  // initialized with Sprite
        this.items = [];
        this.eq = [];
        this.stats = {
            hp: 100,
            power: 10,
            maxhp: 150,
        }
        this.wantsInteraction = false;
    }

    attachSprite(sprite) {
        this.sprite = sprite;
        // Normalize and scale the velocity so that player can't move faster along a diagonal
        this.sprite.body.velocity.normalize().scale(this.speed);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(16, 8);
        this.sprite.body.setOffset(8, 24);
        this.prevPosition = {x: this.sprite.x, y: this.sprite.y};
        this.blocked = this.sprite.body.blocked;
    }

    attachController(controller) {
        this.controller = controller;
    }

    update() {
        this.handleMovement();
        this.handleInteraction();
    }

    moveWithStep(key, stepSizeX, stepSizeY) {
        this.sprite.anims.play(key, true);
    }

    handleMovement() {
        const allowedError = 0.33;  // allowed error in pixels
        const stepSize = 16;
        if (this.hasArrived(allowedError) || this.isBlocked()) {
            this.isMoving = false;
        }
        if (!this.isMoving) {
            // Stop any previous movement from the last frame
            this.sprite.body.setVelocity(0);
            // Horizontal movement
            if (this.controller.left.isDown) {
                this.sprite.body.setVelocityX(-this.speed);
                this.moveWithStep('playerLeft', -stepSize, 0);
            } else if (this.controller.right.isDown) {
                this.sprite.body.setVelocityX(this.speed);
                this.moveWithStep('playerRight', stepSize, 0);
            } else if (this.controller.up.isDown) {
                this.sprite.body.setVelocityY(-this.speed);
                this.moveWithStep('playerUp', 0, -stepSize);
            } else if (this.controller.down.isDown) {
                this.sprite.body.setVelocityY(this.speed);
                this.moveWithStep('playerDown', 0, stepSize);
            } else {
                this.sprite.anims.stopOnRepeat();
            }
        }
        this.prevPosition.x = this.sprite.x;
        this.prevPosition.y = this.sprite.y;
    }

}
