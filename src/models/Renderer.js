import { drawMoneyHud, drawActionButton } from '../utils/drawMoneyHud';
import UpgradeWindow from './UpgradeWindow';

export default class Renderer {
  constructor(canvas, assets, player) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.assets = assets;
    this.scale = window.devicePixelRatio || 1;
    this.buttonSize = 45;
    this.padding = 10;
    this.buttons = this.createButtons();

    this.upgradeWindow = new UpgradeWindow(player, this.assets);
  }

  createButtons() {
    const icons = [
      this.assets.configButtonIcon,
      this.assets.upgradeButtonIcon,
      this.assets.hatButtonIcon,
      this.assets.dailyButtonIcon
    ];
  
    const actions = [
      () => alert('Config clicado!'),
      () => this.upgradeWindow.toggle(),
      () => alert('Chapéu clicado!'),
      () => alert('Daily clicado!')
    ];

    const sizes = [
      [45, 45],  // Config
      [55, 45],  // Upgrade
      [45, 45],  // Chapéu (mais achatado)
      [45, 45],  // Daily (mais alto)
    ];
  
    let y = 10;

    return actions.map((action, i) => {
      const [width, height] = sizes[i];
      const button = {
        x: this.padding,
        y,
        width,
        height,
        action,
        icon: icons[i]
      };
      y += height + this.padding;
      return button;
    });
  }

  setupCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    
    this.canvas.width = width * this.scale;
    this.canvas.height = height * this.scale;
    
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.scale, this.scale);
  }

  render(gameManager, cameraX, cameraY) {
    const viewportWidth = this.canvas.width / this.scale;
    const viewportHeight = this.canvas.height / this.scale;

    this.ctx.clearRect(0, 0, viewportWidth, viewportHeight);

    // Draw background
    this.ctx.drawImage(
      this.assets.backgroundImg,
      cameraX, cameraY,
      viewportWidth, viewportHeight,
      0, 0,
      viewportWidth, viewportHeight
    );

    // Draw construction spots
    gameManager.constructionSpots.forEach(spot => {
      if (!spot.isBuilt) spot.draw(this.ctx, cameraX, cameraY);
    });

    // Draw game objects
    const renderObjects = [
      ...gameManager.boxes,
      ...gameManager.generators,
      ...gameManager.clients,
      ...gameManager.stockers,
      ...gameManager.processingGenerators,
      gameManager.garbage,
      gameManager.player,
      gameManager.paymentBox,
    ];

    if (gameManager.cashier) {
      renderObjects.push(gameManager.cashier);
    }

    renderObjects.sort((a, b) => a.getBaseY() - b.getBaseY());
    renderObjects.forEach(obj => obj.draw(this.ctx, cameraX, cameraY));

    // Draw incoming money
    const allIncomingMoney = gameManager.constructionSpots.flatMap(spot => spot.incomingMoneys);
    allIncomingMoney.forEach(money => money.draw(this.ctx, cameraX, cameraY));

    // Draw UI
    this.drawUI(gameManager.player.money, viewportWidth);
    this.upgradeWindow.draw(this.ctx);
  }
    
  drawUI(money, viewportWidth) {
    drawMoneyHud(this.ctx, money, 0, viewportWidth);

    this.buttons.forEach(btn => {
      drawActionButton(this.ctx, btn.icon, btn.x, btn.y, btn.width, btn.height);
    });
  }

  getButtonIcon(button) {
    // Mapeia os botões para seus ícones correspondentes
    if (button.y === 10) return this.assets.configButtonIcon;
    if (button.y === 10 + (this.buttonSize + this.padding) * 2) return this.assets.upgradeButtonIcon;
    if (button.y === 10 + (this.buttonSize + this.padding) * 3) return this.assets.hatButtonIcon;
    if (button.y === 10 + (this.buttonSize + this.padding) * 4) return this.assets.dailyButtonIcon;
    return null;
  }

  checkButtonClick(clickX, clickY) {
    let clickedOnButton = false;

    this.buttons.forEach(btn => {
      if (
        clickX >= btn.x &&
        clickX <= btn.x + btn.width &&
        clickY >= btn.y &&
        clickY <= btn.y + btn.height
      ) {
        btn.action();
        clickedOnButton = true;
      }
    });

    if (!clickedOnButton) {
      this.upgradeWindow.handleClick(clickX, clickY);
    }
  }
}