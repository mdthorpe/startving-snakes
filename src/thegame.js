var theGame = function(game) {}

theGame.prototype = {
    create: function() {
        this.game.time.advancedTiming = true;
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.restitution = 0.4;

        this.ballsGroup = new Phaser.Group(this.game, '', 'balls', true, false, 'Phaser.Physics.P2JS');
        this.snakes = [];

        // Collision groups
        this.tableCenterCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.tableBoundsCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.ballsCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.scoreHoleCollisionGroup = this.game.physics.p2.createCollisionGroup();

        this.game.physics.p2.setImpactEvents(true);
        this.game.physics.p2.updateBoundsCollisionGroup();

        // init
        this.players = this.initPlayerList();
        //  Create a new custom sized bounds, within the world bounds
        this.customBounds = { left: null, right: null, top: null, bottom: null };

        // Add Objects
        this.addTableBounds(false);
        this.addTableCenter(true);

        this.snakes.push(this.addSnake(300, 82, 42, this.players["green"], true));

        this.addScoreHole(300, 82, 42, this.players["green"], true);
        this.addScoreHole(300, 519, 42, this.players["pink"], true);
        this.addScoreHole(82, 299, 42, this.players["orange"], true);
        this.addScoreHole(519, 297, 42, this.players["yellow"], true);

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
            var speedToCenter = 10;
            if (this.distanceBetween(this.ballsGroup.children[b], this.tableCenter) <= 70) {
                speedToCenter = 0;
            } else if (this.distanceBetween(this.ballsGroup.children[b], this.tableCenter) <= 100) {
                speedToCenter = speedToCenter * 20;
            } else if (this.distanceBetween(this.ballsGroup.children[b], this.tableCenter) < 380) {
                speedToCenter = speedToCenter * 10;
            }
            this.debugCenter = speedToCenter
            this.accelerateToObject(this.ballsGroup.children[b], this.tableCenter, speedToCenter);
        }

    },

    render: function() {
        this.game.debug.text(this.game.time.fps, 2, 20, "#ffffff")
        this.game.debug.text(this.game.input.x, 40, 20, "#ffffff");
        this.game.debug.text(this.game.input.y, 80, 20, "#ffffff");
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
        this.tableBounds = this.game.add.sprite(
            (this.game.width / 2) + 1, (this.game.height / 2) + 1, 'table_bg');

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
        graphics.drawCircle(x, y, d * 2);
        graphics.endFill();

        this.game.physics.p2.enable(hole, debug);

        hole.body.player = player;
        hole.body.static = true;
        hole.body.clearShapes();
        hole.body.addCircle(d / 1.5);
        hole.body.setCollisionGroup(this.scoreHoleCollisionGroup);
        hole.body.collides([this.ballsCollisionGroup], this.ballInHole, this);
    },

    addSnake: function(x, y, r, player, debug) {
        this.createPreviewBounds(200,200,100,100);
        //return shapeSprite;
    },

    ballInHole: function(hole, ball) {
        this.players[hole.player.name].score += 1;
        console.log(hole, ball);
        console.log("hole.player: ", hole.player);
        ball.sprite.destroy();
    },
    createPreviewBounds: function(x, y, w, h) {

        var sim = this.game.physics.p2;

        //  If you want to use your own collision group then set it here and un-comment the lines below
        var mask = sim.boundsCollisionGroup.mask;

        this.customBounds.left = new p2.Body({
            mass: 0,
            position: [sim.pxmi(x), sim.pxmi(y)],
            angle: 1.5707963267948966
        });
        this.customBounds.left.addShape(new p2.Plane());

        this.customBounds.right = new p2.Body({
            mass: 0,
            position: [sim.pxmi(x + w), sim.pxmi(y)],
            angle: -1.5707963267948966
        });
        this.customBounds.right.debug = true;
        this.customBounds.right.addShape(new p2.Plane());

        this.customBounds.top = new p2.Body({
            mass: 0,
            position: [sim.pxmi(x), sim.pxmi(y)],
            angle: -3.141592653589793
        });
        this.customBounds.top.addShape(new p2.Plane());

        this.customBounds.bottom = new p2.Body({
            mass: 0,
            position: [sim.pxmi(x), sim.pxmi(y + h)]
        });
        this.customBounds.bottom.addShape(new p2.Plane());

        sim.world.addBody(this.customBounds.left);
        sim.world.addBody(this.customBounds.right);
        sim.world.addBody(this.customBounds.top);
        sim.world.addBody(this.customBounds.bottom);
        console.log(this.customBounds);

    }

}
