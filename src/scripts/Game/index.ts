import Ball from './sprites/Ball';
import { GameObjectInterface } from './sprites/GameObjectInterface';
import Paddle from './sprites/Paddle';

export default class Game {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly gameObjects: GameObjectInterface[] = [];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;

    this.setupInput();
  }

  public start(): void {
    const ball = new Ball(
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height - 40
    );
    const paddle = new Paddle(this.ctx.canvas.width, this.ctx.canvas.height);

    this.gameObjects.push(ball, paddle);

    this.gameLoop();
  }

  private gameLoop(): void {
    const fps = 60;
    const interval = 1000 / fps;
    let lastTime = performance.now();
    const loop = (time: number) => {
      const deltaTime = time - lastTime;

      if (deltaTime > interval) {
        this.update(deltaTime);
        this.draw();
        lastTime = time;
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  private update(deltaTime: number): void {
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;

    for (const gameObject of this.gameObjects) {
      if (gameObject instanceof Ball) {
        gameObject.update(deltaTime, canvasWidth, canvasHeight);
        continue;
      }

      if (gameObject instanceof Paddle) {
        gameObject.update(deltaTime, canvasWidth);
        continue;
      }

      gameObject.update(deltaTime);
    }

    const ball = this.gameObjects.find(
      (gameObject) => gameObject instanceof Ball
    );
    const paddle = this.gameObjects.find(
      (gameObject) => gameObject instanceof Paddle
    );

    if (ball && paddle) {
      if (paddle.checkCollision(ball.getX(), ball.getY(), ball.getRadius())) {
        ball.reverseYVelocity();
      }
    }
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (const gameObject of this.gameObjects) {
      gameObject.draw(this.ctx);
    }
  }

  private setupInput(): void {
    let paddle: Paddle | undefined;

    document.addEventListener('keydown', (event) => {
      if (!paddle) {
        paddle = this.gameObjects.find(
          (gameObject) => gameObject instanceof Paddle
        );
      }

      if (!paddle) return;

      if (event.key === 'ArrowLeft') {
        paddle.moveLeft();
      } else if (event.key === 'ArrowRight') {
        paddle.moveRight();
      }
    });

    document.addEventListener('keyup', () => {
      if (!paddle) {
        paddle = this.gameObjects.find(
          (gameObject) => gameObject instanceof Paddle
        );
      }

      if (!paddle) return;

      paddle.stop();
    });
  }
}
