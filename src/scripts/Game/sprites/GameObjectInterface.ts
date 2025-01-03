export interface GameObjectInterface {
  update(deltaTime: number, canvasWidth?: number, canvasHeight?: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}
