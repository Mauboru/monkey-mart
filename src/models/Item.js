export default class Item {
  constructor(x, y, width, height, sprite, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sprite = sprite;
    this.type = type;
  }

  draw(ctx, cameraX, cameraY) {
    const drawX = this.x - cameraX;
    const drawY = this.y - cameraY;

    // ctx.fillStyle = 'white';
    // ctx.font = '16px Arial';
    // ctx.textAlign = 'center';
    // ctx.fillText(`$${this.type}`,
    // this.x + this.width / 2 - cameraX,
    // this.y + this.height + 25 - cameraY);
    
    ctx.drawImage(this.sprite, drawX, drawY, this.width, this.height);
  }

  checkCollision(player) {
    return (
      player.x < this.x + this.width &&
      player.x + player.drawWidth > this.x &&
      player.y < this.y + this.height &&
      player.y + player.drawHeight > this.y
    );
  }
}