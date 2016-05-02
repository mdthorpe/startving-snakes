var theGame = function(game) {}

theGame.prototype = {
    create: function() {
        this.game.time.advancedTiming = true;
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.restitution = 0.4;
        this.game.physics.p2.gravity.y = 0

        this.ballsGroup = new Phaser.Group(this.game, '', 'balls', true, false, 'Phaser.Physics.P2JS');
        this.snakes = [];

        // Collision groups
        this.tableCenterCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.tableBoundsCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.ballsCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.scoreHoleCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.snakeHeadCollisionGroup = this.game.physics.p2.createCollisionGroup();

        this.game.physics.p2.setImpactEvents(true);
        this.game.physics.p2.updateBoundsCollisionGroup();

        // init
        this.players = this.initPlayerList();

        // Add Objects
        this.addTableBounds(false);
        this.addTableCenter(true);

        // Score holes
        this.game.add.sprite(0, 0, 'table_score_holes');

        this.addScoreHole(300, 70, 38, this.players["green"], false);
        this.addScoreHole(300, 528, 38, this.players["pink"], false);
        this.addScoreHole(70, 300, 38, this.players["orange"], false);
        this.addScoreHole(528, 300, 38, this.players["yellow"], false);


        // Allow us to shoot random balls onto the field
        this.game.input.mouse.capture = true;
        this.game.input.onDown.add(function(f) {
            this.addBall(this.game.input.x,
                this.game.input.y,
                this.game.rnd.integerInRange(0, 8));
        }, this);

        // Add snakes for players
        this.snakes["green"] = this.addSnake(this.players["green"]);
        this.snakes["pink"] = this.addSnake(this.players["pink"]);
        this.snakes["orange"] = this.addSnake(this.players["orange"]);
        this.snakes["yellow"] = this.addSnake(this.players["yellow"]);

        // Add the player caps
        this.game.add.sprite(0, 0, 'table_player_tops');

        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    },
    update: function() {

        for (b in this.ballsGroup.children) {
            var speedToCenter = 10;
            if (this.distanceBetween(this.ballsGroup.children[b], this.tableCenter) <= 70) {
                speedToCenter = 0;
            } else if (this.distanceBetween(this.ballsGroup.children[b], this.tableCenter) <= 100) {
                speedToCenter = speedToCenter * 2;
            } else if (this.distanceBetween(this.ballsGroup.children[b], this.tableCenter) <= 300) {
                speedToCenter = speedToCenter * 30;
            }
            this.debugCenter = speedToCenter
            this.accelerateToObject(this.ballsGroup.children[b], this.tableCenter, speedToCenter);
        }


        // Move: green

        if (this.downKey.upDuration(25)) {
            this.mouthMove("green", "closed");
        }
        if (this.downKey.downDuration(25)) {
            this.mouthMove("green", "open");
        }
        if (this.downKey.isDown) {
            this.snakeMove("green", "down");
        }

        if (this.downKey.isUp) {
            if (this.snakes["green"].body.y > this.players["green"].home.y) {
                this.snakes["green"].body.velocity.y = -1000;
            } else {
                this.snakes["green"].body.velocity.y = 0;
            }
            this.snakes["green"].body.velocity.x = 0;
        }

        // Move : pink 

        if (this.upKey.upDuration(25)) {
            this.mouthMove("pink", "closed");
        }
        if (this.upKey.downDuration(25)) {
            this.mouthMove("pink", "open");
        }
        if (this.upKey.isDown) {
            this.snakeMove("pink", "up");
        }

        if (this.upKey.isUp) {
            if (this.snakes["pink"].body.y < this.players["pink"].home.y) {
                this.snakes["pink"].body.velocity.y = 1000;
            } else {
                this.snakes["pink"].body.velocity.y = 0;
            }
            this.snakes["pink"].body.velocity.x = 0;
        }


        // Move : orange 

        if (this.rightKey.upDuration(25)) {
            this.mouthMove("orange", "closed");
        }
        if (this.rightKey.downDuration(25)) {
            this.mouthMove("orange", "open");
        }
        if (this.rightKey.isDown) {
            this.snakeMove("orange", "right");
        }

        if (this.rightKey.isUp) {
            if (this.snakes["orange"].body.x > this.players["orange"].home.x) {
                this.snakes["orange"].body.velocity.x = -1000;
            } else {
                this.snakes["orange"].body.velocity.x = 0;
            }
            this.snakes["orange"].body.velocity.y = 0;
        }

        // Move : yellow 

        if (this.leftKey.upDuration(25)) {
            this.mouthMove("yellow", "closed");
        }
        if (this.leftKey.downDuration(25)) {
            this.mouthMove("yellow", "open");
        }
        if (this.leftKey.isDown) {
            this.snakeMove("yellow", "left");
        }

        if (this.leftKey.isUp) {
            if (this.snakes["yellow"].body.x < this.players["yellow"].home.x) {
                this.snakes["yellow"].body.velocity.x = 1000;
            } else {
                this.snakes["yellow"].body.velocity.x = 0;
            }
            this.snakes["yellow"].body.velocity.y = 0;
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

        players["green"] = this.addPlayer({
            "name": "green",
            "color": "0x22FF22",
            "debug": true,
            "home": {
                "x": 300,
                "y": 50
            }
        });
        players["pink"] = this.addPlayer({
            "name": "pink",
            "color": "0xFF00DD",
            "debug": true,
            "home": {
                "x": 300,
                "y": 550
            }
        });
        players["orange"] = this.addPlayer({
            "name": "orange",
            "color": "0xFFB421",
            "debug": true,
            "home": {
                "x": 50,
                "y": 300
            }
        });
        players["yellow"] = this.addPlayer({
            "name": "yellow",
            "color": "0XFFFC21",
            "debug": true,
            "home": {
                "x": 570,
                "y": 300
            }

        });
        return players;
    },

    addPlayer: function(args) {
        var t = {
            "name": args.name,
            "color": args.color,
            "home": args.home,
            "debug": args.debug,
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
            this.scoreHoleCollisionGroup,
            this.snakeHeadCollisionGroup
        ]);

        this.ballsGroup.add(ball);
    },



    // Object functions
    addTableBounds: function(debug) {
        // Load the table sprite and boundry
        //
        this.tableBounds = this.game.add.sprite(
            (this.game.width / 2) + 1, (this.game.height / 2) + 1, 'table_base');

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
        graphics.beginFill(player.color, .4);
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

    addSnake: function(player) {
        var snake = this.game.add.sprite(player.home.x, player.home.y, "snake_" + player.name);
        this.game.physics.p2.enable(snake, player.debug);
        snake.body.clearShapes();
        snake.body.loadPolygon(player.name + "_closed", "closed");
        snake.body.setCollisionGroup(this.snakeHeadCollisionGroup);
        snake.body.collides([this.ballsCollisionGroup,
            this.snakeHeadCollisionGroup
        ]);
        snake.body.static = true;

        return snake;
    },

    ballInHole: function(hole, ball) {
        this.players[hole.player.name].score += 1;
        console.log(hole, ball);
        console.log("hole.player: ", hole.player);
        ball.sprite.destroy();
    },

    mouthMove: function(snakeColor, state) {
        var mouthState = state;
        this.snakes[snakeColor].body.clearShapes();
        this.snakes[snakeColor].body.loadPolygon(snakeColor + "_" + mouthState, mouthState);
        this.snakes[snakeColor].body.setCollisionGroup(this.snakeHeadCollisionGroup);
        this.snakes[snakeColor].body.collides([this.ballsCollisionGroup,
            this.snakeHeadCollisionGroup
        ]);

    },

    snakeMove: function(snakeColor, direction) {
        if (direction == "down") {
            if (this.snakes[snakeColor].body.y <= (this.players[snakeColor].home.y + 100)) {
                this.snakes[snakeColor].body.velocity.y = 1000;
            } else {
                this.snakes[snakeColor].body.velocity.y = 0;
            }
            this.snakes[snakeColor].body.velocity.x = 0;
        }
        if (direction == "up") {
            if (this.snakes[snakeColor].body.y >= (this.players[snakeColor].home.y - 100)) {
                this.snakes[snakeColor].body.velocity.y = -1000;
            } else {
                this.snakes[snakeColor].body.velocity.y = 0;
            }
            this.snakes[snakeColor].body.velocity.x = 0;
        }
        if (direction == "right") {
            if (this.snakes[snakeColor].body.x <= (this.players[snakeColor].home.x + 100)) {
                this.snakes[snakeColor].body.velocity.x = 1000;
            } else {
                this.snakes[snakeColor].body.velocity.x = 0;
            }
            this.snakes[snakeColor].body.velocity.y = 0;
        }
        if (direction == "left") {
            if (this.snakes[snakeColor].body.x >= (this.players[snakeColor].home.x - 100)) {
                this.snakes[snakeColor].body.velocity.x = -1000;
            } else {
                this.snakes[snakeColor].body.velocity.x = 0;
            }
            this.snakes[snakeColor].body.velocity.y = 0;
        }
    }
}