var preload = function(game) {}

preload.prototype = {
    preload: function() {

        // balls
        this.game.load.spritesheet('balls', 'assets/sprite/balls.png', 17, 17);

        // table
        this.game.load.image('table_base', 'assets/sprite/table_base.png');
        this.game.load.image('table_score_holes', 'assets/sprite/table_score_holes.png');
        this.game.load.image('table_player_tops', 'assets/sprite/table_player_tops.png');
        this.game.load.physics('tableBounds', 'assets/physics/tableBounds.json');

        // snake: green
        this.game.load.image('snake_green', 'assets/sprite/snake_green.png');
        this.game.load.physics('green_closed', 'assets/physics/green_closed.json');
        this.game.load.physics('green_open', 'assets/physics/green_open.json');

        // snake: pink
        this.game.load.image('snake_pink', 'assets/sprite/snake_pink.png');
        this.game.load.physics('pink_closed', 'assets/physics/pink_closed.json');
        this.game.load.physics('pink_open', 'assets/physics/pink_open.json');

        // snake: orange
        this.game.load.image('snake_orange', 'assets/sprite/snake_orange.png');
        this.game.load.physics('orange_closed', 'assets/physics/orange_closed.json');
        this.game.load.physics('orange_open', 'assets/physics/orange_open.json');

        // snake: yellow
        this.game.load.image('snake_yellow', 'assets/sprite/snake_yellow.png');
        this.game.load.physics('yellow_closed', 'assets/physics/yellow_closed.json');
        this.game.load.physics('yellow_open', 'assets/physics/yellow_open.json');


        this.game.stage.backgroundColor = '#124184';
    },
    create: function() {
        this.game.state.start("TheGame");
    }
}