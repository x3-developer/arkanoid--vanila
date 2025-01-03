import Ball from './sprites/Ball';
import { GameObjectInterface } from './sprites/GameObjectInterface';
import Paddle from './sprites/Paddle';
import Brick from './sprites/Brick';

export default class Game {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly gameObjects: GameObjectInterface[] = [];
  private isRunning: boolean = true;

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

    this.createBricks();

    this.gameObjects.push(ball, paddle);

    this.isRunning = true;
    this.gameLoop();
  }

  private gameLoop(): void {
    const fps = 60;
    const interval = 1000 / fps;
    let lastTime = performance.now();
    const loop = (time: number) => {
      if (!this.isRunning) return;

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
        if (gameObject.getIsBottomTouch()) {
          this.isRunning = false;
          this.endGame();
        } else {
          gameObject.update(deltaTime, canvasWidth, canvasHeight);
          continue;
        }
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
    const bricks = this.gameObjects.filter(
      (gameObject) => gameObject instanceof Brick
    );

    if (ball) {
      for (const brick of bricks) {
        if (
          brick.isActive() &&
          brick.checkCollision(ball.getX(), ball.getY(), ball.getRadius())
        ) {
          ball.reverseYVelocity();
        }
      }
    }

    if (ball && paddle) {
      if (paddle.checkCollision(ball.getX(), ball.getY(), ball.getRadius())) {
        ball.handlePaddleCollision(paddle.getY(), paddle.getHeight());
      }
    }
  }

  private createBricks(): void {
    const brickWidth = (this.ctx.canvas.width - 16) / 10 - 16;
    const brickHeight = 24;
    const gap = 16;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 10; j++) {
        const x = j * (brickWidth + gap) + 16;
        const y = i * (brickHeight + gap) + 48;
        const brick = new Brick(x, y, brickWidth, brickHeight);

        this.gameObjects.push(brick);
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

  private endGame(): void {
    this.isRunning = false;
    alert('Game Over');
    location.reload();
  }
}
