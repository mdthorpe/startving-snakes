var preload = function(game) {}

preload.prototype = {
    preload: function() {
        this.game.load.spritesheet('balls', 'assets/sprite/balls.png', 17, 17);
        this.game.load.image('block', 'assets/sprite/block.png');
        this.game.load.image('table_bg', 'assets/sprite/table_bg.png');
        this.game.load.physics('tableBounds', 'assets/physics/tableBounds.json');
        this.game.load.physics('blockOpen', 'assets/physics/blockOpen.json');
        this.game.load.physics('blockClosed', 'assets/physics/blockClosed.json');
        this.game.stage.backgroundColor = '#124184';
    },
    create: function() {
        this.game.state.start("TheGame");
    }
}
