var theGame = function(game) {
    numBalls = 6;

    ballsGroup = {};

    tableCenter = {};
    tableBounds = {};
    debugText = {};

    debugCenter = 0;
    tableCenterCollisionGroup = {};
    ballsCollisionGroup = {};

}

theGame.prototype = {
    create: function() {
        this.game.time.advancedTiming = true;
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.restitution = 0.4;

        this.ballsGroup = new Phaser.Group(this.game, '', 'balls', true, false, 'Phaser.Physics.P2JS');
        //snakeBodies = new Phaser.Group(this.game, '', 'snakeBodies', true, false, 'Phaser.Physics.P2JS');

        // Collision groups
        this.tableCenterCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.ballsCollisionGroup = this.game.physics.p2.createCollisionGroup();

        // Add Objects
        this.addTableBounds();
        this.addTableCenter();

        // tmp: Add some test ballsGroup.
        //
        //this.addBall(150, 150, 1);

        this.game.input.mouse.capture = true;
        this.game.input.onDown.add(function(f) {
            this.addBall(this.game.input.x,
                this.game.input.y,
                this.game.rnd.integerInRange(0, 8));
        }, this);

    },
    update: function() {

        for (b in this.ballsGroup.children) {
            var speedToCenter = 10;
            if (this.distanceBetween(this.ballsGroup.children[b], this.tableCenter) <= 50) {
                speedToCenter = 0;
            } else if (this.distanceBetween(this.ballsGroup.children[b], this.tableCenter) <= 100) {
                speedToCenter = 200;
            } else if (this.distanceBetween(this.ballsGroup.children[b], this.tableCenter) < 300) {
                speedToCenter = 300;
            }
            this.debugCenter = speedToCenter
            this.accelerateToObject(this.ballsGroup.children[b], this.tableCenter, speedToCenter);
        }

    },

    render: function() {
        // this.game.debug.text(
        //     this.distanceBetween(this.ballsGroup.children[0],this.tableCenter),
        //     2, 20, "#ffffff"
        // );
        this.game.debug.text(this.game.time.fps, 2, 20, "#ffffff")
        this.game.debug.text(this.debugCenter, 2, 40, "#ffffff");;
        this.game.debug.text(this.game.input.x, 2, 60, "#ffffff");
        this.game.debug.text(this.game.input.y, 40, 60, "#ffffff");
        this.game.debug.text(Phaser.Math.fuzzyFloor(this.game.input.activePointer.duration, 1), 20, 80, "#ffffff");
    },

    // Util Functions
    accelerateToObject: function(obj1, obj2, speed) {
        if (typeof speed === 'undefined') {
            speed = 0;
        }
        var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        obj1.body.force.x = Math.cos(angle) * speed; // accelerateToObject 
        obj1.body.force.y = Math.sin(angle) * speed;
    },
    distanceBetween: function(spriteA, spriteB) {
        var dx = spriteA.body.x - spriteB.body.x; //distance ship X to planet X    
        var dy = spriteA.body.y - spriteB.body.y; //distance ship Y to planet Y    
        var dist = Math.sqrt(dx * dx + dy * dy); //pythagoras ^^  (get the distance to each other)    
        return dist;
    },

    addBall: function(x, y, color) {
        if (x === 'undefined') {
            x = this.game.width / 2;
        }
        if (y === 'undefined') {
            y = this.game.height / 2;
        }

        var ball = this.game.add.sprite(x, y, 'balls', color);
        this.game.physics.p2.enable(ball, true);

        ball.scale.setTo(1.8, 1.8);
        ball.body.setCircle(14);
        ball.body.fixedRotation = true;

        this.ballsGroup.add(ball);
    },


    // Object functions
    addTableBounds: function() {
        // Load the table sprite and boundry
        //
        this.tableBounds = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'table_bg');

        this.game.physics.p2.enable(this.tableBounds, true);

        this.tableBounds.body.static = true;
        this.tableBounds.body.clearShapes();
        this.tableBounds.body.loadPolygon('tableBounds', 'table_bounds');
        this.tableBounds.body.fixedRotation = true;

        this.tableBounds.anchor.setTo(0.5, 0.5)
    },

    addTableCenter: function() {
        // Create a center to draw balls to
        this.tableCenter = this.game.add.sprite(this.game.width / 2, this.game.height / 2, '');

        this.game.physics.p2.enable(this.tableCenter, true);

        this.tableCenter.body.static = true;
        this.tableCenter.body.clearShapes();
        this.tableCenter.body.addCircle(50);
        this.tableCenter.body.setCollisionGroup(this.tableCenterCollisionGroup);
    }
}