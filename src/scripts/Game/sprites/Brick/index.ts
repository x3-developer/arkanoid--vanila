import { GameObjectInterface } from '../GameObjectInterface';

export default class Brick implements GameObjectInterface {
  private readonly x: number;
  private readonly y: number;
  private readonly width: number;
  private readonly height: number;
  private readonly color = '#0095DD';
  private isDestroyed: boolean = false;

  constructor(x: number, y: number, width: number = 64, height: number = 24) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public update(deltaTime: number): void {}

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.isDestroyed) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
  }

  public checkCollision(
    ballX: number,
    ballY: number,
    ballRadius: number
  ): boolean {
    if (
      ballY + ballRadius >= this.y &&
      ballY - ballRadius <= this.y + this.height
    ) {
      if (
        ballX + ballRadius >= this.x &&
        ballX - ballRadius <= this.x + this.width
      ) {
        this.isDestroyed = true; // Разрушить блок при столкновении
        return true;
      }
    }
    return false;
  }

  public isActive(): boolean {
    return !this.isDestroyed;
  }
}
