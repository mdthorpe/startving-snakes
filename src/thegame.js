var theGame = function(game) {
    numBalls = 6;
    balls = {};
    snakeBodies = {};
    tableCenter = {};
    debugText = {};
}

theGame.prototype = {
    create: function() {
    	this.game.time.advancedTiming = true;
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.restitution = 0.5;

        balls = new Phaser.Group(this.game, '', 'balls', true, false, 'Phaser.Physics.P2JS');
        snakeBodies = new Phaser.Group(this.game, '', 'snakeBodies', true, false, 'Phaser.Physics.P2JS');

        // for (var i = 0; i < numBalls; i++) {
        //     var b = balls.create(
        //         this.game.rnd.integerInRange(300, 500),
        //         this.game.rnd.integerInRange(300, 500),
        //         'balls',
        //         this.game.rnd.integerInRange(0, 8)
        //     );
        //     this.game.physics.p2.enable(b, true);
        //     b.scale.setTo(2, 2);
        //     b.body.setCircle(16);
        //     b.body.fixedRotation = true;
        // }

        // Load the table sprite and boundry
        //
        tableBounds = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'table_bg');
        this.game.physics.p2.enable(tableBounds, false);
        tableBounds.body.static = true;

        tableBounds.body.clearShapes();
        tableBounds.body.loadPolygon('tableBounds', 'table_bounds');
        tableBounds.body.fixedRotation = true;
        tableBounds.anchor.setTo(0.5, 0.5)

        // Create a center to draw balls to
        tableCenter = this.game.add.sprite(this.game.width / 2, this.game.height / 2, '');
        this.game.physics.p2.enable(tableCenter, true);
        tableCenter.body.static = true;
        tableCenter.body.clearShapes();

        // tmp: Add some test balls.
        //
        balls.create(436, 73, 'balls', 1);
        balls.create(520, 445, 'balls', 2);
        balls.create(164, 526, 'balls', 3);
        balls.create(80, 155, 'balls', 4);
        this.game.physics.p2.enable(balls, true);

        balls.forEach(function(b) {
            b.scale.setTo(1.8, 1.8);
            b.body.setCircle(16);
            b.body.fixedRotation = true;
        });

    },
    accelerateToObject: function(obj1, obj2, speed) {
        if (typeof this.speed === 'undefined') {
            this.speed = 5;
        }
        var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        //obj1.body.rotation = angle + this.game.math.degToRad(180); // correct angle if wanted
        obj1.body.force.x = Math.cos(angle) * this.speed; // accelerateToObject 
        obj1.body.force.y = Math.sin(angle) * this.speed;
    },
    update: function() {
    	for (b in balls.children){
    		this.accelerateToObject(balls.children[b],tableCenter);
    	}
    },
    render: function() {
    	this.game.debug.text(balls, 2, 64, "#ffffff");
        this.game.debug.text(this.game.time.fps, 2, 14, "#ffffff");
        this.game.debug.text(this.game.input.x, 2, 32, "#ffffff");
        this.game.debug.text(this.game.input.y, 40, 32, "#ffffff");
    }
}