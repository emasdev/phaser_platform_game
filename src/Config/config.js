import 'phaser';

export default {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
  },
  parent: 'game',
  dom: {
    createContainer: true,
  },
};
