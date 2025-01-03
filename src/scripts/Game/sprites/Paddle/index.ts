import { GameObjectInterface } from '../GameObjectInterface';

export default class Paddle implements GameObjectInterface {
  private x: number;
  private readonly y: number;
  private readonly width: number = 100;
  private readonly height: number = 20;
  private readonly color: string = '#0095DD';
  private readonly speed: number = 300;
  private velocity: number = 0;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = canvasWidth / 2 - this.width / 2;
    this.y = canvasHeight - this.height - 10;
  }

  public update(deltaTime: number, canvasWidth: number): void {
    this.x += this.velocity * this.speed * (deltaTime / 1000);

    if (this.x < 0) {
      this.x = 0;
    }

    if (this.x + this.width > canvasWidth) {
      this.x = canvasWidth - this.width;
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  public moveLeft(): void {
    this.velocity = -1;
  }

  public moveRight(): void {
    this.velocity = 1;
  }

  public stop(): void {
    this.velocity = 0;
  }

  public checkCollision(
    ballX: number,
    ballY: number,
    ballRadius: number
  ): boolean {
    return (
      ballY + ballRadius >= this.y &&
      ballX >= this.x &&
      ballX <= this.x + this.width
    );
  }
}
