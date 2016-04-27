var theGame = function(game) {}

theGame.prototype = {
    create: function() {
        this.game.time.advancedTiming = true;
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.restitution = 0.4;

        this.ballsGroup = new Phaser.Group(this.game, '', 'balls', true, false, 'Phaser.Physics.P2JS');

        // Collision groups
        this.tableCenterCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.tableBoundsCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.ballsCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.scoreHoleCollisionGroup = this.game.physics.p2.createCollisionGroup();

        this.game.physics.p2.setImpactEvents(true);
        this.game.physics.p2.updateBoundsCollisionGroup();

        // init
        this.players = this.initPlayerList();

        // Add Objects
        this.addTableBounds(true);
        this.addTableCenter(true);

        this.addScoreHole(300, 82, 42, this.players["green"],true);
        this.addScoreHole(300, 519, 42, this.players["pink"]);
        this.addScoreHole(82, 299, 42, this.players["orange"]);
        this.addScoreHole(519, 297, 42, this.players["yellow"]);

        // tmp: Add some test ballsGroup.
        this.game.input.mouse.capture = true;
        this.game.input.onDown.add(function(f) {
            this.addBall(this.game.input.x,
                this.game.input.y,
                this.game.rnd.integerInRange(0, 8));
        }, this);

    },
    update: function() {

        for (b in this.ballsGroup.children) {
            var speedToCenter = 5;
            if (this.distanceBetween(this.ballsGroup.children[b], this.tableCenter) <= 70) {
                speedToCenter = 0;
            } else if (this.distanceBetween(this.ballsGroup.children[b], this.tableCenter) <= 100) {
                speedToCenter = speedToCenter * 5;
            } else if (this.distanceBetween(this.ballsGroup.children[b], this.tableCenter) < 250) {
                speedToCenter = speedToCenter * 10;
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

    initPlayerList: function() {
        var players = [];

        players["green"] = this.addPlayer("green", "0x22FF22", true);
        players["pink"] = this.addPlayer("pink", "0xFF00DD");
        players["orange"] = this.addPlayer("orange", "0xFFB421");
        players["yellow"] = this.addPlayer("yellow", "0XFFFC21");
        return players;
    },

    addPlayer: function(name, color) {
        var t = {
            "name": name,
            "color": color,
            "score": 0
        }
        return t;
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
        ball.body.setCollisionGroup(this.ballsCollisionGroup);
        ball.body.collides([this.ballsCollisionGroup,
            this.tableBoundsCollisionGroup,
            this.scoreHoleCollisionGroup
        ]);

        this.ballsGroup.add(ball);

    },



    // Object functions
    addTableBounds: function(debug) {
        // Load the table sprite and boundry
        //
        this.tableBounds = this.game.add.sprite((this.game.width / 2) + 1, (this.game.height / 2) + 1, 'table_bg');

        this.game.physics.p2.enable(this.tableBounds, debug);

        this.tableBounds.body.static = true;
        this.tableBounds.body.clearShapes();
        this.tableBounds.body.loadPolygon('tableBounds', 'table_bounds');
        this.tableBounds.body.fixedRotation = true;
        this.tableBounds.body.setCollisionGroup(this.tableBoundsCollisionGroup);
        this.tableBounds.body.collides([this.ballsCollisionGroup, this.tableBoundsCollisionGroup]);

        this.tableBounds.anchor.setTo(0.5, 0.5)
    },

    addTableCenter: function(debug) {
        // Create a center to draw balls to
        this.tableCenter = this.game.add.sprite(this.game.width / 2, this.game.height / 2, '');

        this.game.physics.p2.enable(this.tableCenter, debug);

        this.tableCenter.body.static = true;
        this.tableCenter.body.clearShapes();
        this.tableCenter.body.addCircle(70);
        this.tableCenter.body.setCollisionGroup(this.tableCenterCollisionGroup);

    },

    addScoreHole: function(x, y, d, player, debug) {
        // Create a center to draw balls to
        var hole = this.game.add.sprite(x, y, '');
        var graphics = this.game.add.graphics();

        // draw a circle
        graphics.lineStyle(1);
        graphics.beginFill(player.color, .15);
        graphics.drawCircle(x, y, d*2);
        graphics.endFill();

        this.game.physics.p2.enable(hole, debug);

        hole.body.player = player;
        hole.body.static = true;
        hole.body.clearShapes();
        hole.body.addCircle(d/1.5);
        hole.body.setCollisionGroup(this.scoreHoleCollisionGroup);
        hole.body.collides([this.ballsCollisionGroup], this.ballInHole, this);
    },

    ballInHole: function(ball,hole) {
        console.log("ball.player: ", ball.player);
        this.players[ball.player.name].score += 1;
    }

}