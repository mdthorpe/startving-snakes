var theGame = function(game) {
    numBalls = 6;
    balls = {};
    snakeBodies = {};
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

        balls = new Phaser.Group(this.game, '', 'balls', true, false, 'Phaser.Physics.P2JS');
        snakeBodies = new Phaser.Group(this.game, '', 'snakeBodies', true, false, 'Phaser.Physics.P2JS');


        // Collision groups
        this.tableCenterCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.ballsCollisionGroup = this.game.physics.p2.createCollisionGroup();

        // Load the table sprite and boundry
        //
        this.tableBounds = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'table_bg');
        this.game.physics.p2.enable(this.tableBounds, true);
        this.tableBounds.body.static = true;

        this.tableBounds.body.clearShapes();
        this.tableBounds.body.loadPolygon('tableBounds', 'table_bounds');
        this.tableBounds.body.fixedRotation = true;
        this.tableBounds.anchor.setTo(0.5, 0.5)

        // Create a center to draw balls to
        this.tableCenter = this.game.add.sprite(this.game.width / 2, this.game.height / 2, '');
        this.game.physics.p2.enable(this.tableCenter, true);
        this.tableCenter.body.static = true;
        this.tableCenter.body.clearShapes();
        this.tableCenter.body.addCircle(50);
        this.tableCenter.body.setCollisionGroup(this.tableCenterCollisionGroup);


        // tmp: Add some test balls.
        //
        balls.create(436, 73, 'balls', 1);
        balls.create(520, 445, 'balls', 2);
        balls.create(164, 526, 'balls', 3);
        balls.create(80, 155, 'balls', 4);
        this.game.physics.p2.enable(balls, true);

        balls.forEach(function(b) {
            b.scale.setTo(1.8, 1.8);
            b.body.setCircle(14);
            b.body.fixedRotation = true;
        });

    },
    update: function() {

        for (b in balls.children) {
            var speedToCenter = 10;
            if (this.distanceBetween(balls.children[b], this.tableCenter) <= 50) {
                speedToCenter = 0;
            } else if (this.distanceBetween(balls.children[b], this.tableCenter) <= 100) {
                speedToCenter = 200;
            } else if (this.distanceBetween(balls.children[b], this.tableCenter) < 300) {
                speedToCenter = 300;
            }
            this.debugCenter = speedToCenter
            this.accelerateToObject(balls.children[b], this.tableCenter, speedToCenter);
        }
    },
    render: function() {
        this.game.debug.text(this.distanceBetween(balls.children[0], this.tableCenter), 2, 20, "#ffffff");
        this.game.debug.text(this.game.time.fps, 2, 40, "#ffffff")
        this.game.debug.text(this.debugCenter, 2, 60, "#ffffff");;
        this.game.debug.text(this.game.input.x, 2, 80, "#ffffff");
        this.game.debug.text(this.game.input.y, 40, 80, "#ffffff");
    },
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
}