import { GameObjectInterface } from '../GameObjectInterface';

export default class Ball implements GameObjectInterface {
  private x: number;
  private y: number;
  private readonly radius = 10;
  private readonly color = '#0095DD';
  private velocityX = 100;
  private velocityY = -100;
  private isBottomTouch = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public getRadius(): number {
    return this.radius;
  }

  public getIsBottomTouch(): boolean {
    return this.isBottomTouch;
  }

  public update(
    deltaTime: number,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    let nextX = this.x + this.velocityX * (deltaTime / 1000);
    let nextY = this.y + this.velocityY * (deltaTime / 1000);

    if (nextX - this.radius < 0) {
      this.reverseXVelocity();
      nextX = this.radius;
    } else if (nextX + this.radius > canvasWidth) {
      this.reverseXVelocity();
      nextX = canvasWidth - this.radius;
    }

    if (nextY - this.radius < 0) {
      this.reverseYVelocity();
      nextY = this.radius;
    } else if (nextY + this.radius > canvasHeight) {
      this.isBottomTouch = true;
    }

    this.x = nextX;
    this.y = nextY;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  public reverseYVelocity(): void {
    this.velocityY = -this.velocityY;
  }

  public reverseXVelocity(): void {
    this.velocityX = -this.velocityX;
  }
}
