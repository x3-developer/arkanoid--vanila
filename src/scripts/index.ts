import Game from './Game';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('arkanoidCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  const game = new Game(ctx);
  game.start();
});
